// // import * as Speech from "expo-speech";
// // import { Audio, AVPlaybackStatus } from "expo-av";
// // // Use the legacy API path to avoid deprecation error on SDK 54
// // import * as FileSystem from "expo-file-system/legacy";

// // const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? "";

// // // ─── Common Urdu UI phrases ───────────────────────────────────────────────────

// // // export const UI_URDU: Record<string, string> = {
// // //   back:             "واپس",
// // //   capture:          "تصویر لی جا رہی ہے",
// // //   detecting:        "شناخت ہو رہی ہے",
// // //   connected:        "سرور سے رابطہ ہو گیا",
// // //   disconnected:     "سرور سے رابطہ نہیں",
// // //   switched_urdu:    "زبان اردو میں تبدیل ہو گئی",
// // //   switched_english: "Language changed to English",
// // //   screen_open:      "کرنسی ریڈر اسکرین کھلی ہے",
// // //   auto_started:     "خودکار شناخت شروع",
// // //   going_back:       "واپس مینو پر جا رہے ہیں",
// // //   no_detection:     "کوئی کرنسی نہیں ملی",
// // // };
// // export const UI_URDU: Record<string, string> = {
// //   back: "واپس",
// //   capture: "تصویر لی جا رہی ہے",
// //   detecting: "شناخت ہو رہی ہے",
// //   connected: "سرور سے رابطہ ہو گیا",
// //   disconnected: "سرور سے رابطہ نہیں",
// //   switched_urdu: "زبان اردو میں تبدیل ہو گئی",
// //   switched_english: "Language changed to English",
// //   auto_started: "خودکار شناخت شروع",
// //   going_back: "واپس مینو پر جا رہے ہیں",
// //   no_detection: "کچھ نہیں ملا",

// //   // colour detection
// //   color_title: "رنگ کی شناخت",
// //   color_detecting: "رنگ پہچانا جا رہا ہے",
// //   color_no_detection: "رنگ نہیں ملا",
// // };

// // // ─── Audio helpers ────────────────────────────────────────────────────────────

// // let currentSound: Audio.Sound | null = null;

// // async function playAudioFile(uri: string): Promise<void> {
// //   if (currentSound) {
// //     try {
// //       await currentSound.stopAsync();
// //       await currentSound.unloadAsync();
// //     } catch {}
// //     currentSound = null;
// //   }

// //   await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
// //   const { sound } = await Audio.Sound.createAsync(
// //     { uri },
// //     { shouldPlay: true, volume: 1.0 }
// //   );
// //   currentSound = sound;

// //   sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
// //     if (status.isLoaded && status.didJustFinish) {
// //       sound.unloadAsync().catch(() => {});
// //       if (currentSound === sound) currentSound = null;
// //     }
// //   });
// // }

// // function arrayBufferToBase64(buffer: ArrayBuffer): string {
// //   let binary = "";
// //   const bytes = new Uint8Array(buffer);
// //   for (let i = 0; i < bytes.byteLength; i++) {
// //     binary += String.fromCharCode(bytes[i]);
// //   }
// //   return btoa(binary);
// // }

// // // ─── OpenAI TTS — Urdu (shimmer voice) ───────────────────────────────────────

// // export async function speakUrduOpenAI(text: string): Promise<boolean> {
// //   if (!OPENAI_API_KEY) {
// //     console.warn("[TTS] EXPO_PUBLIC_OPENAI_API_KEY is not set");
// //     return false;
// //   }
// //   if (!text) return false;

// //   try {
// //     const response = await fetch("https://api.openai.com/v1/audio/speech", {
// //       method: "POST",
// //       headers: {
// //         Authorization: `Bearer ${OPENAI_API_KEY}`,
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         model: "tts-1",
// //         voice: "shimmer",
// //         input: text,
// //         response_format: "mp3",
// //       }),
// //     });

// //     if (!response.ok) {
// //       console.warn("[TTS/Urdu] OpenAI error:", response.status);
// //       return false;
// //     }

