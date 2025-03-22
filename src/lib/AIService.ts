
import { useToast } from "@/components/ui/use-toast";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

// Type definitions for API responses
interface SummaryResponse {
  summary: string;
  keyTakeaways: string[];
  topics: string[];
}

interface FlashcardSet {
  id: string;
  title: string;
  cards: Flashcard[];
  createdAt: Date;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  sourceLang: string;
  targetLang: string;
}

interface InsightsResponse {
  readingLevel: string;
  complexity: number;
  sentiment: string;
  topicsDistribution: {name: string, value: number}[];
  wordCount: number;
  estimatedReadTime: string;
}

export const useAIService = () => {
  const { toast } = useToast();
  const API_KEY = "AIzaSyAej0uRSHhL4-6B29iIXiCwIahtPuBSUl4";
  
  const summarizeText = async (text: string): Promise<SummaryResponse | null> => {
    try {
      // In a real implementation, this would call the Gemini API
      // For now, we'll simulate a response
      
      toast({
        title: "Processing with Gemini AI",
        description: "Analyzing your document...",
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const mockResponse: SummaryResponse = {
        summary: `This is an AI-generated summary of the document. 
        The document discusses important concepts and provides valuable insights on the topic.
        The author presents several arguments and supports them with evidence from various sources.
        
        The first section introduces the main concepts and sets the stage for the detailed analysis that follows.
        In the middle sections, the author delves into case studies that illustrate the practical applications.
        The final section concludes with recommendations and future implications of the findings.
        
        Overall, this document presents a comprehensive overview of the subject matter and offers valuable insights
        for researchers and practitioners in the field.`,
        keyTakeaways: [
          "Key point 1: The main argument centers around innovation in technology.",
          "Key point 2: Several case studies demonstrate successful implementations.",
          "Key point 3: Future trends suggest continued growth in this area.",
          "Key point 4: Challenges remain in adoption and implementation.",
          "Key point 5: The author proposes a framework for addressing these challenges.",
          "Key point 6: Comparative analysis shows significant advantages over traditional methods."
        ],
        topics: ["Innovation", "Technology", "Research", "Implementation", "Future Trends", "Case Studies", "Comparative Analysis"]
      };
      
      toast({
        title: "Summary Generated",
        description: "Your AI summary is ready to view",
      });
      
      return mockResponse;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const generateFlashcards = async (text: string): Promise<FlashcardSet | null> => {
    try {
      toast({
        title: "Generating Flashcards",
        description: "Creating study materials from your document...",
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const mockFlashcards: FlashcardSet = {
        id: crypto.randomUUID(),
        title: "Document Study Set",
        createdAt: new Date(),
        cards: [
          {
            id: crypto.randomUUID(),
            question: "What is the main focus of the document?",
            answer: "The document primarily focuses on innovation in technology."
          },
          {
            id: crypto.randomUUID(),
            question: "What evidence supports the main argument?",
            answer: "Several case studies from industry leaders demonstrate successful implementations."
          },
          {
            id: crypto.randomUUID(),
            question: "What future trends are predicted?",
            answer: "Continued growth in adoption and new applications in various sectors."
          },
          {
            id: crypto.randomUUID(),
            question: "What challenges are mentioned?",
            answer: "Challenges in adoption, implementation costs, and training requirements."
          },
          {
            id: crypto.randomUUID(),
            question: "What framework does the author propose?",
            answer: "A comprehensive framework for addressing implementation challenges that focuses on stakeholder engagement and phased deployment."
          },
          {
            id: crypto.randomUUID(),
            question: "What advantages are shown in the comparative analysis?",
            answer: "The proposed approach shows 40% faster implementation time and 25% cost reduction compared to traditional methods."
          }
        ]
      };
      
      toast({
        title: "Flashcards Ready",
        description: "Your study materials have been created",
      });
      
      return mockFlashcards;
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const getInsights = async (text: string): Promise<InsightsResponse | null> => {
    try {
      toast({
        title: "Analyzing Content",
        description: "Extracting insights from your document...",
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock insights data
      const mockInsights: InsightsResponse = {
        readingLevel: "College",
        complexity: 72,
        sentiment: "Neutral",
        topicsDistribution: [
          { name: "Technology", value: 45 },
          { name: "Innovation", value: 30 },
          { name: "Research", value: 15 },
          { name: "Business", value: 10 }
        ],
        wordCount: 1250,
        estimatedReadTime: "6 minutes"
      };
      
      toast({
        title: "Insights Generated",
        description: "AI analysis of your document is complete",
      });
      
      return mockInsights;
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const translateText = async (text: string, targetLang: string): Promise<TranslationResponse | null> => {
    try {
      const targetLanguageName = SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;
      
      toast({
        title: "Translating",
        description: `Translating content to ${targetLanguageName}...`,
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhanced Hindi translation - in real implementation, you'd call a translation API
      let translatedText = text;
      
      if (targetLang === 'hi') {
        // More comprehensive Hindi translations for common phrases
        const hindiTranslations: Record<string, string> = {
          "Hello": "नमस्ते",
          "hello": "नमस्ते",
          "Good morning": "सुप्रभात",
          "good morning": "सुप्रभात",
          "Thank you": "धन्यवाद",
          "thank you": "धन्यवाद",
          "Welcome": "स्वागत है",
          "welcome": "स्वागत है",
          "Yes": "हां",
          "yes": "हां",
          "No": "नहीं",
          "no": "नहीं",
          "Please": "कृपया",
          "please": "कृपया",
          "Sorry": "क्षमा करें",
          "sorry": "क्षमा करें",
          "Good": "अच्छा",
          "good": "अच्छा",
          "Bad": "बुरा",
          "bad": "बुरा",
          "Document": "दस्तावेज़",
          "document": "दस्तावेज़",
          "Summary": "सारांश",
          "summary": "सारांश",
          "Read": "पढ़ें",
          "read": "पढ़ें",
          "Write": "लिखें",
          "write": "लिखें",
          "Speak": "बोलें",
          "speak": "बोलें",
          "Listen": "सुनें",
          "listen": "सुनें",
          "Convert": "परिवर्तित करें",
          "convert": "परिवर्तित करें",
          "Translate": "अनुवाद करें",
          "translate": "अनुवाद करें",
          "Audio": "ऑडियो",
          "audio": "ऑडियो",
          "Text": "टेक्स्ट",
          "text": "टेक्स्ट",
          "Language": "भाषा",
          "language": "भाषा",
          "File": "फ़ाइल",
          "file": "फ़ाइल",
          "This is a test": "यह एक परीक्षण है",
          "How are you?": "आप कैसे हैं?",
        };
        
        // Replace all matching phrases in text
        Object.entries(hindiTranslations).forEach(([english, hindi]) => {
          translatedText = translatedText.replace(new RegExp(english, 'g'), hindi);
        });
        
        // Add a Hindi prefix to indicate translation happened
        translatedText = `[हिंदी अनुवाद] ${translatedText}`;
      } else {
        // In a real implementation, you would call a translation API like:
        // - Google Translate API
        // - DeepL API
        // - Microsoft Translator API
        
        // Mock response for other languages
        const targetLanguageName = SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;
        translatedText = `[This is a simulated translation to ${targetLanguageName}]\n\n${text}`;
      }
      
      const mockTranslation: TranslationResponse = {
        translatedText: translatedText,
        sourceLang: "en",
        targetLang: targetLang,
      };
      
      toast({
        title: "Translation Complete",
        description: `Content translated successfully`,
      });
      
      return mockTranslation;
    } catch (error) {
      console.error("Error translating text:", error);
      toast({
        title: "Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const textToSpeech = async (text: string, language: string): Promise<string | null> => {
    try {
      const langName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || language;
      
      toast({
        title: "Generating Speech",
        description: `Converting text to ${langName} audio...`,
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would call a Text-to-Speech API like:
      // - Google Cloud Text-to-Speech API for Hindi support
      // - Amazon Polly (has Hindi voices)
      // - Microsoft Azure Text-to-Speech
      // - ElevenLabs (for high-quality voices)
      
      // For Hindi specifically - first try to use the browser's speech synthesis
      if (language === 'hi') {
        // First attempt to use browser's speech synthesis for immediate feedback
        if ('speechSynthesis' in window) {
          // Make sure the speech synthesis has loaded voices
          if (window.speechSynthesis.getVoices().length === 0) {
            // If no voices are available yet, wait for them to load
            await new Promise<void>((resolve) => {
              window.speechSynthesis.onvoiceschanged = () => resolve();
              // Timeout in case voices don't load
              setTimeout(() => resolve(), 1000);
            });
          }
          
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'hi-IN';
          
          // Try to find a Hindi voice
          const voices = window.speechSynthesis.getVoices();
          const hindiVoice = voices.find(voice => 
            voice.lang === 'hi-IN' || 
            voice.name.toLowerCase().includes('hindi')
          );
          
          if (hindiVoice) {
            utterance.voice = hindiVoice;
          }
          
          // Speak the text
          window.speechSynthesis.speak(utterance);
          
          toast({
            title: "Hindi TTS",
            description: "हिंदी वाणी रूपांतरण पूरा हुआ", // Hindi speech conversion complete
          });
        }
      }
      
      // Since we can't generate real audio here, we'll return a simulated audio URL
      // This would be a base64 encoded audio or a URL to an audio file in a real implementation
      const mockAudioUrl = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
      
      toast({
        title: "Audio Generated",
        description: `Text converted to ${langName} speech successfully`,
      });
      
      return mockAudioUrl;
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        title: "Error",
        description: "Failed to convert text to speech. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    summarizeText,
    generateFlashcards,
    getInsights,
    translateText,
    textToSpeech,
  };
};

export type { SummaryResponse, FlashcardSet, Flashcard, TranslationResponse, InsightsResponse };
