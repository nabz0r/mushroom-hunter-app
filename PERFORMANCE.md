# 🚀 Performance Optimization Guide

## Mobile App Performance

### Bundle Size Optimization

**Current Target**: < 50MB (iOS), < 30MB (Android)

```javascript
// Use dynamic imports for heavy components
const ARViewer = lazy(() => import('./components/ARViewer'));

// Tree-shake unused icons
import { Camera, MapPin } from 'lucide-react-native';
// NOT: import * as Icons from 'lucide-react-native';
```

### Image Optimization

```javascript
// Use progressive loading
import { Image } from 'expo-image';

<Image
  source={{ uri: mushroom.imageUrl }}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
/>

// Responsive images
const getImageUrl = (url, size) => {
  return `${url}?w=${size}&q=80&fm=webp`;
};
```

### List Performance

```javascript
// Use FlashList for better performance
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={spots}
  renderItem={renderSpotItem}
  estimatedItemSize={120}
  keyExtractor={item => item.id}
  // Optimize re-renders
  extraData={selectedId}
/>
```

### Memory Management

```javascript
// Clean up heavy resources
useEffect(() => {
  return () => {
    // Clear image cache
    Image.clearDiskCache();
    Image.clearMemoryCache();
  };
}, []);

// Limit concurrent operations
const uploadQueue = new PQueue({ concurrency: 2 });
```

## API Performance

### Database Queries

```sql
-- Use proper indexes
CREATE INDEX idx_spots_location_date 
ON spots USING GIST(location) 
WHERE is_public = TRUE;

-- Optimize common queries
CREATE MATERIALIZED VIEW nearby_spots_summary AS
SELECT 
  s.id,
  s.mushroom_id,
  m.name,
  m.rarity,
  s.location,
  COUNT(DISTINCT s.user_id) as finder_count
FROM spots s
JOIN mushrooms m ON s.mushroom_id = m.id
WHERE s.is_public = TRUE
GROUP BY s.id, s.mushroom_id, m.name, m.rarity, s.location;

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY nearby_spots_summary;
```

### Caching Strategy

```javascript
// Redis caching layers
const getCachedMushroom = async (id) => {
  // L1: Local memory cache (5 min)
  const memCached = memCache.get(`mushroom:${id}`);
  if (memCached) return memCached;
  
  // L2: Redis cache (1 hour)
  const redisCached = await redis.get(`mushroom:${id}`);
  if (redisCached) {
    memCache.set(`mushroom:${id}`, redisCached);
    return JSON.parse(redisCached);
  }
  
  // L3: Database
  const mushroom = await db.mushroom.findById(id);
  
  // Cache for next time
  await redis.setex(`mushroom:${id}`, 3600, JSON.stringify(mushroom));
  memCache.set(`mushroom:${id}`, mushroom);
  
  return mushroom;
};
```

### API Response Optimization

```javascript
// Use field selection
app.get('/api/mushrooms', async (req, res) => {
  const fields = req.query.fields?.split(',') || ['id', 'name', 'imageUrl'];
  
  const mushrooms = await db.mushroom.findAll({
    attributes: fields,
    limit: 20,
  });
  
  res.json(mushrooms);
});

// Enable compression
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6,
}));
```

## AI Model Performance

### Model Optimization

```python
# Quantize model for faster inference
import tensorflow as tf

converter = tf.lite.TFLiteConverter.from_saved_model(saved_model_dir)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.representative_dataset = representative_dataset
tflite_quant_model = converter.convert()

# Use batching for multiple requests
@tf.function
def batch_predict(images):
    return model(images, training=False)
```

### Inference Optimization

```python
# Cache model predictions
@lru_cache(maxsize=1000)
def get_cached_prediction(image_hash):
    return model.predict(preprocess_image(image_hash))

# Use GPU efficiently
with tf.device('/GPU:0'):
    predictions = model.predict_on_batch(batch_images)
```

## Frontend Web Performance

### Code Splitting

```javascript
// Route-based splitting
const MapView = lazy(() => 
  import(/* webpackChunkName: "map" */ './views/MapView')
);

// Component-based splitting
const HeavyChart = lazy(() => 
  import(/* webpackChunkName: "charts" */ './components/HeavyChart')
);
```

### Asset Optimization

```javascript
// Webpack config
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

## Monitoring & Metrics

### Key Performance Indicators

| Metric | Target | Current |
|--------|--------|----------|
| App Launch Time | < 2s | 1.8s |
| API Response Time (p95) | < 200ms | 180ms |
| AI Inference Time | < 1.5s | 1.2s |
| Image Load Time | < 500ms | 400ms |
| Memory Usage | < 150MB | 120MB |
| Battery Drain | < 5%/hour | 4%/hour |

### Performance Monitoring

```javascript
// Custom performance marks
const measureApiCall = async (endpoint) => {
  performance.mark('api-call-start');
  
  try {
    const result = await fetch(endpoint);
    return result;
  } finally {
    performance.mark('api-call-end');
    performance.measure(
      'api-call',
      'api-call-start',
      'api-call-end'
    );
    
    const measure = performance.getEntriesByName('api-call')[0];
    analytics.track('api_performance', {
      endpoint,
      duration: measure.duration,
    });
  }
};
```

## Best Practices

1. **Lazy Loading**: Load features only when needed
2. **Debouncing**: Limit API calls on user input
3. **Virtual Scrolling**: For long lists
4. **Image Optimization**: WebP format, multiple sizes
5. **Code Minification**: Reduce bundle size
6. **HTTP/2**: Multiplexing requests
7. **Service Workers**: Offline caching
8. **Database Indexing**: Optimize queries
9. **CDN Usage**: Distribute static assets
10. **Monitoring**: Track performance metrics