// //     const arrayBuffer = await response.arrayBuffer();
// //     const base64 = arrayBufferToBase64(arrayBuffer);
// //     const fileUri =
// //       (FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? "") +
// //       "ui_tts_ur.mp3";
// //     await FileSystem.writeAsStringAsync(fileUri, base64, {
// //       encoding: FileSystem.EncodingType.Base64,
// //     });
// //     await playAudioFile(fileUri);
// //     return true;
// //   } catch (e) {
// //     console.warn("[TTS/Urdu] Error:", e);
// //     return false;
// //   }
// // }

// // // ─── OpenAI TTS — English (nova voice) ───────────────────────────────────────

// // export async function speakEnglishOpenAI(text: string): Promise<boolean> {
// //   if (!OPENAI_API_KEY) {
// //     console.warn("[TTS] EXPO_PUBLIC_OPENAI_API_KEY is not set");
// //     return false;
// //   }
// //   if (!text) return false;

// //   try {
// //     const response = await fetch("https://api.openai.com/v1/audio/speech", {
// //       method: "POST",
// //       headers: {
// //         Authorization: `Bearer ${OPENAI_API_KEY}`,
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         model: "tts-1",
// //         voice: "nova",
// //         input: text,
// //         response_format: "mp3",
// //       }),
// //     });

// //     if (!response.ok) {
// //       console.warn("[TTS/English] OpenAI error:", response.status);
// //       return false;
// //     }

// //     const arrayBuffer = await response.arrayBuffer();
// //     const base64 = arrayBufferToBase64(arrayBuffer);
// //     const fileUri =
// //       (FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? "") +
// //       "ui_tts_en.mp3";
// //     await FileSystem.writeAsStringAsync(fileUri, base64, {
// //       encoding: FileSystem.EncodingType.Base64,
// //     });
// //     await playAudioFile(fileUri);
// //     return true;
// //   } catch (e) {
// //     console.warn("[TTS/English] Error:", e);
// //     return false;
// //   }
// // }

// // // ─── Device TTS — English ─────────────────────────────────────────────────────

// // export function speakEnglishDevice(text: string): void {
// //   if (!text) return;
// //   Speech.speak(text, { language: "en-US", rate: 0.95 });
// // }

// // // ─── Main export ──────────────────────────────────────────────────────────────

// // /**
// //  * speakUI(text, lang)
// //  *
// //  * Call for any UI feedback — button presses, screen announcements, etc.
// //  *  - "ur" → OpenAI shimmer (device has no Urdu voice)
// //  *  - "en" → device TTS via expo-speech (instant, no API call)
// //  */
// // export function speakUI(text: string, lang: "en" | "ur"): void {
// //   if (!text) return;
// //   if (lang === "ur") {
// //     void speakUrduOpenAI(text);
// //   } else {
// //     speakEnglishDevice(text);
// //   }
// // }

// // // ─── Stop all audio ───────────────────────────────────────────────────────────

// // export function stopTTS(): void {
// //   Speech.stop();
// //   if (currentSound) {
// //     currentSound.stopAsync().catch(() => {});
// //     currentSound.unloadAsync().catch(() => {});
// //     currentSound = null;
// //   }
// // }

// /**
//  * ttsService.ts
//  *
//  * Centralised TTS for the app.
//  *  - Urdu   → OpenAI tts-1 (shimmer voice) — device has no Urdu voice
//  *  - English → expo-speech device TTS (fast, no API call)
//  *
//  * NEW: translateAndSpeakCurrency(denomination, lang)
//  *  - Calls GPT-4o-mini to translate e.g. "500" → "پانچ سو روپے" or "Five hundred rupees"
//  *  - Then speaks via the correct pipeline for that language
//  *  - Falls back to speakUI with the raw denomination if translation fails
//  */

// import * as Speech from "expo-speech";
// import { Audio, AVPlaybackStatus } from "expo-av";
// import * as FileSystem from "expo-file-system/legacy";

// const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? "";

// // ─── Common Urdu UI phrases ───────────────────────────────────────────────────

