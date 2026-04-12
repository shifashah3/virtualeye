// // // // // // import { AccessibleButton } from "@/components/AccessibleButton";
// // // // // // import { AccessibleText } from "@/components/AccessibleText";
// // // // // // import { useAccessibility } from "@/contexts/AccessibilityContext";
// // // // // // import { useAccessibleColors } from "@/hooks/useAccessibleColors";
// // // // // // import { Feather } from "@expo/vector-icons";
// // // // // // import { CameraView, useCameraPermissions } from "expo-camera";
// // // // // // import * as FileSystem from "expo-file-system/legacy";
// // // // // // import { useRouter } from "expo-router";
// // // // // // import { useTranslation } from "react-i18next";
// // // // // // import React, { useEffect, useMemo, useRef, useState } from "react";
// // // // // // import { StyleSheet, TouchableOpacity, View } from "react-native";

// // // // // // /** Readable on-color (black/white) */
// // // // // // const onColor = (bg: string) => {
// // // // // //   const hex = (bg || "").replace("#", "");
// // // // // //   if (hex.length !== 6) return "#000000";
// // // // // //   const r = parseInt(hex.slice(0, 2), 16) / 255;
// // // // // //   const g = parseInt(hex.slice(2, 4), 16) / 255;
// // // // // //   const b = parseInt(hex.slice(4, 6), 16) / 255;
// // // // // //   const toLin = (c: number) =>
// // // // // //     c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
// // // // // //   const L = 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
// // // // // //   return L > 0.45 ? "#000000" : "#FFFFFF";
// // // // // // };

// // // // // // const PersonCaptureScreen = () => {
// // // // // //   const router = useRouter();
// // // // // //   const { t } = useTranslation();
// // // // // //   const { speak, hapticFeedback } = useAccessibility();
// // // // // //   const colors = useAccessibleColors();

// // // // // //   const [permission, requestPermission] = useCameraPermissions();
// // // // // //   const [count, setCount] = useState(0);
// // // // // //   const [capturedUris, setCapturedUris] = useState<string[]>([]);
// // // // // //   const cameraRef = useRef<CameraView | null>(null);

// // // // // //   const onBg = useMemo(() => onColor(colors.background), [colors.background]);

// // // // // //   /** 🔊 Announcement */
// // // // // //   useEffect(() => {
// // // // // //     speak?.(t("personCapture.announcement"), true);
// // // // // //     if (!permission) requestPermission();
// // // // // //   }, [permission]);

// // // // // //   const handleCapture = async () => {
// // // // // //     if (!cameraRef.current) {
// // // // // //       speak?.(t("common.loading"), true);
// // // // // //       return;
// // // // // //     }

// // // // // //     try {
// // // // // //       hapticFeedback?.("medium");

// // // // // //       const photo = await cameraRef.current.takePictureAsync({
// // // // // //         quality: 0.7,
// // // // // //         base64: false,
// // // // // //       });

// // // // // //       if (!photo?.uri) return;

// // // // // //       const fileName = `person_photo_${Date.now()}.jpg`;
// // // // // //       const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

// // // // // //       await FileSystem.copyAsync({
// // // // // //         from: photo.uri,
// // // // // //         to: fileUri,
// // // // // //       });

// // // // // //       const next = count + 1;
// // // // // //       const newUris = [...capturedUris, fileUri];

// // // // // //       setCapturedUris(newUris);
// // // // // //       setCount(next);

// // // // // //       speak?.(t("personCapture.photoCaptured", { count: next }), true);

// // // // // //       if (next >= 5) {
// // // // // //         speak?.(t("personCapture.completed"), true);
// // // // // //         router.replace({
// // // // // //           pathname: "/person-name",
// // // // // //           params: {
// // // // // //             count: String(next),
// // // // // //             imageUris: JSON.stringify(newUris),
// // // // // //           },
// // // // // //         } as any);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.error("Capture error:", error);
// // // // // //       speak?.(t("common.loading"), true);
// // // // // //       hapticFeedback?.("error");
// // // // // //     }
// // // // // //   };

// // // // // //   const renderCamera = () => {
// // // // // //     if (!permission) return <View />;

// // // // // //     if (!permission.granted) {
// // // // // //       return (
// // // // // //         <View
// // // // // //           style={[
// // // // // //             styles.permissionCenterOverlay,
// // // // // //             { backgroundColor: colors.background },
// // // // // //           ]}
// // // // // //         >
// // // // // //           <AccessibleButton
// // // // // //             title={t("personCapture.allowCamera")}
// // // // // //             onPress={requestPermission}
// // // // // //             accessibilityLabel={t("personCapture.allowCameraLabel")}
// // // // // //             accessibilityHint={t("personCapture.allowCameraHint")}
// // // // // //             style={styles.permissionButton}
// // // // // //           />
// // // // // //         </View>
// // // // // //       );
// // // // // //     }

// // // // // //     return (
// // // // // //       <View style={[styles.cameraFrameOuter, { borderColor: colors.border }]}>
// // // // // //         <CameraView
// // // // // //           ref={cameraRef}
// // // // // //           style={styles.camera}
// // // // // //           facing="front"
// // // // // //           accessible
// // // // // //           accessibilityLabel={t("personCapture.liveFeedLabel")}
// // // // // //         />
// // // // // //       </View>
// // // // // //     );
// // // // // //   };

// // // // // //   return (
// // // // // //     <View style={[styles.root, { backgroundColor: colors.background }]}>
// // // // // //       {/* Header */}
// // // // // //       <View style={[styles.topBar, { backgroundColor: colors.primary }]}>
// // // // // //         <AccessibleText
// // // // // //           style={[styles.topTitle, { color: colors.textInverse }]}
// // // // // //           accessibilityRole="header"
// // // // // //           level={1}
// // // // // //         >
// // // // // //           {t("personCapture.title")}
// // // // // //         </AccessibleText>
// // // // // //       </View>

// // // // // //       <View style={styles.content}>
// // // // // //         <AccessibleText style={[styles.instructions, { color: onBg }]}>
// // // // // //           {t("personCapture.instructions")}
// // // // // //         </AccessibleText>

// // // // // //         {renderCamera()}

// // // // // //         <AccessibleText
// // // // // //           style={[styles.counterText, { color: onBg }]}
// // // // // //           accessibilityLabel={t("personCapture.counter", { count })}
// // // // // //         >
// // // // // //           {t("personCapture.counter", { count })}
// // // // // //         </AccessibleText>

// // // // // //         <View style={styles.captureWrapper}>
// // // // // //           <TouchableOpacity
// // // // // //             style={[
// // // // // //               styles.captureButton,
// // // // // //               {
// // // // // //                 backgroundColor: colors.primary,
// // // // // //                 borderColor: colors.textInverse,
// // // // // //               },
// // // // // //             ]}
// // // // // //             onPress={handleCapture}
// // // // // //             hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
// // // // // //             accessible
// // // // // //             accessibilityRole="button"
// // // // // //             accessibilityLabel={t("personCapture.captureLabel", {
// // // // // //               count: count + 1,
// // // // // //             })}
// // // // // //             accessibilityHint={t("personCapture.captureHint")}
// // // // // //           >
// // // // // //             <Feather name="camera" size={40} color={colors.textInverse} />
// // // // // //           </TouchableOpacity>
// // // // // //         </View>
// // // // // //       </View>
// // // // // //     </View>
// // // // // //   );
// // // // // // };

// // // // // // export default PersonCaptureScreen;

// // // // // // const styles = StyleSheet.create({
// // // // // //   root: { flex: 1 },

// // // // // //   topBar: {
// // // // // //     height: 120,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //     borderBottomLeftRadius: 8,
// // // // // //     borderBottomRightRadius: 8,
// // // // // //   },
// // // // // //   topTitle: { fontSize: 24, fontWeight: "800" },

// // // // // //   content: {
// // // // // //     flex: 1,
// // // // // //     paddingHorizontal: 20,
// // // // // //     paddingTop: 20,
// // // // // //     paddingBottom: 20,
// // // // // //   },

// // // // // //   instructions: { fontSize: 14, marginBottom: 12 },

// // // // // //   cameraFrameOuter: {
// // // // // //     flex: 1,
// // // // // //     borderRadius: 18,
// // // // // //     borderWidth: 2,
// // // // // //     overflow: "hidden",
// // // // // //     marginBottom: 16,
// // // // // //   },

// // // // // //   camera: { flex: 1 },

// // // // // //   permissionCenterOverlay: {
// // // // // //     flex: 1,
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //   },

// // // // // //   permissionButton: {
// // // // // //     paddingHorizontal: 24,
// // // // // //     paddingVertical: 16,
// // // // // //     borderRadius: 16,
// // // // // //     borderWidth: 1,
// // // // // //   },

// // // // // //   counterText: {
// // // // // //     fontSize: 14,
// // // // // //     textAlign: "center",
// // // // // //     marginBottom: 12,
// // // // // //   },

// // // // // //   captureWrapper: { alignItems: "center" },

// // // // // //   captureButton: {
// // // // // //     width: 80,
// // // // // //     height: 80,
// // // // // //     borderRadius: 40,
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     borderWidth: 4,
// // // // // //   },
// // // // // // });

// // // // // import { AccessibleButton } from "@/components/AccessibleButton";
// // // // // import { AccessibleText } from "@/components/AccessibleText";
// // // // // import { useAccessibility } from "@/contexts/AccessibilityContext";
// // // // // import { useAccessibleColors } from "@/hooks/useAccessibleColors";
// // // // // import { CameraView, useCameraPermissions } from "expo-camera";
// // // // // import * as FileSystem from "expo-file-system/legacy";
// // // // // import { useRouter } from "expo-router";
// // // // // import { useTranslation } from "react-i18next";
// // // // // import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // // // // import {
// // // // //   Dimensions,
// // // // //   I18nManager,
// // // // //   StyleSheet,
// // // // //   View,
// // // // // } from "react-native";

// // // // // const { width } = Dimensions.get("window");
// // // // // const RING_SIZE = Math.min(width * 0.88, 360);
// // // // // const CAMERA_SIZE = RING_SIZE * 0.76;
// // // // // const SEGMENT_COUNT = 60;
// // // // // const REQUIRED_ANGLES = ["front", "left", "right", "up", "down"] as const;
// // // // // type RequiredAngle = (typeof REQUIRED_ANGLES)[number];

// // // // // type FaceGuideResponse = {
// // // // //   ok: boolean;
// // // // //   faceDetected: boolean;
// // // // //   shouldCapture: boolean;
// // // // //   stable: boolean;
// // // // //   distance: "too_close" | "too_far" | "good";
// // // // //   position:
// // // // //     | "centered"
// // // // //     | "move_left"
// // // // //     | "move_right"
// // // // //     | "move_up"
// // // // //     | "move_down";
// // // // //   angle: RequiredAngle | "unknown";
// // // // //   duplicateAngle: boolean;
// // // // //   nextRequiredAngle: RequiredAngle | null;
// // // // //   message?: string;
// // // // // };

// // // // // const GUIDE_MESSAGES: Record<string, string> = {
// // // // //   no_face: "No face detected. Hold the phone in front of your face.",
// // // // //   too_close: "Move the phone a little away.",
// // // // //   too_far: "Bring the phone a little closer.",
// // // // //   move_left: "Move the phone slightly left.",
// // // // //   move_right: "Move the phone slightly right.",
// // // // //   move_up: "Move the phone slightly up.",
// // // // //   move_down: "Move the phone slightly down.",
// // // // //   hold_still: "Hold still.",
// // // // //   duplicate_front: "Front angle already captured. Turn slightly left.",
// // // // //   duplicate_left: "Left angle already captured. Turn slightly right.",
// // // // //   duplicate_right: "Right angle already captured. Lift your chin slightly.",
// // // // //   duplicate_up: "Up angle already captured. Lower your chin slightly.",
// // // // //   duplicate_down: "Down angle already captured. Face front again.",
// // // // //   next_front: "Look straight ahead.",
// // // // //   next_left: "Slowly turn a little left.",
// // // // //   next_right: "Slowly turn a little right.",
// // // // //   next_up: "Lift your chin slightly.",
// // // // //   next_down: "Lower your chin slightly.",
// // // // //   capturing: "Capturing image.",
// // // // //   done: "Registration complete.",
// // // // // };

// // // // // const angleLabelMap: Record<RequiredAngle, string> = {
// // // // //   front: "Front",
// // // // //   left: "Left",
// // // // //   right: "Right",
// // // // //   up: "Up",
// // // // //   down: "Down",
// // // // // };

// // // // // const onColor = (bg: string) => {
// // // // //   const hex = (bg || "").replace("#", "");
// // // // //   if (hex.length !== 6) return "#000000";
// // // // //   const r = parseInt(hex.slice(0, 2), 16) / 255;
// // // // //   const g = parseInt(hex.slice(2, 4), 16) / 255;
// // // // //   const b = parseInt(hex.slice(4, 6), 16) / 255;
// // // // //   const toLin = (c: number) =>
// // // // //     c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
// // // // //   const L = 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
// // // // //   return L > 0.45 ? "#000000" : "#FFFFFF";
// // // // // };

// // // // // const PersonCaptureScreen = () => {
// // // // //   const router = useRouter();
// // // // //   const { t } = useTranslation();
// // // // //   const { speak, hapticFeedback } = useAccessibility();
// // // // //   const colors = useAccessibleColors();

// // // // //   const [permission, requestPermission] = useCameraPermissions();
// // // // //   const [cameraReady, setCameraReady] = useState(false);
// // // // //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// // // // //   const [isCapturing, setIsCapturing] = useState(false);

// // // // //   const [capturedUris, setCapturedUris] = useState<string[]>([]);
// // // // //   const [capturedAngles, setCapturedAngles] = useState<RequiredAngle[]>([]);
// // // // //   const [currentInstruction, setCurrentInstruction] = useState(
// // // // //     "Hold the phone in front of your face."
// // // // //   );
// // // // //   const [statusText, setStatusText] = useState("Looking for face...");
// // // // //   const [lastDetectedAngle, setLastDetectedAngle] = useState<string>("unknown");

// // // // //   const cameraRef = useRef<CameraView | null>(null);
// // // // //   const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
// // // // //   const announceCooldownRef = useRef<string>("");
// // // // //   const mountedRef = useRef(true);

// // // // //   const onPrimary = useMemo(() => onColor(colors.primary), [colors.primary]);

// // // // //   const progressSegments = useMemo(() => {
// // // // //     return Math.round((capturedAngles.length / REQUIRED_ANGLES.length) * SEGMENT_COUNT);
// // // // //   }, [capturedAngles.length]);

// // // // //   const nextRequiredAngle = useMemo(() => {
// // // // //     return REQUIRED_ANGLES.find((a) => !capturedAngles.includes(a)) ?? null;
// // // // //   }, [capturedAngles]);

