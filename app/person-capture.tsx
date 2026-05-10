// // import { AccessibleButton } from "@/components/AccessibleButton";
// // import { AccessibleText } from "@/components/AccessibleText";
// // import { useAccessibility } from "@/contexts/AccessibilityContext";
// // import { useAccessibleColors } from "@/hooks/useAccessibleColors";
// // import { CameraView, useCameraPermissions } from "expo-camera";
// // import * as FileSystem from "expo-file-system/legacy";
// // import { useRouter } from "expo-router";
// // import { useTranslation } from "react-i18next";
// // import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // import {
// //   Dimensions,
// //   I18nManager,
// //   StyleSheet,
// //   View,
// // } from "react-native";
// // import {
// //   stopTTS,
// //   speakUI,
// //   UI_URDU,
// //   translateAndSpeakPersonCapture,
// // } from "../services/ttsService";

// // const { width } = Dimensions.get("window");
// // const RING_SIZE = Math.min(width * 0.88, 360);
// // const CAMERA_SIZE = RING_SIZE * 0.76;
// // const SEGMENT_COUNT = 60;
// // const [lang, setLang] = useState<"en" | "ur">(
// //   i18n.language === "ur" ? "ur" : "en"
// // );

// // const langRef = useRef(lang);

// // useEffect(() => {
// //   langRef.current = lang;
// // }, [lang]);

// // // Keep original backend/capture order
// // const REQUIRED_ANGLES = ["front", "left", "right", "up", "down"] as const;
// // type RequiredAngle = (typeof REQUIRED_ANGLES)[number];

// // type FaceGuideResponse = {
// //   ok: boolean;
// //   faceDetected: boolean;
// //   shouldCapture: boolean;
// //   stable: boolean;
// //   distance: "too_close" | "too_far" | "good";
// //   position: "centered" | "move_left" | "move_right" | "move_up" | "move_down";
// //   angle: RequiredAngle | "unknown";
// //   duplicateAngle: boolean;
// //   nextRequiredAngle: RequiredAngle | null;
// //   message?: string;
// // };

// // const GUIDE_MESSAGES: Record<string, string> = {
// //   no_face: "No face detected. Slowly move the phone until your face is found.",
// //   no_face_recovery: "Move the phone slowly to find your face again.",

// //   too_close: "Move the phone a little away.",
// //   too_far: "Bring the phone a little closer.",

// //   // These are intentionally neutral now.
// //   // We do not want to keep saying move right/left repeatedly.
// //   move_left: "Keep your face centered in the camera.",
// //   move_right: "Keep your face centered in the camera.",
// //   move_up: "Keep your face centered in the camera.",
// //   move_down: "Keep your face centered in the camera.",

// //   hold_still: "Hold still.",

// //   duplicate_front: "Front angle already captured.",
// //   duplicate_left: "Left side already captured.",
// //   duplicate_right: "Right side already captured.",
// //   duplicate_up: "Up angle already captured.",
// //   duplicate_down: "Down angle already captured.",

// //   next_front: "Keep your face straight and centered.",
// //   // next_left: "Turn your face slightly to your left.",
// //   // next_right: "Turn your face slightly to your right.",
// //   next_left: "Turn your face slightly to your right.",
// //   next_right: "Turn your face slightly to your left.",
// //   next_up: "Look slightly upward.",
// //   next_down: "Look slightly downward.",

// //   capturing: "Capturing image.",
// //   done: "Registration complete.",
// //   unavailable: "Guide service unavailable.",
// // };

// // const angleLabelMap: Record<RequiredAngle, string> = {
// //   front: "Front",
// //   left: "Left",
// //   right: "Right",
// //   up: "Up",
// //   down: "Down",
// // };

// // const onColor = (bg: string) => {
// //   const hex = (bg || "").replace("#", "");
// //   if (hex.length !== 6) return "#000000";

// //   const r = parseInt(hex.slice(0, 2), 16) / 255;
// //   const g = parseInt(hex.slice(2, 4), 16) / 255;
// //   const b = parseInt(hex.slice(4, 6), 16) / 255;

// //   const toLin = (c: number) =>
// //     c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

// //   const L = 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
// //   return L > 0.45 ? "#000000" : "#FFFFFF";
// // };

// // // Replace with your current Mac IP
// // const BASE_URL = "http://192.168.18.206:8000";

// // const PersonCaptureScreen = () => {
// //   const router = useRouter();
// //   // const { t } = useTranslation();
// //   const { t, i18n } = useTranslation();
// //   // const { speak, hapticFeedback } = useAccessibility();
// //   const { speak,stopSpeaking, hapticFeedback } = useAccessibility();
// //   const colors = useAccessibleColors();

// //   const [permission, requestPermission] = useCameraPermissions();
// //   const [cameraReady, setCameraReady] = useState(false);
// //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// //   const [isCapturing, setIsCapturing] = useState(false);

// //   const [capturedUris, setCapturedUris] = useState<string[]>([]);
// //   const [capturedAngles, setCapturedAngles] = useState<RequiredAngle[]>([]);
// //   const [currentInstruction, setCurrentInstruction] = useState(
// //     GUIDE_MESSAGES.next_front
// //   );
// //   const [statusText, setStatusText] = useState("Looking for face...");
// //   const [lastDetectedAngle, setLastDetectedAngle] = useState<string>("unknown");

// //   const cameraRef = useRef<CameraView | null>(null);
// //   const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
// //   const mountedRef = useRef(true);

// //   const hasWelcomedRef = useRef(false);
// //   const hasDetectedFaceOnceRef = useRef(false);

// //   const lastSpokenMessageRef = useRef("");
// //   const lastSpokenAtRef = useRef(0);
// //   const lastCaptureAtRef = useRef(0);
// //   const pauseGuidanceUntilRef = useRef(0);

// //   const onPrimary = useMemo(() => onColor(colors.primary), [colors.primary]);

// //   const progressSegments = useMemo(() => {
// //     return Math.round(
// //       (capturedAngles.length / REQUIRED_ANGLES.length) * SEGMENT_COUNT
// //     );
// //   }, [capturedAngles.length]);

// //   const nextRequiredAngle = useMemo(() => {
// //     return REQUIRED_ANGLES.find((a) => !capturedAngles.includes(a)) ?? null;
// //   }, [capturedAngles]);

// //   const getNextAnglePrompt = useCallback((angle: RequiredAngle | null) => {
// //     if (!angle) return GUIDE_MESSAGES.done;
// //     return GUIDE_MESSAGES[`next_${angle}`] ?? "Adjust your face.";
// //   }, []);

// //   // const speakOnce = useCallback(
// //   //   (message: string) => {
// //   //     if (!message) return;

// //   //     const now = Date.now();
// //   //     const sameMessage = lastSpokenMessageRef.current === message;
// //   //     const tooSoon = now - lastSpokenAtRef.current < 3000;

// //   //     if (sameMessage && tooSoon) return;

// //   //     lastSpokenMessageRef.current = message;
// //   //     lastSpokenAtRef.current = now;
// //   //     speak?.(message, true);
// //   //   },
// //   //   [speak]
// //   // );
// //   const speakOnce = useCallback(
// //   async (message: string) => {
// //     if (!message) return;
// //     if (!mountedRef.current) return;

// //     const now = Date.now();
// //     const sameMessage = lastSpokenMessageRef.current === message;
// //     const tooSoon = now - lastSpokenAtRef.current < 3000;

// //     if (sameMessage && tooSoon) return;

// //     lastSpokenMessageRef.current = message;
// //     lastSpokenAtRef.current = now;

// //     await translateAndSpeakPersonCapture(message, langRef.current);
// //   },
// //   []
// // );

// //   useEffect(() => {
// //     mountedRef.current = true;

// //     return () => {
// //       mountedRef.current = false;