// export const UI_URDU: Record<string, string> = {
//   back:             "واپس",
//   capture:          "تصویر لی جا رہی ہے",
//   detecting:        "شناخت ہو رہی ہے",
//   connected:        "سرور سے رابطہ ہو گیا",
//   disconnected:     "سرور سے رابطہ نہیں",
//   switched_urdu:    "زبان اردو میں تبدیل ہو گئی",
//   switched_english: "Language changed to English",
//   screen_open:      "کرنسی ریڈر اسکرین کھلی ہے",
//   auto_started:     "خودکار شناخت شروع",
//   going_back:       "واپس مینو پر جا رہے ہیں",
//   no_detection:     "کوئی کرنسی نہیں ملی",
// };

// // ─── Audio helpers ────────────────────────────────────────────────────────────

// let currentSound: Audio.Sound | null = null;

// async function playAudioFile(uri: string): Promise<void> {
//   if (currentSound) {
//     try {
//       await currentSound.stopAsync();
//       await currentSound.unloadAsync();
//     } catch {}
//     currentSound = null;
//   }

//   await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
//   const { sound } = await Audio.Sound.createAsync(
//     { uri },
//     { shouldPlay: true, volume: 1.0 }
//   );
//   currentSound = sound;

//   sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
//     if (status.isLoaded && status.didJustFinish) {
//       sound.unloadAsync().catch(() => {});
//       if (currentSound === sound) currentSound = null;
//     }
//   });
// }

// function arrayBufferToBase64(buffer: ArrayBuffer): string {
//   let binary = "";
//   const bytes = new Uint8Array(buffer);
//   for (let i = 0; i < bytes.byteLength; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return btoa(binary);
// }

// // ─── OpenAI TTS — Urdu (shimmer voice) ───────────────────────────────────────

// export async function speakUrduOpenAI(text: string): Promise<boolean> {
//   if (!OPENAI_API_KEY) {
//     console.warn("[TTS] EXPO_PUBLIC_OPENAI_API_KEY is not set");
//     return false;
//   }
//   if (!text) return false;

//   try {
//     const response = await fetch("https://api.openai.com/v1/audio/speech", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "tts-1",
//         voice: "shimmer",
//         input: text,
//         response_format: "mp3",
//       }),
//     });

//     if (!response.ok) {
//       console.warn("[TTS/Urdu] OpenAI error:", response.status);
//       return false;
//     }

//     const arrayBuffer = await response.arrayBuffer();
//     const base64 = arrayBufferToBase64(arrayBuffer);
//     const fileUri =
//       (FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? "") +
//       "ui_tts_ur.mp3";
//     await FileSystem.writeAsStringAsync(fileUri, base64, {
//       encoding: FileSystem.EncodingType.Base64,
//     });
//     await playAudioFile(fileUri);
//     return true;
//   } catch (e) {
//     console.warn("[TTS/Urdu] Error:", e);
//     return false;
//   }
// }

// // ─── OpenAI TTS — English (nova voice) ───────────────────────────────────────

// export async function speakEnglishOpenAI(text: string): Promise<boolean> {
//   if (!OPENAI_API_KEY) {
//     console.warn("[TTS] EXPO_PUBLIC_OPENAI_API_KEY is not set");
//     return false;
//   }
//   if (!text) return false;

//   try {
//     const response = await fetch("https://api.openai.com/v1/audio/speech", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "tts-1",
//         voice: "nova",
//         input: text,
//         response_format: "mp3",
//       }),
//     });

//     if (!response.ok) {
//       console.warn("[TTS/English] OpenAI error:", response.status);
//       return false;
//     }

//     const arrayBuffer = await response.arrayBuffer();
//     const base64 = arrayBufferToBase64(arrayBuffer);
//     const fileUri =
//       (FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? "") +
//       "ui_tts_en.mp3";
//     await FileSystem.writeAsStringAsync(fileUri, base64, {
//       encoding: FileSystem.EncodingType.Base64,
//     });
//     await playAudioFile(fileUri);
//     return true;
//   } catch (e) {
//     console.warn("[TTS/English] Error:", e);
//     return false;
//   }
// }

// // ─── Device TTS — English ─────────────────────────────────────────────────────

// export function speakEnglishDevice(text: string): void {
//   if (!text) return;
//   Speech.speak(text, { language: "en-US", rate: 0.95 });
// }

// // ─── Main UI export ───────────────────────────────────────────────────────────

