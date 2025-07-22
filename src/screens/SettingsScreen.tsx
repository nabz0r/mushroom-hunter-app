import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { changeLanguage, getAvailableLanguages } from '@/i18n';
import { notificationService } from '@/services/notificationService';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function SettingsScreen() {
  const { t, currentLanguage } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [notifications, setNotifications] = useState({
    mushroomAlerts: true,
    questReminders: true,
    communityUpdates: true,
    weatherAlerts: true,
    dailyReminder: false,
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showLocation: false,
    shareStats: true,
  });

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setShowLanguageSheet(false);
  };

  const handleNotificationToggle = async (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    setNotifications({ ...notifications, [key]: newValue });
    
    // Handle specific notification settings
    if (key === 'dailyReminder') {
      if (newValue) {
        await notificationService.notifyDailyReminder();
      } else {
        await notificationService.cancelAllNotifications();
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      t('profile.confirmLogout'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('profile.deleteAccount'),
      t('profile.confirmDeleteAccount'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement account deletion
            await AsyncStorage.clear();
            dispatch(logout());
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: t('profile.notifications'),
      icon: 'notifications-outline',
      items: [
        {
          label: t('notifications.mushroomIdentified'),
          value: notifications.mushroomAlerts,
          key: 'mushroomAlerts',
        },
        {
          label: t('notifications.questCompleted'),
          value: notifications.questReminders,
          key: 'questReminders',
        },
        {
          label: t('community.posts'),
          value: notifications.communityUpdates,
          key: 'communityUpdates',
        },
        {
          label: t('notifications.weatherAlert'),
          value: notifications.weatherAlerts,
          key: 'weatherAlerts',
        },
        {
          label: t('notifications.dailyReminder'),
          value: notifications.dailyReminder,
          key: 'dailyReminder',
        },
      ],
    },
    {
      title: t('profile.privacy'),
      icon: 'lock-closed-outline',
      items: [
        {
          label: t('profile.publicProfile'),
          value: privacy.publicProfile,
          key: 'publicProfile',
        },
        {
          label: t('profile.showLocation'),
          value: privacy.showLocation,
          key: 'showLocation',
        },
        {
          label: t('profile.shareStats'),
          value: privacy.shareStats,
          key: 'shareStats',
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-forest-dark px-6 pt-4 pb-6">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">{t('profile.settings')}</Text>
          </View>
        </View>

        {/* Account Section */}
        <View className="px-6 mt-6">
          <Card>
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">🧑‍🌾</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold">{user?.username}</Text>
                <Text className="text-gray-600">{user?.email}</Text>
              </View>
            </View>
            <Button
              title={t('profile.editProfile')}
              onPress={() => {}}
              variant="secondary"
              icon="person-outline"
              fullWidth
            />
          </Card>
        </View>

        {/* Language */}
        <TouchableOpacity
          onPress={() => setShowLanguageSheet(true)}
          className="mx-6 mt-4"
        >
          <Card>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="language-outline" size={24} color="#16a34a" />
                <Text className="text-lg font-medium ml-3">{t('profile.language')}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-600 mr-2">
                  {getAvailableLanguages().find(l => l.code === currentLanguage)?.name}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Settings Sections */}
        {settingsSections.map((section, index) => (
          <View key={index} className="px-6 mt-6">
            <Text className="text-lg font-bold mb-3 flex-row items-center">
              <Ionicons name={section.icon as any} size={20} color="#16a34a" />
              <Text className="ml-2">{section.title}</Text>
            </Text>
            <Card>
              {section.items.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  className={`flex-row items-center justify-between ${
                    itemIndex < section.items.length - 1 ? 'mb-4' : ''
                  }`}
                >
                  <Text className="flex-1 text-gray-700">{item.label}</Text>
                  <Switch
                    value={item.value}
                    onValueChange={() => handleNotificationToggle(item.key as any)}
                    trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                    thumbColor={item.value ? '#16a34a' : '#f4f3f4'}
                  />
                </View>
              ))}
            </Card>
          </View>
        ))}

        {/* Other Options */}
        <View className="px-6 mt-6 mb-8">
          <TouchableOpacity className="mb-3">
            <Card>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700">{t('profile.help')}</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity className="mb-3">
            <Card>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700">{t('profile.terms')}</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity className="mb-3">
            <Card>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700">{t('profile.privacyPolicy')}</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity className="mb-3">
            <Card>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700">{t('profile.about')}</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </View>
            </Card>
          </TouchableOpacity>

          <Button
            title={t('auth.logout')}
            onPress={handleLogout}
            variant="danger"
            icon="log-out-outline"
            fullWidth
            style={{ marginTop: 16 }}
          />

          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="mt-4 py-3"
          >
            <Text className="text-red-600 text-center">
              {t('profile.deleteAccount')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Selection Sheet */}
      <BottomSheet
        isVisible={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
        title={t('profile.language')}
        height={400}
      >
        <View className="p-4">
          {getAvailableLanguages().map((language) => (
            <TouchableOpacity
              key={language.code}
              onPress={() => handleLanguageChange(language.code)}
              className={`flex-row items-center justify-between p-4 rounded-xl mb-2 ${
                currentLanguage === language.code ? 'bg-primary-50' : 'bg-gray-50'
              }`}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">{language.flag}</Text>
                <Text className="text-lg font-medium">{language.name}</Text>
              </View>
              {currentLanguage === language.code && (
                <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}