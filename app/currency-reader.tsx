import { AccessibleButton } from "@/components/AccessibleButton";
import { AccessibleText } from "@/components/AccessibleText";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useAccessibleColors } from "@/hooks/useAccessibleColors";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  I18nManager,
  StyleSheet,
  View
} from "react-native";
import { checkApiHealth, detectCurrency } from "../services/detectionApi";
// const { speak, hapticFeedback } = useAccessibility();

const CurrencyReaderScreen = () => {
  const router = useRouter();
  const { autoStart } = useLocalSearchParams<{ autoStart?: string }>();
  const { t, i18n } = useTranslation();
  const { speak, hapticFeedback } = useAccessibility();
  const colors = useAccessibleColors();

  const [permission, requestPermission] = useCameraPermissions();
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastDetection, setLastDetection] = useState<string>("");
  const [apiConnected, setApiConnected] = useState(false);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [checkingApi, setCheckingApi] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAutoStartedRef = useRef(false);
  const isMountedRef = useRef(true);
  const apiConnectedRef = useRef(false);
  const isAutoDetectingRef = useRef(false);
  const isDetectingRef = useRef(false);
  const lastSpokenRef = useRef("");

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    apiConnectedRef.current = apiConnected;
  }, [apiConnected]);

  useEffect(() => {
    isAutoDetectingRef.current = isAutoDetecting;
  }, [isAutoDetecting]);

  useEffect(() => {
    // speak?.(t("currencyReader.announcement"), true);
    void checkConnection();
  }, [i18n.language]);

  useEffect(() => {
    if (isAutoDetecting && apiConnected) {
      detectionIntervalRef.current = setInterval(() => {
        void captureCurrency();
      }, 2500);
    } else {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [isAutoDetecting, apiConnected]);

  useEffect(() => {
    if (autoStart !== "1") return;
    if (hasAutoStartedRef.current) return;
    if (!permission?.granted) return;
    if (!apiConnected) return;

    hasAutoStartedRef.current = true;
    setIsAutoDetecting(true);
    isAutoDetectingRef.current = true;
    lastSpokenRef.current = "";
    hapticFeedback?.("medium");
    // speak?.(t("objectDetection.startDetection"), true);
  }, [autoStart, permission?.granted, apiConnected, hapticFeedback, t]);

  const checkConnection = async () => {
    if (!isMountedRef.current) return;

    setCheckingApi(true);

    try {
      const isConnected = await checkApiHealth();

      if (!isMountedRef.current) return;

      setApiConnected(isConnected);
      apiConnectedRef.current = isConnected;

      if (!isConnected) {
        setIsAutoDetecting(false);
        isAutoDetectingRef.current = false;
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
          detectionIntervalRef.current = null;
        }

        Alert.alert(
          t("objectDetection.apiNotConnected"),
          t("objectDetection.apiNotConnected")
        );
      }
    } catch (error) {
      if (!isMountedRef.current) return;

      setApiConnected(false);
      apiConnectedRef.current = false;
      setIsAutoDetecting(false);
      isAutoDetectingRef.current = false;

      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }

      Alert.alert(
        t("objectDetection.apiNotConnected"),
        t("objectDetection.apiNotConnected")
      );
    } finally {
      if (isMountedRef.current) {
        setCheckingApi(false);
      }
    }
  };

  const captureCurrency = async () => {
    if (!cameraRef.current) return;
    if (!apiConnectedRef.current) return;
    if (isDetectingRef.current) return;

    isDetectingRef.current = true;
    setIsDetecting(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        shutterSound: false,
      });

      if (!photo?.uri) {
        throw new Error("Failed to capture image");
      }

      const result = await detectCurrency(photo.uri, 0.5);

      if (!isMountedRef.current) return;

      if (result?.detections?.length > 0) {
        const best = result.detections.reduce((a: any, b: any) =>
          a.confidence > b.confidence ? a : b
        );

        const detectedClass = String(best.class ?? "").trim();

        if (detectedClass) {
          setLastDetection(detectedClass);

          const speechKey = detectedClass.toLowerCase();
          if (lastSpokenRef.current !== speechKey) {
            lastSpokenRef.current = speechKey;
            hapticFeedback?.("success");
            speak?.(detectedClass, true);
          }
        }
      } else {
        setLastDetection("");
        lastSpokenRef.current = "";
      }
    } catch (e) {
      // Silent fail in auto mode to avoid repeated alerts
      console.log("[CurrencyReader] Detection failed:", e);
    } finally {
      isDetectingRef.current = false;
      if (isMountedRef.current) {
        setIsDetecting(false);
      }
    }
  };

  const goToModes = () => {
    setIsAutoDetecting(false);
    isAutoDetectingRef.current = false;
    lastSpokenRef.current = "";
    setLastDetection("");

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    router.push("/features");
  };

  const renderCamera = () => {
    if (!permission?.granted) {
      return (
        <View style={styles.permissionCenter}>
          <AccessibleText style={{ color: colors.text, marginBottom: 16 }}>
            {t("common.cameraPermissionNeeded", "Camera permission is required.")}
          </AccessibleText>

          <AccessibleButton
            title={t("personCapture.allowCamera")}
            onPress={requestPermission}
          />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <CameraView
          style={styles.camera}
          facing="back"
          ref={cameraRef}
          accessible={true}
          accessibilityLabel={t("personCapture.liveFeedLabel")}
        />

        {lastDetection !== "" && (
          <View
            style={[
              styles.resultContainer,
              {
                backgroundColor: colors.primary,
                borderColor: colors.textInverse,
                borderWidth: 2,
              },
            ]}
            accessibilityRole="alert"
          >
            <AccessibleText
              style={{ color: colors.textInverse, fontSize: 32, textAlign: "center" }}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {lastDetection}
            </AccessibleText>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { backgroundColor: colors.primary }]}>
        <AccessibleText
          style={{ color: colors.textInverse, fontSize: 24, fontWeight: "800" }}
          accessibilityRole="header"
        >
          {t("welcome.currency")}
        </AccessibleText>
      </View>

      <View style={{ flex: 1 }}>{renderCamera()}</View>

      <View
        style={[
          styles.bottomBar,
          { flexDirection: I18nManager.isRTL ? "row-reverse" : "row" },
        ]}
      >
        <AccessibleButton
          title={t("common.modes")}
          onPress={goToModes}
          style={styles.bottomButton}
        />

        <AccessibleButton
          title={I18nManager.isRTL ? "اردو" : "ENG"}
          onPress={() => {}}
          style={styles.bottomButton}
        />
      </View>
    </View>
  );
};

export default CurrencyReaderScreen;

const styles = StyleSheet.create({
  root: { flex: 1 },

  permissionCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  topBar: {
    minHeight: 110,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingTop: 30,
  },

  topTitle: { fontSize: 24, fontWeight: "800" },

  cameraContainer: { flex: 1 },
  camera: { flex: 1 },

  permissionCenterOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },

  statusOverlay: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  statusText: { fontSize: 14, flex: 1 },

  refreshButton: {
    width: 48,
    height: 48,
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },

  refreshText: { fontSize: 18 },

  detectingIndicator: {
    position: "absolute",
    top: 78,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
  },

  detectingIndicatorText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "700",
  },

  resultContainer: {
    position: "absolute",
    top: "40%",
    left: 30,
    right: 30,
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
  },

  resultText: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "800",
  },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  bottomButton: {
    flex: 1,
    height: 80,
    borderRadius: 18,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});