// export function speakUI(text: string, lang: "en" | "ur"): void {
//   if (!text) return;
//   if (lang === "ur") {
//     void speakUrduOpenAI(text);
//   } else {
//     speakEnglishDevice(text);
//   }
// }

// // ─── Currency translation + speech (NEW) ─────────────────────────────────────

// /**
//  * translateAndSpeakCurrency(denomination, lang)
//  *
//  * Takes the raw denomination string from the detection API (e.g. "500", "1000")
//  * and does two things:
//  *   1. Asks GPT-4o-mini to produce a natural spoken phrase in the target language.
//  *      Urdu   → "پانچ سو روپے"
//  *      English → "Five hundred rupees"
//  *   2. Passes the phrase to the correct TTS pipeline:
//  *      Urdu   → speakUrduOpenAI  (OpenAI shimmer voice)
//  *      English → speakEnglishOpenAI (OpenAI nova voice)
//  *
//  * Falls back to speaking the raw denomination if the translation call fails,
//  * so detection results are never completely silent.
//  *
//  * Returns the translated phrase so the currency screen can update its display text.
//  */
// export async function translateAndSpeakCurrency(
//   denomination: string,
//   lang: "en" | "ur"
// ): Promise<string> {
//   if (!denomination) return "";

//   export async function translateAndSpeakColor(
//   colorText: string,
//   lang: "en" | "ur"
// ): Promise<string> {
//   if (!colorText) return "";

//   const systemPrompt =
//     lang === "ur"
//       ? `You are a colour identification assistant.
// Translate the given colour names into natural Urdu.
// Reply with ONLY the Urdu colour phrase in Urdu script.
// Examples:
// red → لال
// blue, white → نیلا، سفید
// black, grey, brown → کالا، سرمئی، بھورا
// No explanation. No punctuation except Urdu commas when needed.`
//       : `You are a colour identification assistant.
// Convert the given colour names into a natural English spoken phrase.
// Reply with ONLY the English colour phrase.
// Examples:
// red → Red
// blue, white → Blue and white
// black, grey, brown → Black, grey and brown
// No explanation.`;

//   let phrase = colorText;

//   if (!OPENAI_API_KEY) {
//     console.warn("[TTS/Color] EXPO_PUBLIC_OPENAI_API_KEY not set — using raw colour text");
//   } else {
//     try {
//       const response = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "gpt-4o-mini",
//           max_tokens: 40,
//           temperature: 0,
//           messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user", content: colorText },
//           ],
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const translated = data?.choices?.[0]?.message?.content?.trim();

//         if (translated) {
//           phrase = translated;
//           console.log(`[TTS/Color] Translated "${colorText}" → "${phrase}" (${lang})`);
//         }
//       } else {
//         console.warn("[TTS/Color] GPT error:", response.status);
//       }
//     } catch (e) {
//       console.warn("[TTS/Color] Translation failed:", e);
//     }
//   }

//   if (lang === "ur") {
//     void speakUrduOpenAI(phrase);
//   } else {
//     void speakEnglishOpenAI(phrase);
//   }

//   return phrase;
// }
// export async function translateAndSpeakObject(
//   objectText: string,
//   lang: "en" | "ur"
// ): Promise<string> {
//   if (!objectText) return "";

//   const systemPrompt =
//     lang === "ur"
//       ? `You are an object navigation assistant for visually impaired users.
// Translate the detected object or navigation phrase into short natural Urdu.
// Reply with ONLY the Urdu phrase in Urdu script.
// Examples:
// couch → صوفہ
// chair → کرسی
// person center near → شخص سامنے قریب ہے
// person left far → شخص بائیں طرف دور ہے
// cell phone → موبائل فون
// dining table → کھانے کی میز
// No explanation. No punctuation.`
//       : `You are an object navigation assistant for visually impaired users.
// Convert the detected object or navigation phrase into short natural English.
// Reply with ONLY the English phrase.
// Examples:
// couch → Couch
// chair → Chair
// person center near → Person in front nearby
// person left far → Person on the left far away
// No explanation.`;

//   let phrase = objectText;

