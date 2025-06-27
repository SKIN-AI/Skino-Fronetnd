import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  TriangleAlert as AlertTriangle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CircleCheck as CheckCircle,
  Download,
  Share,
  Stethoscope,
} from "lucide-react-native";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function ResultScreen() {
  const router = useRouter();

  // Mock result data
  const result = {
    condition: "Mild Eczema",
    confidence: 87,
    severity: "Mild",
    image:
      "https://images.pexels.com/photos/5938519/pexels-photo-5938519.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Eczema is a common skin condition that causes dry, itchy, and inflamed skin. The affected area shows typical signs of mild eczematous dermatitis.",
    recommendations: [
      "Apply fragrance-free moisturizer twice daily",
      "Avoid known triggers like harsh soaps",
      "Use lukewarm water when bathing",
      "Consider over-the-counter hydrocortisone cream",
    ],
    riskFactors: [
      "Family history of allergies",
      "Dry skin conditions",
      "Environmental allergens",
    ],
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "#10b981";
    if (confidence >= 70) return "#f59e0b";
    return "#ef4444";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Mild":
        return CheckCircle;
      case "Moderate":
        return AlertTriangle;
      case "Severe":
        return AlertTriangle;
      default:
        return CheckCircle;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Result</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Share size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Result Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: result.image }} style={styles.resultImage} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)"]}
            style={styles.imageOverlay}
          >
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>Confidence</Text>
              <Text
                style={[
                  styles.confidenceValue,
                  { color: getConfidenceColor(result.confidence) },
                ]}
              >
                {result.confidence}%
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Diagnosis Card */}
        <View style={styles.diagnosisCard}>
          <View style={styles.diagnosisHeader}>
            <View style={styles.diagnosisIcon}>
              {(() => {
                const IconComponent = getSeverityIcon(result.severity);
                return (
                  <IconComponent
                    size={24}
                    color={result.severity === "Mild" ? "#10b981" : "#f59e0b"}
                  />
                );
              })()}
            </View>
            <View style={styles.diagnosisInfo}>
              <Text style={styles.conditionName}>{result.condition}</Text>
              <Text style={styles.severityText}>
                Severity: {result.severity}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{result.description}</Text>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Recommendations</Text>
          </View>

          {result.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>

        {/* Risk Factors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={20} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Common Risk Factors</Text>
          </View>

          <View style={styles.riskFactorsContainer}>
            {result.riskFactors.map((factor, index) => (
              <View key={index} style={styles.riskFactor}>
                <Text style={styles.riskFactorText}>{factor}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton}>
            <Stethoscope size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Consult Dermatologist</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryButton}>
              <Download size={18} color="#3b82f6" />
              <Text style={styles.secondaryButtonText}>Save Report</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Calendar size={18} color="#3b82f6" />
              <Text style={styles.secondaryButtonText}>Schedule Follow-up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ This analysis is for informational purposes only and should not
            replace professional medical advice. Please consult with a qualified
            dermatologist for proper diagnosis and treatment.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#1f2937",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f9ff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultImage: {
    width: "100%",
    height: 200,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  confidenceContainer: {
    alignSelf: "flex-end",
    alignItems: "center",
  },
  confidenceLabel: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#ffffff",
    opacity: 0.8,
  },
  confidenceValue: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    marginTop: 2,
  },
  diagnosisCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  diagnosisHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  diagnosisIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#f0fdf4",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  diagnosisInfo: {
    flex: 1,
  },
  conditionName: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  severityText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#6b7280",
  },
  description: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: "#4b5563",
    lineHeight: 22,
  },
  section: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#1f2937",
    marginLeft: 8,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    backgroundColor: "#3b82f6",
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
  },
  recommendationText: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: "#4b5563",
    lineHeight: 22,
    flex: 1,
  },
  riskFactorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  riskFactor: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  riskFactorText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#92400e",
  },
  actions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryButton: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#3b82f6",
    marginLeft: 6,
  },
  disclaimer: {
    backgroundColor: "#fef9e7",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  disclaimerText: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#92400e",
    lineHeight: 18,
  },
});
