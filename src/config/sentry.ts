import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

export const initSentry = () => {
  const dsn = Constants.expoConfig?.extra?.sentryDsn;
  
  if (!dsn) {
    console.warn('Sentry DSN not found, skipping initialization');
    return;
  }

  Sentry.init({
    dsn,
    enableInExpoDevelopment: false,
    debug: __DEV__,
    environment: Constants.expoConfig?.extra?.environment || 'development',
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    integrations: [
      new Sentry.Native.ReactNativeTracing({
        tracingOrigins: ['localhost', /^https:\/\/api\.mushroomhunter\.app/],
        routingInstrumentation: new Sentry.Native.ReactNavigationInstrumentation(),
      }),
    ],
  });

  // Set initial user context
  Sentry.Native.setTag('app_version', Constants.expoConfig?.version || 'unknown');
  Sentry.Native.setTag('platform', Constants.platform?.ios ? 'ios' : 'android');
  Sentry.Native.setTag('expo_sdk_version', Constants.expoConfig?.sdkVersion || 'unknown');
};

// Helper functions for Sentry
export const sentryUtils = {
  setUser: (user: { id: string; username: string; email: string }) => {
    Sentry.Native.setUser({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  },

  clearUser: () => {
    Sentry.Native.setUser(null);
  },

  captureException: (error: Error, context?: any) => {
    Sentry.Native.captureException(error, {
      contexts: {
        custom: context,
      },
    });
  },

  captureMessage: (message: string, level: Sentry.Native.Severity = 'info') => {
    Sentry.Native.captureMessage(message, level);
  },

  addBreadcrumb: (breadcrumb: {
    message: string;
    category?: string;
    level?: Sentry.Native.Severity;
    data?: any;
  }) => {
    Sentry.Native.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || 'custom',
      level: breadcrumb.level || 'info',
      data: breadcrumb.data,
      timestamp: Date.now() / 1000,
    });
  },

  startTransaction: (name: string, op: string = 'navigation') => {
    return Sentry.Native.startTransaction({ name, op });
  },
};