//   if (!OPENAI_API_KEY) {
//     console.warn("[TTS/Object] EXPO_PUBLIC_OPENAI_API_KEY not set — using raw object text");
//   } else {
//     try {
//       const response = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "gpt-4o-mini",
//           max_tokens: 40,
//           temperature: 0,
//           messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user", content: objectText },
//           ],
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const translated = data?.choices?.[0]?.message?.content?.trim();

//         if (translated) {
//           phrase = translated;
//           console.log(`[TTS/Object] Translated "${objectText}" → "${phrase}" (${lang})`);
//         }
//       } else {
//         console.warn("[TTS/Object] GPT error:", response.status);
//       }
//     } catch (e) {
//       console.warn("[TTS/Object] Translation failed:", e);
//     }
//   }

//   if (lang === "ur") {
//     void speakUrduOpenAI(phrase);
//   } else {
//     void speakEnglishOpenAI(phrase);
//   }

//   return phrase;
// }


//   // ── Build the translation prompt ────────────────────────────────────────
//   // We give GPT-4o-mini a very tight instruction so it returns ONLY the
//   // spoken phrase — no explanation, no punctuation, no extra words.
//   const systemPrompt =
//     lang === "ur"
//       ? `You are a Pakistani currency reader assistant.
// The user gives you a Pakistani Rupee (PKR) denomination number.
// Reply with ONLY the natural Urdu spoken phrase for that amount, in Urdu script.
// Examples:
//   10   → دس روپے
//   50   → پچاس روپے
//   100  → سو روپے
//   500  → پانچ سو روپے
//   1000 → ایک ہزار روپے
//   5000 → پانچ ہزار روپے
// No explanation. No punctuation. Urdu script only.`
//       : `You are a Pakistani currency reader assistant.
// The user gives you a Pakistani Rupee (PKR) denomination number.
// Reply with ONLY the natural English spoken phrase for that amount.
// Examples:
//   10   → Ten rupees
//   50   → Fifty rupees
//   100  → One hundred rupees
//   500  → Five hundred rupees
//   1000 → One thousand rupees
//   5000 → Five thousand rupees
// No explanation. No punctuation. English only.`;

//   let phrase = denomination; // fallback if translation fails

//   if (!OPENAI_API_KEY) {
//     console.warn("[TTS/Currency] EXPO_PUBLIC_OPENAI_API_KEY not set — using raw denomination");
//   } else {
//     try {
//       const response = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "gpt-4o-mini",
//           // max_tokens kept very small — we only want a short phrase
//           max_tokens: 20,
//           temperature: 0,
//           messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user",   content: denomination },
//           ],
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const translated = data?.choices?.[0]?.message?.content?.trim();

//         if (translated) {
//           phrase = translated;
//           console.log(
//             `[TTS/Currency] Translated "${denomination}" → "${phrase}" (${lang})`
//           );
//         } else {
//           console.warn("[TTS/Currency] Empty translation response — using raw denomination");
//         }
//       } else {
//         console.warn("[TTS/Currency] GPT error:", response.status, "— using raw denomination");
//       }
//     } catch (e) {
//       console.warn("[TTS/Currency] Translation fetch failed:", e, "— using raw denomination");
//     }
//   }

//   // ── Speak the (translated or fallback) phrase ────────────────────────────
//   if (lang === "ur") {
//     void speakUrduOpenAI(phrase);
//   } else {
//     void speakEnglishOpenAI(phrase);
//   }

//   return phrase;
// }

// // ─── Stop all audio ───────────────────────────────────────────────────────────

// export function stopTTS(): void {
//   Speech.stop();
//   if (currentSound) {
//     currentSound.stopAsync().catch(() => {});
//     currentSound.unloadAsync().catch(() => {});
//     currentSound = null;
//   }
// }

import * as Speech from "expo-speech";
import { Audio, AVPlaybackStatus } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? "";

