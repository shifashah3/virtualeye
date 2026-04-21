import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useTranslation } from "react-i18next";

import { detectClothesWithColor, checkApiHealth } from "../services/detectionApi";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useAccessibleColors } from "@/hooks/useAccessibleColors";
import { AccessibleText } from "@/components/AccessibleText";
import { AccessibleButton } from "@/components/AccessibleButton";

const FALLBACK_COLORS = {
  background: "#000000",
  primary: "#1f2937",
  text: "#ffffff",
  textInverse: "#ffffff",
  card: "#111827",
  success: "#22c55e",
  danger: "#ef4444",
  warning: "#f59e0b",
  disabled: "#6b7280",
};

export default function ColorIdentificationScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { speak, stopSpeaking, hapticFeedback } = useAccessibility();

  const hookColors = useAccessibleColors();
  const colors = useMemo(() => hookColors ?? FALLBACK_COLORS, [hookColors]);

  const [permission, requestPermission] = useCameraPermissions();

  const [apiConnected, setApiConnected] = useState(false);
  const [checkingApi, setCheckingApi] = useState(false);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);

  const [detectedLabel, setDetectedLabel] = useState("");
  const [colorHex, setColorHex] = useState("");
  const [detectedColors, setDetectedColors] = useState<string[]>([]);

  const cameraRef = useRef<CameraView>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMountedRef = useRef(true);
  const isDetectingRef = useRef(false);
  const apiConnectedRef = useRef(false);
  const isAutoDetectingRef = useRef(false);
  const hasAutoStartedRef = useRef(false);

  const lastSpokenDetectionRef = useRef("");
  const consecutiveFailuresRef = useRef(0);

  const hasAnnouncedRef = useRef(false);
  const lastAnnouncedLanguageRef = useRef<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      isDetectingRef.current = false;
      isAutoDetectingRef.current = false;
    };
  }, []);

  useEffect(() => {
    apiConnectedRef.current = apiConnected;
  }, [apiConnected]);

  useEffect(() => {
    isAutoDetectingRef.current = isAutoDetecting;
  }, [isAutoDetecting]);

  const clearDetectionLoop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const checkConnection = useCallback(async () => {
    if (!isMountedRef.current) return;

    setCheckingApi(true);

    try {
      const ok = await checkApiHealth();

      if (!isMountedRef.current) return;

      setApiConnected(ok);
      apiConnectedRef.current = ok;

      if (!ok) {
        setIsAutoDetecting(false);
        isAutoDetectingRef.current = false;
        hasAutoStartedRef.current = false;
        clearDetectionLoop();
      }
    } catch (error) {
      console.log("[ColorIdentification] API health check failed:", error);

      if (!isMountedRef.current) return;

      setApiConnected(false);
      apiConnectedRef.current = false;
      setIsAutoDetecting(false);
      isAutoDetectingRef.current = false;
      hasAutoStartedRef.current = false;
      clearDetectionLoop();
    } finally {
      if (isMountedRef.current) {
        setCheckingApi(false);
      }
    }
  }, [clearDetectionLoop]);

  useEffect(() => {
    void checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    const languageChanged = lastAnnouncedLanguageRef.current !== i18n.language;

    if (!hasAnnouncedRef.current || languageChanged) {
      hasAnnouncedRef.current = true;
      lastAnnouncedLanguageRef.current = i18n.language;

      stopSpeaking?.();
      speak?.(
        t(
          "color.announcement",
          "Color identification screen. Use camera to identify clothing colors."
        ),
        true
      );
    }
  }, [i18n.language, speak, stopSpeaking, t]);

  useEffect(() => {
    if (!apiConnected) return;
    if (!permission?.granted) return;
    if (hasAutoStartedRef.current) return;

    hasAutoStartedRef.current = true;
    setIsAutoDetecting(true);
    isAutoDetectingRef.current = true;
    consecutiveFailuresRef.current = 0;
    lastSpokenDetectionRef.current = "";

    hapticFeedback?.("medium");
  }, [apiConnected, permission?.granted, hapticFeedback]);

  const speakDetectionResult = useCallback(
    (colorsList: string[], primaryHex: string) => {
      const cleanColors = colorsList.filter(Boolean);
      const label = cleanColors.join(", ");

      setDetectedColors(cleanColors);
      setDetectedLabel(label);
      setColorHex(primaryHex);
      consecutiveFailuresRef.current = 0;

      const speechKey = `${label.toLowerCase()}|${primaryHex.toLowerCase()}`;
      if (lastSpokenDetectionRef.current !== speechKey) {
        lastSpokenDetectionRef.current = speechKey;
        hapticFeedback?.("success");
        speak?.(label, true);
      }
    },
    [hapticFeedback, speak]
  );

  const handleDetectionFailure = useCallback(
    (error: unknown) => {
      console.log("[ColorIdentification] Detection failed:", error);
      consecutiveFailuresRef.current += 1;

      if (!isAutoDetectingRef.current) {
        hapticFeedback?.("error");
        Alert.alert(
          t("common.error", "Error"),
          error instanceof Error ? error.message : "Detection failed"
        );
        return;
      }

      if (consecutiveFailuresRef.current >= 3) {
        consecutiveFailuresRef.current = 0;
        hapticFeedback?.("warning");
        speak?.(t("common.serverBusy", "Detection temporarily unavailable"), true);
      }
    },
    [hapticFeedback, speak, t]
  );

  const captureAndDetect = useCallback(async () => {
    if (!apiConnectedRef.current) return;
    if (!permission?.granted) return;
    if (!cameraRef.current) return;
    if (isDetectingRef.current) return;

    isDetectingRef.current = true;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: false,
        exif: false,
        shutterSound: false,
      });

      if (!photo?.uri) {
        throw new Error("Failed to capture photo");
      }

      const result: any = await detectClothesWithColor(photo.uri, 0.3);

      if (!isMountedRef.current) return;

      if (!result?.success) {
        throw new Error(result?.message || "Detection request failed");
      }

      const topDetection =
        Array.isArray(result?.detections) && result.detections.length > 0
          ? result.detections[0]
          : null;

      const colorData = topDetection?.color;

      const visibleColors =
        typeof colorData === "object" && colorData !== null && Array.isArray(colorData.visible_colors)
          ? colorData.visible_colors
          : [];

      const colorNames = visibleColors
        .map((c: any) => String(c?.name ?? "").trim())
        .filter(Boolean)
        .slice(0, 5);

      const primaryHex =
        typeof colorData === "object" && colorData !== null
          ? String(colorData.hex ?? "").trim()
          : "";

      console.log("[ColorIdentification] FULL RESULT:", JSON.stringify(result, null, 2));
      console.log("[ColorIdentification] TOP DETECTION:", topDetection);
      console.log("[ColorIdentification] COLOR DATA:", colorData);
      console.log("[ColorIdentification] VISIBLE COLORS:", visibleColors);
      console.log("[ColorIdentification] COLOR NAMES:", colorNames);

      if (colorNames.length > 0) {
        speakDetectionResult(colorNames, primaryHex);
        return;
      }

      consecutiveFailuresRef.current = 0;
    } catch (error) {
      handleDetectionFailure(error);
    } finally {
      isDetectingRef.current = false;
    }
  }, [handleDetectionFailure, permission?.granted, speakDetectionResult]);

  useEffect(() => {
    clearDetectionLoop();

    if (!isAutoDetecting || !apiConnected) {
      return;
    }

    let cancelled = false;

    const runLoop = async () => {
      if (cancelled) return;
      if (!isMountedRef.current) return;
      if (!isAutoDetectingRef.current) return;
      if (!apiConnectedRef.current) return;

      await captureAndDetect();

      if (cancelled) return;
      if (!isMountedRef.current) return;
      if (!isAutoDetectingRef.current) return;
      if (!apiConnectedRef.current) return;

      timeoutRef.current = setTimeout(runLoop, 2000);
    };

    void runLoop();

    return () => {
      cancelled = true;
      clearDetectionLoop();
    };
  }, [apiConnected, isAutoDetecting, captureAndDetect, clearDetectionLoop]);

  const goToModes = useCallback(() => {
    clearDetectionLoop();
    setIsAutoDetecting(false);
    isAutoDetectingRef.current = false;
    hasAutoStartedRef.current = false;
    consecutiveFailuresRef.current = 0;
    lastSpokenDetectionRef.current = "";
    setDetectedLabel("");
    setColorHex("");
    setDetectedColors([]);
    router.push("/features");
  }, [clearDetectionLoop, router]);

  if (!permission) {
    return <View style={[styles.root, { backgroundColor: colors.background }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.topBar, { backgroundColor: colors.primary }]}>
          <AccessibleText style={[styles.topTitle, { color: colors.textInverse }]} level={1}>
            {t("color.title", "Color Identification")}
          </AccessibleText>
        </View>

        <View style={[styles.permissionCenter, { backgroundColor: colors.background }]}>
          <AccessibleText style={{ color: colors.text }}>
            {t("common.cameraPermissionNeeded", "Camera permission is required.")}
          </AccessibleText>

          <AccessibleButton
            title={t("common.allowCamera", "Allow Camera")}
            onPress={requestPermission}
            style={[styles.permissionButton, { borderColor: colors.text }]}
          />

          <AccessibleButton
            title={t("common.modes", "Modes")}
            onPress={goToModes}
            style={styles.permissionButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { backgroundColor: colors.primary }]}>
        <AccessibleText style={[styles.topTitle, { color: colors.textInverse }]} level={1}>
          {t("color.title", "Color Identification")}
        </AccessibleText>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />

        {detectedLabel !== "" && (
          <View style={styles.resultContainer}>
            <View style={[styles.colorSwatch, { backgroundColor: colorHex || "#000000" }]} />
            <AccessibleText style={styles.resultText}>{detectedLabel.toUpperCase()}</AccessibleText>
            {!!colorHex && <AccessibleText style={styles.hexText}>{colorHex}</AccessibleText>}

            {detectedColors.length > 0 && (
              <View style={{ marginTop: 12 }}>
                {detectedColors.map((color, index) => (
                  <AccessibleText key={`${color}-${index}`} style={styles.hexText}>
                    {index + 1}. {color}
                  </AccessibleText>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      <View style={[styles.bottomBar, { backgroundColor: colors.background }]}>
        <AccessibleButton
          title={t("common.modes", "Modes")}
          onPress={goToModes}
          style={styles.bottomButton}
        />

        <AccessibleButton
          title={i18n.language === "ur" ? "اردو" : "ENG"}
          onPress={() => {}}
          style={styles.bottomButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  topBar: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  topTitle: { fontSize: 24, fontWeight: "800" },

  cameraContainer: { flex: 1 },
  camera: { flex: 1 },

  permissionCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 220,
    alignItems: "center",
    justifyContent: "center",
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
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: { fontSize: 14, flex: 1 },
  refreshButton: { padding: 6 },
  refreshText: { fontSize: 18 },

  detectingIndicator: {
    position: "absolute",
    top: 70,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
  },
  detectingIndicatorText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "600",
  },

  resultContainer: {
    position: "absolute",
    top: "35%",
    left: 30,
    right: 30,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  colorSwatch: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  resultText: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  hexText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#CCCCCC",
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