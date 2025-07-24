import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TabView } from '@/components/ui/TabView';
import { SearchBar } from '@/components/ui/SearchBar';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { EmptyState } from '@/components/EmptyState';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAppSelector } from '@/store';
import { analyticsService } from '@/services/analyticsService';
import { formatDate } from '@/utils/helpers';

interface CommunityPost {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    level: number;
    isExpert?: boolean;
  };
  type: 'find' | 'tip' | 'warning' | 'question';
  title?: string;
  content: string;
  mushroom?: {
    id: string;
    name: string;
    rarity: string;
    points: number;
  };
  location?: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  tags?: string[];
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Marie_Ch',
      avatar: '👩‍🌾',
      level: 15,
      isExpert: true,
    },
    type: 'find',
    content: 'Superbe récolte de morilles ce matin ! Les conditions étaient parfaites après la pluie d\'hier.',
    mushroom: {
      id: '3',
      name: 'Morilles',
      rarity: 'rare',
      points: 120,
    },
    location: 'Forêt de Fontainebleau',
    images: ['https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400'],
    timestamp: '2024-10-15T08:30:00Z',
    likes: 45,
    comments: 12,
    isLiked: false,
    tags: ['morilles', 'printemps', 'fontainebleau'],
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Paul_Expert',
      avatar: '🧑‍🏫',
      level: 28,
      isExpert: true,
    },
    type: 'tip',
    title: 'Conseil du jour',
    content: 'Après la pluie, attendez 2-3 jours pour une cueillette optimale ! L\'humidité favorise la croissance mais il faut laisser le temps aux champignons de sortir.',
    timestamp: '2024-10-15T14:15:00Z',
    likes: 89,
    comments: 23,
    isLiked: true,
    tags: ['conseil', 'météo', 'débutant'],
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'ForestLover',
      avatar: '🌲',
      level: 12,
    },
    type: 'warning',
    title: 'Attention danger !',
    content: 'Zone de chênes près du lac - Nombreuses amanites tue-mouches repérées. Soyez très vigilants, surtout avec les enfants !',
    location: 'Bois de Vincennes',
    timestamp: '2024-10-15T16:45:00Z',
    likes: 156,
    comments: 34,
    isLiked: true,
    tags: ['sécurité', 'amanite', 'vincennes'],
  },
  {
    id: '4',
    user: {
      id: 'user4',
      name: 'Débutant_Curieux',
      avatar: '🤔',
      level: 3,
    },
    type: 'question',
    title: 'Aide identification',
    content: 'Quelqu\'un peut-il m\'aider à identifier ce champignon ? Trouvé sous un chêne, chapeau brun avec des taches blanches.',
    images: ['https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=400'],
    timestamp: '2024-10-15T19:20:00Z',
    likes: 8,
    comments: 15,
    isLiked: false,
    tags: ['identification', 'aide', 'débutant'],
  },
];

