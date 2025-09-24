import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { insertRow, uploadImageToBucket } from "@/Services/Services";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon, Upload } from "lucide-react-native";
import React, { useState } from "react";
import {
  dummyMedicalEvent,
  dummyDocument,
} from "@/data/dummyMedicalEventAndDocument";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UploadScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return false;
      }
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Camera not available",
        "Camera functionality is not available on web platform."
      );
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadRecord = async () => {
    if (selectedImage) {
      try {
        // 1. Upload to Supabase Storage
        const fileUri = selectedImage;
        const fileName = fileUri.split("/").pop() || `record_${Date.now()}.png`;
        const fileExt = fileName.split(".").pop() || "png";
        const bucket = "medical-records";
        const path = `${Date.now()}_${fileName}`;

        // Read file as blob
        const fileBlob = await FileSystem.readAsStringAsync(fileUri, {
          encoding: "base64",
        });
        const fileBuffer = Buffer.from(fileBlob, "base64");

        const { data: uploadData, error: uploadError } =
          await uploadImageToBucket(
            bucket,
            path,
            fileBuffer,
            `image/${fileExt}`
          );
        if (uploadError) throw uploadError;

        // 2. Store file_url
        const file_url = uploadData?.path
          ? `${uploadData.fullPath || uploadData.path}`
          : "";

        // // 3. Call external API (dummy placeholder)
        // let api_data = null;
        // try {
        //   // Replace with your actual API call
        //   const response = await fetch(
        //     "https://your-api-endpoint.com/analyze",
        //     {
        //       method: "POST",
        //       headers: { "Content-Type": "application/json" },
        //       body: JSON.stringify({ file_url }),
        //     }
        //   );
        //   api_data = await response.json();
        // } catch {
        //   api_data = null;
        // }

        // 3. Call dummy API to get medical event and document data
        // Simulate API call by returning dummy data
        // In real scenario, replace with actual API call
        const apiResponse = {
          medical_event: { ...dummyMedicalEvent },
          document: { ...dummyDocument, file_url },
        };

        // 4. Update medical_events table with returned data
        await insertRow("medical_events", apiResponse.medical_event);

        // 5. Update documents table with returned data
        await insertRow("documents", apiResponse.document);

        Alert.alert("Success", "Medical record uploaded successfully!");
        setSelectedImage(null);
      } catch (err) {
        let message = "Something went wrong.";
        if (err && typeof err === "object" && "message" in err) {
          message = (err as any).message;
        }
        Alert.alert("Upload Failed :", message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Medical Records</Text>
        <Text style={styles.subtitle}>
          Add your prescriptions or lab reports
        </Text>
      </View>

      <View style={styles.content}>
        {!selectedImage ? (
          <View style={styles.uploadSection}>
            <View style={styles.uploadIcon}>
              <Upload color={Colors.primary} size={48} strokeWidth={1.5} />
            </View>

            <Text style={styles.uploadTitle}>Click to Upload</Text>
            <Text style={styles.uploadDescription}>
              Choose from your device or take a photo
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickImageFromGallery}
              >
                <ImageIcon color="#FFFFFF" size={20} />
                <Text style={styles.buttonText}>Choose from Device</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
                <Camera color="#007AFF" size={20} />
                <Text style={styles.cameraButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.previewSection}>
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>Record Preview</Text>
              <Text style={styles.previewDescription}>
                Your medical record has been selected and is ready to upload
              </Text>

              <View style={styles.previewActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={uploadRecord}
                >
                  <Text style={styles.confirmButtonText}>Upload Record</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    ...Typography.title,
    color: Colors.text.primary,
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  uploadSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  uploadIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  uploadTitle: {
    ...Typography.title,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  uploadDescription: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  uploadButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: Colors.cardBackground,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    gap: 8,
  },
  buttonText: {
    ...Typography.button,
    color: "#FFFFFF",
  },
  cameraButtonText: {
    ...Typography.button,
    color: Colors.primary,
  },
  previewSection: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 100,
  },
  previewCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  previewTitle: {
    ...Typography.title,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  previewDescription: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  previewActions: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.success,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    ...Typography.button,
    color: Colors.text.secondary,
    fontSize: 14,
  },
  confirmButtonText: {
    ...Typography.button,
    color: "#FFFFFF",
    fontSize: 14,
  },
});
