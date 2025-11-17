import { FlatList, StyleSheet, View, useWindowDimensions, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExamCard } from '@/components/exam-card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Exam {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export default function HomeScreen() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const router = useRouter();

  // Responsive column count
  const getNumColumns = () => {
    if (width < 640) return 2; // Mobile: 2 columns
    if (width < 1024) return 3; // Tablet: 3 columns
    return 4; // Desktop: 4 columns
  };

  // Large screen detection
  const isLargeScreen = width > 1024;
  const contentMaxWidth = isLargeScreen ? 1400 : '100%';

  useEffect(() => {
    // Load exams from JSON file
    const examsData = require('@/assets/data/exams.json');
    setExams(examsData);
    setFilteredExams(examsData);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = exams.filter(exam =>
      exam.title.toLowerCase().includes(query.toLowerCase()) ||
      exam.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredExams(filtered);
  };

  const handleExamPress = (examId: string) => {
    router.push(`/exam/${examId}`);
  };

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
            Exams
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Use 1forall exams application
          </ThemedText>
          {/* Search Bar in Header */}
          <TextInput
            style={[
              styles.headerSearchInput,
              {
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Search exams..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
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
        {/* Exams Grid */}
        <FlatList
          data={filteredExams}
          numColumns={getNumColumns()}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExamCard
              id={item.id}
              title={item.title}
              icon={item.icon}
              description={item.description}
              onPress={() => handleExamPress(item.id)}
            />
          )}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
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
  headerSearchInput: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 12,
  },
  gridContent: {
    paddingVertical: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    flex: 1,
  },
});
