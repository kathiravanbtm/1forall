import { useLocalSearchParams } from 'expo-router';
import { getExamById } from '@/utils/exams';
import { ExamDetailScreen } from '@/components/exam-detail-screen';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { StyleSheet, View } from 'react-native';

export default function ExamPage() {
  const { examId } = useLocalSearchParams();
  const exam = getExamById(examId as string);

  if (!exam) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText type="title">Exam Not Found</ThemedText>
          <ThemedText>The exam you're looking for doesn't exist.</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return <ExamDetailScreen exam={exam} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
});
