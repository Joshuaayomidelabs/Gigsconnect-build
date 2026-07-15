import { Capacitor } from '@capacitor/core';

/**
 * Checks if the application is running in a native web view environment (iOS/Android Capacitor).
 */
export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Checks if the platform is iOS.
 */
export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

/**
 * Checks if the platform is Android.
 */
export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};
