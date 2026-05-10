// // import { AccessibleButton } from "@/components/AccessibleButton";
// // import { AccessibleText } from "@/components/AccessibleText";
// // import { useAccessibility } from "@/contexts/AccessibilityContext";
// // import { useAccessibleColors } from "@/hooks/useAccessibleColors";
// // import { CameraView, useCameraPermissions } from "expo-camera";
// // import { useLocalSearchParams, useRouter } from "expo-router";
// // import React, { useCallback, useEffect, useRef, useState } from "react";
// // import { useTranslation } from "react-i18next";
// // import { I18nManager, StyleSheet, View } from "react-native";
// // import { checkApiHealth, detectCurrency } from "../services/detectionApi";
// // import {
// //   speakUI,
// //   speakUrduOpenAI,
// //   speakEnglishOpenAI,
// //   stopTTS,
// //   UI_URDU,
// // } from "../services/ttsService";

// // const URDU_PHRASES: Record<string, string> = {
// //   "10": "دس روپے",
// //   "20": "بیس روپے",
// //   "50": "پچاس روپے",
// //   "100": "سو روپے",
// //   "500": "پانچ سو روپے",
// //   "1000": "ایک ہزار روپے",
// //   "5000": "پانچ ہزار روپے",
// // };

// // const ENGLISH_PHRASES: Record<string, string> = {
// //   "10": "Ten rupees",
// //   "20": "Twenty rupees",
// //   "50": "Fifty rupees",
// //   "100": "One hundred rupees",
// //   "500": "Five hundred rupees",
// //   "1000": "One thousand rupees",
// //   "5000": "Five thousand rupees",
// // };

// // const CurrencyReaderScreen = () => {
// //   const router = useRouter();
// //   const { autoStart } = useLocalSearchParams<{ autoStart?: string }>();
// //   const { t, i18n } = useTranslation();
// //   const { hapticFeedback } = useAccessibility();
// //   const colors = useAccessibleColors();

// //   const [permission, requestPermission] = useCameraPermissions();
// //   const [isDetecting, setIsDetecting] = useState(false);
// //   const [lastDetection, setLastDetection] = useState("");
// //   const [apiConnected, setApiConnected] = useState(false);
// //   const [isAutoDetecting, setIsAutoDetecting] = useState(false);
// //   const [lang, setLang] = useState<"en" | "ur">(
// //     i18n.language === "ur" ? "ur" : "en"
// //   );

// //   const cameraRef = useRef<CameraView>(null);
// //   const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
// //     null
// //   );

// //   const hasAutoStartedRef = useRef(false);
// //   const isMountedRef = useRef(true);
// //   const apiConnectedRef = useRef(false);
// //   const isDetectingRef = useRef(false);
// //   const lastSpokenRef = useRef("");
// //   const langRef = useRef(lang);

// //   useEffect(() => {
// //     langRef.current = lang;
// //   }, [lang]);

// //   useEffect(() => {
// //     isMountedRef.current = true;

// //     void checkConnection();

// //     return () => {
// //       isMountedRef.current = false;
// //       stopTTS();

// //       if (detectionIntervalRef.current) {
// //         clearInterval(detectionIntervalRef.current);
// //         detectionIntervalRef.current = null;
// //       }
// //     };
// //   }, []);

// //   useEffect(() => {
// //     apiConnectedRef.current = apiConnected;
// //   }, [apiConnected]);

// //   useEffect(() => {
// //     if (isAutoDetecting && apiConnected) {
// //       detectionIntervalRef.current = setInterval(() => {
// //         void captureCurrency();
// //       }, 2500);
// //     } else {
// //       if (detectionIntervalRef.current) {
// //         clearInterval(detectionIntervalRef.current);
// //         detectionIntervalRef.current = null;
// //       }
// //     }

// //     return () => {
// //       if (detectionIntervalRef.current) {
// //         clearInterval(detectionIntervalRef.current);
// //         detectionIntervalRef.current = null;
// //       }
// //     };
// //   }, [isAutoDetecting, apiConnected]);

