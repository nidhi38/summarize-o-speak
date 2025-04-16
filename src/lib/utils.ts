
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if text contains Devanagari script (Hindi)
export function containsDevanagariScript(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

// Check if text contains characters of a specific language script
export function containsLanguageSpecificChars(text: string, language: string): boolean {
  switch (language) {
    case 'hi':
      return containsDevanagariScript(text);
    case 'ar':
      return /[\u0600-\u06FF]/.test(text); // Arabic script
    case 'zh':
      return /[\u4E00-\u9FFF]/.test(text); // Chinese characters
    case 'ja':
      return /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/.test(text); // Japanese scripts
    case 'ko':
      return /[\uAC00-\uD7AF\u1100-\u11FF]/.test(text); // Korean Hangul
    case 'ru':
      return /[\u0400-\u04FF]/.test(text); // Cyrillic script
    default:
      return true; // For other languages, assume text is in the correct script
  }
}

// Format time in MM:SS format
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Generate a unique ID
export function generateId(): string {
  return crypto.randomUUID();
}

// Check if browser supports specific speech recognition functionality
export function isSpeechRecognitionSupported(): boolean {
  const windowWithSpeech = window as any;
  return !!(windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition);
}

// Check if browser supports text-to-speech
export function isTextToSpeechSupported(): boolean {
  return 'speechSynthesis' in window;
}

// Handle API errors gracefully
export function handleApiError(error: unknown): string {
  console.error("API Error:", error);
  if (error instanceof Error) {
    return `Operation failed: ${error.message}`;
  }
  return "An unexpected error occurred. Please try again.";
}

// Format file size in human-readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Validate language code
export function isValidLanguageCode(code: string, supportedLanguages: Array<{code: string}>): boolean {
  return supportedLanguages.some(lang => lang.code === code);
}

// Generate a gradient color based on percentage
export function getGradientColor(percentage: number): string {
  if (percentage <= 30) return "from-red-500 to-red-400";
  if (percentage <= 70) return "from-yellow-500 to-yellow-400";
  return "from-green-500 to-green-400";
}

// Format date in user-friendly format
export function formatDate(date: Date | string | number): string {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  }).format(d);
}

// Debounce function for handling input events
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
