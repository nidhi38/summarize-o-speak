
import { Language } from "./types";

export const SUPPORTED_FILE_TYPES = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
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
];

export const DEFAULT_LANGUAGE = "en";

// Helper function to check for Devanagari script (used for Hindi detection)
export const containsDevanagariScript = (text: string): boolean => {
  return /[\u0900-\u097F]/.test(text);
};

// Language-specific text samples for better text-to-speech
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
  selectLanguage: "भाषा चुनें",
  generateAudio: "ऑडियो उत्पन्न करें",
  stopRecording: "रिकॉर्डिंग रोकें",
  recordSpeech: "भाषण रिकॉर्ड करें", 
  translating: "अनुवाद हो रहा है...",
  translationComplete: "अनुवाद पूरा हुआ",
  audioGenerated: "ऑडियो उत्पन्न हुआ",
  playAudio: "ऑडियो चलाएं",
  pauseAudio: "ऑडियो रोकें",
  typeOrSpeak: "यहां टाइप करें या बोलें",
  errorMessage: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
  noHindiVoice: "हिंदी आवाज़ नहीं मिली। कृपया एक हिंदी आवाज़ वाला ब्राउज़र इस्तेमाल करें।",
  hindiTranslationComplete: "हिंदी अनुवाद पूरा हुआ",
  hindiSpeechComplete: "हिंदी वाणी रूपांतरण पूरा हुआ",
  speechConverterTitle: "वाणी रूपांतरक",
  audioConversion: "ऑडियो रूपांतरण",
  convertTextSpeech: "टेक्स्ट से वाणी रूपांतरण करें",
  speakClearly: "माइक्रोफ़ोन में स्पष्ट रूप से बोलें",
  hindiVoiceNotice: "हिंदी आवाज़ उपलब्ध है! आप हिंदी में बोल और सुन सकते हैं।",
  enhancedExperience: "बेहतर अनुभव के लिए",
  textSample1: "यह हिंदी में एक नमूना वाक्य है",
  textSample2: "हिंदी भाषा भारत की प्रमुख भाषाओं में से एक है",
  textSample3: "मुझे हिंदी में बात करना अच्छा लगता है",
  voiceQualityGood: "आवाज़ की गुणवत्ता अच्छी है",
  voiceQualityBad: "आवाज़ की गुणवत्ता खराब है",
  tryAgain: "फिर से प्रयास करें",
  success: "सफल",
  failure: "विफल",
  languageDetected: "पहचानी गई भाषा",
  speakNow: "अब बोलें",
  listening: "सुन रहा है...",
  notListening: "सुन नहीं रहा है",
  // Adding date format related translations
  createdOn: "बनाया गया",
  today: "आज",
  yesterday: "कल",
};

// Adding sample text for other languages to help with translation and TTS
export const LANGUAGE_SAMPLES = {
  es: {
    textSample1: "Esta es una frase de ejemplo en español",
    textSample2: "El español es uno de los idiomas más hablados del mundo",
    textSample3: "Me gusta hablar en español"
  },
  fr: {
    textSample1: "C'est une phrase d'exemple en français",
    textSample2: "Le français est l'une des langues les plus parlées au monde",
    textSample3: "J'aime parler en français"
  },
  de: {
    textSample1: "Dies ist ein Beispielsatz auf Deutsch",
    textSample2: "Deutsch ist eine der meistgesprochenen Sprachen in Europa",
    textSample3: "Ich spreche gerne Deutsch"
  },
  zh: {
    textSample1: "这是一个中文示例句子",
    textSample2: "中文是世界上使用最广泛的语言之一",
    textSample3: "我喜欢说中文"
  },
  ja: {
    textSample1: "これは日本語のサンプル文です",
    textSample2: "日本語は日本の主要言語です",
    textSample3: "私は日本語を話すのが好きです"
  },
  ru: {
    textSample1: "Это пример предложения на русском языке",
    textSample2: "Русский является одним из основных языков России",
    textSample3: "Мне нравится говорить по-русски"
  }
};
