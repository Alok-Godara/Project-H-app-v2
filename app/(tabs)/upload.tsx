import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { dummyDocument } from "@/data/dummyMedicalEventAndDocument";
import { insertRow, uploadImageToBucket } from "@/Services/Services";
import axios from "axios";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon, Upload } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
  const [patient_id]= useState<string>("a2b46eeb-b0d1-4e57-955f-ccf76143b2a1");
  const [loading, setLoading] = useState(false);

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
      quality: 1,
      // No aspect property: free crop, select full image by default
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
      quality: 1,
      // No aspect property: free crop, select full image by default
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadRecord = async () => {
    if (selectedImage) {
      setLoading(true);
      try {
        // 1. Upload to Supabase Storage
        const fileUri = selectedImage;
        const fileName = fileUri.split("/").pop() || `record_${Date.now()}.png`;
        const fileExt = fileName.split(".").pop() || "png";
        const bucket = "medical_data";
        const path = `${Date.now()}_${fileName}`;

        // Read file as base64 using legacy API
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

        // 3. Call external API to extract medical event data
        let medicalEventData = null;
        try {
          // Read file as binary for FormData
          let formData = new FormData();
          // In React Native, FormData file must be { uri, name, type } and cast as any for TS
          formData.append("file", {
            uri: fileUri,
            name: fileName,
            type: `image/${fileExt}`,
          } as any);
          const response = await axios.post(
            "https://ph-api-qjug.onrender.com/extract",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          medicalEventData = {
            ...(typeof response.data === "object" && response.data !== null ? response.data : {}),
            patient_id,
          };
        } catch (apiErr) {
          console.error("[API][extract] Error:", apiErr);
          throw new Error("Failed to extract data from image.");
        }

        // 4. Insert medical event and get its id
        const { error, data } = await insertRow(
          "medical_events",
          medicalEventData
        );
        if (error) {
          console.error("[DB][medical_events] Insert Error:", error);
          throw error;
        } else {
          console.log("[DB][medical_events] Insert Success:", data);
        }

        // 5. Prepare document data using medical_event id and same patient id
        const documentData = {
          ...dummyDocument,
          file_url,
          medical_event_id: data.id,
          patient_id,
        };

        // 6. Insert document (id will be auto-generated by Supabase)
        const { error: docError, data: docData } = await insertRow("documents", documentData);
        if (docError) {
          console.error("[DB][documents] Insert Error:", docError);
        } else {
          console.log("[DB][documents] Insert Success:", docData);
        }

  setLoading(false);
  Alert.alert("Success", "Medical record uploaded successfully!");
  setSelectedImage(null);
      } catch (err) {
        setLoading(false);
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
        {loading && (
          <View style={styles.spinnerContainer}>
            <View style={styles.spinnerBackground} />
            <View style={styles.spinnerBox}>
              <Text style={styles.spinnerText}>Uploading...</Text>
              {/* Use ActivityIndicator from react-native */}
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          </View>
        )}
        {!loading && (!selectedImage ? (
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
        ))}
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  spinnerContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  spinnerBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  spinnerText: {
    ...Typography.body,
    color: Colors.text.primary,
    marginBottom: 16,
  },
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