// //   useEffect(() => {
// //     if (autoStart !== "1") return;
// //     if (hasAutoStartedRef.current) return;
// //     if (!permission?.granted) return;
// //     if (!apiConnected) return;

// //     hasAutoStartedRef.current = true;
// //     setIsAutoDetecting(true);
// //     lastSpokenRef.current = "";

// //     hapticFeedback?.("medium");
// //   }, [autoStart, permission?.granted, apiConnected, hapticFeedback]);

// //   const stopAutoDetection = () => {
// //     setIsAutoDetecting(false);

// //     if (detectionIntervalRef.current) {
// //       clearInterval(detectionIntervalRef.current);
// //       detectionIntervalRef.current = null;
// //     }
// //   };

// //   const checkConnection = async () => {
// //     try {
// //       const isConnected = await checkApiHealth();

// //       if (!isMountedRef.current) return;

// //       setApiConnected(isConnected);
// //       apiConnectedRef.current = isConnected;

// //       if (!isConnected) {
// //         stopAutoDetection();
// //       }
// //     } catch {
// //       if (!isMountedRef.current) return;

// //       setApiConnected(false);
// //       apiConnectedRef.current = false;
// //       stopAutoDetection();
// //     }
// //   };

// //   const captureCurrency = useCallback(async () => {
// //     if (!cameraRef.current) return;
// //     if (!apiConnectedRef.current) return;
// //     if (isDetectingRef.current) return;

// //     isDetectingRef.current = true;
// //     setIsDetecting(true);

// //     try {
// //       const photo = await cameraRef.current.takePictureAsync({
// //         quality: 0.8,
// //         shutterSound: false,
// //       });

// //       if (!photo?.uri) {
// //         throw new Error("Failed to capture image");
// //       }

// //       const result = await detectCurrency(photo.uri, 0.5);

// //       if (!isMountedRef.current) return;

// //       if (result?.detections?.length > 0) {
// //         const best = result.detections.reduce((a: any, b: any) =>
// //           a.confidence > b.confidence ? a : b
// //         );

// //         const detectedClass = String(best.class ?? "").trim();

// //         if (detectedClass) {
// //           setLastDetection(detectedClass);

// //           const speechKey = `${langRef.current}-${detectedClass}`;

// //           if (lastSpokenRef.current !== speechKey) {
// //             lastSpokenRef.current = speechKey;
// //             hapticFeedback?.("success");

// //             if (langRef.current === "ur") {
// //               const phrase = URDU_PHRASES[detectedClass] ?? detectedClass;
// //               void speakUrduOpenAI(phrase);
// //             } else {
// //               const phrase =
// //                 ENGLISH_PHRASES[detectedClass] ?? `${detectedClass} rupees`;
// //               void speakEnglishOpenAI(phrase);
// //             }
// //           }
// //         }
// //       } else {
// //         setLastDetection("");
// //         lastSpokenRef.current = "";
// //       }
// //     } catch (e) {
// //       console.log("[CurrencyReader] Detection failed:", e);
// //     } finally {
// //       isDetectingRef.current = false;

// //       if (isMountedRef.current) {
// //         setIsDetecting(false);
// //       }
// //     }
// //   }, [hapticFeedback]);

// //   const handleLanguageToggle = async () => {
// //     const next = lang === "en" ? "ur" : "en";

// //     stopTTS();

// //     setLang(next);
// //     langRef.current = next;
// //     lastSpokenRef.current = "";

// //     await i18n.changeLanguage(next);

// //     hapticFeedback?.("medium");

// //     speakUI(
// //       next === "ur" ? UI_URDU.switched_urdu : "Language changed to English",
// //       next
// //     );
// //   };

// //   const goToModes = () => {
// //     stopAutoDetection();
// //     stopTTS();

// //     lastSpokenRef.current = "";
// //     setLastDetection("");

// //     hapticFeedback?.("light");

// //     router.push("/features");
// //   };