// //       if (analyzeTimerRef.current) {
// //         clearTimeout(analyzeTimerRef.current);
// //         analyzeTimerRef.current = null;
// //       }
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (!permission) {
// //       requestPermission();
// //       return;
// //     }

// //     if (!permission.granted) {
// //       speakOnce(t("personCapture.allowCamera"));
// //       return;
// //     }

// //     if (!hasWelcomedRef.current) {
// //       hasWelcomedRef.current = true;
// //       const firstPrompt = getNextAnglePrompt(nextRequiredAngle);
// //       setCurrentInstruction(firstPrompt);
// //       speakOnce(firstPrompt);
// //     }
// //   }, [
// //     permission,
// //     requestPermission,
// //     speakOnce,
// //     t,
// //     getNextAnglePrompt,
// //     nextRequiredAngle,
// //   ]);

// //   const completeFlow = useCallback(
// //     (finalUris: string[], finalAngles: RequiredAngle[]) => {
// //       setCurrentInstruction(GUIDE_MESSAGES.done);
// //       setStatusText("5 of 5 captured");
// //       speakOnce(GUIDE_MESSAGES.done);

// //       router.replace({
// //         pathname: "/person-name",
// //         params: {
// //           count: String(finalUris.length),
// //           imageUris: JSON.stringify(finalUris),
// //           capturedAngles: JSON.stringify(finalAngles),
// //         },
// //       } as any);
// //     },
// //     [router, speakOnce]
// //   );

// //   const saveCapturedPhoto = useCallback(
// //     async (tempUri: string, angle: RequiredAngle) => {
// //       const fileName = `person_${angle}_${Date.now()}.jpg`;
// //       const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

// //       await FileSystem.copyAsync({
// //         from: tempUri,
// //         to: fileUri,
// //       });

// //       const nextUris = [...capturedUris, fileUri];
// //       const nextAngles = [...capturedAngles, angle];

// //       setCapturedUris(nextUris);
// //       setCapturedAngles(nextAngles);
// //       setLastDetectedAngle(angle);
// //       hasDetectedFaceOnceRef.current = true;

// //       if (nextAngles.length >= REQUIRED_ANGLES.length) {
// //         completeFlow(nextUris, nextAngles);
// //         return;
// //       }

// //       const nextAngle =
// //         REQUIRED_ANGLES.find((a) => !nextAngles.includes(a)) ?? null;

// //       const prompt = getNextAnglePrompt(nextAngle);

// //       setCurrentInstruction(prompt);
// //       setStatusText(`${nextAngles.length} of 5 captured`);
// //       speakOnce(prompt);
// //     },
// //     [capturedUris, capturedAngles, completeFlow, getNextAnglePrompt, speakOnce]
// //   );

// //   const analyzeFrameForGuidance = useCallback(
// //     async (base64: string): Promise<FaceGuideResponse> => {
// //       const requiredAngle = nextRequiredAngle;

// //       try {
// //         const response = await fetch(`${BASE_URL}/face-registration-guide`, {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify({
// //             imageBase64: base64,
// //             requiredAngle,
// //             capturedAngles,
// //           }),
// //         });

// //         const rawText = await response.text();
// //         console.log("[guide] status:", response.status);
// //         console.log("[guide] raw response:", rawText);

// //         if (!response.ok) {
// //           throw new Error(`Guide API failed with ${response.status}: ${rawText}`);
// //         }

// //         return JSON.parse(rawText) as FaceGuideResponse;
// //       } catch (error) {
// //         console.error("[guide] fetch error:", error);

// //         return {
// //           ok: false,
// //           faceDetected: false,
// //           shouldCapture: false,
// //           stable: false,
// //           distance: "good",
// //           position: "centered",
// //           angle: "unknown",
// //           duplicateAngle: false,
// //           nextRequiredAngle: requiredAngle,
// //           message: GUIDE_MESSAGES.unavailable,
// //         };
// //       }
// //     },
// //     [capturedAngles, nextRequiredAngle]
// //   );

// //   const autoCapturePhoto = useCallback(
// //     async (angle: RequiredAngle) => {
// //       console.log("[autoCapturePhoto] called with angle:", angle);

// //       pauseGuidanceUntilRef.current = Date.now() + 3000;

// //       if (analyzeTimerRef.current) {
// //         clearTimeout(analyzeTimerRef.current);
// //         analyzeTimerRef.current = null;
// //       }

// //       if (!cameraRef.current || isCapturing || !cameraReady) {
// //         console.log("[autoCapturePhoto] blocked", {
// //           hasCameraRef: !!cameraRef.current,
// //           isCapturing,
// //           cameraReady,
// //         });
// //         return;
// //       }

// //       try {
// //         setIsCapturing(true);
// //         setCurrentInstruction(GUIDE_MESSAGES.capturing);
// //         setStatusText(`Capturing ${angleLabelMap[angle]} angle`);
// //         speakOnce(GUIDE_MESSAGES.capturing);
// //         hapticFeedback?.("medium");

// //         const photo = await cameraRef.current.takePictureAsync({
// //           quality: 0.8,
// //           base64: false,
// //           skipProcessing: false,
// //         });

// //         console.log("[autoCapturePhoto] photo:", photo);

// //         if (!photo?.uri) {
// //           speakOnce("Could not capture image. Please hold still.");
// //           return;
// //         }

// //         lastCaptureAtRef.current = Date.now();
// //         pauseGuidanceUntilRef.current = Date.now() + 3000;

// //         await saveCapturedPhoto(photo.uri, angle);
// //         await new Promise((res) => setTimeout(res, 1200));
// //       } catch (error) {
// //         console.log("[autoCapturePhoto] capture error:", error);
// //         speakOnce("Could not capture image. Please hold still.");
// //         hapticFeedback?.("error");
// //       } finally {
// //         if (mountedRef.current) {
// //           setIsCapturing(false);
// //         }
// //       }
// //     },
// //     [cameraReady, hapticFeedback, isCapturing, saveCapturedPhoto, speakOnce]
// //   );

// //   const handleGuideResponse = useCallback(
// //     async (guide: FaceGuideResponse) => {
// //       if (!mountedRef.current) return;

// //       console.log("[guide response]", JSON.stringify(guide, null, 2));

// //       const remainingPrompt = getNextAnglePrompt(nextRequiredAngle);

// //       if (!guide.ok) {
// //         setCurrentInstruction(GUIDE_MESSAGES.unavailable);
// //         setStatusText("Waiting...");
// //         speakOnce(GUIDE_MESSAGES.unavailable);
// //         return;
// //       }

// //       if (!guide.faceDetected) {
// //         setLastDetectedAngle("unknown");

// //         const msg =
// //           hasDetectedFaceOnceRef.current || capturedAngles.length > 0
// //             ? GUIDE_MESSAGES.no_face_recovery
// //             : GUIDE_MESSAGES.no_face;

// //         setCurrentInstruction(msg);
// //         setStatusText("Finding face");
// //         speakOnce(msg);
// //         return;
// //       }

// //       hasDetectedFaceOnceRef.current = true;
// //       setLastDetectedAngle(guide.angle);

// //       if (guide.distance === "too_close") {
// //         setCurrentInstruction(GUIDE_MESSAGES.too_close);
// //         setStatusText("Too close");
// //         speakOnce(GUIDE_MESSAGES.too_close);
// //         return;
// //       }

// //       if (guide.distance === "too_far") {
// //         setCurrentInstruction(GUIDE_MESSAGES.too_far);
// //         setStatusText("Too far");
// //         speakOnce(GUIDE_MESSAGES.too_far);
// //         return;
// //       }

// //       /*
// //         IMPORTANT:
// //         Backend still checks position.
// //         But for speech, we guide the remaining required face angle.
// //         This prevents repeated confusing speech like:
// //         "move your face slightly right".
// //       */
// //       if (guide.position !== "centered") {
// //         setCurrentInstruction(remainingPrompt);
// //         setStatusText("Guiding next required angle");
// //         speakOnce(remainingPrompt);
// //         return;
// //       }

// //       if (guide.duplicateAngle && guide.angle !== "unknown") {
// //         setCurrentInstruction(remainingPrompt);
// //         setStatusText(`Already captured ${guide.angle}`);
// //         speakOnce(remainingPrompt);
// //         return;
// //       }

// //       /*
// //         Keep backend sync:
// //         capture only when backend returns a real uncaptured angle.
// //       */
// //       if (
// //         guide.angle !== "unknown" &&
// //         !capturedAngles.includes(guide.angle)
// //       ) {
// //         await autoCapturePhoto(guide.angle);
// //         return;
// //       }

// //       if (!guide.stable) {
// //         setCurrentInstruction(GUIDE_MESSAGES.hold_still);
// //         setStatusText("Hold still");
// //         speakOnce(GUIDE_MESSAGES.hold_still);
// //         return;
// //       }

// //       /*
// //         Final fallback:
// //         do not use backend generic message for speech.
// //         Speak the next remaining face angle.
// //       */
// //       setCurrentInstruction(remainingPrompt);
// //       setStatusText("Guide ready");
// //       speakOnce(remainingPrompt);
// //     },
// //     [
// //       autoCapturePhoto,
// //       capturedAngles,
// //       getNextAnglePrompt,
// //       nextRequiredAngle,
// //       speakOnce,
// //     ]
// //   );

// //   const runGuidancePass = useCallback(async () => {
// //     if (!permission?.granted || !cameraReady || isAnalyzing || isCapturing) return;
// //     if (!nextRequiredAngle) return;
// //     if (!cameraRef.current) return;

// //     const now = Date.now();

// //     if (now < pauseGuidanceUntilRef.current) return;
// //     if (now - lastCaptureAtRef.current < 2200) return;

// //     try {
// //       setIsAnalyzing(true);

// //       const previewShot = await cameraRef.current.takePictureAsync({
// //         quality: 0.3,
// //         base64: true,
// //         skipProcessing: true,
// //       });

// //       if (!previewShot?.base64) return;

// //       const guide = await analyzeFrameForGuidance(previewShot.base64);
// //       await handleGuideResponse(guide);
// //     } catch (error: any) {
// //       const message = String(error?.message || error || "").toLowerCase();

// //       if (
// //         message.includes("could not be captured") ||
// //         message.includes("camera") ||
// //         message.includes("capture")
// //       ) {
// //         return;
// //       }

// //       console.log("[runGuidancePass] non-camera error:", error);
// //     } finally {
// //       if (mountedRef.current) {
// //         setIsAnalyzing(false);
// //       }
// //     }
// //   }, [
// //     permission?.granted,
// //     cameraReady,
// //     isAnalyzing,
// //     isCapturing,
// //     nextRequiredAngle,
// //     analyzeFrameForGuidance,
// //     handleGuideResponse,
// //   ]);

// //   useEffect(() => {
// //     if (!permission?.granted || !cameraReady) return;
// //     if (capturedAngles.length >= REQUIRED_ANGLES.length) return;

// //     const loop = () => {
// //       runGuidancePass();
// //       analyzeTimerRef.current = setTimeout(loop, 2200);
// //     };

// //     analyzeTimerRef.current = setTimeout(loop, 1200);

// //     return () => {
// //       if (analyzeTimerRef.current) {
// //         clearTimeout(analyzeTimerRef.current);
// //         analyzeTimerRef.current = null;
// //       }
// //     };
// //   }, [permission?.granted, cameraReady, capturedAngles.length, runGuidancePass]);

// // //   const stopCaptureFlow = useCallback(() => {
// // //     stopSpeaking?.();
// // //   if (analyzeTimerRef.current) {
// // //     clearTimeout(analyzeTimerRef.current);
// // //     analyzeTimerRef.current = null;
// // //   }

// // //   setIsAnalyzing(false);
// // //   setIsCapturing(false);
// // //   setCameraReady(false);

// // //   mountedRef.current = false;

// // //   lastSpokenMessageRef.current = "";
// // //   lastSpokenAtRef.current = 0;

// // //   pauseGuidanceUntilRef.current = 0;
// // //   lastCaptureAtRef.current = 0;
// // // }, []);
// //   const stopCaptureFlow = useCallback(() => {
// //     stopSpeaking?.();
// //     stopTTS();

// //     if (analyzeTimerRef.current) {
// //       clearTimeout(analyzeTimerRef.current);
// //       analyzeTimerRef.current = null;
// //     }

// //     setIsAnalyzing(false);
// //     setIsCapturing(false);
// //     setCameraReady(false);

// //     mountedRef.current = false;

// //     lastSpokenMessageRef.current = "";
// //     lastSpokenAtRef.current = 0;

// //     pauseGuidanceUntilRef.current = 0;
// //     lastCaptureAtRef.current = 0;
// //   }, [stopSpeaking]);
// //   const handleLanguageToggle = async () => {
// //   const next = lang === "en" ? "ur" : "en";

// //   stopTTS();

// //   setLang(next);
// //   langRef.current = next;
// //   lastSpokenMessageRef.current = "";
// //   lastSpokenAtRef.current = 0;

// //   await i18n.changeLanguage(next);

// //   hapticFeedback?.("medium");

// //   speakUI(
// //     next === "ur" ? UI_URDU.switched_urdu : UI_URDU.switched_english,
// //     next
// //   );
// // };
// //   const handleRestart = () => {
// //     if (analyzeTimerRef.current) {
// //       clearTimeout(analyzeTimerRef.current);
// //       analyzeTimerRef.current = null;
// //     }

// //     setCapturedUris([]);
// //     setCapturedAngles([]);
// //     setCurrentInstruction(getNextAnglePrompt(REQUIRED_ANGLES[0]));
// //     setStatusText("Looking for face...");
// //     setLastDetectedAngle("unknown");

// //     hasDetectedFaceOnceRef.current = false;
// //     lastSpokenMessageRef.current = "";
// //     lastSpokenAtRef.current = 0;
// //     lastCaptureAtRef.current = 0;
// //     pauseGuidanceUntilRef.current = 0;

// //     speakOnce("Starting again. Keep your face straight and centered.");
// //   };

// //   const renderCameraContent = () => {
// //     if (!permission) {
// //       return <View style={styles.cameraFallback} />;
// //     }

// //     if (!permission.granted) {
// //       return (
// //         <View
// //           style={[
// //             styles.permissionCenterOverlay,
// //             { backgroundColor: colors.card || colors.background },
// //           ]}
// //         >
// //           <AccessibleButton
// //             title={t("personCapture.allowCamera")}
// //             onPress={requestPermission}
// //             accessibilityLabel={t("personCapture.allowCameraLabel")}
// //             accessibilityHint={t("personCapture.allowCameraHint")}
// //             style={[
// //               styles.permissionButton,
// //               {
// //                 backgroundColor: colors.primary,
// //                 borderColor: colors.border,
// //               },
// //             ]}
// //             textStyle={{ color: onPrimary }}
// //           />
// //         </View>
// //       );
// //     }

// //     return (
// //       <CameraView
// //         ref={cameraRef}
// //         style={styles.camera}
// //         facing="front"
// //         accessible
// //         accessibilityLabel={t("personCapture.liveFeedLabel")}
// //         onCameraReady={() => {
// //           setCameraReady(true);

// //           if (!hasWelcomedRef.current) {
// //             hasWelcomedRef.current = true;
// //             const firstPrompt = getNextAnglePrompt(nextRequiredAngle);
// //             setCurrentInstruction(firstPrompt);
// //             setStatusText("Camera ready");
// //             speakOnce(firstPrompt);
// //           }
// //         }}
// //       />
// //     );
// //   };

// //   return (
// //     <View style={[styles.root, { backgroundColor: colors.background }]}>
// //       <View style={styles.content}>
// //         <View style={styles.ringWrap}>
// //           {Array.from({ length: SEGMENT_COUNT }).map((_, index) => {
// //             const isActive = index < progressSegments;

// //             return (
// //               <View
// //                 key={index}
// //                 style={[
// //                   styles.segment,
// //                   {
// //                     backgroundColor: isActive ? colors.primary : colors.border,
// //                     transform: [
// //                       { rotate: `${(360 / SEGMENT_COUNT) * index}deg` },
// //                       { translateY: -(RING_SIZE / 2 - 10) },
// //                     ],
// //                     opacity: isActive ? 1 : 0.85,
// //                   },
// //                 ]}
// //               />
// //             );
// //           })}

// //           <View
// //             style={[
// //               styles.cameraCircleOuter,
// //               {
// //                 width: CAMERA_SIZE,
// //                 height: CAMERA_SIZE,
// //                 borderRadius: CAMERA_SIZE / 2,
// //                 borderColor: colors.border,
// //               },
// //             ]}
// //           >
// //             <View
// //               style={[
// //                 styles.cameraCircleInner,
// //                 {
// //                   borderRadius: CAMERA_SIZE / 2,
// //                   backgroundColor: colors.card || colors.background,
// //                 },
// //               ]}
// //             >
// //               {renderCameraContent()}

// //               <View
// //                 pointerEvents="none"
// //                 style={[
// //                   styles.guideOval,
// //                   {
// //                     borderColor: colors.primary,
// //                   },
// //                 ]}
// //               />

// //               <View
// //                 pointerEvents="none"
// //                 style={[
// //                   styles.scanLine,
// //                   {
// //                     backgroundColor: colors.primary,
// //                     shadowColor: colors.primary,
// //                     opacity: isCapturing ? 1 : 0.75,
// //                   },
// //                 ]}
// //               />
// //             </View>
// //           </View>
// //         </View>

// //         <AccessibleText
// //           style={[styles.instructions, { color: colors.text }]}
// //           accessibilityRole="text"
// //         >
// //           {currentInstruction}
// //         </AccessibleText>

// //         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
// //           {capturedAngles.length} / 5 captured
// //         </AccessibleText>

// //         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
// //           Current angle: {lastDetectedAngle}
// //         </AccessibleText>

// //         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
// //           {statusText}
// //         </AccessibleText>
// //       </View>

// //       <View
// //         style={[
// //           styles.bottomBar,
// //           {
// //             flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
// //             borderTopColor: colors.border,
// //             backgroundColor: colors.background,
// //           },
// //         ]}
// //       >
// //         <AccessibleButton
// //           // title={t("common.modes")}
// //           title={lang === "ur" ? "واپس" : t("common.modes")}
// //           // onPress={() => router.push("/features")}
// //           onPress={() => {
// //               stopCaptureFlow();
// //               router.replace("/features");
// //             }}
// //           accessibilityLabel={t("common.modes")}
// //           accessibilityHint={t("common.modesHint")}
// //           style={[
// //             styles.bottomButton,
// //             {
// //               backgroundColor: colors.card || colors.background,
// //               borderColor: colors.border,
// //             },
// //           ]}
// //           textStyle={{ color: colors.text }}
// //         />

// //      <AccessibleButton
// //         title={lang === "ur" ? "دوبارہ شروع کریں" : "Start Again"}
// //         onPress={handleRestart}
// //         accessibilityLabel={
// //           lang === "ur" ? "رجسٹریشن دوبارہ شروع کریں" : "Start registration again"
// //         }
// //         accessibilityHint={
// //           lang === "ur"
// //             ? "محفوظ زاویے ختم کر کے دوبارہ شروع کرتا ہے"
// //             : "Clears captured angles and starts over"
// //         }
// //         style={[
// //           styles.bottomButton,
// //           {
// //             backgroundColor: colors.card || colors.background,
// //             borderColor: colors.border,
// //           },
// //         ]}
// //         textStyle={{ color: colors.text }}
// //       />
// //             <AccessibleButton
// //         title={lang === "ur" ? "اردو" : "ENG"}
// //         onPress={handleLanguageToggle}
// //         accessibilityRole="switch"
// //         accessibilityState={{ checked: lang === "ur" }}
// //         style={[
// //           styles.bottomButton,
// //           {
// //             backgroundColor: colors.card || colors.background,
// //             borderColor: colors.border,
// //           },
// //         ]}
// //         textStyle={{ color: colors.text }}
// //       />
// //       </View>
// //     </View>
// //   );
// // };

// // export default PersonCaptureScreen;

// // const styles = StyleSheet.create({
// //   root: {
// //     flex: 1,
// //   },
// //   content: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingHorizontal: 20,
// //     paddingTop: 24,
// //     paddingBottom: 12,
// //   },
// //   ringWrap: {
// //     width: RING_SIZE,
// //     height: RING_SIZE,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     position: "relative",
// //     marginBottom: 28,
// //   },
// //   segment: {
// //     position: "absolute",
// //     width: 4,
// //     height: 28,
// //     borderRadius: 999,
// //   },
// //   cameraCircleOuter: {
// //     overflow: "hidden",
// //     borderWidth: 2,
// //   },
// //   cameraCircleInner: {
// //     flex: 1,
// //     overflow: "hidden",
// //     position: "relative",
// //   },
// //   camera: {
// //     flex: 1,
// //   },
// //   cameraFallback: {
// //     flex: 1,
// //     backgroundColor: "#111111",
// //   },
// //   permissionCenterOverlay: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingHorizontal: 20,
// //   },
// //   permissionButton: {
// //     paddingHorizontal: 24,
// //     paddingVertical: 16,
// //     borderRadius: 16,
// //     borderWidth: 1,
// //   },
// //   guideOval: {
// //     position: "absolute",
// //     width: "76%",
// //     height: "92%",
// //     borderWidth: 2,
// //     borderRadius: 999,
// //     alignSelf: "center",
// //     top: "4%",
// //     opacity: 0.28,
// //   },
// //   scanLine: {
// //     position: "absolute",
// //     left: "8%",
// //     right: "8%",
// //     top: "52%",
// //     height: 4,
// //     borderRadius: 999,
// //     shadowOpacity: 0.45,
// //     shadowRadius: 10,
// //     elevation: 6,
// //   },
// //   instructions: {
// //     fontSize: 18,
// //     fontWeight: "800",
// //     textAlign: "center",
// //     lineHeight: 25,
// //     maxWidth: 310,
// //     marginBottom: 12,
// //   },
// //   metaText: {
// //     fontSize: 14,
// //     textAlign: "center",
// //     marginBottom: 6,
// //     opacity: 0.9,
// //   },
// //   bottomBar: {
// //     paddingHorizontal: 20,
// //     paddingTop: 12,
// //     paddingBottom: 18,
// //     gap: 12,
// //     borderTopWidth: 1,
// //   },
// //   bottomButton: {
// //     flex: 1,
// //     minHeight: 58,
// //     borderRadius: 18,
// //     borderWidth: 1.5,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginHorizontal: 4,
// //   },
// // });

// import { AccessibleButton } from "@/components/AccessibleButton";
// import { AccessibleText } from "@/components/AccessibleText";
// import { useAccessibility } from "@/contexts/AccessibilityContext";
// import { useAccessibleColors } from "@/hooks/useAccessibleColors";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import * as FileSystem from "expo-file-system/legacy";
// import { useRouter } from "expo-router";
// import { useTranslation } from "react-i18next";
// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { Dimensions, I18nManager, StyleSheet, View } from "react-native";

// import {
//   stopTTS,
//   speakUI,
//   UI_URDU,
//   translateAndSpeakPersonCapture,
// } from "../services/ttsService";
// import { Audio } from "expo-av";

// const { width } = Dimensions.get("window");
// const RING_SIZE = Math.min(width * 0.88, 360);
// const CAMERA_SIZE = RING_SIZE * 0.76;
// const SEGMENT_COUNT = 60;

// const REQUIRED_ANGLES = ["front", "left", "right", "up", "down"] as const;
// type RequiredAngle = (typeof REQUIRED_ANGLES)[number];

// type FaceGuideResponse = {
//   ok: boolean;
//   faceDetected: boolean;
//   shouldCapture: boolean;
//   stable: boolean;
//   distance: "too_close" | "too_far" | "good";
//   position: "centered" | "move_left" | "move_right" | "move_up" | "move_down";
//   angle: RequiredAngle | "unknown";
//   duplicateAngle: boolean;
//   nextRequiredAngle: RequiredAngle | null;
//   message?: string;
// };

// const GUIDE_MESSAGES: Record<string, string> = {
//   no_face: "No face detected. Slowly move the phone until your face is found.",
//   no_face_recovery: "Move the phone slowly to find your face again.",
//   too_close: "Move the phone a little away.",
//   too_far: "Bring the phone a little closer.",
//   // move_left: "Keep your face centered in the camera.",
//   // move_right: "Keep your face centered in the camera.",
//   // move_up: "Keep your face centered in the camera.",
//   // move_down: "Keep your face centered in the camera.",
//   move_left: "Move face left.",
//   move_right: "Move face right.",
//   move_up: "Move face up.",
//   move_down: "Move face down.",
//   hold_still: "Hold still.",
//   next_front: "Keep your face straight and centered.",
//   next_left: "Turn your face slightly to your right.",
//   next_right: "Turn your face slightly to your left.",
//   next_up: "Look slightly upward.",
//   next_down: "Look slightly downward.",
//   capturing: "",
//   done: "Registration complete.",
//   unavailable: "Guide service unavailable.",
// };

// const angleLabelMap: Record<RequiredAngle, string> = {
//   front: "Front",
//   left: "Left",
//   right: "Right",
//   up: "Up",
//   down: "Down",
// };

// const onColor = (bg: string) => {
//   const hex = (bg || "").replace("#", "");
//   if (hex.length !== 6) return "#000000";

//   const r = parseInt(hex.slice(0, 2), 16) / 255;
//   const g = parseInt(hex.slice(2, 4), 16) / 255;
//   const b = parseInt(hex.slice(4, 6), 16) / 255;

//   const toLin = (c: number) =>
//     c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

//   const L = 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
//   return L > 0.45 ? "#000000" : "#FFFFFF";
// };

// const BASE_URL = "http://192.168.18.206:8000";

// const PersonCaptureScreen = () => {
//   const router = useRouter();
//   const { t, i18n } = useTranslation();
//   const { stopSpeaking, hapticFeedback } = useAccessibility();
//   const colors = useAccessibleColors();

//   const [lang, setLang] = useState<"en" | "ur">(
//     i18n.language === "ur" ? "ur" : "en"
//   );

//   const [permission, requestPermission] = useCameraPermissions();
//   const [cameraReady, setCameraReady] = useState(false);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [isCapturing, setIsCapturing] = useState(false);

//   const [capturedUris, setCapturedUris] = useState<string[]>([]);
//   const [capturedAngles, setCapturedAngles] = useState<RequiredAngle[]>([]);
//   const [currentInstruction, setCurrentInstruction] = useState(
//     GUIDE_MESSAGES.next_front
//   );
//   const [statusText, setStatusText] = useState("Looking for face...");
//   const [lastDetectedAngle, setLastDetectedAngle] = useState<string>("unknown");

//   const cameraRef = useRef<CameraView | null>(null);
//   const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const mountedRef = useRef(true);
//   const stoppedRef = useRef(false);
//   const sessionRef = useRef(0);

//   const langRef = useRef(lang);
//   const hasWelcomedRef = useRef(false);
//   const hasDetectedFaceOnceRef = useRef(false);

//   const lastSpokenMessageRef = useRef("");
//   const lastSpokenAtRef = useRef(0);
//   const lastCaptureAtRef = useRef(0);
//   const pauseGuidanceUntilRef = useRef(0);

//   useEffect(() => {
//     langRef.current = lang;
//   }, [lang]);

//   const onPrimary = useMemo(() => onColor(colors.primary), [colors.primary]);

//   const progressSegments = useMemo(() => {
//     return Math.round(
//       (capturedAngles.length / REQUIRED_ANGLES.length) * SEGMENT_COUNT
//     );
//   }, [capturedAngles.length]);

//   const nextRequiredAngle = useMemo(() => {
//     return REQUIRED_ANGLES.find((a) => !capturedAngles.includes(a)) ?? null;
//   }, [capturedAngles]);

//   const getNextAnglePrompt = useCallback((angle: RequiredAngle | null) => {
//     if (!angle) return GUIDE_MESSAGES.done;
//     return GUIDE_MESSAGES[`next_${angle}`] ?? "Adjust your face.";
//   }, []);

//   const clearGuidanceTimer = useCallback(() => {
//     if (analyzeTimerRef.current) {
//       clearTimeout(analyzeTimerRef.current);
//       analyzeTimerRef.current = null;
//     }
//   }, []);

//   const stopCaptureFlow = useCallback(() => {
//     sessionRef.current += 1;
//     stoppedRef.current = true;
//     mountedRef.current = false;

//     clearGuidanceTimer();

//     stopSpeaking?.();
//     stopTTS();

//     setIsAnalyzing(false);
//     setIsCapturing(false);
//     setCameraReady(false);

//     lastSpokenMessageRef.current = "";
//     lastSpokenAtRef.current = 0;
//     pauseGuidanceUntilRef.current = 0;
//     lastCaptureAtRef.current = 0;
//   }, [clearGuidanceTimer, stopSpeaking]);

//   const speakOnce = useCallback(async (message: string) => {
//     if (!message) return;
//     if (!mountedRef.current) return;
//     if (stoppedRef.current) return;

//     const now = Date.now();
//     const sameMessage = lastSpokenMessageRef.current === message;
//     const tooSoon = now - lastSpokenAtRef.current < 3000;

//     if (sameMessage && tooSoon) return;

//     const mySession = sessionRef.current;

//     lastSpokenMessageRef.current = message;
//     lastSpokenAtRef.current = now;

//     await translateAndSpeakPersonCapture(message, langRef.current);

//     if (
//       mySession !== sessionRef.current ||
//       stoppedRef.current ||
//       !mountedRef.current
//     ) {
//       stopTTS();
//     }
//   }, []);

//   useEffect(() => {
//     mountedRef.current = true;
//     stoppedRef.current = false;

//     return () => {
//       stopCaptureFlow();
//     };
//   }, [stopCaptureFlow]);

//   useEffect(() => {
//     if (stoppedRef.current) return;

//     if (!permission) {
//       requestPermission();
//       return;
//     }

//     if (!permission.granted) {
//       void speakOnce(t("personCapture.allowCamera"));
//       return;
//     }

//     if (!hasWelcomedRef.current) {
//       hasWelcomedRef.current = true;
//       const firstPrompt = getNextAnglePrompt(nextRequiredAngle);
//       setCurrentInstruction(firstPrompt);
//       void speakOnce(firstPrompt);
//     }
//   }, [
//     permission,
//     requestPermission,
//     speakOnce,
//     t,
//     getNextAnglePrompt,
//     nextRequiredAngle,
//   ]);

//   const completeFlow = useCallback(
//     (finalUris: string[], finalAngles: RequiredAngle[]) => {
//       if (stoppedRef.current) return;

//       setCurrentInstruction(GUIDE_MESSAGES.done);
//       setStatusText("5 of 5 captured");
//       void speakOnce(GUIDE_MESSAGES.done);

//       router.replace({
//         pathname: "/person-name",
//         params: {
//           count: String(finalUris.length),
//           imageUris: JSON.stringify(finalUris),
//           capturedAngles: JSON.stringify(finalAngles),
//         },
//       } as any);
//     },
//     [router, speakOnce]
//   );

//   const saveCapturedPhoto = useCallback(
//     async (tempUri: string, angle: RequiredAngle) => {
//       if (stoppedRef.current) return;

//       const fileName = `person_${angle}_${Date.now()}.jpg`;
//       const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

//       await FileSystem.copyAsync({
//         from: tempUri,
//         to: fileUri,
//       });

//       if (stoppedRef.current) return;

//       const nextUris = [...capturedUris, fileUri];
//       const nextAngles = [...capturedAngles, angle];

//       setCapturedUris(nextUris);
//       setCapturedAngles(nextAngles);
//       setLastDetectedAngle(angle);
//       hasDetectedFaceOnceRef.current = true;

//       if (nextAngles.length >= REQUIRED_ANGLES.length) {
//         completeFlow(nextUris, nextAngles);
//         return;
//       }

//       const nextAngle =
//         REQUIRED_ANGLES.find((a) => !nextAngles.includes(a)) ?? null;

//       const prompt = getNextAnglePrompt(nextAngle);

//       setCurrentInstruction(prompt);
//       setStatusText(`${nextAngles.length} of 5 captured`);
//       void speakOnce(prompt);
//     },
//     [capturedUris, capturedAngles, completeFlow, getNextAnglePrompt, speakOnce]
//   );

//   const analyzeFrameForGuidance = useCallback(
//     async (base64: string): Promise<FaceGuideResponse> => {
//       const requiredAngle = nextRequiredAngle;

//       try {
//         const response = await fetch(`${BASE_URL}/face-registration-guide`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             imageBase64: base64,
//             requiredAngle,
//             capturedAngles,
//           }),
//         });

//         const rawText = await response.text();

//         if (!response.ok) {
//           throw new Error(`Guide API failed with ${response.status}: ${rawText}`);
//         }

//         return JSON.parse(rawText) as FaceGuideResponse;
//       } catch (error) {
//         console.error("[guide] fetch error:", error);

//         return {
//           ok: false,
//           faceDetected: false,
//           shouldCapture: false,
//           stable: false,
//           distance: "good",
//           position: "centered",
//           angle: "unknown",
//           duplicateAngle: false,
//           nextRequiredAngle: requiredAngle,
//           message: GUIDE_MESSAGES.unavailable,
//         };
//       }
//     },
//     [capturedAngles, nextRequiredAngle]
//   );

//   const autoCapturePhoto = useCallback(
//     async (angle: RequiredAngle) => {
//       if (stoppedRef.current) return;

//       pauseGuidanceUntilRef.current = Date.now() + 3000;
//       clearGuidanceTimer();

//       if (!cameraRef.current || isCapturing || !cameraReady) return;

//       try {
//         // setIsCapturing(true);
//         // setCurrentInstruction(GUIDE_MESSAGES.capturing);
//         // setStatusText(`Capturing ${angleLabelMap[angle]} angle`);
//         // void speakOnce(GUIDE_MESSAGES.capturing);
//         // hapticFeedback?.("medium");
//         setCurrentInstruction("Hold still.");
//         setStatusText(`Saving ${angleLabelMap[angle]} angle`);

//         const photo = await cameraRef.current.takePictureAsync({
//           quality: 0.8,
//           base64: false,
//           skipProcessing: false,
//           shutterSound: false,
//         });

//         if (stoppedRef.current) return;

//         if (!photo?.uri) {
//           void speakOnce("Could not capture image. Please hold still.");
//           return;
//         }

//         lastCaptureAtRef.current = Date.now();
//         pauseGuidanceUntilRef.current = Date.now() + 3000;

//         await saveCapturedPhoto(photo.uri, angle);
//       } catch (error) {
//         if (!stoppedRef.current) {
//           console.log("[autoCapturePhoto] capture error:", error);
//           void speakOnce("Could not capture image. Please hold still.");
//           hapticFeedback?.("error");
//         }
//       } finally {
//         if (mountedRef.current && !stoppedRef.current) {
//           setIsCapturing(false);
//         }
//       }
//     },
//     [
//       cameraReady,
//       clearGuidanceTimer,
//       hapticFeedback,
//       isCapturing,
//       saveCapturedPhoto,
//       speakOnce,
//     ]
//   );

//   const handleGuideResponse = useCallback(
//     async (guide: FaceGuideResponse) => {
//       if (!mountedRef.current || stoppedRef.current) return;

//       const remainingPrompt = getNextAnglePrompt(nextRequiredAngle);

//       if (!guide.ok) {
//         setCurrentInstruction(GUIDE_MESSAGES.unavailable);
//         setStatusText("Waiting...");
//         void speakOnce(GUIDE_MESSAGES.unavailable);
//         return;
//       }

//       if (!guide.faceDetected) {
//         setLastDetectedAngle("unknown");

//         const msg =
//           hasDetectedFaceOnceRef.current || capturedAngles.length > 0
//             ? GUIDE_MESSAGES.no_face_recovery
//             : GUIDE_MESSAGES.no_face;

//         setCurrentInstruction(msg);
//         setStatusText("Finding face");
//         void speakOnce(msg);
//         return;
//       }

//       hasDetectedFaceOnceRef.current = true;
//       setLastDetectedAngle(guide.angle);

//       if (guide.distance === "too_close") {
//         setCurrentInstruction(GUIDE_MESSAGES.too_close);
//         setStatusText("Too close");
//         void speakOnce(GUIDE_MESSAGES.too_close);
//         return;
//       }

//       if (guide.distance === "too_far") {
//         setCurrentInstruction(GUIDE_MESSAGES.too_far);
//         setStatusText("Too far");
//         void speakOnce(GUIDE_MESSAGES.too_far);
//         return;
//       }

//       if (guide.position !== "centered") {
//         setCurrentInstruction(remainingPrompt);
//         setStatusText("Guiding next required angle");
//         void speakOnce(remainingPrompt);
//         return;
//       }

//       if (guide.duplicateAngle && guide.angle !== "unknown") {
//         setCurrentInstruction(remainingPrompt);
//         setStatusText(`Already captured ${guide.angle}`);
//         void speakOnce(remainingPrompt);
//         return;
//       }

//       if (guide.angle !== "unknown" && !capturedAngles.includes(guide.angle)) {
//         await autoCapturePhoto(guide.angle);
//         return;
//       }

//       if (!guide.stable) {
//         setCurrentInstruction(GUIDE_MESSAGES.hold_still);
//         setStatusText("Hold still");
//         void speakOnce(GUIDE_MESSAGES.hold_still);
//         return;
//       }

//       setCurrentInstruction(remainingPrompt);
//       setStatusText("Guide ready");
//       void speakOnce(remainingPrompt);
//     },
//     [
//       autoCapturePhoto,
//       capturedAngles,
//       getNextAnglePrompt,
//       nextRequiredAngle,
//       speakOnce,
//     ]
//   );

//   const runGuidancePass = useCallback(async () => {
//     if (stoppedRef.current) return;
//     if (!permission?.granted || !cameraReady || isAnalyzing || isCapturing) return;
//     if (!nextRequiredAngle) return;
//     if (!cameraRef.current) return;

//     const now = Date.now();

//     if (now < pauseGuidanceUntilRef.current) return;
//     if (now - lastCaptureAtRef.current < 2200) return;

//     const mySession = sessionRef.current;

//     try {
//       setIsAnalyzing(true);

//       const previewShot = await cameraRef.current.takePictureAsync({
//         quality: 0.3,
//         base64: true,
//         skipProcessing: true,
//         shutterSound: false,
//       });

//       if (
//         stoppedRef.current ||
//         mySession !== sessionRef.current ||
//         !previewShot?.base64
//       ) {
//         return;
//       }

//       const guide = await analyzeFrameForGuidance(previewShot.base64);

//       if (stoppedRef.current || mySession !== sessionRef.current) return;

//       await handleGuideResponse(guide);
//     } catch (error: any) {
//       const message = String(error?.message || error || "").toLowerCase();

//       if (
//         message.includes("could not be captured") ||
//         message.includes("camera") ||
//         message.includes("capture")
//       ) {
//         return;
//       }

//       console.log("[runGuidancePass] non-camera error:", error);
//     } finally {
//       if (mountedRef.current && !stoppedRef.current) {
//         setIsAnalyzing(false);
//       }
//     }
//   }, [
//     permission?.granted,
//     cameraReady,
//     isAnalyzing,
//     isCapturing,
//     nextRequiredAngle,
//     analyzeFrameForGuidance,
//     handleGuideResponse,
//   ]);

//   useEffect(() => {
//     clearGuidanceTimer();

//     if (stoppedRef.current) return;
//     if (!permission?.granted || !cameraReady) return;
//     if (capturedAngles.length >= REQUIRED_ANGLES.length) return;

//     let cancelled = false;

//     const loop = async () => {
//       if (cancelled || stoppedRef.current) return;

//       await runGuidancePass();

//       if (cancelled || stoppedRef.current) return;

//       analyzeTimerRef.current = setTimeout(loop, 2200);
//     };

//     analyzeTimerRef.current = setTimeout(loop, 1200);

//     return () => {
//       cancelled = true;
//       clearGuidanceTimer();
//     };
//   }, [
//     permission?.granted,
//     cameraReady,
//     capturedAngles.length,
//     runGuidancePass,
//     clearGuidanceTimer,
//   ]);

//   const handleLanguageToggle = async () => {
//     if (stoppedRef.current) return;

//     const next = lang === "en" ? "ur" : "en";

//     stopTTS();

//     setLang(next);
//     langRef.current = next;
//     lastSpokenMessageRef.current = "";
//     lastSpokenAtRef.current = 0;

//     await i18n.changeLanguage(next);

//     hapticFeedback?.("medium");

//     speakUI(
//       next === "ur" ? UI_URDU.switched_urdu : UI_URDU.switched_english,
//       next
//     );
//   };

//   const handleRestart = () => {
//     if (stoppedRef.current) return;

//     clearGuidanceTimer();

//     setCapturedUris([]);
//     setCapturedAngles([]);
//     setCurrentInstruction(getNextAnglePrompt(REQUIRED_ANGLES[0]));
//     setStatusText("Looking for face...");
//     setLastDetectedAngle("unknown");

//     hasDetectedFaceOnceRef.current = false;
//     lastSpokenMessageRef.current = "";
//     lastSpokenAtRef.current = 0;
//     lastCaptureAtRef.current = 0;
//     pauseGuidanceUntilRef.current = 0;

//     void speakOnce("Starting again. Keep your face straight and centered.");
//   };

//   const goToModes = () => {
//     stopCaptureFlow();

//     requestAnimationFrame(() => {
//       router.replace("/features");
//     });
//   };

//   const renderCameraContent = () => {
//     if (!permission) {
//       return <View style={styles.cameraFallback} />;
//     }

//     if (!permission.granted) {
//       return (
//         <View
//           style={[
//             styles.permissionCenterOverlay,
//             { backgroundColor: colors.card || colors.background },
//           ]}
//         >
//           <AccessibleButton
//             title={t("personCapture.allowCamera")}
//             onPress={requestPermission}
//             accessibilityLabel={t("personCapture.allowCameraLabel")}
//             accessibilityHint={t("personCapture.allowCameraHint")}
//             style={[
//               styles.permissionButton,
//               {
//                 backgroundColor: colors.primary,
//                 borderColor: colors.border,
//               },
//             ]}
//             textStyle={{ color: onPrimary }}
//           />
//         </View>
//       );
//     }

//     return (
//       <CameraView
//         ref={cameraRef}
//         style={styles.camera}
//         facing="front"
//         accessible
//         accessibilityLabel={t("personCapture.liveFeedLabel")}
//         onCameraReady={() => {
//           if (stoppedRef.current) return;

//           setCameraReady(true);

//           if (!hasWelcomedRef.current) {
//             hasWelcomedRef.current = true;
//             const firstPrompt = getNextAnglePrompt(nextRequiredAngle);
//             setCurrentInstruction(firstPrompt);
//             setStatusText("Camera ready");
//             void speakOnce(firstPrompt);
//           }
//         }}
//       />
//     );
//   };

//   return (
//     <View style={[styles.root, { backgroundColor: colors.background }]}>
//       <View style={styles.content}>
//         <View style={styles.ringWrap}>
//           {Array.from({ length: SEGMENT_COUNT }).map((_, index) => {
//             const isActive = index < progressSegments;

//             return (
//               <View
//                 key={index}
//                 style={[
//                   styles.segment,
//                   {
//                     backgroundColor: isActive ? colors.primary : colors.border,
//                     transform: [
//                       { rotate: `${(360 / SEGMENT_COUNT) * index}deg` },
//                       { translateY: -(RING_SIZE / 2 - 10) },
//                     ],
//                     opacity: isActive ? 1 : 0.85,
//                   },
//                 ]}
//               />
//             );
//           })}

//           <View
//             style={[
//               styles.cameraCircleOuter,
//               {
//                 width: CAMERA_SIZE,
//                 height: CAMERA_SIZE,
//                 borderRadius: CAMERA_SIZE / 2,
//                 borderColor: colors.border,
//               },
//             ]}
//           >
//             <View
//               style={[
//                 styles.cameraCircleInner,
//                 {
//                   borderRadius: CAMERA_SIZE / 2,
//                   backgroundColor: colors.card || colors.background,
//                 },
//               ]}
//             >
//               {renderCameraContent()}

//               <View
//                 pointerEvents="none"
//                 style={[styles.guideOval, { borderColor: colors.primary }]}
//               />

//               <View
//                 pointerEvents="none"
//                 style={[
//                   styles.scanLine,
//                   {
//                     backgroundColor: colors.primary,
//                     shadowColor: colors.primary,
//                     opacity: isCapturing ? 1 : 0.75,
//                   },
//                 ]}
//               />
//             </View>
//           </View>
//         </View>

//         <AccessibleText
//           style={[styles.instructions, { color: colors.text }]}
//           accessibilityRole="text"
//         >
//           {currentInstruction}
//         </AccessibleText>

//         {/* <AccessibleText style={[styles.metaText, { color: colors.text }]}>
//           {capturedAngles.length} / 5 captured
//         </AccessibleText> */}
//         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
//           {lang === "ur"
//             ? `${capturedAngles.length} / 5 محفوظ`
//             : `${capturedAngles.length} / 5 captured`}
//         </AccessibleText>

//         {/* <AccessibleText style={[styles.metaText, { color: colors.text }]}>
//           Current angle: {lastDetectedAngle}
//         </AccessibleText> */}
//         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
//           {lang === "ur"
//             ? `موجودہ زاویہ: ${lastDetectedAngle}`
//             : `Current angle: ${lastDetectedAngle}`}
//         </AccessibleText>


//         {/* <AccessibleText style={[styles.metaText, { color: colors.text }]}>
//           {statusText}
//         </AccessibleText> */}
//         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
//           {lang === "ur" ? getUrduStatus(statusText) : statusText}
//         </AccessibleText>
//       </View>

//       <View
//         style={[
//           styles.bottomBar,
//           {
//             flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
//             borderTopColor: colors.border,
//             backgroundColor: colors.background,
//           },
//         ]}
//       >
//         <AccessibleButton
//           title={lang === "ur" ? "واپس" : t("common.modes")}
//           onPress={goToModes}
//           accessibilityLabel={lang === "ur" ? "واپس" : t("common.modes")}
//           accessibilityHint={t("common.modesHint")}
//           style={[
//             styles.bottomButton,
//             {
//               backgroundColor: colors.card || colors.background,
//               borderColor: colors.border,
//             },
//           ]}
//           textStyle={{ color: colors.text }}
//         />

//         <AccessibleButton
//           title={lang === "ur" ? "دوبارہ شروع کریں" : "Start Again"}
//           onPress={handleRestart}
//           accessibilityLabel={
//             lang === "ur" ? "رجسٹریشن دوبارہ شروع کریں" : "Start registration again"
//           }
//           accessibilityHint={
//             lang === "ur"
//               ? "محفوظ زاویے ختم کر کے دوبارہ شروع کرتا ہے"
//               : "Clears captured angles and starts over"
//           }
//           style={[
//             styles.bottomButton,
//             {
//               backgroundColor: colors.card || colors.background,
//               borderColor: colors.border,
//             },
//           ]}
//           textStyle={{ color: colors.text }}
//         />

//         <AccessibleButton
//           title={lang === "ur" ? "اردو" : "ENG"}
//           onPress={handleLanguageToggle}
//           accessibilityRole="switch"
//           accessibilityState={{ checked: lang === "ur" }}
//           style={[
//             styles.bottomButton,
//             {
//               backgroundColor: colors.card || colors.background,
//               borderColor: colors.border,
//             },
//           ]}
//           textStyle={{ color: colors.text }}
//         />
//       </View>
//     </View>
//   );
// };

// export default PersonCaptureScreen;

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 20,
//     paddingTop: 24,
//     paddingBottom: 12,
//   },
//   ringWrap: {
//     width: RING_SIZE,
//     height: RING_SIZE,
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//     marginBottom: 28,
//   },
//   segment: {
//     position: "absolute",
//     width: 4,
//     height: 28,
//     borderRadius: 999,
//   },
//   cameraCircleOuter: {
//     overflow: "hidden",
//     borderWidth: 2,
//   },
//   cameraCircleInner: {
//     flex: 1,
//     overflow: "hidden",
//     position: "relative",
//   },
//   camera: {
//     flex: 1,
//   },
//   cameraFallback: {
//     flex: 1,
//     backgroundColor: "#111111",
//   },
//   permissionCenterOverlay: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 20,
//   },
//   permissionButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 16,
//     borderRadius: 16,
//     borderWidth: 1,
//   },
//   guideOval: {
//     position: "absolute",
//     width: "76%",
//     height: "92%",
//     borderWidth: 2,
//     borderRadius: 999,
//     alignSelf: "center",
//     top: "4%",
//     opacity: 0.28,
//   },
//   scanLine: {
//     position: "absolute",
//     left: "8%",
//     right: "8%",
//     top: "52%",
//     height: 4,
//     borderRadius: 999,
//     shadowOpacity: 0.45,
//     shadowRadius: 10,
//     elevation: 6,
//   },
//   instructions: {
//     fontSize: 18,
//     fontWeight: "800",
//     textAlign: "center",
//     lineHeight: 25,
//     maxWidth: 310,
//     marginBottom: 12,
//   },
//   metaText: {
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 6,
//     opacity: 0.9,
//   },
//   bottomBar: {
//     paddingHorizontal: 20,
//     paddingTop: 12,
//     paddingBottom: 18,
//     gap: 12,
//     borderTopWidth: 1,
//   },
//   bottomButton: {
//     flex: 1,
//     minHeight: 58,
//     borderRadius: 18,
//     borderWidth: 1.5,
//     alignItems: "center",
//     justifyContent: "center",
//     marginHorizontal: 4,
//   },
// });

import { AccessibleButton } from "@/components/AccessibleButton";
import { AccessibleText } from "@/components/AccessibleText";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useAccessibleColors } from "@/hooks/useAccessibleColors";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, I18nManager, StyleSheet, View } from "react-native";

