import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, I18nManager, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useTranslation } from "react-i18next";

import { detectClothesWithColor, checkApiHealth } from "../services/detectionApi";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useAccessibleColors } from "@/hooks/useAccessibleColors";
import { AccessibleText } from "@/components/AccessibleText";
import { AccessibleButton } from "@/components/AccessibleButton";

import {
  speakUI,
  stopTTS,  
  speakUrduOpenAI,
  speakEnglishOpenAI,
  UI_URDU,
} from "../services/ttsService";

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? "";

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

const DETECTION_DELAY_MS = 5000;

async function translateColorOnly(
  colorText: string,
  lang: "en" | "ur"
): Promise<string> {
  if (!colorText) return "";
  if (!OPENAI_API_KEY) return colorText;

  const systemPrompt =
    lang === "ur"
      ? `Translate this colour detection result into short natural spoken Urdu.
Reply ONLY in Urdu script.
Do not explain.`
      : `Convert this colour detection result into short natural spoken English.
Reply ONLY with the spoken phrase.
Do not explain.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 80,
        temperature: 0,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: colorText },
        ],
      }),
    });

    if (!response.ok) return colorText;

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || colorText;
  } catch {
    return colorText;
  }
}

export default function ColorIdentificationScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { hapticFeedback } = useAccessibility();

  const hookColors = useAccessibleColors();
  const colors = useMemo(() => hookColors ?? FALLBACK_COLORS, [hookColors]);

  const [permission, requestPermission] = useCameraPermissions();

  const [apiConnected, setApiConnected] = useState(false);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [detectedLabel, setDetectedLabel] = useState("");
  const [colorHex, setColorHex] = useState("");
  const [detectedColors, setDetectedColors] = useState<string[]>([]);

  const [lang, setLang] = useState<"en" | "ur">(
    i18n.language === "ur" ? "ur" : "en"
  );

  const cameraRef = useRef<CameraView>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sessionRef = useRef(0);
  const isMountedRef = useRef(true);
  const isDetectingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const apiConnectedRef = useRef(false);
  const isAutoDetectingRef = useRef(false);
  const hasAutoStartedRef = useRef(false);
  const lastSpokenDetectionRef = useRef("");
  const consecutiveFailuresRef = useRef(0);
  const langRef = useRef(lang);
  const shouldStopEverythingRef = useRef(false);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  const clearDetectionLoop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const hardStopColorMode = useCallback(() => {
    sessionRef.current += 1;
    shouldStopEverythingRef.current = true;

    clearDetectionLoop();
    stopTTS();

    isAutoDetectingRef.current = false;
    isDetectingRef.current = false;
    isSpeakingRef.current = false;
    apiConnectedRef.current = false;
    hasAutoStartedRef.current = false;
    lastSpokenDetectionRef.current = "";

    setIsAutoDetecting(false);
    setDetectedLabel("");
    setColorHex("");
    setDetectedColors([]);
  }, [clearDetectionLoop]);

  useEffect(() => {
    isMountedRef.current = true;
    shouldStopEverythingRef.current = false;

    return () => {
      isMountedRef.current = false;
      hardStopColorMode();
    };
  }, [hardStopColorMode]);

  useEffect(() => {
    apiConnectedRef.current = apiConnected;
  }, [apiConnected]);

  useEffect(() => {
    isAutoDetectingRef.current = isAutoDetecting;
  }, [isAutoDetecting]);

  const checkConnection = useCallback(async () => {
    const mySession = sessionRef.current;

    try {
      const ok = await checkApiHealth();

      if (
        mySession !== sessionRef.current ||
        !isMountedRef.current ||
        shouldStopEverythingRef.current
      ) {
        return;
      }

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

      if (
        mySession !== sessionRef.current ||
        !isMountedRef.current ||
        shouldStopEverythingRef.current
      ) {
        return;
      }

      setApiConnected(false);
      apiConnectedRef.current = false;
      setIsAutoDetecting(false);
      isAutoDetectingRef.current = false;
      hasAutoStartedRef.current = false;
      clearDetectionLoop();
    }
  }, [clearDetectionLoop]);

  useEffect(() => {
    shouldStopEverythingRef.current = false;
    void checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    if (!apiConnected) return;
    if (!permission?.granted) return;
    if (hasAutoStartedRef.current) return;
    if (shouldStopEverythingRef.current) return;

    hasAutoStartedRef.current = true;
    setIsAutoDetecting(true);
    isAutoDetectingRef.current = true;
    consecutiveFailuresRef.current = 0;
    lastSpokenDetectionRef.current = "";

    hapticFeedback?.("medium");
  }, [apiConnected, permission?.granted, hapticFeedback]);

  const speakDetectionResult = useCallback(
    async (colorsList: string[], primaryHex: string) => {
      const mySession = sessionRef.current;

      if (shouldStopEverythingRef.current) return;
      if (!isMountedRef.current) return;
      if (!isAutoDetectingRef.current) return;
      if (isSpeakingRef.current) return;

      const cleanColors = colorsList.filter(Boolean);
      const rawLabel = cleanColors.join(", ");

      if (!rawLabel) return;

      setDetectedColors(cleanColors);
      setColorHex(primaryHex);

      consecutiveFailuresRef.current = 0;

      const speechKey = `${rawLabel.toLowerCase()}|${primaryHex.toLowerCase()}|${langRef.current}`;

      if (lastSpokenDetectionRef.current === speechKey) return;

      lastSpokenDetectionRef.current = speechKey;
      isSpeakingRef.current = true;

      hapticFeedback?.("success");

      try {
        const phrase = await translateColorOnly(rawLabel, langRef.current);

        if (
          mySession !== sessionRef.current ||
          shouldStopEverythingRef.current ||
          !isMountedRef.current ||
          !isAutoDetectingRef.current
        ) {
          stopTTS();
          return;
        }

        setDetectedLabel(phrase);

        if (langRef.current === "ur") {
          await speakUrduOpenAI(phrase);
        } else {
          await speakEnglishOpenAI(phrase);
        }

        if (
          mySession !== sessionRef.current ||
          shouldStopEverythingRef.current ||
          !isMountedRef.current ||
          !isAutoDetectingRef.current
        ) {
          stopTTS();
          return;
        }

        await new Promise<void>((resolve) => {
          timeoutRef.current = setTimeout(resolve, DETECTION_DELAY_MS);
        });
      } finally {
        if (mySession === sessionRef.current) {
          isSpeakingRef.current = false;
        }
      }
    },
    [hapticFeedback]
  );

  const handleDetectionFailure = useCallback(
    (error: unknown) => {
      if (shouldStopEverythingRef.current) return;

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
      }
    },
    [hapticFeedback, t]
  );

  const captureAndDetect = useCallback(async () => {
    const mySession = sessionRef.current;

    if (shouldStopEverythingRef.current) return;
    if (!apiConnectedRef.current) return;
    if (!permission?.granted) return;
    if (!cameraRef.current) return;
    if (isDetectingRef.current) return;
    if (isSpeakingRef.current) return;

    isDetectingRef.current = true;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: false,
        exif: false,
        shutterSound: false,
      });

      if (
        mySession !== sessionRef.current ||
        shouldStopEverythingRef.current ||
        !isMountedRef.current
      ) {
        return;
      }

      if (!photo?.uri) {
        throw new Error("Failed to capture photo");
      }

      const result: any = await detectClothesWithColor(photo.uri, 0.3);

      if (
        mySession !== sessionRef.current ||
        shouldStopEverythingRef.current ||
        !isMountedRef.current
      ) {
        return;
      }

      if (!result?.success) {
        throw new Error(result?.message || "Detection request failed");
      }

      const topDetection =
        Array.isArray(result?.detections) && result.detections.length > 0
          ? result.detections[0]
          : null;

      const colorData = topDetection?.color;

      const visibleColors =
        typeof colorData === "object" &&
        colorData !== null &&
        Array.isArray(colorData.visible_colors)
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

      if (colorNames.length > 0) {
        await speakDetectionResult(colorNames, primaryHex);
      } else {
        consecutiveFailuresRef.current = 0;
      }
    } catch (error) {
      if (
        mySession === sessionRef.current &&
        !shouldStopEverythingRef.current
      ) {
        handleDetectionFailure(error);
      }
    } finally {
      if (mySession === sessionRef.current) {
        isDetectingRef.current = false;
      }
    }
  }, [handleDetectionFailure, permission?.granted, speakDetectionResult]);

  useEffect(() => {
    clearDetectionLoop();

    if (!isAutoDetecting || !apiConnected) return;

    let cancelled = false;
    const mySession = sessionRef.current;

    const runLoop = async () => {
      if (cancelled) return;
      if (mySession !== sessionRef.current) return;
      if (shouldStopEverythingRef.current) return;
      if (!isMountedRef.current) return;
      if (!isAutoDetectingRef.current) return;
      if (!apiConnectedRef.current) return;

      await captureAndDetect();

      if (cancelled) return;
      if (mySession !== sessionRef.current) return;
      if (shouldStopEverythingRef.current) return;
      if (!isMountedRef.current) return;
      if (!isAutoDetectingRef.current) return;
      if (!apiConnectedRef.current) return;

      timeoutRef.current = setTimeout(runLoop, DETECTION_DELAY_MS);
    };

    void runLoop();

    return () => {
      cancelled = true;
      clearDetectionLoop();
    };
  }, [apiConnected, isAutoDetecting, captureAndDetect, clearDetectionLoop]);

  const handleLanguageToggle = async () => {
    const mySession = sessionRef.current;
    const next = lang === "en" ? "ur" : "en";

    stopTTS();

    setLang(next);
    langRef.current = next;
    lastSpokenDetectionRef.current = "";
    setDetectedLabel("");

    await i18n.changeLanguage(next);

    if (
      mySession !== sessionRef.current ||
      shouldStopEverythingRef.current ||
      !isMountedRef.current
    ) {
      return;
    }

    hapticFeedback?.("medium");

    speakUI(
      next === "ur" ? UI_URDU.switched_urdu : "Language changed to English",
      next
    );
  };

  const goToModes = useCallback(() => {
    hardStopColorMode();

    requestAnimationFrame(() => {
      router.replace("/features");
    });
  }, [router, hardStopColorMode]);

  if (!permission) {
    return <View style={[styles.root, { backgroundColor: colors.background }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.topBar, { backgroundColor: colors.primary }]}>
          <AccessibleText
            style={[styles.topTitle, { color: colors.textInverse }]}
            level={1}
          >
            {lang === "ur"
              ? "رنگ کی شناخت"
              : t("color.title", "Color Identification")}
          </AccessibleText>
        </View>

        <View
          style={[
            styles.permissionCenter,
            { backgroundColor: colors.background },
          ]}
        >
          <AccessibleText style={{ color: colors.text }}>
            {t("common.cameraPermissionNeeded", "Camera permission is required.")}
          </AccessibleText>

          <AccessibleButton
            title={t("common.allowCamera", "Allow Camera")}
            onPress={requestPermission}
            style={[styles.permissionButton, { borderColor: colors.text }]}
          />

          <AccessibleButton
            title={lang === "ur" ? "واپس" : t("common.modes", "Modes")}
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
        <AccessibleText
          style={[styles.topTitle, { color: colors.textInverse }]}
          level={1}
        >
          {lang === "ur"
            ? "رنگ کی شناخت"
            : t("color.title", "Color Identification")}
        </AccessibleText>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />

        {detectedLabel !== "" && (
          <View style={styles.resultContainer}>
            <View
              style={[
                styles.colorSwatch,
                { backgroundColor: colorHex || "#000000" },
              ]}
            />

            <AccessibleText style={styles.resultText}>
              {detectedLabel.toUpperCase()}
            </AccessibleText>

            {!!colorHex && (
              <AccessibleText style={styles.hexText}>{colorHex}</AccessibleText>
            )}

            {detectedColors.length > 0 && (
              <View style={{ marginTop: 12 }}>
                {detectedColors.map((color, index) => (
                  <AccessibleText
                    key={`${color}-${index}`}
                    style={styles.hexText}
                  >
                    {index + 1}. {color}
                  </AccessibleText>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
          },
        ]}
      >
        <AccessibleButton
          title={lang === "ur" ? "واپس" : t("common.modes", "Modes")}
          onPress={goToModes}
          style={styles.bottomButton}
        />

        <AccessibleButton
          title={lang === "ur" ? "اردو" : "ENG"}
          onPress={handleLanguageToggle}
          accessibilityRole="switch"
          accessibilityState={{ checked: lang === "ur" }}
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