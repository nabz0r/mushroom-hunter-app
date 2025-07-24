import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';

interface TabItem {
  key: string;
  title: string;
  badge?: number;
}

interface TabViewProps {
  tabs: TabItem[];
  initialTab?: string;
  onTabChange?: (tabKey: string) => void;
  renderTabContent: (tabKey: string) => React.ReactNode;
  tabBarStyle?: string;
  activeTabStyle?: string;
  inactiveTabStyle?: string;
}

export function TabView({
  tabs,
  initialTab,
  onTabChange,
  renderTabContent,
  tabBarStyle = '',
  activeTabStyle = '',
  inactiveTabStyle = '',
}: TabViewProps) {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.key);
  const indicatorPosition = React.useRef(new Animated.Value(0)).current;
  const tabWidth = 100 / tabs.length;

  const handleTabPress = (tabKey: string, index: number) => {
    setActiveTab(tabKey);
    onTabChange?.(tabKey);
    
    // Animate indicator
    Animated.spring(indicatorPosition, {
      toValue: index * tabWidth,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View className="flex-1">
      {/* Tab Bar */}
      <View className={`border-b border-gray-200 ${tabBarStyle}`}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.key;
            
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => handleTabPress(tab.key, index)}
                className={`
                  px-6 py-4 flex-row items-center justify-center relative
                  ${isActive ? activeTabStyle || 'border-b-2 border-primary-500' : inactiveTabStyle}
                `}
                style={{ minWidth: 120 }}
              >
                <Text
                  className={`
                    font-medium text-center
                    ${isActive ? 'text-primary-600' : 'text-gray-600'}
                  `}
                >
                  {tab.title}
                </Text>
                
                {tab.badge && tab.badge > 0 && (
                  <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {tab.badge > 99 ? '99+' : tab.badge.toString()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        
        {/* Animated Indicator */}
        <Animated.View
          className="absolute bottom-0 h-0.5 bg-primary-500"
          style={{
            left: `${indicatorPosition}%`,
            width: `${tabWidth}%`,
          }}
        />
      </View>
      
      {/* Tab Content */}
      <View className="flex-1">
        {renderTabContent(activeTab)}
      </View>
    </View>
  );
}