import {
  stopTTS,
  speakUI,
  UI_URDU,
  translateAndSpeakPersonCapture,
} from "../services/ttsService";

const { width } = Dimensions.get("window");
const RING_SIZE = Math.min(width * 0.88, 360);
const CAMERA_SIZE = RING_SIZE * 0.76;
const SEGMENT_COUNT = 60;

const REQUIRED_ANGLES = ["front", "left", "right", "up", "down"] as const;
type RequiredAngle = (typeof REQUIRED_ANGLES)[number];

type FaceGuideResponse = {
  ok: boolean;
  faceDetected: boolean;
  shouldCapture: boolean;
  stable: boolean;
  distance: "too_close" | "too_far" | "good";
  position: "centered" | "move_left" | "move_right" | "move_up" | "move_down";
  angle: RequiredAngle | "unknown";
  duplicateAngle: boolean;
  nextRequiredAngle: RequiredAngle | null;
  message?: string;
};

const GUIDE_MESSAGES: Record<string, string> = {
  no_face: "No face detected. Slowly move the phone until your face is found.",
  no_face_recovery: "Move the phone slowly to find your face again.",
  too_close: "Move the phone a little away.",
  too_far: "Bring the phone a little closer.",
  move_left: "Move face left.",
  move_right: "Move face right.",
  move_up: "Move face up.",
  move_down: "Move face down.",
  hold_still: "Hold still.",
  next_front: "Keep your face straight and centered.",
  next_left: "Turn your face slightly to your right.",
  next_right: "Turn your face slightly to your left.",
  next_up: "Look slightly upward.",
  next_down: "Look slightly downward.",
  capturing: "",
  done: "Registration complete.",
  unavailable: "Guide service unavailable.",
};