export const UI_URDU: Record<string, string> = {
  back: "واپس",
  capture: "تصویر لی جا رہی ہے",
  detecting: "شناخت ہو رہی ہے",
  connected: "سرور سے رابطہ ہو گیا",
  disconnected: "سرور سے رابطہ نہیں",
  switched_urdu: "زبان اردو میں تبدیل ہو گئی",
  switched_english: "Language changed to English",
  auto_started: "خودکار شناخت شروع",
  going_back: "واپس مینو پر جا رہے ہیں",
  no_detection: "کچھ نہیں ملا",

  color_title: "رنگ کی شناخت",
  color_detecting: "رنگ پہچانا جا رہا ہے",
  color_no_detection: "رنگ نہیں ملا",
};

let currentSound: Audio.Sound | null = null;

async function playAudioFile(uri: string): Promise<void> {
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch {}
    currentSound = null;
  }

  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

  const { sound } = await Audio.Sound.createAsync(
    { uri },
    { shouldPlay: true, volume: 1.0 }
  );

  currentSound = sound;

  sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      sound.unloadAsync().catch(() => {});
      if (currentSound === sound) currentSound = null;
    }
  });
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

export async function speakUrduOpenAI(text: string): Promise<boolean> {
  if (!text) return false;

  if (!OPENAI_API_KEY) {
    console.warn("[TTS/Urdu] OpenAI API key missing");
    return false;
  }

  try {
    await stopTTSAsync();

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "shimmer",
        input: text,
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      console.warn("[TTS/Urdu] OpenAI error:", response.status);
      return false;
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);

    const fileUri =
      (FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? "") +
      `tts_urdu_${Date.now()}.mp3`;

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await playAudioFile(fileUri);
    return true;
  } catch (error) {
    console.warn("[TTS/Urdu] Failed:", error);
    return false;
  }
}

export async function speakEnglishOpenAI(text: string): Promise<boolean> {
  if (!text) return false;

  if (!OPENAI_API_KEY) {
    console.warn("[TTS/English] OpenAI API key missing, using device TTS");
    speakEnglishDevice(text);
    return false;
  }

  try {
    await stopTTSAsync();

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "nova",
        input: text,
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      console.warn("[TTS/English] OpenAI error:", response.status);
      speakEnglishDevice(text);
      return false;
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);

    const fileUri =
      (FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? "") +
      `tts_english_${Date.now()}.mp3`;

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await playAudioFile(fileUri);
    return true;
  } catch (error) {
    console.warn("[TTS/English] Failed:", error);
    speakEnglishDevice(text);
    return false;
  }
}

export function speakEnglishDevice(text: string): void {
  if (!text) return;

  Speech.stop();
  Speech.speak(text, {
    language: "en-US",
    rate: 0.95,
  });
}

export function speakUI(text: string, lang: "en" | "ur"): void {
  if (!text) return;

  if (lang === "ur") {
    void speakUrduOpenAI(text);
  } else {
    speakEnglishDevice(text);
  }
}

async function translateWithOpenAI(
  text: string,
  systemPrompt: string
): Promise<string> {
  if (!text) return "";

  if (!OPENAI_API_KEY) {
    console.warn("[Translate] OpenAI API key missing");
    return text;
  }

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
          { role: "user", content: text },
        ],
      }),
    });

    if (!response.ok) {
      console.warn("[Translate] GPT error:", response.status);
      return text;
    }

    const data = await response.json();
    const translated = data?.choices?.[0]?.message?.content?.trim();

    return translated || text;
  } catch (error) {
    console.warn("[Translate] Failed:", error);
    return text;
  }
}

export async function translateAndSpeakCurrency(
  denomination: string,
  lang: "en" | "ur"
): Promise<string> {
  if (!denomination) return "";

  const systemPrompt =
    lang === "ur"
      ? `Translate this Pakistani currency detection result into short natural spoken Urdu.
Reply ONLY in Urdu script.
Do not explain.`
      : `Convert this Pakistani currency detection result into short natural spoken English.
Reply ONLY with the spoken phrase.
Do not explain.`;

  const phrase = await translateWithOpenAI(denomination, systemPrompt);

  if (lang === "ur") {
    void speakUrduOpenAI(phrase);
  } else {
    void speakEnglishOpenAI(phrase);
  }

  return phrase;
}