// //   const renderCamera = () => {
// //     if (!permission?.granted) {
// //       return (
// //         <View style={styles.permissionCenter}>
// //           <AccessibleText style={{ color: colors.text, marginBottom: 16 }}>
// //             {t("common.cameraPermissionNeeded", "Camera permission is required.")}
// //           </AccessibleText>

// //           <AccessibleButton
// //             title={t("personCapture.allowCamera")}
// //             onPress={requestPermission}
// //           />
// //         </View>
// //       );
// //     }

// //     return (
// //       <View style={{ flex: 1 }}>
// //         <CameraView
// //           style={styles.camera}
// //           facing="back"
// //           ref={cameraRef}
// //           accessible={true}
// //           accessibilityLabel={t("personCapture.liveFeedLabel")}
// //         />

// //         {lastDetection !== "" && (
// //           <View
// //             style={[
// //               styles.resultContainer,
// //               {
// //                 backgroundColor: colors.primary,
// //                 borderColor: colors.textInverse,
// //                 borderWidth: 2,
// //               },
// //             ]}
// //             accessibilityRole="alert"
// //           >
// //             <AccessibleText
// //               style={{
// //                 color: colors.textInverse,
// //                 fontSize: 32,
// //                 textAlign: "center",
// //                 fontWeight: "800",
// //               }}
// //               adjustsFontSizeToFit
// //               numberOfLines={1}
// //             >
// //               {lang === "ur"
// //                 ? URDU_PHRASES[lastDetection] ?? lastDetection
// //                 : ENGLISH_PHRASES[lastDetection] ?? lastDetection}
// //             </AccessibleText>
// //           </View>
// //         )}
// //       </View>
// //     );
// //   };

// //   return (
// //     <View style={[styles.root, { backgroundColor: colors.background }]}>
// //       <View style={[styles.topBar, { backgroundColor: colors.primary }]}>
// //         <AccessibleText
// //           style={{ color: colors.textInverse, fontSize: 24, fontWeight: "800" }}
// //           accessibilityRole="header"
// //         >
// //           {lang === "ur" ? "کرنسی ریڈر" : t("welcome.currency")}
// //         </AccessibleText>
// //       </View>

// //       <View style={{ flex: 1 }}>{renderCamera()}</View>

// //       <View
// //         style={[
// //           styles.bottomBar,
// //           { flexDirection: I18nManager.isRTL ? "row-reverse" : "row" },
// //         ]}
// //       >
// //         <AccessibleButton
// //           title={lang === "ur" ? "واپس" : t("common.modes")}
// //           onPress={goToModes}
// //           style={styles.bottomButton}
// //         />

// //         <AccessibleButton
// //           title={lang === "ur" ? "اردو" : "ENG"}
// //           onPress={handleLanguageToggle}
// //           accessibilityRole="switch"
// //           accessibilityState={{ checked: lang === "ur" }}
// //           style={styles.bottomButton}
// //         />
// //       </View>
// //     </View>
// //   );
// // };

// // export default CurrencyReaderScreen;

// // const styles = StyleSheet.create({
// //   root: { flex: 1 },

// //   permissionCenter: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     padding: 20,
// //   },

// //   topBar: {
// //     minHeight: 110,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderBottomLeftRadius: 12,
// //     borderBottomRightRadius: 12,
// //     paddingTop: 30,
// //   },

// //   camera: { flex: 1 },

// //   resultContainer: {
// //     position: "absolute",
// //     top: "40%",
// //     left: 30,
// //     right: 30,
// //     padding: 30,
// //     borderRadius: 20,
// //     alignItems: "center",
// //     borderWidth: 2,
// //   },

// //   bottomBar: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     paddingHorizontal: 20,
// //     paddingVertical: 12,
// //   },

// //   bottomButton: {
// //     flex: 1,
// //     height: 80,
// //     borderRadius: 18,
// //     marginHorizontal: 6,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// // });

