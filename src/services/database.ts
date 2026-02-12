import * as SQLite from 'expo-sqlite';

const DB_NAME = 'mushroom_hunter.db';

let db: SQLite.SQLiteDatabase | null = null;

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    await initializeDatabase(db);
  }
  return db;
}

async function initializeDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      avatar TEXT,
      level INTEGER DEFAULT 1,
      points INTEGER DEFAULT 0,
      experience INTEGER DEFAULT 0,
      daily_streak INTEGER DEFAULT 0,
      auth_provider TEXT DEFAULT 'email',
      last_active_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS mushrooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      scientific_name TEXT,
      edible INTEGER DEFAULT 0,
      rarity TEXT DEFAULT 'common',
      points INTEGER DEFAULT 10,
      description TEXT,
      habitat TEXT,
      season TEXT,
      lookalikes TEXT,
      image_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS spots (
      id TEXT PRIMARY KEY,
      mushroom_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      photos TEXT,
      notes TEXT,
      date_found TEXT DEFAULT (datetime('now')),
      verified INTEGER DEFAULT 0,
      public_spot INTEGER DEFAULT 1,
      synced INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (mushroom_id) REFERENCES mushrooms(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      code TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      points INTEGER DEFAULT 0,
      unlocked_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS quest_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      quest_id TEXT NOT NULL,
      progress TEXT DEFAULT '{}',
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      synced_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_spots_user ON spots(user_id);
    CREATE INDEX IF NOT EXISTS idx_spots_mushroom ON spots(mushroom_id);
    CREATE INDEX IF NOT EXISTS idx_spots_location ON spots(latitude, longitude);
    CREATE INDEX IF NOT EXISTS idx_sync_queue_pending ON sync_queue(synced_at) WHERE synced_at IS NULL;
  `);
}

// User operations
export const userDB = {
  async upsert(user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    level?: number;
    points?: number;
    experience?: number;
    daily_streak?: number;
    auth_provider?: string;
  }): Promise<void> {
    const database = await getDatabase();
    await database.runAsync(
      `INSERT INTO users (id, username, email, avatar, level, points, experience, daily_streak, auth_provider, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         username = excluded.username,
         email = excluded.email,
         avatar = COALESCE(excluded.avatar, users.avatar),
         level = COALESCE(excluded.level, users.level),
         points = COALESCE(excluded.points, users.points),
         experience = COALESCE(excluded.experience, users.experience),
         daily_streak = COALESCE(excluded.daily_streak, users.daily_streak),
         auth_provider = COALESCE(excluded.auth_provider, users.auth_provider),
         updated_at = datetime('now')`,
      [
        user.id,
        user.username,
        user.email,
        user.avatar || null,
        user.level || 1,
        user.points || 0,
        user.experience || 0,
        user.daily_streak || 0,
        user.auth_provider || 'email',
      ]
    );
  },

  async getById(id: string) {
    const database = await getDatabase();
    return database.getFirstAsync<{
      id: string;
      username: string;
      email: string;
      avatar: string | null;
      level: number;
      points: number;
      experience: number;
      daily_streak: number;
      auth_provider: string;
      last_active_date: string | null;
      created_at: string;
    }>('SELECT * FROM users WHERE id = ?', [id]);
  },

  async getByEmail(email: string) {
    const database = await getDatabase();
    return database.getFirstAsync<{
      id: string;
      username: string;
      email: string;
      avatar: string | null;
      level: number;
      points: number;
      experience: number;
      daily_streak: number;
      auth_provider: string;
    }>('SELECT * FROM users WHERE email = ?', [email]);
  },

  async updatePoints(id: string, pointsToAdd: number): Promise<void> {
    const database = await getDatabase();
    await database.runAsync(
      `UPDATE users SET points = points + ?, updated_at = datetime('now') WHERE id = ?`,
      [pointsToAdd, id]
    );
  },

  async updateStreak(id: string): Promise<number> {
    const database = await getDatabase();
    const user = await database.getFirstAsync<{
      daily_streak: number;
      last_active_date: string | null;
    }>('SELECT daily_streak, last_active_date FROM users WHERE id = ?', [id]);

    if (!user) return 0;

    const today = new Date().toDateString();
    const lastActive = user.last_active_date
      ? new Date(user.last_active_date).toDateString()
      : null;

    if (lastActive === today) return user.daily_streak;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const newStreak = lastActive === yesterday.toDateString()
      ? user.daily_streak + 1
      : 1;

    await database.runAsync(
      `UPDATE users SET daily_streak = ?, last_active_date = datetime('now'), updated_at = datetime('now') WHERE id = ?`,
      [newStreak, id]
    );

    return newStreak;
  },

  async delete(id: string): Promise<void> {
    const database = await getDatabase();
    await database.runAsync('DELETE FROM achievements WHERE user_id = ?', [id]);
    await database.runAsync('DELETE FROM quest_progress WHERE user_id = ?', [id]);
    await database.runAsync('DELETE FROM spots WHERE user_id = ?', [id]);
    await database.runAsync('DELETE FROM users WHERE id = ?', [id]);
  },
};

// Mushroom operations
export const mushroomDB = {
  async upsert(mushroom: {
    id: string;
    name: string;
    scientificName?: string;
    edible?: boolean;
    rarity?: string;
    points?: number;
    description?: string;
    habitat?: string[];
    season?: string[];
    lookalikes?: string[];
    imageUrl?: string;
  }): Promise<void> {
    const database = await getDatabase();
    await database.runAsync(
      `INSERT INTO mushrooms (id, name, scientific_name, edible, rarity, points, description, habitat, season, lookalikes, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         scientific_name = excluded.scientific_name,
         edible = excluded.edible,
         rarity = excluded.rarity,
         points = excluded.points,
         description = excluded.description,
         habitat = excluded.habitat,
         season = excluded.season,
         lookalikes = excluded.lookalikes,
         image_url = excluded.image_url`,
      [
        mushroom.id,
        mushroom.name,
        mushroom.scientificName || null,
        mushroom.edible ? 1 : 0,
        mushroom.rarity || 'common',
        mushroom.points || 10,
        mushroom.description || null,
        JSON.stringify(mushroom.habitat || []),
        JSON.stringify(mushroom.season || []),
        JSON.stringify(mushroom.lookalikes || []),
        mushroom.imageUrl || null,
      ]
    );
  },

  async getAll() {
    const database = await getDatabase();
    return database.getAllAsync<{
      id: string;
      name: string;
      scientific_name: string | null;
      edible: number;
      rarity: string;
      points: number;
      description: string | null;
      habitat: string;
      season: string;
      lookalikes: string;
      image_url: string | null;
    }>('SELECT * FROM mushrooms ORDER BY name');
  },

  async getById(id: string) {
    const database = await getDatabase();
    return database.getFirstAsync('SELECT * FROM mushrooms WHERE id = ?', [id]);
  },

  async seedFromMockData(mushrooms: Array<{
    id: string;
    name: string;
    scientificName?: string;
    edible?: boolean;
    rarity?: string;
    points?: number;
    description?: string;
    habitat?: string[];
    season?: string[];
    lookalikes?: string[];
    imageUrl?: string;
  }>): Promise<void> {
    for (const mushroom of mushrooms) {
      await this.upsert(mushroom);
    }
  },
};

// Spot operations
export const spotDB = {
  async create(spot: {
    id: string;
    mushroomId: string;
    userId: string;
    latitude: number;
    longitude: number;
    photos?: string[];
    notes?: string;
    verified?: boolean;
    publicSpot?: boolean;
  }): Promise<void> {
    const database = await getDatabase();
    await database.runAsync(
      `INSERT INTO spots (id, mushroom_id, user_id, latitude, longitude, photos, notes, verified, public_spot)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        spot.id,
        spot.mushroomId,
        spot.userId,
        spot.latitude,
        spot.longitude,
        JSON.stringify(spot.photos || []),
        spot.notes || null,
        spot.verified ? 1 : 0,
        spot.publicSpot !== false ? 1 : 0,
      ]
    );

    // Queue for sync
    await this.queueSync('create', 'spots', spot.id, spot);
  },

  async getByUser(userId: string) {
    const database = await getDatabase();
    return database.getAllAsync(
      `SELECT s.*, m.name as mushroom_name, m.rarity as mushroom_rarity
       FROM spots s
       LEFT JOIN mushrooms m ON s.mushroom_id = m.id
       WHERE s.user_id = ?
       ORDER BY s.date_found DESC`,
      [userId]
    );
  },

  async getNearby(latitude: number, longitude: number, radiusKm: number = 10) {
    const database = await getDatabase();
    // Approximate degree-to-km conversion for filtering
    const latDelta = radiusKm / 111.0;
    const lonDelta = radiusKm / (111.0 * Math.cos(latitude * Math.PI / 180));

    return database.getAllAsync(
      `SELECT s.*, m.name as mushroom_name, m.edible as mushroom_edible, m.rarity as mushroom_rarity
       FROM spots s
       LEFT JOIN mushrooms m ON s.mushroom_id = m.id
       WHERE s.public_spot = 1
         AND s.latitude BETWEEN ? AND ?
         AND s.longitude BETWEEN ? AND ?
       ORDER BY s.date_found DESC`,
      [
        latitude - latDelta,
        latitude + latDelta,
        longitude - lonDelta,
        longitude + lonDelta,
      ]
    );
  },

  async getUserStats(userId: string) {
    const database = await getDatabase();
    return database.getFirstAsync<{
      total_spots: number;
      unique_species: number;
      verified_spots: number;
    }>(
      `SELECT
        COUNT(*) as total_spots,
        COUNT(DISTINCT mushroom_id) as unique_species,
        SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) as verified_spots
       FROM spots WHERE user_id = ?`,
      [userId]
    );
  },

  async queueSync(action: string, tableName: string, recordId: string, data: any): Promise<void> {
    const database = await getDatabase();
    await database.runAsync(
      'INSERT INTO sync_queue (action, table_name, record_id, data) VALUES (?, ?, ?, ?)',
      [action, tableName, recordId, JSON.stringify(data)]
    );
  },
};

// Sync operations
export const syncDB = {
  async getPendingItems() {
    const database = await getDatabase();
    return database.getAllAsync(
      'SELECT * FROM sync_queue WHERE synced_at IS NULL ORDER BY created_at ASC'
    );
  },

  async markSynced(id: number): Promise<void> {
    const database = await getDatabase();
    await database.runAsync(
      "UPDATE sync_queue SET synced_at = datetime('now') WHERE id = ?",
      [id]
    );
  },

  async clearSynced(): Promise<void> {
    const database = await getDatabase();
    await database.runAsync('DELETE FROM sync_queue WHERE synced_at IS NOT NULL');
  },
};

// Database management
export const databaseService = {
  async initialize(): Promise<void> {
    await getDatabase();
  },

  async reset(): Promise<void> {
    const database = await getDatabase();
    await database.execAsync(`
      DELETE FROM sync_queue;
      DELETE FROM quest_progress;
      DELETE FROM achievements;
      DELETE FROM spots;
      DELETE FROM mushrooms;
      DELETE FROM users;
    `);
  },

  async close(): Promise<void> {
    if (db) {
      await db.closeAsync();
      db = null;
    }
  },
};
