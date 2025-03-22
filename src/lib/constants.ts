
import { Language } from "./types";

export const SUPPORTED_FILE_TYPES = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
];

export const DEFAULT_LANGUAGE = "en";

// Hindi translation helpers for better text-to-speech
export const HINDI_TEXT_SAMPLES = {
  welcome: "स्वागत है",
  hello: "नमस्ते",
  speak: "बोलें",
  listen: "सुनें",
  translate: "अनुवाद करें",
  generate: "उत्पन्न करें",
  stop: "रोकें",
  start: "शुरू करें",
  typeHere: "यहां टाइप करें या बोलें",
  processing: "प्रोसेसिंग हो रही है...",
  done: "पूरा हुआ",
  audio: "ऑडियो",
  text: "टेक्स्ट",
  speechConverter: "भाषण कनवर्टर",
  language: "भाषा",
  record: "रिकॉर्ड",
  recording: "रिकॉर्डिंग",
  recentConversions: "हाल के रूपांतरण",
  selectLanguage: "भाषा चुनें"
};