// import { AccessibleButton } from "@/components/AccessibleButton";
// import { AccessibleText } from "@/components/AccessibleText";
// import { useAccessibility } from "@/contexts/AccessibilityContext";
// import { useAccessibleColors } from "@/hooks/useAccessibleColors";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   ActivityIndicator,
//   I18nManager,
//   StyleSheet,
//   View,
// } from "react-native";
// import { checkApiHealth, detectCurrency } from "../services/detectionApi";
// import {
//   speakUI,
//   stopTTS,
//   translateAndSpeakCurrency,
//   UI_URDU,
// } from "../services/ttsService";

// // No hardcoded phrase maps — translation is handled by GPT-4o-mini at runtime.

// const CurrencyReaderScreen = () => {
//   const router = useRouter();
//   const { autoStart } = useLocalSearchParams<{ autoStart?: string }>();
//   const { t, i18n } = useTranslation();
//   const { hapticFeedback } = useAccessibility();
//   const colors = useAccessibleColors();

//   const [permission, requestPermission] = useCameraPermissions();
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [apiConnected, setApiConnected] = useState(false);
//   const [checkingApi, setCheckingApi] = useState(false);
//   const [isAutoDetecting, setIsAutoDetecting] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   // Raw denomination from API e.g. "500"
//   const [lastDetection, setLastDetection] = useState("");
//   // Translated display phrase e.g. "پانچ سو روپے" or "Five hundred rupees"
//   const [displayPhrase, setDisplayPhrase] = useState("");

//   const [lang, setLang] = useState<"en" | "ur">(
//     i18n.language === "ur" ? "ur" : "en"
//   );

//   const cameraRef = useRef<CameraView>(null);
//   const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const hasAutoStartedRef = useRef(false);
//   const isMountedRef = useRef(true);
//   const apiConnectedRef = useRef(false);
//   const isAutoDetectingRef = useRef(false);
//   const isDetectingRef = useRef(false);
//   const lastSpokenRef = useRef("");
//   const langRef = useRef(lang);

//   useEffect(() => { langRef.current = lang; }, [lang]);

//   // ── Mount / unmount ──────────────────────────────────────────────────────
//   useEffect(() => {
//     isMountedRef.current = true;

//     speakUI(
//       lang === "ur" ? UI_URDU.screen_open : "Currency Reader screen is open",
//       lang
//     );

//     void checkConnection();

//     return () => {
//       isMountedRef.current = false;
//       if (detectionIntervalRef.current) {
//         clearInterval(detectionIntervalRef.current);
//         detectionIntervalRef.current = null;
//       }
//       stopTTS();
//     };
//   }, []);

//   useEffect(() => { apiConnectedRef.current = apiConnected; }, [apiConnected]);
//   useEffect(() => { isAutoDetectingRef.current = isAutoDetecting; }, [isAutoDetecting]);

//   // ── Detection interval ───────────────────────────────────────────────────
//   useEffect(() => {
//     if (isAutoDetecting && apiConnected) {
//       detectionIntervalRef.current = setInterval(() => {
//         void captureCurrency();
//       }, 2500);
//     } else {
//       if (detectionIntervalRef.current) {
//         clearInterval(detectionIntervalRef.current);
//         detectionIntervalRef.current = null;
//       }
//     }
//     return () => {
//       if (detectionIntervalRef.current) {
//         clearInterval(detectionIntervalRef.current);
//         detectionIntervalRef.current = null;
//       }
//     };
//   }, [isAutoDetecting, apiConnected]);

//   // ── AutoStart param ──────────────────────────────────────────────────────
//   useEffect(() => {
//     if (autoStart !== "1") return;
//     if (hasAutoStartedRef.current) return;
//     if (!permission?.granted) return;
//     if (!apiConnected) return;

//     hasAutoStartedRef.current = true;
//     setIsAutoDetecting(true);
//     isAutoDetectingRef.current = true;
//     lastSpokenRef.current = "";
//     hapticFeedback?.("medium");
//     speakUI(
//       lang === "ur" ? UI_URDU.auto_started : "Auto detection started",
//       lang
//     );
//   }, [autoStart, permission?.granted, apiConnected]);

