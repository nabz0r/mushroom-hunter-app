#!/usr/bin/env node

/**
 * Generate app.json with environment-specific configuration
 */

const fs = require('fs');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';
const VERSION = process.env.npm_package_version || '1.0.0';
const BUILD_NUMBER = process.env.BUILD_NUMBER || '1';

const environments = {
  development: {
    name: 'Mushroom Hunter (Dev)',
    slug: 'mushroom-hunter-dev',
    scheme: 'mushroomhunterdev',
    bundleIdentifier: 'com.mushroomhunter.app.dev',
    package: 'com.mushroomhunter.app.dev',
  },
  staging: {
    name: 'Mushroom Hunter (Staging)',
    slug: 'mushroom-hunter-staging',
    scheme: 'mushroomhunterstaging',
    bundleIdentifier: 'com.mushroomhunter.app.staging',
    package: 'com.mushroomhunter.app.staging',
  },
  production: {
    name: 'Mushroom Hunter',
    slug: 'mushroom-hunter',
    scheme: 'mushroomhunter',
    bundleIdentifier: 'com.mushroomhunter.app',
    package: 'com.mushroomhunter.app',
  },
};

const config = environments[ENV];

const appJson = {
  expo: {
    name: config.name,
    slug: config.slug,
    scheme: config.scheme,
    version: VERSION,
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#2D5016',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: config.bundleIdentifier,
      buildNumber: BUILD_NUMBER,
      infoPlist: {
        NSCameraUsageDescription: 'Mushroom Hunter needs camera access to identify mushrooms',
        NSLocationWhenInUseUsageDescription: 'Mushroom Hunter needs location access to track mushroom spots',
        NSPhotoLibraryUsageDescription: 'Mushroom Hunter needs photo library access to save mushroom photos',
        NSMotionUsageDescription: 'Mushroom Hunter uses motion sensors for AR features',
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#2D5016',
      },
      package: config.package,
      versionCode: parseInt(BUILD_NUMBER),
      permissions: [
        'CAMERA',
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'WRITE_EXTERNAL_STORAGE',
        'READ_EXTERNAL_STORAGE',
        'VIBRATE',
      ],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_ANDROID_KEY,
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-camera',
      'expo-location',
      'expo-image-picker',
      'expo-media-library',
      'expo-notifications',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
    ],
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID || 'your-project-id',
      },
      environment: ENV,
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      sentryDsn: process.env.SENTRY_DSN,
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
  },
};

// Write app.json
fs.writeFileSync(
  path.join(__dirname, '..', 'app.json'),
  JSON.stringify(appJson, null, 2)
);

console.log(`✅ Generated app.json for ${ENV} environment`);
console.log(`   Version: ${VERSION} (${BUILD_NUMBER})`);
console.log(`   Bundle ID: ${config.bundleIdentifier}`);