const PostCard = ({ post, onLike, onComment, onShare }: {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}) => {
  const getPostIcon = () => {
    switch (post.type) {
      case 'find':
        return { name: 'leaf' as const, color: '#22c55e' };
      case 'tip':
        return { name: 'bulb' as const, color: '#f59e0b' };
      case 'warning':
        return { name: 'warning' as const, color: '#ef4444' };
      case 'question':
        return { name: 'help-circle' as const, color: '#3b82f6' };
      default:
        return { name: 'chatbubble' as const, color: '#6b7280' };
    }
  };

  const icon = getPostIcon();

  return (
    <Card className="mb-4 overflow-hidden">
      {/* Post Header */}
      <View className="p-4 pb-0">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <Avatar
              emoji={post.user.avatar}
              size="medium"
            />
            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <Text className="font-semibold">{post.user.name}</Text>
                {post.user.isExpert && (
                  <Badge
                    text="Expert"
                    variant="success"
                    size="small"
                    dot
                    style={{ marginLeft: 8 }}
                  />
                )}
              </View>
              <View className="flex-row items-center mt-1">
                <Text className="text-gray-500 text-sm">
                  Niveau {post.user.level}
                </Text>
                <Text className="text-gray-400 mx-2">•</Text>
                <Text className="text-gray-500 text-sm">
                  {formatDate(post.timestamp)}
                </Text>
              </View>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name={icon.name} size={20} color={icon.color} />
            {post.mushroom && (
              <Badge
                text={`+${post.mushroom.points} pts`}
                variant="success"
                size="small"
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
        </View>

        {/* Post Title */}
        {post.title && (
          <Text className="font-bold text-lg mb-2">{post.title}</Text>
        )}

        {/* Post Content */}
        <Text className="text-gray-700 leading-5 mb-3">{post.content}</Text>

        {/* Mushroom Info */}
        {post.mushroom && (
          <View className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-2">🍄</Text>
              <View className="flex-1">
                <Text className="font-semibold text-green-800">
                  {post.mushroom.name}
                </Text>
                <Text className="text-green-600 text-sm">
                  Rareté: {post.mushroom.rarity}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Location */}
        {post.location && (
          <View className="flex-row items-center mb-3">
            <Ionicons name="location" size={16} color="#6b7280" />
            <Text className="text-gray-600 ml-1 text-sm">{post.location}</Text>
          </View>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <View className="flex-row flex-wrap mb-3">
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                text={`#${tag}`}
                variant="info"
                size="small"
                style={{ marginRight: 4, marginBottom: 4 }}
              />
            ))}
          </View>
        )}
      </View>

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <View className="mb-3">
          <Image
            source={{ uri: post.images[0] }}
            className="w-full h-48"
            resizeMode="cover"
          />
        </View>
      )}

      {/* Post Actions */}
      <View className="flex-row border-t border-gray-100 px-4 py-2">
        <TouchableOpacity
          onPress={() => onLike(post.id)}
          className="flex-1 flex-row items-center justify-center py-2"
        >
          <Ionicons
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={post.isLiked ? '#ef4444' : '#6b7280'}
          />
          <Text className={`ml-1 ${post.isLiked ? 'text-red-500' : 'text-gray-600'}`}>
            {post.likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => onComment(post.id)}
          className="flex-1 flex-row items-center justify-center py-2"
        >
          <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
          <Text className="text-gray-600 ml-1">{post.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => onShare(post.id)}
          className="flex-1 flex-row items-center justify-center py-2"
        >
          <Ionicons name="share-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export function CommunityScreen({ navigation }: any) {
  const { user } = useAppSelector(state => state.auth);
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    analyticsService.trackScreenView('community');
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        return {
          ...post,
          isLiked: newIsLiked,
          likes: newIsLiked ? post.likes + 1 : post.likes - 1,
        };
      }
      return post;
    }));
    
    analyticsService.trackUserAction('like_post', { postId });
  };

  const handleComment = (postId: string) => {
    // Navigate to post details with comments
    analyticsService.trackUserAction('open_comments', { postId });
  };

  const handleShare = (postId: string) => {
    // Share post functionality
    analyticsService.trackUserAction('share_post', { postId });
  };

  const handleCreatePost = () => {
    // Navigate to create post screen
    analyticsService.trackUserAction('create_post_start');
  };

  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        post.content.toLowerCase().includes(searchLower) ||
        post.title?.toLowerCase().includes(searchLower) ||
        post.user.name.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (activeTab === 'all') return true;
    return post.type === activeTab;
  });

  const tabs = [
    { key: 'all', title: 'Tout' },
    { key: 'find', title: 'Trouvailles' },
    { key: 'tip', title: 'Conseils' },
    { key: 'warning', title: 'Alertes' },
    { key: 'question', title: 'Questions' },
  ];

  const renderTabContent = (tabKey: string) => (
    <ScrollView
      className="flex-1 px-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
        ))
      ) : (
        <EmptyState
          emoji="📝"
          title="Aucune publication"
          description="Soyez le premier à partager votre expérience !"
          actionText="Créer une publication"
          onAction={handleCreatePost}
        />
      )}
      <View className="h-20" />
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-4 pb-2 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Communauté</Text>
          <View className="flex-row">
            <TouchableOpacity className="bg-gray-100 p-2 rounded-full mr-2">
              <Ionicons name="notifications-outline" size={20} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
              <Ionicons name="person-outline" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="flex-row justify-around bg-gray-50 rounded-xl p-3 mb-4">
          <View className="items-center">
            <Text className="font-bold text-lg">1.2k</Text>
            <Text className="text-gray-600 text-xs">En ligne</Text>
          </View>
          <View className="items-center">
            <Text className="font-bold text-lg">45</Text>
            <Text className="text-gray-600 text-xs">Nouvelles trouvailles</Text>
          </View>
          <View className="items-center">
            <Text className="font-bold text-lg">12</Text>
            <Text className="text-gray-600 text-xs">Events actifs</Text>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar
          placeholder="Rechercher dans la communauté..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={(query) => {
            analyticsService.trackUserAction('search_community', { query });
          }}
        />
      </View>

      {/* Tab Content */}
      <TabView
        tabs={tabs}
        initialTab="all"
        onTabChange={setActiveTab}
        renderTabContent={renderTabContent}
      />

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-4">
        <FloatingActionButton
          icon="add"
          onPress={handleCreatePost}
          size="large"
        />
      </View>
    </SafeAreaView>
  );
}