//   // ── API health check ─────────────────────────────────────────────────────
//   const checkConnection = async () => {
//     if (!isMountedRef.current) return;
//     setCheckingApi(true);

//     let ok = false;
//     try { ok = await checkApiHealth(); } catch { ok = false; }

//     if (!isMountedRef.current) return;

//     setApiConnected(ok);
//     apiConnectedRef.current = ok;

//     if (!ok) stopAutoDetection();
//     if (isMountedRef.current) setCheckingApi(false);
//   };

//   const stopAutoDetection = () => {
//     setIsAutoDetecting(false);
//     isAutoDetectingRef.current = false;
//     if (detectionIntervalRef.current) {
//       clearInterval(detectionIntervalRef.current);
//       detectionIntervalRef.current = null;
//     }
//   };

//   // ── Capture + detect ─────────────────────────────────────────────────────
//   const captureCurrency = useCallback(async () => {
//     if (!cameraRef.current) return;
//     if (!apiConnectedRef.current) return;
//     if (isDetectingRef.current) return;

//     isDetectingRef.current = true;
//     setIsDetecting(true);

//     try {
//       const photo = await cameraRef.current.takePictureAsync({
//         quality: 0.8,
//         shutterSound: false,
//       });

//       if (!photo?.uri) throw new Error("Failed to capture image");

//       const result = await detectCurrency(photo.uri, 0.5);
//       if (!isMountedRef.current) return;

//       if (result?.detections?.length > 0) {
//         const best = result.detections.reduce((a: any, b: any) =>
//           a.confidence > b.confidence ? a : b
//         );
//         const detectedClass = String(best.class ?? "").trim();

//         if (detectedClass) {
//           setLastDetection(detectedClass);

//           // Only speak if the detection changed
//           const speechKey = `${detectedClass}|${langRef.current}`;
//           if (lastSpokenRef.current !== speechKey) {
//             lastSpokenRef.current = speechKey;
//             hapticFeedback?.("success");

//             // ── Translation + TTS ──────────────────────────────────────
//             // translateAndSpeakCurrency calls GPT-4o-mini to produce a
//             // natural phrase, then speaks it via the correct voice pipeline.
//             // It returns the phrase so we can display it on screen too.
//             void (async () => {
//               setIsSpeaking(true);
//               try {
//                 const phrase = await translateAndSpeakCurrency(
//                   detectedClass,
//                   langRef.current
//                 );
//                 if (isMountedRef.current && phrase) {
//                   setDisplayPhrase(phrase);
//                 }
//               } finally {
//                 if (isMountedRef.current) setIsSpeaking(false);
//               }
//             })();
//           }
//         }
//       } else {
//         setLastDetection("");
//         setDisplayPhrase("");
//         lastSpokenRef.current = "";
//       }
//     } catch (e) {
//       console.log("[CurrencyReader] Detection failed:", e);
//     } finally {
//       isDetectingRef.current = false;
//       if (isMountedRef.current) setIsDetecting(false);
//     }
//   }, [hapticFeedback]);

//   // ── Manual capture ───────────────────────────────────────────────────────
//   const handleManualCapture = () => {
//     hapticFeedback?.("light");
//     speakUI(lang === "ur" ? UI_URDU.capture : "Capturing", lang);
//     void captureCurrency();
//   };

//   // ── Language toggle ──────────────────────────────────────────────────────
//   const handleLanguageToggle = async () => {
//     const next = lang === "en" ? "ur" : "en";
//     setLang(next);
//     langRef.current = next;

//     // Reset spoken key so the current detection is re-spoken in the new language
//     lastSpokenRef.current = "";
//     setDisplayPhrase("");

//     await i18n.changeLanguage(next);
//     hapticFeedback?.("medium");
//     speakUI(
//       next === "ur" ? UI_URDU.switched_urdu : "Language changed to English",
//       next
//     );

