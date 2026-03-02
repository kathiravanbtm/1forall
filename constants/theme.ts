/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Modern, minimal professional color palette
const primary = '#2563EB'; // Professional blue
const primaryDark = '#1E40AF'; // Darker blue for hover/active states
const secondary = '#64748B'; // Slate gray for secondary text
const successColor = '#10B981'; // Green for CTAs
const background = '#FFFFFF';
const backgroundSecondary = '#F8FAFC'; // Very light blue-gray
const backgroundDark = '#0F172A'; // Deep navy for dark mode
const backgroundDarkSecondary = '#1E293B'; // Slightly lighter navy
const textPrimary = '#0F172A'; // Deep navy for main text
const textSecondary = '#64748B'; // Gray for secondary text
const border = '#E2E8F0'; // Light gray border
const borderDark = '#334155'; // Dark gray for dark mode

export const Colors = {
  light: {
    text: textPrimary,
    background: background,
    backgroundSecondary: backgroundSecondary,
    tint: primary,
    icon: secondary,
    tabIconDefault: secondary,
    tabIconSelected: primary,
    textSecondary: textSecondary,
    border: border,
    success: successColor,
    primary: primary,
    primaryDark: primaryDark,
  },
  dark: {
    text: '#F1F5F9', // Light text for dark mode
    background: backgroundDark,
    backgroundSecondary: backgroundDarkSecondary,
    tint: '#60A5FA', // Lighter blue for dark mode
    icon: '#94A3B8',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#60A5FA',
    textSecondary: '#CBD5E1',
    border: borderDark,
    success: '#34D399',
    primary: '#60A5FA',
    primaryDark: '#3B82F6',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