export async function translateAndSpeakColor(
  colorText: string,
  lang: "en" | "ur"
): Promise<string> {
  if (!colorText) return "";

  const systemPrompt =
    lang === "ur"
      ? `Translate this colour detection result into short natural spoken Urdu.
Reply ONLY in Urdu script.
Do not explain.`
      : `Convert this colour detection result into short natural spoken English.
Reply ONLY with the spoken phrase.
Do not explain.`;

  const phrase = await translateWithOpenAI(colorText, systemPrompt);

  if (lang === "ur") {
    void speakUrduOpenAI(phrase);
  } else {
    void speakEnglishOpenAI(phrase);
  }

  return phrase;
}

// export async function translateAndSpeakObject(
//   objectText: string,
//   lang: "en" | "ur"
// ): Promise<string> {
//   if (!objectText) return "";

// //   const systemPrompt =
// //     lang === "ur"
// //       ? `Translate this detected object or navigation phrase into short natural spoken Urdu for a visually impaired user.
// // Reply ONLY in Urdu script.
// // Do not explain.`
// //       : `Convert this detected object or navigation phrase into short natural spoken English for a visually impaired user.
// // Reply ONLY with the spoken phrase.
// // Do not explain.`;
// const systemPrompt =
//   lang === "ur"
//     ? `Translate only object names and navigation words into short natural Urdu for a visually impaired user.

// IMPORTANT:
// If the text contains a person's name, keep the name EXACTLY as it is.
// Do NOT translate names.
// Do NOT convert names into Urdu script.

// Examples:
// Ashbah center near → Ashbah سامنے قریب ہے
// Muneeb left far → Muneeb بائیں طرف دور ہے
// couch → صوفہ
// chair → کرسی
// cell phone → موبائل فون

// Reply ONLY in Urdu script.
// No explanation.`

//   const phrase = await translateWithOpenAI(objectText, systemPrompt);

//   if (lang === "ur") {
//     void speakUrduOpenAI(phrase);
//   } else {
//     void speakEnglishOpenAI(phrase);
//   }

//   return phrase;
// }

export async function translateAndSpeakObject(
  objectText: string,
  lang: "en" | "ur"
): Promise<string> {
  if (!objectText) return "";

  const systemPrompt =
    lang === "ur"
      ? `Translate only object names and navigation words into short natural Urdu for a visually impaired user.

IMPORTANT:
If the text contains a person's name, keep the name EXACTLY as it is.
Do NOT translate names.
Do NOT convert names into Urdu script.

Examples:
Ashbah center near → Ashbah سامنے قریب ہے
Muneeb left far → Muneeb بائیں طرف دور ہے
couch → صوفہ
chair → کرسی
cell phone → موبائل فون

Reply ONLY in Urdu script.
No explanation.`
      : `Convert this detected object or navigation phrase into short natural spoken English for a visually impaired user.

IMPORTANT:
If the text contains a person's name, keep the name exactly as it is.

Reply ONLY with the spoken phrase.
Do not explain.`;

  const phrase = await translateWithOpenAI(objectText, systemPrompt);

  if (lang === "ur") {
    void speakUrduOpenAI(phrase);
  } else {
    void speakEnglishOpenAI(phrase);
  }

  return phrase;
}
export async function translateAndSpeakPersonCapture(
  text: string,
  lang: "en" | "ur"
): Promise<string> {
  if (!text) return "";

  const systemPrompt =
    lang === "ur"
      ? `Translate this face/person registration guidance into short natural spoken Urdu for a visually impaired user.
Reply ONLY in Urdu script.
Do not explain.
Keep it simple and direct.`
      : `Convert this face/person registration guidance into short natural spoken English for a visually impaired user.
Reply ONLY with the spoken phrase.
Do not explain.
Keep it simple and direct.`;

  const phrase = await translateWithOpenAI(text, systemPrompt);

  if (lang === "ur") {
    await speakUrduOpenAI(phrase);
  } else {
    await speakEnglishOpenAI(phrase);
  }

  return phrase;
}
async function stopTTSAsync(): Promise<void> {
  Speech.stop();

  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch {}
    currentSound = null;
  }
}

export function stopTTS(): void {
  Speech.stop();

  if (currentSound) {
    currentSound.stopAsync().catch(() => {});
    currentSound.unloadAsync().catch(() => {});
    currentSound = null;
  }
}