//     // If a note is already on screen, re-translate it immediately
//     if (lastDetection) {
//       void (async () => {
//         setIsSpeaking(true);
//         try {
//           const phrase = await translateAndSpeakCurrency(lastDetection, next);
//           if (isMountedRef.current && phrase) {
//             setDisplayPhrase(phrase);
//             lastSpokenRef.current = `${lastDetection}|${next}`;
//           }
//         } finally {
//           if (isMountedRef.current) setIsSpeaking(false);
//         }
//       })();
//     }
//   };

//   // ── Navigate back ────────────────────────────────────────────────────────
//   const goToModes = () => {
//     stopAutoDetection();
//     lastSpokenRef.current = "";
//     setLastDetection("");
//     setDisplayPhrase("");
//     hapticFeedback?.("light");
//     speakUI(lang === "ur" ? UI_URDU.going_back : "Going back to modes", lang);
//     router.push("/features");
//   };

//   // ── Camera render ────────────────────────────────────────────────────────
//   const renderCamera = () => {
//     if (!permission?.granted) {
//       return (
//         <View style={styles.permissionCenter}>
//           <AccessibleText style={{ color: colors.text, marginBottom: 16 }}>
//             {t("common.cameraPermissionNeeded", "Camera permission is required.")}
//           </AccessibleText>
//           <AccessibleButton
//             title={t("personCapture.allowCamera")}
//             onPress={requestPermission}
//           />
//         </View>
//       );
//     }

//     return (
//       <View style={{ flex: 1 }}>
//         <CameraView
//           style={styles.camera}
//           facing="back"
//           ref={cameraRef}
//           accessible
//           accessibilityLabel={t("personCapture.liveFeedLabel")}
//         />

//         {/* Connecting indicator */}
//         {checkingApi && (
//           <View
//             style={[styles.statusOverlay, { backgroundColor: colors.card + "EE" }]}
//             accessibilityRole="alert"
//             accessibilityLiveRegion="polite"
//           >
//             <ActivityIndicator color={colors.primary} />
//             <AccessibleText
//               style={[styles.statusText, { color: colors.text, marginLeft: 10 }]}
//             >
//               {lang === "ur" ? "سرور سے رابطہ ہو رہا ہے…" : "Connecting to server…"}
//             </AccessibleText>
//           </View>
//         )}

//         {/* Detecting spinner */}
//         {isDetecting && (
//           <View
//             style={[
//               styles.detectingIndicator,
//               { backgroundColor: colors.primary + "CC" },
//             ]}
//             accessibilityRole="progressbar"
//             accessibilityLabel={
//               lang === "ur" ? "شناخت ہو رہی ہے" : "Detecting currency"
//             }
//           >
//             <ActivityIndicator color={colors.textInverse} size="small" />
//             <AccessibleText
//               style={[styles.detectingIndicatorText, { color: colors.textInverse }]}
//             >
//               {lang === "ur" ? "شناخت ہو رہی ہے…" : "Detecting…"}
//             </AccessibleText>
//           </View>
//         )}

//         {/* Detection result */}
//         {displayPhrase !== "" && (
//           <View
//             style={[
//               styles.resultContainer,
//               {
//                 backgroundColor: colors.primary,
//                 borderColor: colors.textInverse,
//                 borderWidth: 2,
//               },
//             ]}
//             // TalkBack reads this automatically when it appears
//             accessibilityRole="alert"
//             accessibilityLiveRegion="assertive"
//             accessibilityLabel={
//               lang === "ur"
//                 ? `شناخت: ${displayPhrase}`
//                 : `Detected: ${displayPhrase}`
//             }
//           >
//             <AccessibleText
//               style={{
//                 color: colors.textInverse,
//                 fontSize: 40,
//                 fontWeight: "900",
//                 textAlign: "center",
//               }}
//               adjustsFontSizeToFit
//               numberOfLines={2}
//             >
//               {displayPhrase}
//             </AccessibleText>

//             {isSpeaking && (
//               <AccessibleText
//                 style={{
//                   color: colors.textInverse,
//                   fontSize: 13,
//                   marginTop: 6,
//                   opacity: 0.8,
//                 }}
//               >
//                 {lang === "ur" ? "🔊 بول رہا ہے…" : "🔊 Speaking…"}
//               </AccessibleText>
//             )}
//           </View>
//         )}
//       </View>
//     );
//   };

