import { StyleSheet, ScrollView, TouchableOpacity, View, useWindowDimensions, Alert } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Document } from '@/utils/exams';

interface DocumentUploadProps {
  exam: {
    id: string;
    title: string;
    icon: string;
    documents: Document[];
  };
}

interface UploadedFile {
  documentId: string;
  fileName: string;
  size: number;
}

export function ExamDetailScreen({ exam }: DocumentUploadProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isWeb = width > 768;

  const handleUploadFile = (documentId: string) => {
    Alert.alert('File Upload', `Upload for ${documentId}`);
  };

  const handleDownloadConverted = () => {
    if (uploadedFiles.length === 0) {
      Alert.alert('Error', 'Please upload at least one file');
      return;
    }
    Alert.alert('Success', 'Your file has been converted and downloaded!');
  };

  const handleEditImage = (documentId: string) => {
    Alert.alert('Edit Image', `Open editor for ${documentId}`);
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <View
        style={[
          styles.topHeader,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            paddingLeft: Math.max(insets.left, 12),
            paddingRight: Math.max(insets.right, 12),
            paddingTop: Math.max(insets.top, 12),
          },
        ]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText type="defaultSemiBold" style={[styles.headerExamTitle, { color: colors.text }]}>
          {exam.title}
        </ThemedText>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
        contentContainerStyle={{
          paddingLeft: Math.max(insets.left, 0),
          paddingRight: Math.max(insets.right, 0),
          paddingBottom: Math.max(insets.bottom, 0),
        }}
        showsVerticalScrollIndicator={false}>

        <ThemedView style={[styles.section, { backgroundColor: colors.background }]}>
          <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: colors.text }]}>
            Required Documents
          </ThemedText>

          <ThemedView style={styles.documentsContainer}>
            {exam.documents.map((doc, index) => (
              <ThemedView
                key={doc.id}
                style={[
                  styles.documentCard,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                    marginBottom: index < exam.documents.length - 1 ? 12 : 0,
                  },
                ]}>
                <View style={styles.documentInfo}>
                  <ThemedText type="defaultSemiBold" style={[styles.docName, { color: colors.text }]}>
                    {doc.name}
                  </ThemedText>
                  <ThemedText style={[styles.docSpec, { color: colors.textSecondary }]}>
                    Size: {doc.size} • Format: {doc.format}
                  </ThemedText>
                </View>

                <View style={styles.documentActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleUploadFile(doc.id)}>
                    <ThemedText style={styles.actionButtonText}>Upload</ThemedText>
                  </TouchableOpacity>

                  {uploadedFiles.some(f => f.documentId === doc.id) && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.success }]}
                      onPress={() => handleEditImage(doc.id)}>
                      <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        {uploadedFiles.length > 0 && (
          <ThemedView style={[styles.section, { backgroundColor: colors.background }]}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: colors.text }]}>
              Uploaded Files ({uploadedFiles.length})
            </ThemedText>

            <ThemedView style={styles.filesContainer}>
              {uploadedFiles.map((file, index) => (
                <ThemedView
                  key={`${file.documentId}-${index}`}
                  style={[
                    styles.fileItem,
                    {
                      backgroundColor: colors.backgroundSecondary,
                      borderLeftColor: colors.primary,
                    },
                  ]}>
                  <ThemedText style={[styles.fileName, { color: colors.text }]}>
                    📄 {file.fileName}
                  </ThemedText>
                  <ThemedText style={[styles.fileSize, { color: colors.textSecondary }]}>
                    {(file.size / 1024).toFixed(2)} KB
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        )}

        {uploadedFiles.length > 0 && (
          <ThemedView style={[styles.section, { backgroundColor: colors.background }]}>
            <TouchableOpacity
              style={[
                styles.downloadButton,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={handleDownloadConverted}>
              <ThemedText style={styles.downloadButtonText}>
                Download Converted File
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerExamTitle: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  section: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  documentsContainer: {
    gap: 0,
  },
  documentCard: {
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
  },
  documentInfo: {
    marginBottom: 12,
  },
  docName: {
    fontSize: 14,
    marginBottom: 6,
  },
  docSpec: {
    fontSize: 12,
    lineHeight: 16,
  },
  documentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    flex: 1,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  filesContainer: {
    gap: 8,
  },
  fileItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
  },
  downloadButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