// // // // //   const announce = useCallback(
// // // // //     (message: string) => {
// // // // //       if (!message) return;
// // // // //       if (announceCooldownRef.current === message) return;
// // // // //       announceCooldownRef.current = message;
// // // // //       speak?.(message, true);

// // // // //       setTimeout(() => {
// // // // //         if (announceCooldownRef.current === message) {
// // // // //           announceCooldownRef.current = "";
// // // // //         }
// // // // //       }, 1200);
// // // // //     },
// // // // //     [speak]
// // // // //   );

// // // // //   useEffect(() => {
// // // // //     mountedRef.current = true;
// // // // //     return () => {
// // // // //       mountedRef.current = false;
// // // // //       if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
// // // // //     };
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     if (!permission) {
// // // // //       requestPermission();
// // // // //       return;
// // // // //     }
// // // // //     if (!permission.granted) {
// // // // //       announce(t("personCapture.allowCamera"));
// // // // //       return;
// // // // //     }
// // // // //     announce("Hold the phone in front of your face.");
// // // // //   }, [permission, requestPermission, announce, t]);

// // // // //   const getNextAnglePrompt = useCallback((angle: RequiredAngle | null) => {
// // // // //     if (!angle) return GUIDE_MESSAGES.done;
// // // // //     return GUIDE_MESSAGES[`next_${angle}`] ?? "Adjust your face.";
// // // // //   }, []);

// // // // //   const completeFlow = useCallback(
// // // // //     (finalUris: string[], finalAngles: RequiredAngle[]) => {
// // // // //       setCurrentInstruction(GUIDE_MESSAGES.done);
// // // // //       setStatusText("5 of 5 captured");
// // // // //       announce(GUIDE_MESSAGES.done);

// // // // //       router.replace({
// // // // //         pathname: "/person-name",
// // // // //         params: {
// // // // //           count: String(finalUris.length),
// // // // //           imageUris: JSON.stringify(finalUris),
// // // // //           capturedAngles: JSON.stringify(finalAngles),
// // // // //         },
// // // // //       } as any);
// // // // //     },
// // // // //     [announce, router]
// // // // //   );

// // // // //   const saveCapturedPhoto = useCallback(
// // // // //     async (tempUri: string, angle: RequiredAngle) => {
// // // // //       const fileName = `person_${angle}_${Date.now()}.jpg`;
// // // // //       const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

// // // // //       await FileSystem.copyAsync({
// // // // //         from: tempUri,
// // // // //         to: fileUri,
// // // // //       });

// // // // //       const nextUris = [...capturedUris, fileUri];
// // // // //       const nextAngles = [...capturedAngles, angle];

// // // // //       setCapturedUris(nextUris);
// // // // //       setCapturedAngles(nextAngles);
// // // // //       setLastDetectedAngle(angle);

// // // // //       if (nextAngles.length >= REQUIRED_ANGLES.length) {
// // // // //         completeFlow(nextUris, nextAngles);
// // // // //         return;
// // // // //       }

// // // // //       const nextAngle = REQUIRED_ANGLES.find((a) => !nextAngles.includes(a)) ?? null;
// // // // //       const prompt = getNextAnglePrompt(nextAngle);
// // // // //       setCurrentInstruction(prompt);
// // // // //       setStatusText(`${nextAngles.length} of 5 captured`);
// // // // //       announce(prompt);
// // // // //     },
// // // // //     [announce, capturedAngles, capturedUris, completeFlow, getNextAnglePrompt]
// // // // //   );

// // // // //   /**
// // // // //    * BACKEND CONTRACT:
// // // // //    * POST /face-registration-guide
// // // // //    * body: { imageBase64, requiredAngle, capturedAngles }
// // // // //    * returns FaceGuideResponse
// // // // //    */
// // // // //   const analyzeFrameForGuidance = useCallback(
// // // // //     async (base64: string): Promise<FaceGuideResponse> => {
// // // // //       const requiredAngle = nextRequiredAngle;

// // // // //       const BASE_URL = "http://localhost:8000";

// // // // //       try {
// // // // //         const response = await fetch(`${BASE_URL}/face-registration-guide`, {
// // // // //           method: "POST",
// // // // //           headers: {
// // // // //             "Content-Type": "application/json",
// // // // //           },
// // // // //           body: JSON.stringify({
// // // // //             imageBase64: base64,
// // // // //             requiredAngle,
// // // // //             capturedAngles,
// // // // //           }),
// // // // //         });

// // // // //         if (!response.ok) {
// // // // //           throw new Error(`Guide API failed with ${response.status}`);
// // // // //         }

// // // // //         return (await response.json()) as FaceGuideResponse;
// // // // //       } catch (error) {
// // // // //         console.error("Guide API error:", error);

// // // // //         return {
// // // // //           ok: false,
// // // // //           faceDetected: false,
// // // // //           shouldCapture: false,
// // // // //           stable: false,
// // // // //           distance: "good",
// // // // //           position: "centered",
// // // // //           angle: "unknown",
// // // // //           duplicateAngle: false,
// // // // //           nextRequiredAngle,
// // // // //           message: "Guide service unavailable.",
// // // // //         };
// // // // //       }
// // // // //     },
// // // // //     [capturedAngles, nextRequiredAngle]
// // // // //   );

// // // // //   const autoCapturePhoto = useCallback(
// // // // //     async (angle: RequiredAngle) => {
// // // // //       if (!cameraRef.current || isCapturing || !cameraReady) return;

// // // // //       try {
// // // // //         setIsCapturing(true);
// // // // //         setCurrentInstruction(GUIDE_MESSAGES.capturing);
// // // // //         setStatusText(`Capturing ${angleLabelMap[angle]} angle`);
// // // // //         announce(GUIDE_MESSAGES.capturing);
// // // // //         hapticFeedback?.("medium");

// // // // //         const photo = await cameraRef.current.takePictureAsync({
// // // // //           quality: 0.7,
// // // // //           base64: false,
// // // // //           skipProcessing: true,
// // // // //         });

// // // // //         if (!photo?.uri) return;
// // // // //         await saveCapturedPhoto(photo.uri, angle);
// // // // //       } catch (error) {
// // // // //         console.error("Auto capture error:", error);
// // // // //         announce("Could not capture image. Please hold still.");
// // // // //         hapticFeedback?.("error");
// // // // //       } finally {
// // // // //         if (mountedRef.current) {
// // // // //           setIsCapturing(false);
// // // // //         }
// // // // //       }
// // // // //     },
// // // // //     [announce, cameraReady, hapticFeedback, isCapturing, saveCapturedPhoto]
// // // // //   );

// // // // //   const handleGuideResponse = useCallback(
// // // // //     async (guide: FaceGuideResponse) => {
// // // // //       if (!mountedRef.current) return;

// // // // //       if (!guide.ok) {
// // // // //         setCurrentInstruction("Guide service unavailable.");
// // // // //         setStatusText("Waiting...");
// // // // //         return;
// // // // //       }

// // // // //       if (!guide.faceDetected) {
// // // // //         setCurrentInstruction(GUIDE_MESSAGES.no_face);
// // // // //         setStatusText("No face detected");
// // // // //         announce(GUIDE_MESSAGES.no_face);
// // // // //         return;
// // // // //       }

// // // // //       setLastDetectedAngle(guide.angle);

// // // // //       if (guide.distance === "too_close") {
// // // // //         setCurrentInstruction(GUIDE_MESSAGES.too_close);
// // // // //         setStatusText("Too close");
// // // // //         announce(GUIDE_MESSAGES.too_close);
// // // // //         return;
// // // // //       }

// // // // //       if (guide.distance === "too_far") {
// // // // //         setCurrentInstruction(GUIDE_MESSAGES.too_far);
// // // // //         setStatusText("Too far");
// // // // //         announce(GUIDE_MESSAGES.too_far);
// // // // //         return;
// // // // //       }

// // // // //       if (guide.position !== "centered") {
// // // // //         const msg = GUIDE_MESSAGES[guide.position] ?? "Adjust position.";
// // // // //         setCurrentInstruction(msg);
// // // // //         setStatusText("Adjusting position");
// // // // //         announce(msg);
// // // // //         return;
// // // // //       }

// // // // //       if (guide.duplicateAngle && guide.angle !== "unknown") {
// // // // //         const duplicateMsg =
// // // // //           GUIDE_MESSAGES[`duplicate_${guide.angle}`] ||
// // // // //           getNextAnglePrompt(guide.nextRequiredAngle);
// // // // //         setCurrentInstruction(duplicateMsg);
// // // // //         setStatusText(`Duplicate ${guide.angle} angle`);
// // // // //         announce(duplicateMsg);
// // // // //         return;
// // // // //       }

// // // // //       if (!guide.stable) {
// // // // //         setCurrentInstruction(GUIDE_MESSAGES.hold_still);
// // // // //         setStatusText("Hold still");
// // // // //         announce(GUIDE_MESSAGES.hold_still);
// // // // //         return;
// // // // //       }

// // // // //       if (
// // // // //         guide.shouldCapture &&
// // // // //         guide.angle !== "unknown" &&
// // // // //         !capturedAngles.includes(guide.angle)
// // // // //       ) {
// // // // //         await autoCapturePhoto(guide.angle);
// // // // //         return;
// // // // //       }

// // // // //       const prompt = getNextAnglePrompt(guide.nextRequiredAngle);
// // // // //       setCurrentInstruction(prompt);
// // // // //       setStatusText("Face aligned");
// // // // //       announce(prompt);
// // // // //     },
// // // // //     [announce, autoCapturePhoto, capturedAngles, getNextAnglePrompt]
// // // // //   );

// // // // //   const runGuidancePass = useCallback(async () => {
// // // // //     if (!permission?.granted || !cameraReady || isAnalyzing || isCapturing) return;
// // // // //     if (!nextRequiredAngle) return;
// // // // //     if (!cameraRef.current) return;

// // // // //     try {
// // // // //       setIsAnalyzing(true);

// // // // //       const previewShot = await cameraRef.current.takePictureAsync({
// // // // //         quality: 0.25,
// // // // //         base64: true,
// // // // //         skipProcessing: true,
// // // // //       });

// // // // //       if (!previewShot?.base64) return;

// // // // //       const guide = await analyzeFrameForGuidance(previewShot.base64);
// // // // //       await handleGuideResponse(guide);
// // // // //     } catch (error) {
// // // // //       console.error("Guidance pass error:", error);
// // // // //     } finally {
// // // // //       if (mountedRef.current) {
// // // // //         setIsAnalyzing(false);
// // // // //       }
// // // // //     }
// // // // //   }, [
// // // // //     analyzeFrameForGuidance,
// // // // //     cameraReady,
// // // // //     handleGuideResponse,
// // // // //     isAnalyzing,
// // // // //     isCapturing,
// // // // //     nextRequiredAngle,
// // // // //     permission?.granted,
// // // // //   ]);

// // // // //   useEffect(() => {
// // // // //     if (!permission?.granted || !cameraReady) return;
// // // // //     if (capturedAngles.length >= REQUIRED_ANGLES.length) return;

// // // // //     const loop = () => {
// // // // //       runGuidancePass();
// // // // //       analyzeTimerRef.current = setTimeout(loop, 1400);
// // // // //     };

// // // // //     analyzeTimerRef.current = setTimeout(loop, 1200);

// // // // //     return () => {
// // // // //       if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
// // // // //     };
// // // // //   }, [permission?.granted, cameraReady, capturedAngles.length, runGuidancePass]);

// // // // //   const handleRestart = () => {
// // // // //     if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
// // // // //     setCapturedUris([]);
// // // // //     setCapturedAngles([]);
// // // // //     setCurrentInstruction("Hold the phone in front of your face.");
// // // // //     setStatusText("Looking for face...");
// // // // //     setLastDetectedAngle("unknown");
// // // // //     announce("Starting again.");
// // // // //   };

// // // // //   const renderCameraContent = () => {
// // // // //     if (!permission) {
// // // // //       return <View style={styles.cameraFallback} />;
// // // // //     }

// // // // //     if (!permission.granted) {
// // // // //       return (
// // // // //         <View
// // // // //           style={[
// // // // //             styles.permissionCenterOverlay,
// // // // //             { backgroundColor: colors.card || colors.background },
// // // // //           ]}
// // // // //         >
// // // // //           <AccessibleButton
// // // // //             title={t("personCapture.allowCamera")}
// // // // //             onPress={requestPermission}
// // // // //             accessibilityLabel={t("personCapture.allowCameraLabel")}
// // // // //             accessibilityHint={t("personCapture.allowCameraHint")}
// // // // //             style={[
// // // // //               styles.permissionButton,
// // // // //               {
// // // // //                 backgroundColor: colors.primary,
// // // // //                 borderColor: colors.border,
// // // // //               },
// // // // //             ]}
// // // // //             textStyle={{ color: onPrimary }}
// // // // //           />
// // // // //         </View>
// // // // //       );
// // // // //     }

// // // // //     return (
// // // // //       <CameraView
// // // // //         ref={cameraRef}
// // // // //         style={styles.camera}
// // // // //         facing="front"
// // // // //         accessible
// // // // //         accessibilityLabel={t("personCapture.liveFeedLabel")}
// // // // //         onCameraReady={() => {
// // // // //           setCameraReady(true);
// // // // //           setCurrentInstruction("Look straight ahead.");
// // // // //           setStatusText("Camera ready");
// // // // //         }}
// // // // //       />
// // // // //     );
// // // // //   };

// // // // //   return (
// // // // //     <View style={[styles.root, { backgroundColor: colors.background }]}>
// // // // //       <View style={styles.content}>
// // // // //         <View style={styles.ringWrap}>
// // // // //           {Array.from({ length: SEGMENT_COUNT }).map((_, index) => {
// // // // //             const isActive = index < progressSegments;
// // // // //             return (
// // // // //               <View
// // // // //                 key={index}
// // // // //                 style={[
// // // // //                   styles.segment,
// // // // //                   {
// // // // //                     backgroundColor: isActive ? colors.primary : colors.border,
// // // // //                     transform: [
// // // // //                       { rotate: `${(360 / SEGMENT_COUNT) * index}deg` },
// // // // //                       { translateY: -(RING_SIZE / 2 - 10) },
// // // // //                     ],
// // // // //                     opacity: isActive ? 1 : 0.85,
// // // // //                   },
// // // // //                 ]}
// // // // //               />
// // // // //             );
// // // // //           })}

// // // // //           <View
// // // // //             style={[
// // // // //               styles.cameraCircleOuter,
// // // // //               {
// // // // //                 width: CAMERA_SIZE,
// // // // //                 height: CAMERA_SIZE,
// // // // //                 borderRadius: CAMERA_SIZE / 2,
// // // // //                 borderColor: colors.border,
// // // // //               },
// // // // //             ]}
// // // // //           >
// // // // //             <View
// // // // //               style={[
// // // // //                 styles.cameraCircleInner,
// // // // //                 {
// // // // //                   borderRadius: CAMERA_SIZE / 2,
// // // // //                   backgroundColor: colors.card || colors.background,
// // // // //                 },
// // // // //               ]}
// // // // //             >
// // // // //               {renderCameraContent()}

// // // // //               <View
// // // // //                 pointerEvents="none"
// // // // //                 style={[
// // // // //                   styles.guideOval,
// // // // //                   {
// // // // //                     borderColor: colors.primary,
// // // // //                   },
// // // // //                 ]}
// // // // //               />

// // // // //               <View
// // // // //                 pointerEvents="none"
// // // // //                 style={[
// // // // //                   styles.scanLine,
// // // // //                   {
// // // // //                     backgroundColor: colors.primary,
// // // // //                     shadowColor: colors.primary,
// // // // //                     opacity: isCapturing ? 1 : 0.75,
// // // // //                   },
// // // // //                 ]}
// // // // //               />
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>

// // // // //         <AccessibleText
// // // // //           style={[styles.instructions, { color: colors.text }]}
// // // // //           accessibilityRole="text"
// // // // //         >
// // // // //           {currentInstruction}
// // // // //         </AccessibleText>

// // // // //         <AccessibleText
// // // // //           style={[styles.metaText, { color: colors.text }]}
// // // // //         >
// // // // //           {capturedAngles.length} / 5 captured
// // // // //         </AccessibleText>

// // // // //         <AccessibleText
// // // // //           style={[styles.metaText, { color: colors.text }]}
// // // // //         >
// // // // //           Current angle: {lastDetectedAngle}
// // // // //         </AccessibleText>

// // // // //         <AccessibleText
// // // // //           style={[styles.metaText, { color: colors.text }]}
// // // // //         >
// // // // //           {statusText}
// // // // //         </AccessibleText>
// // // // //       </View>

// // // // //       <View
// // // // //         style={[
// // // // //           styles.bottomBar,
// // // // //           {
// // // // //             flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
// // // // //             borderTopColor: colors.border,
// // // // //             backgroundColor: colors.background,
// // // // //           },
// // // // //         ]}
// // // // //       >
// // // // //         <AccessibleButton
// // // // //           title={t("common.modes")}
// // // // //           onPress={() => router.push("/features")}
// // // // //           accessibilityLabel={t("common.modes")}
// // // // //           accessibilityHint={t("common.modesHint")}
// // // // //           style={[
// // // // //             styles.bottomButton,
// // // // //             {
// // // // //               backgroundColor: colors.card || colors.background,
// // // // //               borderColor: colors.border,
// // // // //             },
// // // // //           ]}
// // // // //           textStyle={{ color: colors.text }}
// // // // //         />

// // // // //         <AccessibleButton
// // // // //           title="Start Again"
// // // // //           onPress={handleRestart}
// // // // //           accessibilityLabel="Start registration again"
// // // // //           accessibilityHint="Clears captured angles and starts over"
// // // // //           style={[
// // // // //             styles.bottomButton,
// // // // //             {
// // // // //               backgroundColor: colors.card || colors.background,
// // // // //               borderColor: colors.border,
// // // // //             },
// // // // //           ]}
// // // // //           textStyle={{ color: colors.text }}
// // // // //         />
// // // // //       </View>
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // export default PersonCaptureScreen;

// // // // // const styles = StyleSheet.create({
// // // // //   root: {
// // // // //     flex: 1,
// // // // //   },

// // // // //   content: {
// // // // //     flex: 1,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     paddingHorizontal: 20,
// // // // //     paddingTop: 24,
// // // // //     paddingBottom: 12,
// // // // //   },

// // // // //   ringWrap: {
// // // // //     width: RING_SIZE,
// // // // //     height: RING_SIZE,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     position: "relative",
// // // // //     marginBottom: 28,
// // // // //   },

// // // // //   segment: {
// // // // //     position: "absolute",
// // // // //     width: 4,
// // // // //     height: 28,
// // // // //     borderRadius: 999,
// // // // //   },

// // // // //   cameraCircleOuter: {
// // // // //     overflow: "hidden",
// // // // //     borderWidth: 2,
// // // // //   },

// // // // //   cameraCircleInner: {
// // // // //     flex: 1,
// // // // //     overflow: "hidden",
// // // // //     position: "relative",
// // // // //   },

// // // // //   camera: {
// // // // //     flex: 1,
// // // // //   },

// // // // //   cameraFallback: {
// // // // //     flex: 1,
// // // // //     backgroundColor: "#111111",
// // // // //   },

// // // // //   permissionCenterOverlay: {
// // // // //     flex: 1,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     paddingHorizontal: 20,
// // // // //   },

// // // // //   permissionButton: {
// // // // //     paddingHorizontal: 24,
// // // // //     paddingVertical: 16,
// // // // //     borderRadius: 16,
// // // // //     borderWidth: 1,
// // // // //   },

// // // // //   guideOval: {
// // // // //     position: "absolute",
// // // // //     width: "76%",
// // // // //     height: "92%",
// // // // //     borderWidth: 2,
// // // // //     borderRadius: 999,
// // // // //     alignSelf: "center",
// // // // //     top: "4%",
// // // // //     opacity: 0.28,
// // // // //   },

// // // // //   scanLine: {
// // // // //     position: "absolute",
// // // // //     left: "8%",
// // // // //     right: "8%",
// // // // //     top: "52%",
// // // // //     height: 4,
// // // // //     borderRadius: 999,
// // // // //     shadowOpacity: 0.45,
// // // // //     shadowRadius: 10,
// // // // //     elevation: 6,
// // // // //   },

// // // // //   instructions: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: "800",
// // // // //     textAlign: "center",
// // // // //     lineHeight: 25,
// // // // //     maxWidth: 310,
// // // // //     marginBottom: 12,
// // // // //   },

// // // // //   metaText: {
// // // // //     fontSize: 14,
// // // // //     textAlign: "center",
// // // // //     marginBottom: 6,
// // // // //     opacity: 0.9,
// // // // //   },

// // // // //   bottomBar: {
// // // // //     paddingHorizontal: 20,
// // // // //     paddingTop: 12,
// // // // //     paddingBottom: 18,
// // // // //     gap: 12,
// // // // //     borderTopWidth: 1,
// // // // //   },

// // // // //   bottomButton: {
// // // // //     flex: 1,
// // // // //     minHeight: 58,
// // // // //     borderRadius: 18,
// // // // //     borderWidth: 1.5,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginHorizontal: 4,
// // // // //   },
// // // // // });
// // // // import { AccessibleButton } from "@/components/AccessibleButton";
// // // // import { AccessibleText } from "@/components/AccessibleText";
// // // // import { useAccessibility } from "@/contexts/AccessibilityContext";
// // // // import { useAccessibleColors } from "@/hooks/useAccessibleColors";
// // // // import { CameraView, useCameraPermissions } from "expo-camera";
// // // // import * as FileSystem from "expo-file-system/legacy";
// // // // import { useRouter } from "expo-router";
// // // // import { useTranslation } from "react-i18next";
// // // // import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // // // import {
// // // //   Dimensions,
// // // //   I18nManager,
// // // //   StyleSheet,
// // // //   View,
// // // // } from "react-native";

// // // // const { width } = Dimensions.get("window");
// // // // const RING_SIZE = Math.min(width * 0.88, 360);
// // // // const CAMERA_SIZE = RING_SIZE * 0.76;
// // // // const SEGMENT_COUNT = 60;

// // // // const REQUIRED_ANGLES = ["front", "left", "right", "up", "down"] as const;
// // // // type RequiredAngle = (typeof REQUIRED_ANGLES)[number];

// // // // type FaceGuideResponse = {
// // // //   ok: boolean;
// // // //   faceDetected: boolean;
// // // //   shouldCapture: boolean;
// // // //   stable: boolean;
// // // //   distance: "too_close" | "too_far" | "good";
// // // //   position: "centered" | "move_left" | "move_right" | "move_up" | "move_down";
// // // //   angle: RequiredAngle | "unknown";
// // // //   duplicateAngle: boolean;
// // // //   nextRequiredAngle: RequiredAngle | null;
// // // //   message?: string;
// // // // };

// // // // const GUIDE_MESSAGES: Record<string, string> = {
// // // //   no_face: "No face detected. Hold the phone in front of your face.",
// // // //   too_close: "Move the phone a little away.",
// // // //   too_far: "Bring the phone a little closer.",
// // // //   move_left: "Move the phone slightly left.",
// // // //   move_right: "Move the phone slightly right.",
// // // //   move_up: "Move the phone slightly up.",
// // // //   move_down: "Move the phone slightly down.",
// // // //   hold_still: "Hold still.",
// // // //   duplicate_front: "Front angle already captured. Turn slightly left.",
// // // //   duplicate_left: "Left angle already captured. Turn slightly right.",
// // // //   duplicate_right: "Right angle already captured. Lift your chin slightly.",
// // // //   duplicate_up: "Up angle already captured. Lower your chin slightly.",
// // // //   duplicate_down: "Down angle already captured. Face front again.",
// // // //   next_front: "Look straight ahead.",
// // // //   next_left: "Slowly turn a little left.",
// // // //   next_right: "Slowly turn a little right.",
// // // //   next_up: "Lift your chin slightly.",
// // // //   next_down: "Lower your chin slightly.",
// // // //   capturing: "Capturing image.",
// // // //   done: "Registration complete.",
// // // //   unavailable: "Guide service unavailable.",
// // // // };

// // // // const angleLabelMap: Record<RequiredAngle, string> = {
// // // //   front: "Front",
// // // //   left: "Left",
// // // //   right: "Right",
// // // //   up: "Up",
// // // //   down: "Down",
// // // // };

// // // // const onColor = (bg: string) => {
// // // //   const hex = (bg || "").replace("#", "");
// // // //   if (hex.length !== 6) return "#000000";
// // // //   const r = parseInt(hex.slice(0, 2), 16) / 255;
// // // //   const g = parseInt(hex.slice(2, 4), 16) / 255;
// // // //   const b = parseInt(hex.slice(4, 6), 16) / 255;
// // // //   const toLin = (c: number) =>
// // // //     c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
// // // //   const L = 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
// // // //   return L > 0.45 ? "#000000" : "#FFFFFF";
// // // // };

// // // // const BASE_URL = "http://192.168.18.206:8000"; // <-- change this for real phone

// // // // const PersonCaptureScreen = () => {
// // // //   const router = useRouter();
// // // //   const { t } = useTranslation();
// // // //   const { speak, hapticFeedback } = useAccessibility();
// // // //   const colors = useAccessibleColors();

// // // //   const [permission, requestPermission] = useCameraPermissions();
// // // //   const [cameraReady, setCameraReady] = useState(false);
// // // //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// // // //   const [isCapturing, setIsCapturing] = useState(false);

// // // //   const [capturedUris, setCapturedUris] = useState<string[]>([]);
// // // //   const [capturedAngles, setCapturedAngles] = useState<RequiredAngle[]>([]);
// // // //   const [currentInstruction, setCurrentInstruction] = useState("Hold the phone in front of your face.");
// // // //   const [statusText, setStatusText] = useState("Looking for face...");
// // // //   const [lastDetectedAngle, setLastDetectedAngle] = useState<string>("unknown");

// // // //   const cameraRef = useRef<CameraView | null>(null);
// // // //   const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
// // // //   const mountedRef = useRef(true);

// // // //   const lastSpokenMessageRef = useRef("");
// // // //   const lastSpokenAtRef = useRef(0);

// // // //   const onPrimary = useMemo(() => onColor(colors.primary), [colors.primary]);

// // // //   const progressSegments = useMemo(() => {
// // // //     return Math.round((capturedAngles.length / REQUIRED_ANGLES.length) * SEGMENT_COUNT);
// // // //   }, [capturedAngles.length]);

// // // //   const nextRequiredAngle = useMemo(() => {
// // // //     return REQUIRED_ANGLES.find((a) => !capturedAngles.includes(a)) ?? null;
// // // //   }, [capturedAngles]);

// // // //   const speakOnce = useCallback(
// // // //     (message: string) => {
// // // //       if (!message) return;

// // // //       const now = Date.now();
// // // //       const isSame = lastSpokenMessageRef.current === message;
// // // //       const tooSoon = now - lastSpokenAtRef.current < 1800;

// // // //       if (isSame && tooSoon) return;

// // // //       lastSpokenMessageRef.current = message;
// // // //       lastSpokenAtRef.current = now;
// // // //       speak?.(message, true);
// // // //     },
// // // //     [speak]
// // // //   );

// // // //   useEffect(() => {
// // // //     mountedRef.current = true;
// // // //     return () => {
// // // //       mountedRef.current = false;
// // // //       if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
// // // //     };
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     if (!permission) {
// // // //       requestPermission();
// // // //       return;
// // // //     }

// // // //     if (!permission.granted) {
// // // //       speakOnce(t("personCapture.allowCamera"));
// // // //       return;
// // // //     }

// // // //     speakOnce("Hold the phone in front of your face.");
// // // //   }, [permission, requestPermission, speakOnce, t]);

// // // //   const getNextAnglePrompt = useCallback((angle: RequiredAngle | null) => {
// // // //     if (!angle) return GUIDE_MESSAGES.done;
// // // //     return GUIDE_MESSAGES[`next_${angle}`] ?? "Adjust your face.";
// // // //   }, []);

// // // //   const completeFlow = useCallback(
// // // //     (finalUris: string[], finalAngles: RequiredAngle[]) => {
// // // //       setCurrentInstruction(GUIDE_MESSAGES.done);
// // // //       setStatusText("5 of 5 captured");
// // // //       speakOnce(GUIDE_MESSAGES.done);

// // // //       router.replace({
// // // //         pathname: "/person-name",
// // // //         params: {
// // // //           count: String(finalUris.length),
// // // //           imageUris: JSON.stringify(finalUris),
// // // //           capturedAngles: JSON.stringify(finalAngles),
// // // //         },
// // // //       } as any);
// // // //     },
// // // //     [router, speakOnce]
// // // //   );

// // // //   const saveCapturedPhoto = useCallback(
// // // //     async (tempUri: string, angle: RequiredAngle) => {
// // // //       const fileName = `person_${angle}_${Date.now()}.jpg`;
// // // //       const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

// // // //       await FileSystem.copyAsync({
// // // //         from: tempUri,
// // // //         to: fileUri,
// // // //       });

// // // //       const nextUris = [...capturedUris, fileUri];
// // // //       const nextAngles = [...capturedAngles, angle];

// // // //       setCapturedUris(nextUris);
// // // //       setCapturedAngles(nextAngles);
// // // //       setLastDetectedAngle(angle);

// // // //       if (nextAngles.length >= REQUIRED_ANGLES.length) {
// // // //         completeFlow(nextUris, nextAngles);
// // // //         return;
// // // //       }

// // // //       const nextAngle = REQUIRED_ANGLES.find((a) => !nextAngles.includes(a)) ?? null;
// // // //       const prompt = getNextAnglePrompt(nextAngle);
// // // //       setCurrentInstruction(prompt);
// // // //       setStatusText(`${nextAngles.length} of 5 captured`);
// // // //       speakOnce(prompt);
// // // //     },
// // // //     [capturedUris, capturedAngles, completeFlow, getNextAnglePrompt, speakOnce]
// // // //   );

// // // //   const analyzeFrameForGuidance = useCallback(
// // // //     async (base64: string): Promise<FaceGuideResponse> => {
// // // //       const requiredAngle = nextRequiredAngle;

// // // //       try {
// // // //         const response = await fetch(`${BASE_URL}/face-registration-guide`, {
// // // //           method: "POST",
// // // //           headers: {
// // // //             "Content-Type": "application/json",
// // // //           },
// // // //           body: JSON.stringify({
// // // //             imageBase64: base64,
// // // //             requiredAngle,
// // // //             capturedAngles,
// // // //           }),
// // // //         });

// // // //         if (!response.ok) {
// // // //           throw new Error(`Guide API failed with ${response.status}`);
// // // //         }

// // // //         return (await response.json()) as FaceGuideResponse;
// // // //       } catch (error) {
// // // //         console.error("Guide API error:", error);
// // // //         return {
// // // //           ok: false,
// // // //           faceDetected: false,
// // // //           shouldCapture: false,
// // // //           stable: false,
// // // //           distance: "good",
// // // //           position: "centered",
// // // //           angle: "unknown",
// // // //           duplicateAngle: false,
// // // //           nextRequiredAngle,
// // // //           message: GUIDE_MESSAGES.unavailable,
// // // //         };
// // // //       }
// // // //     },
// // // //     [capturedAngles, nextRequiredAngle]
// // // //   );

// // // //   const autoCapturePhoto = useCallback(
// // // //     async (angle: RequiredAngle) => {
// // // //       if (!cameraRef.current || isCapturing || !cameraReady) return;

// // // //       try {
// // // //         setIsCapturing(true);
// // // //         setCurrentInstruction(GUIDE_MESSAGES.capturing);
// // // //         setStatusText(`Capturing ${angleLabelMap[angle]} angle`);
// // // //         speakOnce(GUIDE_MESSAGES.capturing);
// // // //         hapticFeedback?.("medium");

// // // //         const photo = await cameraRef.current.takePictureAsync({
// // // //           quality: 0.8,
// // // //           base64: false,
// // // //           skipProcessing: false,
// // // //         });

// // // //         if (!photo?.uri) return;
// // // //         await saveCapturedPhoto(photo.uri, angle);
// // // //       } catch (error) {
// // // //         console.error("Auto capture error:", error);
// // // //         speakOnce("Could not capture image. Please hold still.");
// // // //         hapticFeedback?.("error");
// // // //       } finally {
// // // //         if (mountedRef.current) {
// // // //           setIsCapturing(false);
// // // //         }
// // // //       }
// // // //     },
// // // //     [cameraReady, hapticFeedback, isCapturing, saveCapturedPhoto, speakOnce]
// // // //   );

// // // //   const handleGuideResponse = useCallback(
// // // //     async (guide: FaceGuideResponse) => {
// // // //       if (!mountedRef.current) return;

// // // //       if (!guide.ok) {
// // // //         setCurrentInstruction(guide.message || GUIDE_MESSAGES.unavailable);
// // // //         setStatusText("Waiting...");
// // // //         speakOnce(guide.message || GUIDE_MESSAGES.unavailable);
// // // //         return;
// // // //       }

// // // //       if (!guide.faceDetected) {
// // // //         setCurrentInstruction(GUIDE_MESSAGES.no_face);
// // // //         setStatusText("No face detected");
// // // //         speakOnce(GUIDE_MESSAGES.no_face);
// // // //         return;
// // // //       }

// // // //       setLastDetectedAngle(guide.angle);

// // // //       if (guide.distance === "too_close") {
// // // //         setCurrentInstruction(GUIDE_MESSAGES.too_close);
// // // //         setStatusText("Too close");
// // // //         speakOnce(GUIDE_MESSAGES.too_close);
// // // //         return;
// // // //       }

// // // //       if (guide.distance === "too_far") {
// // // //         setCurrentInstruction(GUIDE_MESSAGES.too_far);
// // // //         setStatusText("Too far");
// // // //         speakOnce(GUIDE_MESSAGES.too_far);
// // // //         return;
// // // //       }

// // // //       if (guide.position !== "centered") {
// // // //         const msg = GUIDE_MESSAGES[guide.position] ?? "Adjust position.";
// // // //         setCurrentInstruction(msg);
// // // //         setStatusText("Adjusting position");
// // // //         speakOnce(msg);
// // // //         return;
// // // //       }

// // // //       if (guide.duplicateAngle && guide.angle !== "unknown") {
// // // //         const duplicateMsg =
// // // //           GUIDE_MESSAGES[`duplicate_${guide.angle}`] ||
// // // //           getNextAnglePrompt(guide.nextRequiredAngle);
// // // //         setCurrentInstruction(duplicateMsg);
// // // //         setStatusText(`Duplicate ${guide.angle} angle`);
// // // //         speakOnce(duplicateMsg);
// // // //         return;
// // // //       }

// // // //       if (!guide.stable) {
// // // //         setCurrentInstruction(GUIDE_MESSAGES.hold_still);
// // // //         setStatusText("Hold still");
// // // //         speakOnce(GUIDE_MESSAGES.hold_still);
// // // //         return;
// // // //       }

// // // //       if (
// // // //         guide.shouldCapture &&
// // // //         guide.angle !== "unknown" &&
// // // //         !capturedAngles.includes(guide.angle)
// // // //       ) {
// // // //         await autoCapturePhoto(guide.angle);
// // // //         return;
// // // //       }

// // // //       const prompt = guide.message || getNextAnglePrompt(guide.nextRequiredAngle);
// // // //       setCurrentInstruction(prompt);
// // // //       setStatusText("Face aligned");
// // // //       speakOnce(prompt);
// // // //     },
// // // //     [autoCapturePhoto, capturedAngles, getNextAnglePrompt, speakOnce]
// // // //   );

// // // //   const runGuidancePass = useCallback(async () => {
// // // //     if (!permission?.granted || !cameraReady || isAnalyzing || isCapturing) return;
// // // //     if (!nextRequiredAngle) return;
// // // //     if (!cameraRef.current) return;

// // // //     try {
// // // //       setIsAnalyzing(true);

// // // //       const previewShot = await cameraRef.current.takePictureAsync({
// // // //         quality: 0.35,
// // // //         base64: true,
// // // //         skipProcessing: true,
// // // //       });

// // // //       if (!previewShot?.base64) return;

// // // //       const guide = await analyzeFrameForGuidance(previewShot.base64);
// // // //       await handleGuideResponse(guide);
// // // //     } catch (error) {
// // // //       console.error("Guidance pass error:", error);
// // // //     } finally {
// // // //       if (mountedRef.current) {
// // // //         setIsAnalyzing(false);
// // // //       }
// // // //     }
// // // //   }, [
// // // //     permission?.granted,
// // // //     cameraReady,
// // // //     isAnalyzing,
// // // //     isCapturing,
// // // //     nextRequiredAngle,
// // // //     analyzeFrameForGuidance,
// // // //     handleGuideResponse,
// // // //   ]);

// // // //   useEffect(() => {
// // // //     if (!permission?.granted || !cameraReady) return;
// // // //     if (capturedAngles.length >= REQUIRED_ANGLES.length) return;

// // // //     const loop = () => {
// // // //       runGuidancePass();
// // // //       analyzeTimerRef.current = setTimeout(loop, 1600);
// // // //     };

// // // //     analyzeTimerRef.current = setTimeout(loop, 1200);

// // // //     return () => {
// // // //       if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
// // // //     };
// // // //   }, [permission?.granted, cameraReady, capturedAngles.length, runGuidancePass]);

// // // //   const handleRestart = () => {
// // // //     if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
// // // //     setCapturedUris([]);
// // // //     setCapturedAngles([]);
// // // //     setCurrentInstruction("Hold the phone in front of your face.");
// // // //     setStatusText("Looking for face...");
// // // //     setLastDetectedAngle("unknown");
// // // //     lastSpokenMessageRef.current = "";
// // // //     lastSpokenAtRef.current = 0;
// // // //     speakOnce("Starting again.");
// // // //   };

// // // //   const renderCameraContent = () => {
// // // //     if (!permission) {
// // // //       return <View style={styles.cameraFallback} />;
// // // //     }

// // // //     if (!permission.granted) {
// // // //       return (
// // // //         <View
// // // //           style={[
// // // //             styles.permissionCenterOverlay,
// // // //             { backgroundColor: colors.card || colors.background },
// // // //           ]}
// // // //         >
// // // //           <AccessibleButton
// // // //             title={t("personCapture.allowCamera")}
// // // //             onPress={requestPermission}
// // // //             accessibilityLabel={t("personCapture.allowCameraLabel")}
// // // //             accessibilityHint={t("personCapture.allowCameraHint")}
// // // //             style={[
// // // //               styles.permissionButton,
// // // //               {
// // // //                 backgroundColor: colors.primary,
// // // //                 borderColor: colors.border,
// // // //               },
// // // //             ]}
// // // //             textStyle={{ color: onPrimary }}
// // // //           />
// // // //         </View>
// // // //       );
// // // //     }

// // // //     return (
// // // //       <CameraView
// // // //         ref={cameraRef}
// // // //         style={styles.camera}
// // // //         facing="front"
// // // //         accessible
// // // //         accessibilityLabel={t("personCapture.liveFeedLabel")}
// // // //         onCameraReady={() => {
// // // //           setCameraReady(true);
// // // //           setCurrentInstruction("Look straight ahead.");
// // // //           setStatusText("Camera ready");
// // // //           speakOnce("Look straight ahead.");
// // // //         }}
// // // //       />
// // // //     );
// // // //   };

// // // //   return (
// // // //     <View style={[styles.root, { backgroundColor: colors.background }]}>
// // // //       <View style={styles.content}>
// // // //         <View style={styles.ringWrap}>
// // // //           {Array.from({ length: SEGMENT_COUNT }).map((_, index) => {
// // // //             const isActive = index < progressSegments;
// // // //             return (
// // // //               <View
// // // //                 key={index}
// // // //                 style={[
// // // //                   styles.segment,
// // // //                   {
// // // //                     backgroundColor: isActive ? colors.primary : colors.border,
// // // //                     transform: [
// // // //                       { rotate: `${(360 / SEGMENT_COUNT) * index}deg` },
// // // //                       { translateY: -(RING_SIZE / 2 - 10) },
// // // //                     ],
// // // //                     opacity: isActive ? 1 : 0.85,
// // // //                   },
// // // //                 ]}
// // // //               />
// // // //             );
// // // //           })}

// // // //           <View
// // // //             style={[
// // // //               styles.cameraCircleOuter,
// // // //               {
// // // //                 width: CAMERA_SIZE,
// // // //                 height: CAMERA_SIZE,
// // // //                 borderRadius: CAMERA_SIZE / 2,
// // // //                 borderColor: colors.border,
// // // //               },
// // // //             ]}
// // // //           >
// // // //             <View
// // // //               style={[
// // // //                 styles.cameraCircleInner,
// // // //                 {
// // // //                   borderRadius: CAMERA_SIZE / 2,
// // // //                   backgroundColor: colors.card || colors.background,
// // // //                 },
// // // //               ]}
// // // //             >
// // // //               {renderCameraContent()}

// // // //               <View
// // // //                 pointerEvents="none"
// // // //                 style={[
// // // //                   styles.guideOval,
// // // //                   {
// // // //                     borderColor: colors.primary,
// // // //                   },
// // // //                 ]}
// // // //               />

// // // //               <View
// // // //                 pointerEvents="none"
// // // //                 style={[
// // // //                   styles.scanLine,
// // // //                   {
// // // //                     backgroundColor: colors.primary,
// // // //                     shadowColor: colors.primary,
// // // //                     opacity: isCapturing ? 1 : 0.75,
// // // //                   },
// // // //                 ]}
// // // //               />
// // // //             </View>
// // // //           </View>
// // // //         </View>

// // // //         <AccessibleText
// // // //           style={[styles.instructions, { color: colors.text }]}
// // // //           accessibilityRole="text"
// // // //         >
// // // //           {currentInstruction}
// // // //         </AccessibleText>

// // // //         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
// // // //           {capturedAngles.length} / 5 captured
// // // //         </AccessibleText>

// // // //         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
// // // //           Current angle: {lastDetectedAngle}
// // // //         </AccessibleText>

// // // //         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
// // // //           {statusText}
// // // //         </AccessibleText>
// // // //       </View>

// // // //       <View
// // // //         style={[
// // // //           styles.bottomBar,
// // // //           {
// // // //             flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
// // // //             borderTopColor: colors.border,
// // // //             backgroundColor: colors.background,
// // // //           },
// // // //         ]}
// // // //       >
// // // //         <AccessibleButton
// // // //           title={t("common.modes")}
// // // //           onPress={() => router.push("/features")}
// // // //           accessibilityLabel={t("common.modes")}
// // // //           accessibilityHint={t("common.modesHint")}
// // // //           style={[
// // // //             styles.bottomButton,
// // // //             {
// // // //               backgroundColor: colors.card || colors.background,
// // // //               borderColor: colors.border,
// // // //             },
// // // //           ]}
// // // //           textStyle={{ color: colors.text }}
// // // //         />

// // // //         <AccessibleButton
// // // //           title="Start Again"
// // // //           onPress={handleRestart}
// // // //           accessibilityLabel="Start registration again"
// // // //           accessibilityHint="Clears captured angles and starts over"
// // // //           style={[
// // // //             styles.bottomButton,
// // // //             {
// // // //               backgroundColor: colors.card || colors.background,
// // // //               borderColor: colors.border,
// // // //             },
// // // //           ]}
// // // //           textStyle={{ color: colors.text }}
// // // //         />
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // };

// // // // export default PersonCaptureScreen;

// // // // const styles = StyleSheet.create({
// // // //   root: {
// // // //     flex: 1,
// // // //   },
// // // //   content: {
// // // //     flex: 1,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     paddingHorizontal: 20,
// // // //     paddingTop: 24,
// // // //     paddingBottom: 12,
// // // //   },
// // // //   ringWrap: {
// // // //     width: RING_SIZE,
// // // //     height: RING_SIZE,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     position: "relative",
// // // //     marginBottom: 28,
// // // //   },
// // // //   segment: {
// // // //     position: "absolute",
// // // //     width: 4,
// // // //     height: 28,
// // // //     borderRadius: 999,
// // // //   },
// // // //   cameraCircleOuter: {
// // // //     overflow: "hidden",
// // // //     borderWidth: 2,
// // // //   },
// // // //   cameraCircleInner: {
// // // //     flex: 1,
// // // //     overflow: "hidden",
// // // //     position: "relative",
// // // //   },
// // // //   camera: {
// // // //     flex: 1,
// // // //   },
// // // //   cameraFallback: {
// // // //     flex: 1,
// // // //     backgroundColor: "#111111",
// // // //   },
// // // //   permissionCenterOverlay: {
// // // //     flex: 1,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     paddingHorizontal: 20,
// // // //   },
// // // //   permissionButton: {
// // // //     paddingHorizontal: 24,
// // // //     paddingVertical: 16,
// // // //     borderRadius: 16,
// // // //     borderWidth: 1,
// // // //   },
// // // //   guideOval: {
// // // //     position: "absolute",
// // // //     width: "76%",
// // // //     height: "92%",
// // // //     borderWidth: 2,
// // // //     borderRadius: 999,
// // // //     alignSelf: "center",
// // // //     top: "4%",
// // // //     opacity: 0.28,
// // // //   },
// // // //   scanLine: {
// // // //     position: "absolute",
// // // //     left: "8%",
// // // //     right: "8%",
// // // //     top: "52%",
// // // //     height: 4,
// // // //     borderRadius: 999,
// // // //     shadowOpacity: 0.45,
// // // //     shadowRadius: 10,
// // // //     elevation: 6,
// // // //   },
// // // //   instructions: {
// // // //     fontSize: 18,
// // // //     fontWeight: "800",
// // // //     textAlign: "center",
// // // //     lineHeight: 25,
// // // //     maxWidth: 310,
// // // //     marginBottom: 12,
// // // //   },
// // // //   metaText: {
// // // //     fontSize: 14,
// // // //     textAlign: "center",
// // // //     marginBottom: 6,
// // // //     opacity: 0.9,
// // // //   },
// // // //   bottomBar: {
// // // //     paddingHorizontal: 20,
// // // //     paddingTop: 12,
// // // //     paddingBottom: 18,
// // // //     gap: 12,
// // // //     borderTopWidth: 1,
// // // //   },
// // // //   bottomButton: {
// // // //     flex: 1,
// // // //     minHeight: 58,
// // // //     borderRadius: 18,
// // // //     borderWidth: 1.5,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginHorizontal: 4,
// // // //   },
// // // // });

// // // import { AccessibleButton } from "@/components/AccessibleButton";
// // // import { AccessibleText } from "@/components/AccessibleText";
// // // import { useAccessibility } from "@/contexts/AccessibilityContext";
// // // import { useAccessibleColors } from "@/hooks/useAccessibleColors";
// // // import { CameraView, useCameraPermissions } from "expo-camera";
// // // import * as FileSystem from "expo-file-system/legacy";
// // // import { useRouter } from "expo-router";
// // // import { useTranslation } from "react-i18next";
// // // import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // // import {
// // //   Dimensions,
// // //   I18nManager,
// // //   StyleSheet,
// // //   View,
// // // } from "react-native";

// // // const { width } = Dimensions.get("window");
// // // const RING_SIZE = Math.min(width * 0.88, 360);
// // // const CAMERA_SIZE = RING_SIZE * 0.76;
// // // const SEGMENT_COUNT = 60;

// // // const REQUIRED_ANGLES = ["front", "left", "right", "up", "down"] as const;
// // // type RequiredAngle = (typeof REQUIRED_ANGLES)[number];

// // // type FaceGuideResponse = {
// // //   ok: boolean;
// // //   faceDetected: boolean;
// // //   shouldCapture: boolean;
// // //   stable: boolean;
// // //   distance: "too_close" | "too_far" | "good";
// // //   position: "centered" | "move_left" | "move_right" | "move_up" | "move_down";
// // //   angle: RequiredAngle | "unknown";
// // //   duplicateAngle: boolean;
// // //   nextRequiredAngle: RequiredAngle | null;
// // //   message?: string;
// // // };

// // // const GUIDE_MESSAGES: Record<string, string> = {
// // //   no_face: "No face detected. Hold the phone in front of your face.",
// // //   too_close: "Move the phone a little away.",
// // //   too_far: "Bring the phone a little closer.",
// // //   move_left: "Move the phone slightly left.",
// // //   move_right: "Move the phone slightly right.",
// // //   move_up: "Move the phone slightly up.",
// // //   move_down: "Move the phone slightly down.",
// // //   hold_still: "Hold still.",
// // //   duplicate_front: "Front angle already captured. Turn slightly left.",
// // //   duplicate_left: "Left angle already captured. Turn slightly right.",
// // //   duplicate_right: "Right angle already captured. Lift your chin slightly.",
// // //   duplicate_up: "Up angle already captured. Lower your chin slightly.",
// // //   duplicate_down: "Down angle already captured. Face front again.",
// // //   next_front: "Look straight ahead.",
// // //   next_left: "Slowly turn a little left.",
// // //   next_right: "Slowly turn a little right.",
// // //   next_up: "Lift your chin slightly.",
// // //   next_down: "Lower your chin slightly.",
// // //   capturing: "Capturing image.",
// // //   done: "Registration complete.",
// // //   unavailable: "Guide service unavailable.",
// // // };

// // // const angleLabelMap: Record<RequiredAngle, string> = {
// // //   front: "Front",
// // //   left: "Left",
// // //   right: "Right",
// // //   up: "Up",
// // //   down: "Down",
// // // };

// // // const onColor = (bg: string) => {
// // //   const hex = (bg || "").replace("#", "");
// // //   if (hex.length !== 6) return "#000000";
// // //   const r = parseInt(hex.slice(0, 2), 16) / 255;
// // //   const g = parseInt(hex.slice(2, 4), 16) / 255;
// // //   const b = parseInt(hex.slice(4, 6), 16) / 255;
// // //   const toLin = (c: number) =>
// // //     c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
// // //   const L = 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
// // //   return L > 0.45 ? "#000000" : "#FFFFFF";
// // // };

// // // // IMPORTANT: replace with your current Mac IP when testing on a real phone
// // // const BASE_URL = "http://192.168.18.206:8000";

// // // const PersonCaptureScreen = () => {
// // //   const router = useRouter();
// // //   const { t } = useTranslation();
// // //   const { speak, hapticFeedback } = useAccessibility();
// // //   const colors = useAccessibleColors();

// // //   const [permission, requestPermission] = useCameraPermissions();
// // //   const [cameraReady, setCameraReady] = useState(false);
// // //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// // //   const [isCapturing, setIsCapturing] = useState(false);

// // //   const [capturedUris, setCapturedUris] = useState<string[]>([]);
// // //   const [capturedAngles, setCapturedAngles] = useState<RequiredAngle[]>([]);
// // //   const [currentInstruction, setCurrentInstruction] = useState(
// // //     "Hold the phone in front of your face."
// // //   );
// // //   const [statusText, setStatusText] = useState("Looking for face...");
// // //   const [lastDetectedAngle, setLastDetectedAngle] = useState<string>("unknown");

// // //   const cameraRef = useRef<CameraView | null>(null);
// // //   const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
// // //   const mountedRef = useRef(true);

// // //   const lastSpokenMessageRef = useRef("");
// // //   const lastSpokenAtRef = useRef(0);

// // //   const onPrimary = useMemo(() => onColor(colors.primary), [colors.primary]);

// // //   const progressSegments = useMemo(() => {
// // //     return Math.round((capturedAngles.length / REQUIRED_ANGLES.length) * SEGMENT_COUNT);
// // //   }, [capturedAngles.length]);

// // //   const nextRequiredAngle = useMemo(() => {
// // //     return REQUIRED_ANGLES.find((a) => !capturedAngles.includes(a)) ?? null;
// // //   }, [capturedAngles]);

// // //   const speakOnce = useCallback(
// // //     (message: string) => {
// // //       if (!message) return;

// // //       const now = Date.now();
// // //       const sameMessage = lastSpokenMessageRef.current === message;
// // //       const tooSoon = now - lastSpokenAtRef.current < 1800;

// // //       if (sameMessage && tooSoon) return;

// // //       lastSpokenMessageRef.current = message;
// // //       lastSpokenAtRef.current = now;
// // //       speak?.(message, true);
// // //     },
// // //     [speak]
// // //   );

// // //   useEffect(() => {
// // //     mountedRef.current = true;

// // //     return () => {
// // //       mountedRef.current = false;
// // //       if (analyzeTimerRef.current) {
// // //         clearTimeout(analyzeTimerRef.current);
// // //         analyzeTimerRef.current = null;
// // //       }
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     if (!permission) {
// // //       requestPermission();
// // //       return;
// // //     }

// // //     if (!permission.granted) {
// // //       speakOnce(t("personCapture.allowCamera"));
// // //       return;
// // //     }

// // //     speakOnce("Hold the phone in front of your face.");
// // //   }, [permission, requestPermission, speakOnce, t]);

// // //   const getNextAnglePrompt = useCallback((angle: RequiredAngle | null) => {
// // //     if (!angle) return GUIDE_MESSAGES.done;
// // //     return GUIDE_MESSAGES[`next_${angle}`] ?? "Adjust your face.";
// // //   }, []);

// // //   const completeFlow = useCallback(
// // //     (finalUris: string[], finalAngles: RequiredAngle[]) => {
// // //       setCurrentInstruction(GUIDE_MESSAGES.done);
// // //       setStatusText("5 of 5 captured");
// // //       speakOnce(GUIDE_MESSAGES.done);

// // //       router.replace({
// // //         pathname: "/person-name",
// // //         params: {
// // //           count: String(finalUris.length),
// // //           imageUris: JSON.stringify(finalUris),
// // //           capturedAngles: JSON.stringify(finalAngles),
// // //         },
// // //       } as any);
// // //     },
// // //     [router, speakOnce]
// // //   );

// // //   const saveCapturedPhoto = useCallback(
// // //     async (tempUri: string, angle: RequiredAngle) => {
// // //       const fileName = `person_${angle}_${Date.now()}.jpg`;
// // //       const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

// // //       await FileSystem.copyAsync({
// // //         from: tempUri,
// // //         to: fileUri,
// // //       });

// // //       const nextUris = [...capturedUris, fileUri];
// // //       const nextAngles = [...capturedAngles, angle];

// // //       setCapturedUris(nextUris);
// // //       setCapturedAngles(nextAngles);
// // //       setLastDetectedAngle(angle);

// // //       if (nextAngles.length >= REQUIRED_ANGLES.length) {
// // //         completeFlow(nextUris, nextAngles);
// // //         return;
// // //       }

// // //       const nextAngle = REQUIRED_ANGLES.find((a) => !nextAngles.includes(a)) ?? null;
// // //       const prompt = getNextAnglePrompt(nextAngle);
// // //       setCurrentInstruction(prompt);
// // //       setStatusText(`${nextAngles.length} of 5 captured`);
// // //       speakOnce(prompt);
// // //     },
// // //     [capturedUris, capturedAngles, completeFlow, getNextAnglePrompt, speakOnce]
// // //   );

// // //   const analyzeFrameForGuidance = useCallback(
// // //     async (base64: string): Promise<FaceGuideResponse> => {
// // //       const requiredAngle = nextRequiredAngle;

// // //       try {
// // //         const response = await fetch(`${BASE_URL}/face-registration-guide`, {
// // //           method: "POST",
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //           },
// // //           body: JSON.stringify({
// // //             imageBase64: base64,
// // //             requiredAngle,
// // //             capturedAngles,
// // //           }),
// // //         });

// // //         const rawText = await response.text();
// // //         console.log("[guide] status:", response.status);
// // //         console.log("[guide] raw response:", rawText);

// // //         if (!response.ok) {
// // //           throw new Error(`Guide API failed with ${response.status}: ${rawText}`);
// // //         }

// // //         const parsed = JSON.parse(rawText) as FaceGuideResponse;
// // //         return parsed;
// // //       } catch (error) {
// // //         console.error("[guide] fetch error:", error);
// // //         return {
// // //           ok: false,
// // //           faceDetected: false,
// // //           shouldCapture: false,
// // //           stable: false,
// // //           distance: "good",
// // //           position: "centered",
// // //           angle: "unknown",
// // //           duplicateAngle: false,
// // //           nextRequiredAngle: requiredAngle,
// // //           message: GUIDE_MESSAGES.unavailable,
// // //         };
// // //       }
// // //     },
// // //     [capturedAngles, nextRequiredAngle]
// // //   );

// // //   const autoCapturePhoto = useCallback(
// // //     async (angle: RequiredAngle) => {
// // //       console.log("[autoCapturePhoto] called with angle:", angle);

// // //       if (analyzeTimerRef.current) {
// // //         clearTimeout(analyzeTimerRef.current);
// // //         analyzeTimerRef.current = null;
// // //       }

// // //       if (!cameraRef.current || isCapturing || !cameraReady) {
// // //         console.log("[autoCapturePhoto] blocked", {
// // //           hasCameraRef: !!cameraRef.current,
// // //           isCapturing,
// // //           cameraReady,
// // //         });
// // //         return;
// // //       }

// // //       try {
// // //         setIsCapturing(true);
// // //         setCurrentInstruction(GUIDE_MESSAGES.capturing);
// // //         setStatusText(`Capturing ${angleLabelMap[angle]} angle`);
// // //         speakOnce(GUIDE_MESSAGES.capturing);
// // //         hapticFeedback?.("medium");

// // //         const photo = await cameraRef.current.takePictureAsync({
// // //           quality: 0.8,
// // //           base64: false,
// // //           skipProcessing: false,
// // //         });

// // //         console.log("[autoCapturePhoto] photo:", photo);

// // //         if (!photo?.uri) {
// // //           speakOnce("Could not capture image. Please hold still.");
// // //           return;
// // //         }

// // //         await saveCapturedPhoto(photo.uri, angle);
// // //       } catch (error) {
// // //         console.error("[autoCapturePhoto] error:", error);
// // //         speakOnce("Could not capture image. Please hold still.");
// // //         hapticFeedback?.("error");
// // //       } finally {
// // //         if (mountedRef.current) {
// // //           setIsCapturing(false);
// // //         }
// // //       }
// // //     },
// // //     [cameraReady, hapticFeedback, isCapturing, saveCapturedPhoto, speakOnce]
// // //   );

// // //   const handleGuideResponse = useCallback(
// // //     async (guide: FaceGuideResponse) => {
// // //       if (!mountedRef.current) return;

// // //       console.log("[guide response]", JSON.stringify(guide, null, 2));

// // //       if (!guide.ok) {
// // //         const msg = guide.message || GUIDE_MESSAGES.unavailable;
// // //         setCurrentInstruction(msg);
// // //         setStatusText("Waiting...");
// // //         speakOnce(msg);
// // //         return;
// // //       }

// // //       if (!guide.faceDetected) {
// // //         setLastDetectedAngle("unknown");
// // //         setCurrentInstruction(GUIDE_MESSAGES.no_face);
// // //         setStatusText("No face detected");
// // //         speakOnce(GUIDE_MESSAGES.no_face);
// // //         return;
// // //       }

// // //       setLastDetectedAngle(guide.angle);

// // //       if (guide.distance === "too_close") {
// // //         setCurrentInstruction(GUIDE_MESSAGES.too_close);
// // //         setStatusText("Too close");
// // //         speakOnce(GUIDE_MESSAGES.too_close);
// // //         return;
// // //       }

// // //       if (guide.distance === "too_far") {
// // //         setCurrentInstruction(GUIDE_MESSAGES.too_far);
// // //         setStatusText("Too far");
// // //         speakOnce(GUIDE_MESSAGES.too_far);
// // //         return;
// // //       }

// // //       if (guide.position !== "centered") {
// // //         const msg = GUIDE_MESSAGES[guide.position] ?? "Adjust position.";
// // //         setCurrentInstruction(msg);
// // //         setStatusText("Adjusting position");
// // //         speakOnce(msg);
// // //         return;
// // //       }

// // //       if (guide.duplicateAngle && guide.angle !== "unknown") {
// // //         const duplicateMsg =
// // //           GUIDE_MESSAGES[`duplicate_${guide.angle}`] ||
// // //           getNextAnglePrompt(guide.nextRequiredAngle);
// // //         setCurrentInstruction(duplicateMsg);
// // //         setStatusText(`Duplicate ${guide.angle} angle`);
// // //         speakOnce(duplicateMsg);
// // //         return;
// // //       }

// // //       if (
// // //         guide.angle !== "unknown" &&
// // //         guide.nextRequiredAngle !== null &&
// // //         guide.angle === guide.nextRequiredAngle &&
// // //         !capturedAngles.includes(guide.angle)
// // //       ) {
// // //         await autoCapturePhoto(guide.angle);
// // //         return;
// // //       }

// // //       if (!guide.stable) {
// // //         setCurrentInstruction(GUIDE_MESSAGES.hold_still);
// // //         setStatusText("Hold still");
// // //         speakOnce(GUIDE_MESSAGES.hold_still);
// // //         return;
// // //       }

// // //       const prompt = guide.message || getNextAnglePrompt(guide.nextRequiredAngle);
// // //       setCurrentInstruction(prompt);
// // //       setStatusText("Face aligned");
// // //       speakOnce(prompt);
// // //     },
// // //     [autoCapturePhoto, capturedAngles, getNextAnglePrompt, speakOnce]
// // //   );

// // //   const runGuidancePass = useCallback(async () => {
// // //     if (!permission?.granted || !cameraReady || isAnalyzing || isCapturing) return;
// // //     if (!nextRequiredAngle) return;
// // //     if (!cameraRef.current) return;

// // //     try {
// // //       setIsAnalyzing(true);

// // //       const previewShot = await cameraRef.current.takePictureAsync({
// // //         quality: 0.35,
// // //         base64: true,
// // //         skipProcessing: true,
// // //       });

// // //       if (!previewShot?.base64) return;

// // //       const guide = await analyzeFrameForGuidance(previewShot.base64);
// // //       await handleGuideResponse(guide);
// // //     } catch (error) {
// // //       console.error("[runGuidancePass] error:", error);
// // //     } finally {
// // //       if (mountedRef.current) {
// // //         setIsAnalyzing(false);
// // //       }
// // //     }
// // //   }, [
// // //     permission?.granted,
// // //     cameraReady,
// // //     isAnalyzing,
// // //     isCapturing,
// // //     nextRequiredAngle,
// // //     analyzeFrameForGuidance,
// // //     handleGuideResponse,
// // //   ]);

// // //   useEffect(() => {
// // //     if (!permission?.granted || !cameraReady) return;
// // //     if (capturedAngles.length >= REQUIRED_ANGLES.length) return;

// // //     const loop = () => {
// // //       runGuidancePass();
// // //       analyzeTimerRef.current = setTimeout(loop, 1600);
// // //     };

// // //     analyzeTimerRef.current = setTimeout(loop, 1200);

// // //     return () => {
// // //       if (analyzeTimerRef.current) {
// // //         clearTimeout(analyzeTimerRef.current);
// // //         analyzeTimerRef.current = null;
// // //       }
// // //     };
// // //   }, [permission?.granted, cameraReady, capturedAngles.length, runGuidancePass]);

// // //   const handleRestart = () => {
// // //     if (analyzeTimerRef.current) {
// // //       clearTimeout(analyzeTimerRef.current);
// // //       analyzeTimerRef.current = null;
// // //     }

// // //     setCapturedUris([]);
// // //     setCapturedAngles([]);
// // //     setCurrentInstruction("Hold the phone in front of your face.");
// // //     setStatusText("Looking for face...");
// // //     setLastDetectedAngle("unknown");

// // //     lastSpokenMessageRef.current = "";
// // //     lastSpokenAtRef.current = 0;

// // //     speakOnce("Starting again.");
// // //   };

// // //   const renderCameraContent = () => {
// // //     if (!permission) {
// // //       return <View style={styles.cameraFallback} />;
// // //     }

// // //     if (!permission.granted) {
// // //       return (
// // //         <View
// // //           style={[
// // //             styles.permissionCenterOverlay,
// // //             { backgroundColor: colors.card || colors.background },
// // //           ]}
// // //         >
// // //           <AccessibleButton
// // //             title={t("personCapture.allowCamera")}
// // //             onPress={requestPermission}
// // //             accessibilityLabel={t("personCapture.allowCameraLabel")}
// // //             accessibilityHint={t("personCapture.allowCameraHint")}
// // //             style={[
// // //               styles.permissionButton,
// // //               {
// // //                 backgroundColor: colors.primary,
// // //                 borderColor: colors.border,
// // //               },
// // //             ]}
// // //             textStyle={{ color: onPrimary }}
// // //           />
// // //         </View>
// // //       );
// // //     }

// // //     return (
// // //       <CameraView
// // //         ref={cameraRef}
// // //         style={styles.camera}
// // //         facing="front"
// // //         accessible
// // //         accessibilityLabel={t("personCapture.liveFeedLabel")}
// // //         onCameraReady={() => {
// // //           setCameraReady(true);
// // //           setCurrentInstruction("Look straight ahead.");
// // //           setStatusText("Camera ready");
// // //           speakOnce("Look straight ahead.");
// // //         }}
// // //       />
// // //     );
// // //   };

// // //   return (
// // //     <View style={[styles.root, { backgroundColor: colors.background }]}>
// // //       <View style={styles.content}>
// // //         <View style={styles.ringWrap}>
// // //           {Array.from({ length: SEGMENT_COUNT }).map((_, index) => {
// // //             const isActive = index < progressSegments;
// // //             return (
// // //               <View
// // //                 key={index}
// // //                 style={[
// // //                   styles.segment,
// // //                   {
// // //                     backgroundColor: isActive ? colors.primary : colors.border,
// // //                     transform: [
// // //                       { rotate: `${(360 / SEGMENT_COUNT) * index}deg` },
// // //                       { translateY: -(RING_SIZE / 2 - 10) },
// // //                     ],
// // //                     opacity: isActive ? 1 : 0.85,
// // //                   },
// // //                 ]}
// // //               />
// // //             );
// // //           })}

// // //           <View
// // //             style={[
// // //               styles.cameraCircleOuter,
// // //               {
// // //                 width: CAMERA_SIZE,
// // //                 height: CAMERA_SIZE,
// // //                 borderRadius: CAMERA_SIZE / 2,
// // //                 borderColor: colors.border,
// // //               },
// // //             ]}
// // //           >
// // //             <View
// // //               style={[
// // //                 styles.cameraCircleInner,
// // //                 {
// // //                   borderRadius: CAMERA_SIZE / 2,
// // //                   backgroundColor: colors.card || colors.background,
// // //                 },
// // //               ]}
// // //             >
// // //               {renderCameraContent()}

// // //               <View
// // //                 pointerEvents="none"
// // //                 style={[
// // //                   styles.guideOval,
// // //                   {
// // //                     borderColor: colors.primary,
// // //                   },
// // //                 ]}
// // //               />

// // //               <View
// // //                 pointerEvents="none"
// // //                 style={[
// // //                   styles.scanLine,
// // //                   {
// // //                     backgroundColor: colors.primary,
// // //                     shadowColor: colors.primary,
// // //                     opacity: isCapturing ? 1 : 0.75,
// // //                   },
// // //                 ]}
// // //               />
// // //             </View>
// // //           </View>
// // //         </View>

// // //         <AccessibleText
// // //           style={[styles.instructions, { color: colors.text }]}
// // //           accessibilityRole="text"
// // //         >
// // //           {currentInstruction}
// // //         </AccessibleText>

// // //         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
// // //           {capturedAngles.length} / 5 captured
// // //         </AccessibleText>

// // //         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
// // //           Current angle: {lastDetectedAngle}
// // //         </AccessibleText>

// // //         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
// // //           {statusText}
// // //         </AccessibleText>
// // //       </View>

// // //       <View
// // //         style={[
// // //           styles.bottomBar,
// // //           {
// // //             flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
// // //             borderTopColor: colors.border,
// // //             backgroundColor: colors.background,
// // //           },
// // //         ]}
// // //       >
// // //         <AccessibleButton
// // //           title={t("common.modes")}
// // //           onPress={() => router.push("/features")}
// // //           accessibilityLabel={t("common.modes")}
// // //           accessibilityHint={t("common.modesHint")}
// // //           style={[
// // //             styles.bottomButton,
// // //             {
// // //               backgroundColor: colors.card || colors.background,
// // //               borderColor: colors.border,
// // //             },
// // //           ]}
// // //           textStyle={{ color: colors.text }}
// // //         />

// // //         <AccessibleButton
// // //           title="Start Again"
// // //           onPress={handleRestart}
// // //           accessibilityLabel="Start registration again"
// // //           accessibilityHint="Clears captured angles and starts over"
// // //           style={[
// // //             styles.bottomButton,
// // //             {
// // //               backgroundColor: colors.card || colors.background,
// // //               borderColor: colors.border,
// // //             },
// // //           ]}
// // //           textStyle={{ color: colors.text }}
// // //         />
// // //       </View>
// // //     </View>
// // //   );
// // // };

// // // export default PersonCaptureScreen;

// // // const styles = StyleSheet.create({
// // //   root: {
// // //     flex: 1,
// // //   },
// // //   content: {
// // //     flex: 1,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     paddingHorizontal: 20,
// // //     paddingTop: 24,
// // //     paddingBottom: 12,
// // //   },
// // //   ringWrap: {
// // //     width: RING_SIZE,
// // //     height: RING_SIZE,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     position: "relative",
// // //     marginBottom: 28,
// // //   },
// // //   segment: {
// // //     position: "absolute",
// // //     width: 4,
// // //     height: 28,
// // //     borderRadius: 999,
// // //   },
// // //   cameraCircleOuter: {
// // //     overflow: "hidden",
// // //     borderWidth: 2,
// // //   },
// // //   cameraCircleInner: {
// // //     flex: 1,
// // //     overflow: "hidden",
// // //     position: "relative",
// // //   },
// // //   camera: {
// // //     flex: 1,
// // //   },
// // //   cameraFallback: {
// // //     flex: 1,
// // //     backgroundColor: "#111111",
// // //   },
// // //   permissionCenterOverlay: {
// // //     flex: 1,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     paddingHorizontal: 20,
// // //   },
// // //   permissionButton: {
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 16,
// // //     borderRadius: 16,
// // //     borderWidth: 1,
// // //   },
// // //   guideOval: {
// // //     position: "absolute",
// // //     width: "76%",
// // //     height: "92%",
// // //     borderWidth: 2,
// // //     borderRadius: 999,
// // //     alignSelf: "center",
// // //     top: "4%",
// // //     opacity: 0.28,
// // //   },
// // //   scanLine: {
// // //     position: "absolute",
// // //     left: "8%",
// // //     right: "8%",
// // //     top: "52%",
// // //     height: 4,
// // //     borderRadius: 999,
// // //     shadowOpacity: 0.45,
// // //     shadowRadius: 10,
// // //     elevation: 6,
// // //   },
// // //   instructions: {
// // //     fontSize: 18,
// // //     fontWeight: "800",
// // //     textAlign: "center",
// // //     lineHeight: 25,
// // //     maxWidth: 310,
// // //     marginBottom: 12,
// // //   },
// // //   metaText: {
// // //     fontSize: 14,
// // //     textAlign: "center",
// // //     marginBottom: 6,
// // //     opacity: 0.9,
// // //   },
// // //   bottomBar: {
// // //     paddingHorizontal: 20,
// // //     paddingTop: 12,
// // //     paddingBottom: 18,
// // //     gap: 12,
// // //     borderTopWidth: 1,
// // //   },
// // //   bottomButton: {
// // //     flex: 1,
// // //     minHeight: 58,
// // //     borderRadius: 18,
// // //     borderWidth: 1.5,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginHorizontal: 4,
// // //   },
// // // });
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

// // const { width } = Dimensions.get("window");
// // const RING_SIZE = Math.min(width * 0.88, 360);
// // const CAMERA_SIZE = RING_SIZE * 0.76;
// // const SEGMENT_COUNT = 60;

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
// //   no_face: "No face detected. Hold the phone in front of your face.",
// //   too_close: "Move the phone a little away.",
// //   too_far: "Bring the phone a little closer.",
// //   move_left: "Move the phone slightly left.",
// //   move_right: "Move the phone slightly right.",
// //   move_up: "Move the phone slightly up.",
// //   move_down: "Move the phone slightly down.",
// //   hold_still: "Hold still.",
// //   duplicate_front: "Front angle already captured. Turn slightly left.",
// //   duplicate_left: "Left angle already captured. Turn slightly right.",
// //   duplicate_right: "Right angle already captured. Lift your chin slightly.",
// //   duplicate_up: "Up angle already captured. Lower your chin slightly.",
// //   duplicate_down: "Down angle already captured. Face front again.",
// //   next_front: "Look straight ahead.",
// //   next_left: "Slowly turn a little left.",
// //   next_right: "Slowly turn a little right.",
// //   next_up: "Lift your chin slightly.",
// //   next_down: "Lower your chin slightly.",
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

// // // Replace with your current Mac IP when testing on a real phone
// // const BASE_URL = "http://192.168.18.206:8000";

// // const PersonCaptureScreen = () => {
// //   const router = useRouter();
// //   const { t } = useTranslation();
// //   const { speak, hapticFeedback } = useAccessibility();
// //   const colors = useAccessibleColors();

// //   const [permission, requestPermission] = useCameraPermissions();
// //   const [cameraReady, setCameraReady] = useState(false);
// //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// //   const [isCapturing, setIsCapturing] = useState(false);

// //   const [capturedUris, setCapturedUris] = useState<string[]>([]);
// //   const [capturedAngles, setCapturedAngles] = useState<RequiredAngle[]>([]);
// //   const [currentInstruction, setCurrentInstruction] = useState(
// //     "Hold the phone in front of your face."
// //   );
// //   const [statusText, setStatusText] = useState("Looking for face...");
// //   const [lastDetectedAngle, setLastDetectedAngle] = useState<string>("unknown");

// //   const cameraRef = useRef<CameraView | null>(null);
// //   const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
// //   const mountedRef = useRef(true);

// //   const lastSpokenMessageRef = useRef("");
// //   const lastSpokenAtRef = useRef(0);

// //   const onPrimary = useMemo(() => onColor(colors.primary), [colors.primary]);

// //   const progressSegments = useMemo(() => {
// //     return Math.round((capturedAngles.length / REQUIRED_ANGLES.length) * SEGMENT_COUNT);
// //   }, [capturedAngles.length]);

// //   const nextRequiredAngle = useMemo(() => {
// //     return REQUIRED_ANGLES.find((a) => !capturedAngles.includes(a)) ?? null;
// //   }, [capturedAngles]);

// //   const speakOnce = useCallback(
// //     (message: string) => {
// //       if (!message) return;

// //       const now = Date.now();
// //       const sameMessage = lastSpokenMessageRef.current === message;
// //       const tooSoon = now - lastSpokenAtRef.current < 1800;

// //       if (sameMessage && tooSoon) return;

// //       lastSpokenMessageRef.current = message;
// //       lastSpokenAtRef.current = now;
// //       speak?.(message, true);
// //     },
// //     [speak]
// //   );

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

// //     speakOnce("Hold the phone in front of your face.");
// //   }, [permission, requestPermission, speakOnce, t]);

// //   const getNextAnglePrompt = useCallback((angle: RequiredAngle | null) => {
// //     if (!angle) return GUIDE_MESSAGES.done;
// //     return GUIDE_MESSAGES[`next_${angle}`] ?? "Adjust your face.";
// //   }, []);

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

// //       if (nextAngles.length >= REQUIRED_ANGLES.length) {
// //         completeFlow(nextUris, nextAngles);
// //         return;
// //       }

// //       const nextAngle = REQUIRED_ANGLES.find((a) => !nextAngles.includes(a)) ?? null;
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

// //         await saveCapturedPhoto(photo.uri, angle);
// //         await new Promise((res) => setTimeout(res, 900));
// //       } catch (error) {
// //         console.error("[autoCapturePhoto] error:", error);
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

// //       if (!guide.ok) {
// //         const msg = guide.message || GUIDE_MESSAGES.unavailable;
// //         setCurrentInstruction(msg);
// //         setStatusText("Waiting...");
// //         speakOnce(msg);
// //         return;
// //       }

// //       if (!guide.faceDetected) {
// //         setLastDetectedAngle("unknown");
// //         setCurrentInstruction(GUIDE_MESSAGES.no_face);
// //         setStatusText("No face detected");
// //         speakOnce(GUIDE_MESSAGES.no_face);
// //         return;
// //       }

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

// //       if (guide.position !== "centered") {
// //         const msg = GUIDE_MESSAGES[guide.position] ?? "Adjust position.";
// //         setCurrentInstruction(msg);
// //         setStatusText("Adjusting position");
// //         speakOnce(msg);
// //         return;
// //       }

// //       if (guide.duplicateAngle && guide.angle !== "unknown") {
// //         const duplicateMsg =
// //           GUIDE_MESSAGES[`duplicate_${guide.angle}`] ||
// //           getNextAnglePrompt(guide.nextRequiredAngle);
// //         setCurrentInstruction(duplicateMsg);
// //         setStatusText(`Duplicate ${guide.angle} angle`);
// //         speakOnce(duplicateMsg);
// //         return;
// //       }

// //       if (
// //         guide.angle !== "unknown" &&
// //         guide.nextRequiredAngle !== null &&
// //         guide.angle === guide.nextRequiredAngle &&
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

// //       const prompt = guide.message || getNextAnglePrompt(guide.nextRequiredAngle);
// //       setCurrentInstruction(prompt);
// //       setStatusText("Face aligned");
// //       speakOnce(prompt);
// //     },
// //     [autoCapturePhoto, capturedAngles, getNextAnglePrompt, speakOnce]
// //   );

// //   const runGuidancePass = useCallback(async () => {
// //     if (!permission?.granted || !cameraReady || isAnalyzing || isCapturing) return;
// //     if (!nextRequiredAngle) return;
// //     if (!cameraRef.current) return;

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
// //     } catch (error) {
// //       console.error("[runGuidancePass] error:", error);
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

// //   const handleRestart = () => {
// //     if (analyzeTimerRef.current) {
// //       clearTimeout(analyzeTimerRef.current);
// //       analyzeTimerRef.current = null;
// //     }

// //     setCapturedUris([]);
// //     setCapturedAngles([]);
// //     setCurrentInstruction("Hold the phone in front of your face.");
// //     setStatusText("Looking for face...");
// //     setLastDetectedAngle("unknown");

// //     lastSpokenMessageRef.current = "";
// //     lastSpokenAtRef.current = 0;

// //     speakOnce("Starting again.");
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
// //           setCurrentInstruction("Look straight ahead.");
// //           setStatusText("Camera ready");
// //           speakOnce("Look straight ahead.");
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
// //           title={t("common.modes")}
// //           onPress={() => router.push("/features")}
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

// //         <AccessibleButton
// //           title="Start Again"
// //           onPress={handleRestart}
// //           accessibilityLabel="Start registration again"
// //           accessibilityHint="Clears captured angles and starts over"
// //           style={[
// //             styles.bottomButton,
// //             {
// //               backgroundColor: colors.card || colors.background,
// //               borderColor: colors.border,
// //             },
// //           ]}
// //           textStyle={{ color: colors.text }}
// //         />
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
// import {
//   Dimensions,
//   I18nManager,
//   StyleSheet,
//   View,
// } from "react-native";

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
//   no_face: "No face detected. Hold the phone in front of your face.",
//   too_close: "Move the phone a little away.",
//   too_far: "Bring the phone a little closer.",
//   move_left: "Move the phone slightly left.",
//   move_right: "Move the phone slightly right.",
//   move_up: "Move the phone slightly up.",
//   move_down: "Move the phone slightly down.",
//   hold_still: "Hold still.",
//   duplicate_front: "Front angle already captured. Turn slightly left.",
//   duplicate_left: "Left angle already captured. Turn slightly right.",
//   duplicate_right: "Right angle already captured. Lift your chin slightly.",
//   duplicate_up: "Up angle already captured. Lower your chin slightly.",
//   duplicate_down: "Down angle already captured. Face front again.",
//   next_front: "Look straight ahead.",
//   next_left: "Slowly turn a little left.",
//   next_right: "Slowly turn a little right.",
//   next_up: "Lift your chin slightly.",
//   next_down: "Lower your chin slightly.",
//   capturing: "Capturing image.",
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

// // Replace with your current Mac IP when testing on a real phone
// const BASE_URL = "http://192.168.18.206:8000";

// const PersonCaptureScreen = () => {
//   const router = useRouter();
//   const { t } = useTranslation();
//   const { speak, hapticFeedback } = useAccessibility();
//   const colors = useAccessibleColors();

//   const [permission, requestPermission] = useCameraPermissions();
//   const [cameraReady, setCameraReady] = useState(false);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [isCapturing, setIsCapturing] = useState(false);

//   const [capturedUris, setCapturedUris] = useState<string[]>([]);
//   const [capturedAngles, setCapturedAngles] = useState<RequiredAngle[]>([]);
//   const [currentInstruction, setCurrentInstruction] = useState(
//     "Hold the phone in front of your face."
//   );
//   const [statusText, setStatusText] = useState("Looking for face...");
//   const [lastDetectedAngle, setLastDetectedAngle] = useState<string>("unknown");

//   const cameraRef = useRef<CameraView | null>(null);
//   const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const mountedRef = useRef(true);
//   const lastCaptureAtRef = useRef(0);

//   const lastSpokenMessageRef = useRef("");
//   const lastSpokenAtRef = useRef(0);

//   const onPrimary = useMemo(() => onColor(colors.primary), [colors.primary]);

//   const progressSegments = useMemo(() => {
//     return Math.round((capturedAngles.length / REQUIRED_ANGLES.length) * SEGMENT_COUNT);
//   }, [capturedAngles.length]);

//   const nextRequiredAngle = useMemo(() => {
//     return REQUIRED_ANGLES.find((a) => !capturedAngles.includes(a)) ?? null;
//   }, [capturedAngles]);

//   const speakOnce = useCallback(
//     (message: string) => {
//       if (!message) return;

//       const now = Date.now();
//       const sameMessage = lastSpokenMessageRef.current === message;
//       const tooSoon = now - lastSpokenAtRef.current < 1800;

//       if (sameMessage && tooSoon) return;

//       lastSpokenMessageRef.current = message;
//       lastSpokenAtRef.current = now;
//       speak?.(message, true);
//     },
//     [speak]
//   );

//   useEffect(() => {
//     mountedRef.current = true;
//     return () => {
//       mountedRef.current = false;
//       if (analyzeTimerRef.current) {
//         clearTimeout(analyzeTimerRef.current);
//         analyzeTimerRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (!permission) {
//       requestPermission();
//       return;
//     }

//     if (!permission.granted) {
//       speakOnce(t("personCapture.allowCamera"));
//       return;
//     }

//     speakOnce("Hold the phone in front of your face.");
//   }, [permission, requestPermission, speakOnce, t]);

//   const getNextAnglePrompt = useCallback((angle: RequiredAngle | null) => {
//     if (!angle) return GUIDE_MESSAGES.done;
//     return GUIDE_MESSAGES[`next_${angle}`] ?? "Adjust your face.";
//   }, []);

//   const completeFlow = useCallback(
//     (finalUris: string[], finalAngles: RequiredAngle[]) => {
//       setCurrentInstruction(GUIDE_MESSAGES.done);
//       setStatusText("5 of 5 captured");
//       speakOnce(GUIDE_MESSAGES.done);

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
//       const fileName = `person_${angle}_${Date.now()}.jpg`;
//       const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

//       await FileSystem.copyAsync({
//         from: tempUri,
//         to: fileUri,
//       });

//       const nextUris = [...capturedUris, fileUri];
//       const nextAngles = [...capturedAngles, angle];

//       setCapturedUris(nextUris);
//       setCapturedAngles(nextAngles);
//       setLastDetectedAngle(angle);

//       if (nextAngles.length >= REQUIRED_ANGLES.length) {
//         completeFlow(nextUris, nextAngles);
//         return;
//       }

//       const nextAngle = REQUIRED_ANGLES.find((a) => !nextAngles.includes(a)) ?? null;
//       const prompt = getNextAnglePrompt(nextAngle);
//       setCurrentInstruction(prompt);
//       setStatusText(`${nextAngles.length} of 5 captured`);
//       speakOnce(prompt);
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
//         console.log("[guide] status:", response.status);
//         console.log("[guide] raw response:", rawText);

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
//       console.log("[autoCapturePhoto] called with angle:", angle);

//       if (analyzeTimerRef.current) {
//         clearTimeout(analyzeTimerRef.current);
//         analyzeTimerRef.current = null;
//       }

//       if (!cameraRef.current || isCapturing || !cameraReady) {
//         console.log("[autoCapturePhoto] blocked", {
//           hasCameraRef: !!cameraRef.current,
//           isCapturing,
//           cameraReady,
//         });
//         return;
//       }

//       try {
//         setIsCapturing(true);
//         setCurrentInstruction(GUIDE_MESSAGES.capturing);
//         setStatusText(`Capturing ${angleLabelMap[angle]} angle`);
//         speakOnce(GUIDE_MESSAGES.capturing);
//         hapticFeedback?.("medium");

//         const photo = await cameraRef.current.takePictureAsync({
//           quality: 0.8,
//           base64: false,
//           skipProcessing: false,
//         });

//         console.log("[autoCapturePhoto] photo:", photo);

//         if (!photo?.uri) {
//           speakOnce("Could not capture image. Please hold still.");
//           return;
//         }

//         lastCaptureAtRef.current = Date.now();
//         await saveCapturedPhoto(photo.uri, angle);
//         await new Promise((res) => setTimeout(res, 900));
//       } catch (error) {
//         console.error("[autoCapturePhoto] error:", error);
//         speakOnce("Could not capture image. Please hold still.");
//         hapticFeedback?.("error");
//       } finally {
//         if (mountedRef.current) {
//           setIsCapturing(false);
//         }
//       }
//     },
//     [cameraReady, hapticFeedback, isCapturing, saveCapturedPhoto, speakOnce]
//   );

//   const handleGuideResponse = useCallback(
//     async (guide: FaceGuideResponse) => {
//       if (!mountedRef.current) return;

//       console.log("[guide response]", JSON.stringify(guide, null, 2));

//       if (!guide.ok) {
//         const msg = guide.message || GUIDE_MESSAGES.unavailable;
//         setCurrentInstruction(msg);
//         setStatusText("Waiting...");
//         speakOnce(msg);
//         return;
//       }

//       if (!guide.faceDetected) {
//         setLastDetectedAngle("unknown");
//         setCurrentInstruction(GUIDE_MESSAGES.no_face);
//         setStatusText("No face detected");
//         speakOnce(GUIDE_MESSAGES.no_face);
//         return;
//       }

//       setLastDetectedAngle(guide.angle);

//       if (guide.distance === "too_close") {
//         setCurrentInstruction(GUIDE_MESSAGES.too_close);
//         setStatusText("Too close");
//         speakOnce(GUIDE_MESSAGES.too_close);
//         return;
//       }

//       if (guide.distance === "too_far") {
//         setCurrentInstruction(GUIDE_MESSAGES.too_far);
//         setStatusText("Too far");
//         speakOnce(GUIDE_MESSAGES.too_far);
//         return;
//       }

//       if (guide.position !== "centered") {
//         const msg = GUIDE_MESSAGES[guide.position] ?? "Adjust position.";
//         setCurrentInstruction(msg);
//         setStatusText("Adjusting position");
//         speakOnce(msg);
//         return;
//       }

//       if (guide.duplicateAngle && guide.angle !== "unknown") {
//         const duplicateMsg =
//           GUIDE_MESSAGES[`duplicate_${guide.angle}`] ||
//           getNextAnglePrompt(guide.nextRequiredAngle);
//         setCurrentInstruction(duplicateMsg);
//         setStatusText(`Duplicate ${guide.angle} angle`);
//         speakOnce(duplicateMsg);
//         return;
//       }

//       if (
//         guide.angle !== "unknown" &&
//         guide.nextRequiredAngle !== null &&
//         guide.angle === guide.nextRequiredAngle &&
//         !capturedAngles.includes(guide.angle)
//       ) {
//         await autoCapturePhoto(guide.angle);
//         return;
//       }

//       if (!guide.stable) {
//         setCurrentInstruction(GUIDE_MESSAGES.hold_still);
//         setStatusText("Hold still");
//         speakOnce(GUIDE_MESSAGES.hold_still);
//         return;
//       }

//       const prompt = guide.message || getNextAnglePrompt(guide.nextRequiredAngle);
//       setCurrentInstruction(prompt);
//       setStatusText("Face aligned");
//       speakOnce(prompt);
//     },
//     [autoCapturePhoto, capturedAngles, getNextAnglePrompt, speakOnce]
//   );

//   const runGuidancePass = useCallback(async () => {
//     if (!permission?.granted || !cameraReady || isAnalyzing || isCapturing) return;
//     if (!nextRequiredAngle) return;
//     if (!cameraRef.current) return;

//     const now = Date.now();
//     if (now - lastCaptureAtRef.current < 1800) {
//       return;
//     }

//     try {
//       setIsAnalyzing(true);

//       const previewShot = await cameraRef.current.takePictureAsync({
//         quality: 0.3,
//         base64: true,
//         skipProcessing: true,
//       });

//       if (!previewShot?.base64) return;

//       const guide = await analyzeFrameForGuidance(previewShot.base64);
//       await handleGuideResponse(guide);
//     } catch (error: any) {
//       const message = String(error?.message || error || "");
//       if (!message.toLowerCase().includes("could not be captured")) {
//         console.error("[runGuidancePass] error:", error);
//       }
//     } finally {
//       if (mountedRef.current) {
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
//     if (!permission?.granted || !cameraReady) return;
//     if (capturedAngles.length >= REQUIRED_ANGLES.length) return;

//     const loop = () => {
//       runGuidancePass();
//       analyzeTimerRef.current = setTimeout(loop, 2200);
//     };

//     analyzeTimerRef.current = setTimeout(loop, 1200);

//     return () => {
//       if (analyzeTimerRef.current) {
//         clearTimeout(analyzeTimerRef.current);
//         analyzeTimerRef.current = null;
//       }
//     };
//   }, [permission?.granted, cameraReady, capturedAngles.length, runGuidancePass]);

//   const handleRestart = () => {
//     if (analyzeTimerRef.current) {
//       clearTimeout(analyzeTimerRef.current);
//       analyzeTimerRef.current = null;
//     }

//     setCapturedUris([]);
//     setCapturedAngles([]);
//     setCurrentInstruction("Hold the phone in front of your face.");
//     setStatusText("Looking for face...");
//     setLastDetectedAngle("unknown");

//     lastSpokenMessageRef.current = "";
//     lastSpokenAtRef.current = 0;
//     lastCaptureAtRef.current = 0;

//     speakOnce("Starting again.");
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
//           setCameraReady(true);
//           setCurrentInstruction("Look straight ahead.");
//           setStatusText("Camera ready");
//           speakOnce("Look straight ahead.");
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
//                 style={[
//                   styles.guideOval,
//                   {
//                     borderColor: colors.primary,
//                   },
//                 ]}
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

//         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
//           {capturedAngles.length} / 5 captured
//         </AccessibleText>

//         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
//           Current angle: {lastDetectedAngle}
//         </AccessibleText>

//         <AccessibleText style={[styles.metaText, { color: colors.text }]}>
//           {statusText}
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
//           title={t("common.modes")}
//           onPress={() => router.push("/features")}
//           accessibilityLabel={t("common.modes")}
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
//           title="Start Again"
//           onPress={handleRestart}
//           accessibilityLabel="Start registration again"
//           accessibilityHint="Clears captured angles and starts over"
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
import {
  Dimensions,
  I18nManager,
  StyleSheet,
  View,
} from "react-native";

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
  no_face: "No face detected. Hold the phone in front of your face.",
  too_close: "Move the phone a little away.",
  too_far: "Bring the phone a little closer.",
  move_left: "Move the phone slightly left.",
  move_right: "Move the phone slightly right.",
  move_up: "Move the phone slightly up.",
  move_down: "Move the phone slightly down.",
  hold_still: "Hold still.",
  duplicate_front: "Front angle already captured.",
  duplicate_left: "Left angle already captured.",
  duplicate_right: "Right angle already captured.",
  duplicate_up: "Up angle already captured.",
  duplicate_down: "Down angle already captured.",
  next_front: "Look straight ahead.",
  next_left: "Slowly turn a little left.",
  next_right: "Slowly turn a little right.",
  next_up: "Lift your chin slightly.",
  next_down: "Lower your chin slightly.",
  capturing: "Capturing image.",
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

// Replace with your current Mac IP when testing on a real phone
const BASE_URL = "http://192.168.18.206:8000";

const PersonCaptureScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { speak, hapticFeedback } = useAccessibility();
  const colors = useAccessibleColors();

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const [capturedUris, setCapturedUris] = useState<string[]>([]);
  const [capturedAngles, setCapturedAngles] = useState<RequiredAngle[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState(
    "Hold the phone in front of your face."
  );
  const [statusText, setStatusText] = useState("Looking for face...");
  const [lastDetectedAngle, setLastDetectedAngle] = useState<string>("unknown");

  const cameraRef = useRef<CameraView | null>(null);
  const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const lastSpokenMessageRef = useRef("");
  const lastSpokenAtRef = useRef(0);
  const lastCaptureAtRef = useRef(0);
  const pauseGuidanceUntilRef = useRef(0);

  const onPrimary = useMemo(() => onColor(colors.primary), [colors.primary]);

  const progressSegments = useMemo(() => {
    return Math.round((capturedAngles.length / REQUIRED_ANGLES.length) * SEGMENT_COUNT);
  }, [capturedAngles.length]);

  const nextRequiredAngle = useMemo(() => {
    return REQUIRED_ANGLES.find((a) => !capturedAngles.includes(a)) ?? null;
  }, [capturedAngles]);

  const speakOnce = useCallback(
    (message: string) => {
      if (!message) return;

      const now = Date.now();
      const sameMessage = lastSpokenMessageRef.current === message;
      const tooSoon = now - lastSpokenAtRef.current < 1800;

      if (sameMessage && tooSoon) return;

      lastSpokenMessageRef.current = message;
      lastSpokenAtRef.current = now;
      speak?.(message, true);
    },
    [speak]
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (analyzeTimerRef.current) {
        clearTimeout(analyzeTimerRef.current);
        analyzeTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!permission) {
      requestPermission();
      return;
    }

    if (!permission.granted) {
      speakOnce(t("personCapture.allowCamera"));
      return;
    }

    speakOnce("Hold the phone in front of your face.");
  }, [permission, requestPermission, speakOnce, t]);

  const getNextAnglePrompt = useCallback((angle: RequiredAngle | null) => {
    if (!angle) return GUIDE_MESSAGES.done;
    return GUIDE_MESSAGES[`next_${angle}`] ?? "Adjust your face.";
  }, []);

  const completeFlow = useCallback(
    (finalUris: string[], finalAngles: RequiredAngle[]) => {
      setCurrentInstruction(GUIDE_MESSAGES.done);
      setStatusText("5 of 5 captured");
      speakOnce(GUIDE_MESSAGES.done);

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
      const fileName = `person_${angle}_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: tempUri,
        to: fileUri,
      });

      const nextUris = [...capturedUris, fileUri];
      const nextAngles = [...capturedAngles, angle];

      setCapturedUris(nextUris);
      setCapturedAngles(nextAngles);
      setLastDetectedAngle(angle);

      if (nextAngles.length >= REQUIRED_ANGLES.length) {
        completeFlow(nextUris, nextAngles);
        return;
      }

      const nextAngle = REQUIRED_ANGLES.find((a) => !nextAngles.includes(a)) ?? null;
      const prompt = getNextAnglePrompt(nextAngle);
      setCurrentInstruction(prompt);
      setStatusText(`${nextAngles.length} of 5 captured`);
      speakOnce(prompt);
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
        console.log("[guide] status:", response.status);
        console.log("[guide] raw response:", rawText);

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
      console.log("[autoCapturePhoto] called with angle:", angle);

      pauseGuidanceUntilRef.current = Date.now() + 3000;

      if (analyzeTimerRef.current) {
        clearTimeout(analyzeTimerRef.current);
        analyzeTimerRef.current = null;
      }

      if (!cameraRef.current || isCapturing || !cameraReady) {
        console.log("[autoCapturePhoto] blocked", {
          hasCameraRef: !!cameraRef.current,
          isCapturing,
          cameraReady,
        });
        return;
      }

      try {
        setIsCapturing(true);
        setCurrentInstruction(GUIDE_MESSAGES.capturing);
        setStatusText(`Capturing ${angleLabelMap[angle]} angle`);
        speakOnce(GUIDE_MESSAGES.capturing);
        hapticFeedback?.("medium");

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        });

        console.log("[autoCapturePhoto] photo:", photo);

        if (!photo?.uri) {
          speakOnce("Could not capture image. Please hold still.");
          return;
        }

        lastCaptureAtRef.current = Date.now();
        pauseGuidanceUntilRef.current = Date.now() + 3000;

        await saveCapturedPhoto(photo.uri, angle);
        await new Promise((res) => setTimeout(res, 1200));
      } catch (error) {
        console.log("[autoCapturePhoto] capture error:", error);
        speakOnce("Could not capture image. Please hold still.");
        hapticFeedback?.("error");
      } finally {
        if (mountedRef.current) {
          setIsCapturing(false);
        }
      }
    },
    [cameraReady, hapticFeedback, isCapturing, saveCapturedPhoto, speakOnce]
  );

  const handleGuideResponse = useCallback(
    async (guide: FaceGuideResponse) => {
      if (!mountedRef.current) return;

      console.log("[guide response]", JSON.stringify(guide, null, 2));

      if (!guide.ok) {
        const msg = guide.message || GUIDE_MESSAGES.unavailable;
        setCurrentInstruction(msg);
        setStatusText("Waiting...");
        speakOnce(msg);
        return;
      }

      if (!guide.faceDetected) {
        setLastDetectedAngle("unknown");
        setCurrentInstruction(GUIDE_MESSAGES.no_face);
        setStatusText("No face detected");
        speakOnce(GUIDE_MESSAGES.no_face);
        return;
      }

      setLastDetectedAngle(guide.angle);

      if (guide.distance === "too_close") {
        setCurrentInstruction(GUIDE_MESSAGES.too_close);
        setStatusText("Too close");
        speakOnce(GUIDE_MESSAGES.too_close);
        return;
      }

      if (guide.distance === "too_far") {
        setCurrentInstruction(GUIDE_MESSAGES.too_far);
        setStatusText("Too far");
        speakOnce(GUIDE_MESSAGES.too_far);
        return;
      }

      if (guide.position !== "centered") {
        const msg = GUIDE_MESSAGES[guide.position] ?? "Adjust position.";
        setCurrentInstruction(msg);
        setStatusText("Adjusting position");
        speakOnce(msg);
        return;
      }

      if (guide.duplicateAngle && guide.angle !== "unknown") {
        const duplicateMsg =
          GUIDE_MESSAGES[`duplicate_${guide.angle}`] ||
          getNextAnglePrompt(guide.nextRequiredAngle);
        setCurrentInstruction(duplicateMsg);
        setStatusText(`Duplicate ${guide.angle} angle`);
        speakOnce(duplicateMsg);
        return;
      }

      if (
        guide.angle !== "unknown" &&
        !capturedAngles.includes(guide.angle)
      ) {
        await autoCapturePhoto(guide.angle);
        return;
      }

      if (!guide.stable) {
        setCurrentInstruction(GUIDE_MESSAGES.hold_still);
        setStatusText("Hold still");
        speakOnce(GUIDE_MESSAGES.hold_still);
        return;
      }

      const prompt = guide.message || getNextAnglePrompt(guide.nextRequiredAngle);
      setCurrentInstruction(prompt);
      setStatusText("Face aligned");
      speakOnce(prompt);
    },
    [autoCapturePhoto, capturedAngles, getNextAnglePrompt, speakOnce]
  );

  const runGuidancePass = useCallback(async () => {
    if (!permission?.granted || !cameraReady || isAnalyzing || isCapturing) return;
    if (!nextRequiredAngle) return;
    if (!cameraRef.current) return;

    const now = Date.now();

    if (now < pauseGuidanceUntilRef.current) {
      return;
    }

    if (now - lastCaptureAtRef.current < 2200) {
      return;
    }

    try {
      setIsAnalyzing(true);

      const previewShot = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        base64: true,
        skipProcessing: true,
      });

      if (!previewShot?.base64) return;

      const guide = await analyzeFrameForGuidance(previewShot.base64);
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
      if (mountedRef.current) {
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
    if (!permission?.granted || !cameraReady) return;
    if (capturedAngles.length >= REQUIRED_ANGLES.length) return;

    const loop = () => {
      runGuidancePass();
      analyzeTimerRef.current = setTimeout(loop, 2200);
    };

    analyzeTimerRef.current = setTimeout(loop, 1200);

    return () => {
      if (analyzeTimerRef.current) {
        clearTimeout(analyzeTimerRef.current);
        analyzeTimerRef.current = null;
      }
    };
  }, [permission?.granted, cameraReady, capturedAngles.length, runGuidancePass]);

  const handleRestart = () => {
    if (analyzeTimerRef.current) {
      clearTimeout(analyzeTimerRef.current);
      analyzeTimerRef.current = null;
    }

    setCapturedUris([]);
    setCapturedAngles([]);
    setCurrentInstruction("Hold the phone in front of your face.");
    setStatusText("Looking for face...");
    setLastDetectedAngle("unknown");

    lastSpokenMessageRef.current = "";
    lastSpokenAtRef.current = 0;
    lastCaptureAtRef.current = 0;
    pauseGuidanceUntilRef.current = 0;

    speakOnce("Starting again.");
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
          setCameraReady(true);
          setCurrentInstruction("Look straight ahead.");
          setStatusText("Camera ready");
          speakOnce("Look straight ahead.");
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
                style={[
                  styles.guideOval,
                  {
                    borderColor: colors.primary,
                  },
                ]}
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
          {currentInstruction}
        </AccessibleText>

        <AccessibleText style={[styles.metaText, { color: colors.text }]}>
          {capturedAngles.length} / 5 captured
        </AccessibleText>

        <AccessibleText style={[styles.metaText, { color: colors.text }]}>
          Current angle: {lastDetectedAngle}
        </AccessibleText>

        <AccessibleText style={[styles.metaText, { color: colors.text }]}>
          {statusText}
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
          title={t("common.modes")}
          onPress={() => router.push("/features")}
          accessibilityLabel={t("common.modes")}
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
          title="Start Again"
          onPress={handleRestart}
          accessibilityLabel="Start registration again"
          accessibilityHint="Clears captured angles and starts over"
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