//   // ── Main render ──────────────────────────────────────────────────────────
//   return (
//     <View style={[styles.root, { backgroundColor: colors.background }]}>
//       {/* Top bar */}
//       <View style={[styles.topBar, { backgroundColor: colors.primary }]}>
//         <AccessibleText
//           style={{ color: colors.textInverse, fontSize: 24, fontWeight: "800" }}
//           accessibilityRole="header"
//         >
//           {lang === "ur" ? "کرنسی ریڈر" : t("welcome.currency")}
//         </AccessibleText>

//         <View
//           style={[
//             styles.apiDot,
//             { backgroundColor: apiConnected ? "#00C853" : "#FF1744" },
//           ]}
//           accessibilityLabel={
//             apiConnected
//               ? lang === "ur" ? "سرور متصل" : "Server connected"
//               : lang === "ur" ? "سرور منقطع" : "Server disconnected"
//           }
//         />
//       </View>

//       <View style={{ flex: 1 }}>{renderCamera()}</View>

//       {/* Bottom bar */}
//       <View
//         style={[
//           styles.bottomBar,
//           { flexDirection: I18nManager.isRTL ? "row-reverse" : "row" },
//         ]}
//       >
//         <AccessibleButton
//           title={lang === "ur" ? "واپس" : t("common.modes")}
//           onPress={goToModes}
//           accessibilityHint={
//             lang === "ur" ? "مینو پر واپس جائیں" : "Go back to feature menu"
//           }
//           style={styles.bottomButton}
//         />

//         <AccessibleButton
//           title={lang === "ur" ? "تصویر لیں" : "Capture"}
//           onPress={handleManualCapture}
//           accessibilityHint={
//             lang === "ur"
//               ? "ایک بار کرنسی شناخت کریں"
//               : "Capture one photo and detect currency"
//           }
//           style={[styles.bottomButton, { backgroundColor: colors.primary }]}
//         />

//         <AccessibleButton
//           title={lang === "ur" ? "اردو" : "ENG"}
//           onPress={handleLanguageToggle}
//           accessibilityLabel={
//             lang === "ur"
//               ? "اردو موڈ فعال — انگریزی پر تبدیل کریں"
//               : "English mode active — switch to Urdu"
//           }
//           accessibilityRole="switch"
//           accessibilityState={{ checked: lang === "ur" }}
//           style={styles.bottomButton}
//         />
//       </View>
//     </View>
//   );
// };

// export default CurrencyReaderScreen;

// const styles = StyleSheet.create({
//   root: { flex: 1 },

//   permissionCenter: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },

//   topBar: {
//     minHeight: 110,
//     justifyContent: "center",
//     alignItems: "center",
//     borderBottomLeftRadius: 12,
//     borderBottomRightRadius: 12,
//     paddingTop: 30,
//     flexDirection: "row",
//     gap: 10,
//   },

//   apiDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginTop: 2,
//   },

//   camera: { flex: 1 },

//   statusOverlay: {
//     position: "absolute",
//     top: 12,
//     left: 20,
//     right: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     borderRadius: 10,
//   },

//   statusText: { fontSize: 14, flex: 1 },

//   detectingIndicator: {
//     position: "absolute",
//     top: 12,
//     left: 20,
//     right: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//     borderRadius: 10,
//   },

//   detectingIndicatorText: {
//     fontSize: 14,
//     marginLeft: 8,
//     fontWeight: "700",
//   },

//   resultContainer: {
//     position: "absolute",
//     top: "38%",
//     left: 30,
//     right: 30,
//     padding: 30,
//     borderRadius: 20,
//     alignItems: "center",
//   },

//   bottomBar: {
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//   },

//   bottomButton: {
//     flex: 1,
//     height: 80,
//     borderRadius: 18,
//     marginHorizontal: 6,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });


import { AccessibleButton } from "@/components/AccessibleButton";
import { AccessibleText } from "@/components/AccessibleText";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useAccessibleColors } from "@/hooks/useAccessibleColors";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View } from "react-native";
import { checkApiHealth, detectCurrency } from "../services/detectionApi";
import {
  speakUI,
  stopTTS,
  translateAndSpeakCurrency,
  UI_URDU,
} from "../services/ttsService";

const CurrencyReaderScreen = () => {
  const router = useRouter();
  const { autoStart } = useLocalSearchParams<{ autoStart?: string }>();
  const { t, i18n } = useTranslation();
  const { hapticFeedback } = useAccessibility();
  const colors = useAccessibleColors();

  const [permission, requestPermission] = useCameraPermissions();
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastDetection, setLastDetection] = useState("");
  const [displayPhrase, setDisplayPhrase] = useState("");
  const [apiConnected, setApiConnected] = useState(false);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [lang, setLang] = useState<"en" | "ur">(
    i18n.language === "ur" ? "ur" : "en"
  );

  const cameraRef = useRef<CameraView>(null);
  const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const hasAutoStartedRef = useRef(false);
  const isMountedRef = useRef(true);
  const apiConnectedRef = useRef(false);
  const isDetectingRef = useRef(false);
  const lastSpokenRef = useRef("");
  const langRef = useRef(lang);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    isMountedRef.current = true;
    void checkConnection();

    return () => {
      isMountedRef.current = false;
      stopTTS();

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
    lastSpokenRef.current = "";

    hapticFeedback?.("medium");
  }, [autoStart, permission?.granted, apiConnected, hapticFeedback]);

  const stopAutoDetection = () => {
    setIsAutoDetecting(false);

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  const checkConnection = async () => {
    try {
      const isConnected = await checkApiHealth();

      if (!isMountedRef.current) return;

      setApiConnected(isConnected);
      apiConnectedRef.current = isConnected;

      if (!isConnected) {
        stopAutoDetection();
      }
    } catch {
      if (!isMountedRef.current) return;

      setApiConnected(false);
      apiConnectedRef.current = false;
      stopAutoDetection();
    }
  };

  const captureCurrency = useCallback(async () => {
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

          const speechKey = `${langRef.current}-${detectedClass}`;

          if (lastSpokenRef.current !== speechKey) {
            lastSpokenRef.current = speechKey;
            hapticFeedback?.("success");

            const phrase = await translateAndSpeakCurrency(
              detectedClass,
              langRef.current
            );

            if (isMountedRef.current) {
              setDisplayPhrase(phrase || detectedClass);
            }
          }
        }
      } else {
        setLastDetection("");
        setDisplayPhrase("");
        lastSpokenRef.current = "";
      }
    } catch (e) {
      console.log("[CurrencyReader] Detection failed:", e);
    } finally {
      isDetectingRef.current = false;

      if (isMountedRef.current) {
        setIsDetecting(false);
      }
    }
  }, [hapticFeedback]);

  const handleLanguageToggle = async () => {
    const next = lang === "en" ? "ur" : "en";

    stopTTS();

    setLang(next);
    langRef.current = next;
    lastSpokenRef.current = "";
    setDisplayPhrase("");

    await i18n.changeLanguage(next);

    hapticFeedback?.("medium");

    speakUI(
      next === "ur" ? UI_URDU.switched_urdu : "Language changed to English",
      next
    );
  };

  const goToModes = () => {
    stopAutoDetection();
    stopTTS();

    lastSpokenRef.current = "";
    setLastDetection("");
    setDisplayPhrase("");

    hapticFeedback?.("light");

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
              style={{
                color: colors.textInverse,
                fontSize: 32,
                textAlign: "center",
                fontWeight: "800",
              }}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {displayPhrase || lastDetection}
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
          {lang === "ur" ? "کرنسی ریڈر" : t("welcome.currency")}
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
          title={lang === "ur" ? "واپس" : t("common.modes")}
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

  camera: { flex: 1 },

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