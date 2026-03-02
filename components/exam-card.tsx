import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { ThemedText } from './themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ExamCardProps {
  id: string;
  title: string;
  icon: string;
  description: string;
  onPress?: () => void;
}

export function ExamCard({ id, title, icon, description, onPress }: ExamCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          shadowColor: isDark ? '#000' : '#0F172A',
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: isDark ? 8 : 12,
          elevation: isDark ? 5 : 3,
          minHeight: isWeb ? 200 : 180,
          padding: isWeb ? 20 : 16,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* Icon Container */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.backgroundSecondary,
          },
        ]}>
        <ThemedText style={styles.icon}>{icon}</ThemedText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: isWeb ? 16 : 14,
            },
          ]}>
          {title}
        </ThemedText>
        <ThemedText
          style={[
            styles.description,
            {
              color: colors.textSecondary,
              fontSize: isWeb ? 13 : 12,
            },
          ]}>
          {description}
        </ThemedText>
      </View>


    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    marginVertical: 8,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 180,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
    marginBottom: 12,
  },
  title: {
    marginBottom: 6,
    lineHeight: 20,
  },
  description: {
    lineHeight: 18,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
