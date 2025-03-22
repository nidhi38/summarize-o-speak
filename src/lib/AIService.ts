import { useToast } from "@/components/ui/use-toast";
import { SUPPORTED_LANGUAGES, HINDI_TEXT_SAMPLES } from "@/lib/constants";

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
      
      let translatedText = text;
      
      if (targetLang === 'hi') {
        // Comprehensive Hindi translations dictionary
        const hindiTranslations: Record<string, string> = {
          // Basic greetings and common phrases
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
          
          // App-specific terms
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
          "Generate": "उत्पन्न करें",
          "generate": "उत्पन्न करें",
          "Stop": "रोकें",
          "stop": "रोकें",
          "Start": "शुरू करें",
          "start": "शुरू करें",
          "Recording": "रिकॉर्डिंग",
          "recording": "रिकॉर्डिंग",
          "Type here": "यहां टाइप करें",
          "type here": "यहां टाइप करें",
          "Processing": "प्रोसेसिंग हो रही है",
          "processing": "प्रोसेसिंग हो रही है",
          "Done": "पूरा हुआ",
          "done": "पूरा हुआ",
          "Speech Converter": "भाषण कनवर्टर",
          "speech converter": "भाषण कनवर्टर",
          "Record Speech": "भाषण रिकॉर्ड करें",
          "record speech": "भाषण रिकॉर्ड करें",
          "Stop Recording": "रिकॉर्डिंग रोकें",
          "stop recording": "रिकॉर्डिंग रोकें",
          "Generate Audio": "ऑडियो उत्पन्न करें",
          "generate audio": "ऑडियो उत्पन्न करें",
          "Recent Conversions": "हाल के रूपांतरण",
          "recent conversions": "हाल के रूपांतरण",
          "Select language": "भाषा चुनें",
          "select language": "भाषा चुनें",

          // Sample sentences for TTS
          "This is a test": "यह एक परीक्षण है",
          "How are you?": "आप कैसे हैं?",
          "I am fine": "मैं ठीक हूँ",
          "What is your name?": "आपका नाम क्या है?",
          "My name is": "मेरा नाम है",
          "Where are you from?": "आप कहाँ से हैं?",
          "I am from": "मैं से हूँ",
          "I don't understand": "मैं समझ नहीं पा रहा हूँ",
          "Can you help me?": "क्या आप मेरी मदद कर सकते हैं?",
          "I like this": "मुझे यह पसंद है",
          "I don't like this": "मुझे यह पसंद नहीं है",
          "This is a document summary": "यह एक दस्तावेज़ सारांश है",
          "Convert text to speech": "टेक्स्ट को भाषण में परिवर्तित करें",
          "Speech to text converter": "भाषण से टेक्स्ट कनवर्टर",
          "Your document": "आपका दस्तावेज",
          "Your summary": "आपका सारांश",
          "Translate this text": "इस टेक्स्ट का अनुवाद करें",
          "Play audio": "ऑडियो चलाएं",
          "Pause audio": "ऑडियो रोकें",
          "Type or speak text here": "यहां टेक्स्ट टाइप करें या बोलें",
          "Type or speak": "टाइप करें या बोलें",
          "Hindi translation complete": "हिंदी अनुवाद पूरा हुआ",
          "Hindi voice not found": "हिंदी आवाज़ नहीं मिली",
          "For best experience": "सर्वोत्तम अनुभव के लिए",
          "Please use a browser with Hindi voice support": "कृपया एक हिंदी आवाज़ वाला ब्राउज़र इस्तेमाल करें",
          "This is a simulated translation to Hindi": "यह हिंदी में एक सिमुलेटेड अनुवाद है",
          "Translation complete": "अनुवाद पूरा हुआ",
          "Audio generated": "ऑडियो उत्पन्न हुआ",
          "Recording started": "रिकॉर्डिंग शुरू हुई",
          "Recording stopped": "रिकॉर्डिंग रुकी",
          "Speech converted to text successfully": "भाषण को सफलतापूर्वक टेक्स्ट में परिवर्तित किया गया",
          "Please enter some text to convert to speech": "कृपया भाषण में परिवर्तित करने के लिए कुछ टेक्स्ट दर्ज करें",
          "Converting text to speech": "टेक्स्ट को भाषण में परिवर्तित किया जा रहा है",
          "Generating audio": "ऑडियो उत्पन्न हो रहा है",
          "Text has been converted to speech successfully": "टेक्स्ट को सफलतापूर्वक भाषण में परिवर्तित किया गया है",
          "Failed to generate audio": "ऑडियो उत्पन्न करने में विफल",
          "Please try again": "कृपया पुनः प्रयास करें",
          "Translating to Hindi": "हिंदी में अनुवाद किया जा रहा है",
          "Translating": "अनुवाद हो रहा है",
          "Your text has been translated to Hindi successfully": "आपके टेक्स्ट का हिंदी में सफलतापूर्वक अनुवाद किया गया है!",
          "Failed to translate text": "टेक्स्ट का अनुवाद करने में विफल",
          "Please enter some text to translate": "कृपया अनुवाद के लिए कुछ टेक्स्ट दर्ज करें",
        };
        
        // First, specifically check for entire sentences or phrases
        Object.entries(hindiTranslations).forEach(([english, hindi]) => {
          // Use a case-insensitive regex to replace whole phrases
          const regex = new RegExp(`\\b${english}\\b`, 'gi');
          translatedText = translatedText.replace(regex, hindi);
        });
        
        // If text is mostly unchanged, provide a more comprehensive Hindi translation
        if (translatedText === text || translatedText.indexOf(text) > -1) {
          translatedText = `यह एक हिंदी अनुवाद है: ${text}`;
        }
        
        // Make sure to prefix that this is a Hindi translation
        if (!translatedText.startsWith("[हिंदी अनुवाद]")) {
          translatedText = `[हिंदी अनुवाद] ${translatedText}`;
        }
      } else {
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
        title: language === 'hi' ? "ऑडियो उत्पन्न हो रहा है" : "Generating Speech",
        description: language === 'hi' ? 
          "टेक्स्ट को हिंदी भाषण में परिवर्तित किया जा रहा है..." : 
          `Converting text to ${langName} audio...`,
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For Hindi specifically - attempt to use browser's speech synthesis
      if (language === 'hi') {
        // First attempt to use browser's speech synthesis for immediate feedback
        if ('speechSynthesis' in window) {
          console.log("Using speech synthesis for Hindi text-to-speech");
          
          // Make sure the speech synthesis has loaded voices
          if (window.speechSynthesis.getVoices().length === 0) {
            // If no voices are available yet, wait for them to load
            await new Promise<void>((resolve) => {
              const voicesChangedHandler = () => {
                window.speechSynthesis.onvoiceschanged = null;
                resolve();
              };
              
              window.speechSynthesis.onvoiceschanged = voicesChangedHandler;
              // Timeout in case voices don't load
              setTimeout(() => {
                window.speechSynthesis.onvoiceschanged = null;
                resolve();
              }, 1000);
            });
          }
          
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'hi-IN';
          
          // Try to find a Hindi voice
          const voices = window.speechSynthesis.getVoices();
          console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));
          
          const hindiVoice = voices.find(voice => 
            voice.lang === 'hi-IN' || 
            voice.lang.startsWith('hi') ||
            voice.name.toLowerCase().includes('hindi')
          );
          
          if (hindiVoice) {
            utterance.voice = hindiVoice;
            console.log("Using Hindi voice:", hindiVoice.name);
          } else {
            console.log("No Hindi voice found, using default voice");
          }
          
          // Speak the text
          window.speechSynthesis.cancel(); // Cancel any ongoing speech
          window.speechSynthesis.speak(utterance);
          
          console.log("Started Hindi speech synthesis");
          
          toast({
            title: "हिंदी TTS",
            description: "हिंदी वाणी रूपांतरण पूरा हुआ", // Hindi speech conversion complete
          });
        } else {
          console.log("Speech synthesis not available");
        }
      }
      
      // Simulated audio URL
      const mockAudioUrl = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
      
      toast({
        title: language === 'hi' ? "ऑडियो उत्पन्न हुआ" : "Audio Generated",
        description: language === 'hi' ? 
          "टेक्स्ट को सफलतापूर्वक हिंदी भाषण में परिवर्तित किया गया है" : 
          `Text converted to ${langName} speech successfully`,
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