const angleLabelMap: Record<RequiredAngle, string> = {
  front: "Front",
  left: "Left",
  right: "Right",
  up: "Up",
  down: "Down",
};

const angleLabelUrduMap: Record<RequiredAngle, string> = {
  front: "سامنے",
  left: "بائیں",
  right: "دائیں",
  up: "اوپر",
  down: "نیچے",
};

const onColor = (bg: string) => {
  const hex = (bg || "").replace("#", "");
  if (hex.length !== 6) return "#000000";

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const toLin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const L = 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
  return L > 0.45 ? "#000000" : "#FFFFFF";
};

const BASE_URL = "http://192.168.18.206:8000";

const PersonCaptureScreen = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { stopSpeaking, hapticFeedback } = useAccessibility();
  const colors = useAccessibleColors();

  const [lang, setLang] = useState<"en" | "ur">(
    i18n.language === "ur" ? "ur" : "en"
  );

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const [capturedUris, setCapturedUris] = useState<string[]>([]);
  const [capturedAngles, setCapturedAngles] = useState<RequiredAngle[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState(
    GUIDE_MESSAGES.next_front
  );
  const [statusText, setStatusText] = useState("Looking for face...");
  const [lastDetectedAngle, setLastDetectedAngle] = useState<string>("unknown");

  const cameraRef = useRef<CameraView | null>(null);
  const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mountedRef = useRef(true);
  const stoppedRef = useRef(false);
  const sessionRef = useRef(0);

  const langRef = useRef(lang);
  const hasWelcomedRef = useRef(false);
  const hasDetectedFaceOnceRef = useRef(false);

  const lastSpokenMessageRef = useRef("");
  const lastSpokenAtRef = useRef(0);
  const lastCaptureAtRef = useRef(0);
  const pauseGuidanceUntilRef = useRef(0);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  const onPrimary = useMemo(() => onColor(colors.primary), [colors.primary]);

  const progressSegments = useMemo(() => {
    return Math.round(
      (capturedAngles.length / REQUIRED_ANGLES.length) * SEGMENT_COUNT
    );
  }, [capturedAngles.length]);

  const nextRequiredAngle = useMemo(() => {
    return REQUIRED_ANGLES.find((a) => !capturedAngles.includes(a)) ?? null;
  }, [capturedAngles]);

  const getNextAnglePrompt = useCallback((angle: RequiredAngle | null) => {
    if (!angle) return GUIDE_MESSAGES.done;
    return GUIDE_MESSAGES[`next_${angle}`] ?? "Adjust your face.";
  }, []);

  const getInstructionText = useCallback(
    (text: string) => {
      if (lang !== "ur") return text;

      switch (text) {
        case GUIDE_MESSAGES.no_face:
          return "چہرہ نہیں ملا۔ فون آہستہ آہستہ حرکت دیں۔";
        case GUIDE_MESSAGES.no_face_recovery:
          return "چہرہ دوبارہ تلاش کریں۔ فون آہستہ حرکت دیں۔";
        case GUIDE_MESSAGES.too_close:
          return "فون تھوڑا دور کریں۔";
        case GUIDE_MESSAGES.too_far:
          return "فون تھوڑا قریب کریں۔";
        case GUIDE_MESSAGES.move_left:
          return "چہرہ بائیں کریں۔";
        case GUIDE_MESSAGES.move_right:
          return "چہرہ دائیں کریں۔";
        case GUIDE_MESSAGES.move_up:
          return "چہرہ اوپر کریں۔";
        case GUIDE_MESSAGES.move_down:
          return "چہرہ نیچے کریں۔";
        case GUIDE_MESSAGES.hold_still:
          return "ساکن رہیں۔";
        case GUIDE_MESSAGES.next_front:
          return "سیدھا دیکھیں۔";
        case GUIDE_MESSAGES.next_left:
          return "چہرہ تھوڑا دائیں کریں۔";
        case GUIDE_MESSAGES.next_right:
          return "چہرہ تھوڑا بائیں کریں۔";
        case GUIDE_MESSAGES.next_up:
          return "تھوڑا اوپر دیکھیں۔";
        case GUIDE_MESSAGES.next_down:
          return "تھوڑا نیچے دیکھیں۔";
        case GUIDE_MESSAGES.done:
          return "رجسٹریشن مکمل ہو گئی۔";
        case GUIDE_MESSAGES.unavailable:
          return "گائیڈ دستیاب نہیں۔";
        default:
          return text;
      }
    },
    [lang]
  );

  const getUrduStatus = useCallback((text: string) => {
    switch (text) {
      case "Looking for face...":
      case "Finding face":
        return "چہرہ تلاش کیا جا رہا ہے";
      case "Too close":
        return "بہت قریب";
      case "Too far":
        return "بہت دور";
      case "Guide ready":
        return "تیار";
      case "Hold still":
        return "ساکن رہیں";
      case "Waiting...":
        return "انتظار کریں";
      case "Camera ready":
        return "کیمرا تیار ہے";
      case "Guiding next required angle":
        return "اگلے زاویے کے لیے رہنمائی";
      case "5 of 5 captured":
        return "5 میں سے 5 محفوظ";
      default:
        if (text.includes("of 5 captured")) {
          const number = text.split(" ")[0];
          return `5 میں سے ${number} محفوظ`;
        }
        if (text.includes("Saving")) {
          return "محفوظ ہو رہا ہے";
        }
        if (text.includes("Already captured")) {
          return "یہ زاویہ پہلے محفوظ ہو چکا ہے";
        }
        return text;
    }
  }, []);

  const getDisplayAngle = useCallback(
    (angle: string) => {
      if (lang !== "ur") return angle;
      if (angle === "unknown") return "نامعلوم";
      return angleLabelUrduMap[angle as RequiredAngle] ?? angle;
    },
    [lang]
  );

  const clearGuidanceTimer = useCallback(() => {
    if (analyzeTimerRef.current) {
      clearTimeout(analyzeTimerRef.current);
      analyzeTimerRef.current = null;
    }
  }, []);

  const stopCaptureFlow = useCallback(() => {
    sessionRef.current += 1;
    stoppedRef.current = true;
    mountedRef.current = false;

    clearGuidanceTimer();

    stopSpeaking?.();
    stopTTS();

    setIsAnalyzing(false);
    setIsCapturing(false);
    setCameraReady(false);

    lastSpokenMessageRef.current = "";
    lastSpokenAtRef.current = 0;
    pauseGuidanceUntilRef.current = 0;
    lastCaptureAtRef.current = 0;
  }, [clearGuidanceTimer, stopSpeaking]);

  const speakOnce = useCallback(async (message: string) => {
    if (!message) return;
    if (!mountedRef.current) return;
    if (stoppedRef.current) return;

    const now = Date.now();
    const sameMessage = lastSpokenMessageRef.current === message;
    const tooSoon = now - lastSpokenAtRef.current < 3000;

    if (sameMessage && tooSoon) return;

    const mySession = sessionRef.current;

    lastSpokenMessageRef.current = message;
    lastSpokenAtRef.current = now;

    await translateAndSpeakPersonCapture(message, langRef.current);

    if (
      mySession !== sessionRef.current ||
      stoppedRef.current ||
      !mountedRef.current
    ) {
      stopTTS();
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    stoppedRef.current = false;

    return () => {
      stopCaptureFlow();
    };
  }, [stopCaptureFlow]);

  useEffect(() => {
    if (stoppedRef.current) return;

    if (!permission) {
      requestPermission();
      return;
    }

    if (!permission.granted) {
      void speakOnce(t("personCapture.allowCamera"));
      return;
    }

    if (!hasWelcomedRef.current) {
      hasWelcomedRef.current = true;
      const firstPrompt = getNextAnglePrompt(nextRequiredAngle);
      setCurrentInstruction(firstPrompt);
      void speakOnce(firstPrompt);
    }
  }, [
    permission,
    requestPermission,
    speakOnce,
    t,
    getNextAnglePrompt,
    nextRequiredAngle,
  ]);

  const completeFlow = useCallback(
    (finalUris: string[], finalAngles: RequiredAngle[]) => {
      if (stoppedRef.current) return;

      setCurrentInstruction(GUIDE_MESSAGES.done);
      setStatusText("5 of 5 captured");
      void speakOnce(GUIDE_MESSAGES.done);

      router.replace({
        pathname: "/person-name",
        params: {
          count: String(finalUris.length),
          imageUris: JSON.stringify(finalUris),
          capturedAngles: JSON.stringify(finalAngles),
        },
      } as any);
    },
    [router, speakOnce]
  );

  const saveCapturedPhoto = useCallback(
    async (tempUri: string, angle: RequiredAngle) => {
      if (stoppedRef.current) return;

      const fileName = `person_${angle}_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: tempUri,
        to: fileUri,
      });

      if (stoppedRef.current) return;

      const nextUris = [...capturedUris, fileUri];
      const nextAngles = [...capturedAngles, angle];

      setCapturedUris(nextUris);
      setCapturedAngles(nextAngles);
      setLastDetectedAngle(angle);
      hasDetectedFaceOnceRef.current = true;

      if (nextAngles.length >= REQUIRED_ANGLES.length) {
        completeFlow(nextUris, nextAngles);
        return;
      }

      const nextAngle =
        REQUIRED_ANGLES.find((a) => !nextAngles.includes(a)) ?? null;

      const prompt = getNextAnglePrompt(nextAngle);

      setCurrentInstruction(prompt);
      setStatusText(`${nextAngles.length} of 5 captured`);
      void speakOnce(prompt);
    },
    [capturedUris, capturedAngles, completeFlow, getNextAnglePrompt, speakOnce]
  );

  const analyzeFrameForGuidance = useCallback(
    async (base64: string): Promise<FaceGuideResponse> => {
      const requiredAngle = nextRequiredAngle;

      try {
        const response = await fetch(`${BASE_URL}/face-registration-guide`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageBase64: base64,
            requiredAngle,
            capturedAngles,
          }),
        });

        const rawText = await response.text();

        if (!response.ok) {
          throw new Error(`Guide API failed with ${response.status}: ${rawText}`);
        }

        return JSON.parse(rawText) as FaceGuideResponse;
      } catch (error) {
        console.error("[guide] fetch error:", error);

        return {
          ok: false,
          faceDetected: false,
          shouldCapture: false,
          stable: false,
          distance: "good",
          position: "centered",
          angle: "unknown",
          duplicateAngle: false,
          nextRequiredAngle: requiredAngle,
          message: GUIDE_MESSAGES.unavailable,
        };
      }
    },
    [capturedAngles, nextRequiredAngle]
  );

  const autoCapturePhoto = useCallback(
    async (angle: RequiredAngle) => {
      if (stoppedRef.current) return;

      pauseGuidanceUntilRef.current = Date.now() + 3000;
      clearGuidanceTimer();

      if (!cameraRef.current || isCapturing || !cameraReady) return;

      try {
        setIsCapturing(true);
        setCurrentInstruction(GUIDE_MESSAGES.hold_still);
        setStatusText(
          langRef.current === "ur"
            ? `${angleLabelUrduMap[angle]} محفوظ ہو رہا ہے`
            : `Saving ${angleLabelMap[angle]} angle`
        );

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: true,
          shutterSound: false,
        });

        if (stoppedRef.current) return;

        if (!photo?.uri) {
          void speakOnce("Could not capture image. Please hold still.");
          return;
        }

        lastCaptureAtRef.current = Date.now();
        pauseGuidanceUntilRef.current = Date.now() + 3000;

        await saveCapturedPhoto(photo.uri, angle);
      } catch (error) {
        if (!stoppedRef.current) {
          console.log("[autoCapturePhoto] capture error:", error);
          void speakOnce("Could not capture image. Please hold still.");
          hapticFeedback?.("error");
        }
      } finally {
        if (mountedRef.current && !stoppedRef.current) {
          setIsCapturing(false);
        }
      }
    },
    [
      cameraReady,
      clearGuidanceTimer,
      hapticFeedback,
      isCapturing,
      saveCapturedPhoto,
      speakOnce,
    ]
  );

  const handleGuideResponse = useCallback(
    async (guide: FaceGuideResponse) => {
      if (!mountedRef.current || stoppedRef.current) return;

      const remainingPrompt = getNextAnglePrompt(nextRequiredAngle);

      if (!guide.ok) {
        setCurrentInstruction(GUIDE_MESSAGES.unavailable);
        setStatusText("Waiting...");
        void speakOnce(GUIDE_MESSAGES.unavailable);
        return;
      }

      if (!guide.faceDetected) {
        setLastDetectedAngle("unknown");

        const msg =
          hasDetectedFaceOnceRef.current || capturedAngles.length > 0
            ? GUIDE_MESSAGES.no_face_recovery
            : GUIDE_MESSAGES.no_face;

        setCurrentInstruction(msg);
        setStatusText("Finding face");
        void speakOnce(msg);
        return;
      }

      hasDetectedFaceOnceRef.current = true;
      setLastDetectedAngle(guide.angle);

      if (guide.distance === "too_close") {
        setCurrentInstruction(GUIDE_MESSAGES.too_close);
        setStatusText("Too close");
        void speakOnce(GUIDE_MESSAGES.too_close);
        return;
      }

      if (guide.distance === "too_far") {
        setCurrentInstruction(GUIDE_MESSAGES.too_far);
        setStatusText("Too far");
        void speakOnce(GUIDE_MESSAGES.too_far);
        return;
      }

      if (guide.position !== "centered") {
        setCurrentInstruction(remainingPrompt);
        setStatusText("Guiding next required angle");
        void speakOnce(remainingPrompt);
        return;
      }

      if (guide.duplicateAngle && guide.angle !== "unknown") {
        setCurrentInstruction(remainingPrompt);
        setStatusText(`Already captured ${guide.angle}`);
        void speakOnce(remainingPrompt);
        return;
      }

      if (guide.angle !== "unknown" && !capturedAngles.includes(guide.angle)) {
        await autoCapturePhoto(guide.angle);
        return;
      }

      if (!guide.stable) {
        setCurrentInstruction(GUIDE_MESSAGES.hold_still);
        setStatusText("Hold still");
        void speakOnce(GUIDE_MESSAGES.hold_still);
        return;
      }

      setCurrentInstruction(remainingPrompt);
      setStatusText("Guide ready");
      void speakOnce(remainingPrompt);
    },
    [
      autoCapturePhoto,
      capturedAngles,
      getNextAnglePrompt,
      nextRequiredAngle,
      speakOnce,
    ]
  );

  const runGuidancePass = useCallback(async () => {
    if (stoppedRef.current) return;
    if (!permission?.granted || !cameraReady || isAnalyzing || isCapturing) return;
    if (!nextRequiredAngle) return;
    if (!cameraRef.current) return;

    const now = Date.now();

    if (now < pauseGuidanceUntilRef.current) return;
    if (now - lastCaptureAtRef.current < 2200) return;

    const mySession = sessionRef.current;

    try {
      setIsAnalyzing(true);

      const previewShot = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        base64: true,
        skipProcessing: true,
        shutterSound: false,
      });

      if (
        stoppedRef.current ||
        mySession !== sessionRef.current ||
        !previewShot?.base64
      ) {
        return;
      }

      const guide = await analyzeFrameForGuidance(previewShot.base64);

      if (stoppedRef.current || mySession !== sessionRef.current) return;

      await handleGuideResponse(guide);
    } catch (error: any) {
      const message = String(error?.message || error || "").toLowerCase();

      if (
        message.includes("could not be captured") ||
        message.includes("camera") ||
        message.includes("capture")
      ) {
        return;
      }

      console.log("[runGuidancePass] non-camera error:", error);
    } finally {
      if (mountedRef.current && !stoppedRef.current) {
        setIsAnalyzing(false);
      }
    }
  }, [
    permission?.granted,
    cameraReady,
    isAnalyzing,
    isCapturing,
    nextRequiredAngle,
    analyzeFrameForGuidance,
    handleGuideResponse,
  ]);

  useEffect(() => {
    clearGuidanceTimer();

    if (stoppedRef.current) return;
    if (!permission?.granted || !cameraReady) return;
    if (capturedAngles.length >= REQUIRED_ANGLES.length) return;

    let cancelled = false;

    const loop = async () => {
      if (cancelled || stoppedRef.current) return;

      await runGuidancePass();

      if (cancelled || stoppedRef.current) return;

      analyzeTimerRef.current = setTimeout(loop, 2200);
    };

    analyzeTimerRef.current = setTimeout(loop, 1200);

    return () => {
      cancelled = true;
      clearGuidanceTimer();
    };
  }, [
    permission?.granted,
    cameraReady,
    capturedAngles.length,
    runGuidancePass,
    clearGuidanceTimer,
  ]);

  const handleLanguageToggle = async () => {
    if (stoppedRef.current) return;

    const next = lang === "en" ? "ur" : "en";

    stopTTS();

    setLang(next);
    langRef.current = next;
    lastSpokenMessageRef.current = "";
    lastSpokenAtRef.current = 0;

    await i18n.changeLanguage(next);

    hapticFeedback?.("medium");

    speakUI(
      next === "ur" ? UI_URDU.switched_urdu : UI_URDU.switched_english,
      next
    );
  };

  const handleRestart = () => {
    if (stoppedRef.current) return;

    clearGuidanceTimer();

    setCapturedUris([]);
    setCapturedAngles([]);
    setCurrentInstruction(getNextAnglePrompt(REQUIRED_ANGLES[0]));
    setStatusText("Looking for face...");
    setLastDetectedAngle("unknown");

    hasDetectedFaceOnceRef.current = false;
    lastSpokenMessageRef.current = "";
    lastSpokenAtRef.current = 0;
    lastCaptureAtRef.current = 0;
    pauseGuidanceUntilRef.current = 0;

    void speakOnce("Starting again. Keep your face straight and centered.");
  };

  const goToModes = () => {
    stopCaptureFlow();

    requestAnimationFrame(() => {
      router.replace("/features");
    });
  };

  const renderCameraContent = () => {
    if (!permission) {
      return <View style={styles.cameraFallback} />;
    }

    if (!permission.granted) {
      return (
        <View
          style={[
            styles.permissionCenterOverlay,
            { backgroundColor: colors.card || colors.background },
          ]}
        >
          <AccessibleButton
            title={t("personCapture.allowCamera")}
            onPress={requestPermission}
            accessibilityLabel={t("personCapture.allowCameraLabel")}
            accessibilityHint={t("personCapture.allowCameraHint")}
            style={[
              styles.permissionButton,
              {
                backgroundColor: colors.primary,
                borderColor: colors.border,
              },
            ]}
            textStyle={{ color: onPrimary }}
          />
        </View>
      );
    }

    return (
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        accessible
        accessibilityLabel={t("personCapture.liveFeedLabel")}
        onCameraReady={() => {
          if (stoppedRef.current) return;

          setCameraReady(true);

          if (!hasWelcomedRef.current) {
            hasWelcomedRef.current = true;
            const firstPrompt = getNextAnglePrompt(nextRequiredAngle);
            setCurrentInstruction(firstPrompt);
            setStatusText("Camera ready");
            void speakOnce(firstPrompt);
          }
        }}
      />
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.ringWrap}>
          {Array.from({ length: SEGMENT_COUNT }).map((_, index) => {
            const isActive = index < progressSegments;

            return (
              <View
                key={index}
                style={[
                  styles.segment,
                  {
                    backgroundColor: isActive ? colors.primary : colors.border,
                    transform: [
                      { rotate: `${(360 / SEGMENT_COUNT) * index}deg` },
                      { translateY: -(RING_SIZE / 2 - 10) },
                    ],
                    opacity: isActive ? 1 : 0.85,
                  },
                ]}
              />
            );
          })}

          <View
            style={[
              styles.cameraCircleOuter,
              {
                width: CAMERA_SIZE,
                height: CAMERA_SIZE,
                borderRadius: CAMERA_SIZE / 2,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.cameraCircleInner,
                {
                  borderRadius: CAMERA_SIZE / 2,
                  backgroundColor: colors.card || colors.background,
                },
              ]}
            >
              {renderCameraContent()}

              <View
                pointerEvents="none"
                style={[styles.guideOval, { borderColor: colors.primary }]}
              />

              <View
                pointerEvents="none"
                style={[
                  styles.scanLine,
                  {
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                    opacity: isCapturing ? 1 : 0.75,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <AccessibleText
          style={[styles.instructions, { color: colors.text }]}
          accessibilityRole="text"
        >
          {getInstructionText(currentInstruction)}
        </AccessibleText>

        <AccessibleText style={[styles.metaText, { color: colors.text }]}>
          {lang === "ur"
            ? `${capturedAngles.length} / 5 محفوظ`
            : `${capturedAngles.length} / 5 captured`}
        </AccessibleText>

        <AccessibleText style={[styles.metaText, { color: colors.text }]}>
          {lang === "ur"
            ? `موجودہ زاویہ: ${getDisplayAngle(lastDetectedAngle)}`
            : `Current angle: ${lastDetectedAngle}`}
        </AccessibleText>

        <AccessibleText style={[styles.metaText, { color: colors.text }]}>
          {lang === "ur" ? getUrduStatus(statusText) : statusText}
        </AccessibleText>
      </View>

      <View
        style={[
          styles.bottomBar,
          {
            flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <AccessibleButton
          title={lang === "ur" ? "واپس" : t("common.modes")}
          onPress={goToModes}
          accessibilityLabel={lang === "ur" ? "واپس" : t("common.modes")}
          accessibilityHint={t("common.modesHint")}
          style={[
            styles.bottomButton,
            {
              backgroundColor: colors.card || colors.background,
              borderColor: colors.border,
            },
          ]}
          textStyle={{ color: colors.text }}
        />

        <AccessibleButton
          title={lang === "ur" ? "دوبارہ شروع کریں" : "Start Again"}
          onPress={handleRestart}
          accessibilityLabel={
            lang === "ur" ? "رجسٹریشن دوبارہ شروع کریں" : "Start registration again"
          }
          accessibilityHint={
            lang === "ur"
              ? "محفوظ زاویے ختم کر کے دوبارہ شروع کرتا ہے"
              : "Clears captured angles and starts over"
          }
          style={[
            styles.bottomButton,
            {
              backgroundColor: colors.card || colors.background,
              borderColor: colors.border,
            },
          ]}
          textStyle={{ color: colors.text }}
        />

        <AccessibleButton
          title={lang === "ur" ? "اردو" : "ENG"}
          onPress={handleLanguageToggle}
          accessibilityRole="switch"
          accessibilityState={{ checked: lang === "ur" }}
          style={[
            styles.bottomButton,
            {
              backgroundColor: colors.card || colors.background,
              borderColor: colors.border,
            },
          ]}
          textStyle={{ color: colors.text }}
        />
      </View>
    </View>
  );
};

export default PersonCaptureScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 28,
  },
  segment: {
    position: "absolute",
    width: 4,
    height: 28,
    borderRadius: 999,
  },
  cameraCircleOuter: {
    overflow: "hidden",
    borderWidth: 2,
  },
  cameraCircleInner: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  cameraFallback: {
    flex: 1,
    backgroundColor: "#111111",
  },
  permissionCenterOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  guideOval: {
    position: "absolute",
    width: "76%",
    height: "92%",
    borderWidth: 2,
    borderRadius: 999,
    alignSelf: "center",
    top: "4%",
    opacity: 0.28,
  },
  scanLine: {
    position: "absolute",
    left: "8%",
    right: "8%",
    top: "52%",
    height: 4,
    borderRadius: 999,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  instructions: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 25,
    maxWidth: 310,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 6,
    opacity: 0.9,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    gap: 12,
    borderTopWidth: 1,
  },
  bottomButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
});