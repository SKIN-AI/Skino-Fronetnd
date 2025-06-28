import React, { useState, useEffect } from "react";
import { Camera, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Camera as CameraIcon,
  CircleCheck as CheckCircle,
  FlipHorizontal,
  Info,
  Upload,
  X,
  Zap,
} from "lucide-react-native";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function ScanScreen() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");

  // Use the hook to manage camera permissions
  const [permission, requestPermission] = useCameraPermissions();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<
    "preparing" | "analyzing" | "finalizing"
  >("preparing");

  if (!permission) {
    // Permissions are still loading
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <CameraIcon size={48} color="#3b82f6" />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionSubtitle}>
            We need access to your camera to analyze your skin condition
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleCapture = async () => {
    setIsAnalyzing(true);
    setAnalysisStep("preparing");

    // Simulate analysis progress
    setTimeout(() => setAnalysisStep("analyzing"), 1000);
    setTimeout(() => setAnalysisStep("finalizing"), 2500);

    setTimeout(() => {
      setIsAnalyzing(false);

      router.push({
        pathname: "/result",
        params: {
          result: JSON.stringify({
            predicted_class: "Sample Skin Condition",
            confidence: 85,
            recommendation:
              "Keep skin moisturized.\nAvoid direct sunlight.\nUse sunscreen regularly.",
            image: null,
          }),
        },
      });
    }, 4000);
  };

  const handleUploadPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your photo library to upload images for analysis.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);

        setIsAnalyzing(true);
        setAnalysisStep("preparing");

        setTimeout(() => setAnalysisStep("analyzing"), 800);
        setTimeout(() => setAnalysisStep("finalizing"), 2200);

        setTimeout(() => {
          setIsAnalyzing(false);
          setSelectedImage(null);

          router.push({
            pathname: "/result",
            params: {
              result: JSON.stringify({
                predicted_class: "Uploaded Skin Condition",
                confidence: 78,
                recommendation:
                  "Keep area clean.\nApply medicated cream as advised.\nFollow up in 2 weeks.",
                image: imageUri,
              }),
            },
          });
        }, 3500);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(
        "Upload Error",
        "There was an error selecting your image. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const getAnalysisStepText = () => {
    switch (analysisStep) {
      case "preparing":
        return "Preparing image for analysis...";
      case "analyzing":
        return "AI analyzing skin patterns...";
      case "finalizing":
        return "Generating detailed report...";
      default:
        return "Processing...";
    }
  };

  const getAnalysisProgress = () => {
    switch (analysisStep) {
      case "preparing":
        return "25%";
      case "analyzing":
        return "70%";
      case "finalizing":
        return "95%";
      default:
        return "0%";
    }
  };

  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#1e40af", "#3b82f6"]}
          style={styles.analyzingContainer}
        >
          <View style={styles.analyzingContent}>
            {selectedImage && (
              <View style={styles.analyzingImageContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.analyzingImage}
                />
                <View style={styles.analyzingOverlay}>
                  <CheckCircle size={32} color="#10b981" />
                </View>
              </View>
            )}

            <View style={styles.analyzeIcon}>
              <Zap size={48} color="#ffffff" />
            </View>
            <Text style={styles.analyzingTitle}>Analyzing Your Skin</Text>
            <Text style={styles.analyzingSubtitle}>{getAnalysisStepText()}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: getAnalysisProgress() },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {getAnalysisProgress()} Complete
              </Text>
            </View>

            <View style={styles.analysisSteps}>
              <View
                style={[
                  styles.stepIndicator,
                  analysisStep === "preparing" && styles.activeStep,
                ]}
              >
                <Text style={styles.stepText}>Preparing</Text>
              </View>
              <View
                style={[
                  styles.stepIndicator,
                  analysisStep === "analyzing" && styles.activeStep,
                ]}
              >
                <Text style={styles.stepText}>Analyzing</Text>
              </View>
              <View
                style={[
                  styles.stepIndicator,
                  analysisStep === "finalizing" && styles.activeStep,
                ]}
              >
                <Text style={styles.stepText}>Finalizing</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <X size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Your Skin</Text>
        <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButton}>
          <FlipHorizontal size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing}>
          {/* Camera Overlay */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.overlayText}>
              Position the affected area within the frame
            </Text>
          </View>
        </CameraView>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <View style={styles.instructionItem}>
          <Info size={16} color="#3b82f6" />
          <Text style={styles.instructionText}>Ensure good lighting and clear focus</Text>
        </View>
        <View style={styles.instructionItem}>
          <Info size={16} color="#3b82f6" />
          <Text style={styles.instructionText}>Keep the camera steady for best results</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
          <View style={styles.uploadIconContainer}>
            <Upload size={20} color="#3b82f6" />
          </View>
          <Text style={styles.uploadText}>Upload Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureInner}>
            <CameraIcon size={32} color="#ffffff" />
          </View>
        </TouchableOpacity>

        <View style={styles.placeholder} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  //... same styles as before (omitted here for brevity)
});
