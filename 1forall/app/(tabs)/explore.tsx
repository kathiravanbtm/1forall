import { StyleSheet, View, FlatList, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Tool {
  id: string;
  name: string;
  description: string;
  logo: string;
}

interface ToolCategory {
  id: string;
  category: string;
  icon: string;
  tools: Tool[];
}

export default function TabTwoScreen() {
  const [toolCategories, setToolCategories] = useState<ToolCategory[]>([]);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const isLargeScreen = width > 1024;

  useEffect(() => {
    const toolsData = require('@/assets/data/tools.json');
    setToolCategories(toolsData);
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: colors.background, dark: colors.background }}
      headerImage={
        <View
          style={[
            styles.headerContainer,
            { 
              backgroundColor: colors.background,
              paddingLeft: Math.max(insets.left, 16),
              paddingRight: Math.max(insets.right, 16),
              paddingTop: insets.top,
            },
          ]}>
          <ThemedText type="title" style={styles.headerTitle}>
            Tools
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Convert files between different formats
          </ThemedText>
        </View>
      }>
      <ThemedView
        style={[
          styles.container,
          { 
            backgroundColor: colors.backgroundSecondary,
            paddingLeft: Math.max(insets.left, 12),
            paddingRight: Math.max(insets.right, 12),
          },
        ]}>
        <FlatList
          data={toolCategories}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.categoryContainer}>
              {/* Category Header */}
              <View style={styles.categoryHeader}>
                <ThemedText style={styles.categoryIcon}>{item.icon}</ThemedText>
                <ThemedText type="defaultSemiBold" style={[styles.categoryTitle, { color: colors.text }]}>
                  {item.category}
                </ThemedText>
              </View>

              {/* Tools Grid */}
              <View style={styles.toolsGrid}>
                {item.tools.map((tool) => (
                  <TouchableOpacity
                    key={tool.id}
                    style={[
                      styles.toolCard,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        shadowColor: isDark ? '#000' : '#0F172A',
                      },
                    ]}
                    activeOpacity={0.7}>
                    {/* Logo Container - Square Shape */}
                    <View style={[styles.logoContainer, { backgroundColor: colors.backgroundSecondary }]}>
                      <ThemedText style={styles.logoText}>{tool.logo}</ThemedText>
                    </View>
                    
                    {/* Text Container */}
                    <View style={styles.textContainer}>
                      <ThemedText type="defaultSemiBold" style={[styles.toolName, { color: colors.text }]}>
                        {tool.name}
                      </ThemedText>
                      <ThemedText style={[styles.toolDescription, { color: colors.textSecondary }]}>
                        {tool.description}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  listContent: {
    paddingVertical: 12,
    paddingBottom: 24,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  toolCard: {
    flex: 1,
    minWidth: '48%',
    borderRadius: 10,
    borderWidth: 1,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  logoContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  logoText: {
    fontSize: 36,
  },
  textContainer: {
    padding: 12,
  },
  toolName: {
    fontSize: 13,
    marginBottom: 6,
  },
  toolDescription: {
    fontSize: 11,
    lineHeight: 15,
  },
});
