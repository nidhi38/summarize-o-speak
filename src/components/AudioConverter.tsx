import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Pause, Volume2, VolumeX, Languages, Sparkles, Wand2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AudioConversion } from "@/lib/types";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, HINDI_TEXT_SAMPLES } from "@/lib/constants";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAIService } from "@/lib/AIService";

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

interface AudioConverterProps {
  language: string;
  onSaveAudioConversion: (conversion: AudioConversion) => void;
}

const AudioConverter = ({ language, onSaveAudioConversion }: AudioConverterProps) => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language || DEFAULT_LANGUAGE);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [previousConversions, setPreviousConversions] = useState<AudioConversion[]>([]);
  const [recognition, setRecognition] = useState<any>(null);
  const [voicesList, setVoicesList] = useState<SpeechSynthesisVoice[]>([]);
  const [hindiVoiceFound, setHindiVoiceFound] = useState(false);
  const [needsTranslation, setNeedsTranslation] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const { translateText: aiTranslateText, textToSpeech } = useAIService();
  
  useEffect(() => {
    const storedConversions = localStorage.getItem('audioConversions');
    if (storedConversions) {
      try {
        const parsedConversions = JSON.parse(storedConversions);
        const processedConversions = parsedConversions.map((conv: any) => ({
          ...conv,
          createdAt: conv.createdAt ? new Date(conv.createdAt) : new Date()
        }));
        setPreviousConversions(processedConversions.slice(0, 5));
      } catch (e) {
        console.error("Error loading stored conversions:", e);
      }
    }

    const windowWithSpeech = window as WindowWithSpeechRecognition;
    if (windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition) {
      setupSpeechRecognition();
    }

    setSelectedLanguage(language || DEFAULT_LANGUAGE);

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  useEffect(() => {
    const checkAndLoadVoices = async () => {
      if ('speechSynthesis' in window) {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          try {
            voices = await waitForVoices();
          } catch (e) {
            console.error("Error loading voices:", e);
          }
        }
        setVoicesList(voices);
        const hindiVoice = findHindiVoice(voices);
        setHindiVoiceFound(!!hindiVoice);
        if (hindiVoice) {
          console.log("Hindi voice successfully loaded:", hindiVoice.name);
          if (selectedLanguage === 'hi') {
            toast({
              title: "हिंदी आवाज़ मिल गई",
              description: "हिंदी वाणी सुविधा उपलब्ध है",
            });
          }
        } else {
          console.warn("No Hindi voice found");
        }
      }
    };
    
    checkAndLoadVoices();
  }, [selectedLanguage]);

  useEffect(() => {
    if (selectedLanguage === 'hi') {
      const containsHindiChars = /[\u0900-\u097F]/.test(text);
      setNeedsTranslation(!containsHindiChars && text.trim().length > 0);
    }
  }, [text, selectedLanguage]);

  const waitForVoices = () => {
    return new Promise<SpeechSynthesisVoice[]>((resolve, reject) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        return resolve(voices);
      }
      
      let timeoutId: number;
      
      const voicesChangedHandler = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          clearTimeout(timeoutId);
          window.speechSynthesis.onvoiceschanged = null;
          resolve(voices);
        }
      };
      
      window.speechSynthesis.onvoiceschanged = voicesChangedHandler;
      
      timeoutId = window.setTimeout(() => {
        window.speechSynthesis.onvoiceschanged = null;
        const fallbackVoices = window.speechSynthesis.getVoices();
        if (fallbackVoices.length > 0) {
          resolve(fallbackVoices);
        } else {
          reject(new Error("Could not load voices"));
        }
      }, 3000);
    });
  };

  const loadVoices = () => {
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesList(voices);
        const hindiVoice = findHindiVoice(voices);
        setHindiVoiceFound(!!hindiVoice);
        console.log("Loaded voices:", voices.map(v => `${v.name} (${v.lang})`).join(', '));
        console.log("Hindi voice found:", hindiVoice ? hindiVoice.name : "None");
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          const updatedVoices = window.speechSynthesis.getVoices();
          setVoicesList(updatedVoices);
          const hindiVoice = findHindiVoice(updatedVoices);
          setHindiVoiceFound(!!hindiVoice);
          console.log("Updated voices:", updatedVoices.map(v => `${v.name} (${v.lang})`).join(', '));
          console.log("Hindi voice found:", hindiVoice ? hindiVoice.name : "None");
        };
      }
    }
  };

  const findHindiVoice = (voices: SpeechSynthesisVoice[]) => {
    const naturalHindiVoice = voices.find(voice => 
      (voice.lang === 'hi-IN' || voice.lang.startsWith('hi')) &&
      (voice.name.toLowerCase().includes('natural') || voice.name.toLowerCase().includes('madhur'))
    );
    
    if (naturalHindiVoice) {
      return naturalHindiVoice;
    }
    
    return voices.find(voice => 
      voice.lang === 'hi-IN' || 
      voice.lang.startsWith('hi') ||
      voice.name.toLowerCase().includes('hindi') ||
      voice.name.toLowerCase().includes('indian')
    );
  };

  const setupSpeechRecognition = () => {
    const windowWithSpeech = window as WindowWithSpeechRecognition;
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    
    recognitionInstance.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage;

    recognitionInstance.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      if (transcript) {
        setText(prev => prev + ' ' + transcript);
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      toast({
        title: selectedLanguage === 'hi' ? "मान्यता त्रुटि" : "Recognition Error",
        description: selectedLanguage === 'hi' ? 
          "भाषण पहचान के साथ एक समस्या थी।" : 
          "There was a problem with speech recognition.",
        variant: "destructive",
      });
      setIsRecording(false);
    };

    setRecognition(recognitionInstance);
  };

  useEffect(() => {
    if (recognition) {
      recognition.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage;
    }
  }, [selectedLanguage, recognition]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const startRecording = async () => {
    try {
      if (!recognition) {
        setupSpeechRecognition();
      }
      
      if (recognition) {
        recognition.start();
        setIsRecording(true);
        
        const languageName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'selected language';
        const message = selectedLanguage === 'hi' ? 
          HINDI_TEXT_SAMPLES.speakClearly : 
          `Speak clearly into your microphone in ${languageName}`;
        
        toast({
          title: selectedLanguage === 'hi' ? "रिकॉर्डिंग शुरू हुई" : "Recording started",
          description: message,
        });
      } else {
        throw new Error("Speech recognition not available");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: selectedLanguage === 'hi' ? 
          "माइक्रोफ़ोन तक पहुंचने में असमर्थ। कृपया अनुमतियों की जांच करें।" : 
          "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
    
    const message = selectedLanguage === 'hi' ? 
      "भाषण को सफलतापूर्वक टेक्स्ट में परिवर्तित किया गया" : 
      "Speech converted to text successfully";
    
    toast({
      title: selectedLanguage === 'hi' ? "रिकॉर्डिंग रुकी" : "Recording stopped",
      description: message,
    });
  };
  
  const generateAudio = async () => {
    if (!text.trim()) {
      const message = selectedLanguage === 'hi' ? 
        "कृपया भाषण में परिवर्तित करने के लिए कुछ टेक्स्ट दर्ज करें" : 
        "Please enter some text to convert to speech";
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingAudio(true);
    
    try {
      let textToConvert = text;
      const languageName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'selected language';
      
      const needsTranslation = selectedLanguage !== 'en' && !textContainsTargetLanguageChars(text, selectedLanguage);
      
      if (needsTranslation) {
        const translationMessage = selectedLanguage === 'hi' ? 
          "अंग्रेजी से हिंदी में अनुवाद किया जा रहा है..." : 
          `Translating to ${languageName}...`;
        
        toast({
          title: selectedLanguage === 'hi' ? "अनुवाद हो रहा है" : "Translating",
          description: translationMessage,
        });
        
        const translationResponse = await aiTranslateText(text, selectedLanguage);
        if (translationResponse) {
          textToConvert = translationResponse.translatedText;
          console.log(`Translated text for TTS (${selectedLanguage}):`, textToConvert);
          
          setText(textToConvert);
        }
      }

      const message = selectedLanguage === 'hi' ? 
        "टेक्स्ट को हिंदी भाषण में परिवर्तित किया जा रहा है..." : 
        `Converting text to speech in ${languageName}...`;
      
      toast({
        title: selectedLanguage === 'hi' ? "ऑडियो उत्पन्न हो रहा है" : "Generating audio",
        description: message,
      });

      if (selectedLanguage === 'hi') {
        const success = speakHindiDirectly(textToConvert);
        if (!success) {
          console.warn("Direct Hindi speech failed, falling back to API");
        }
      }

      const generatedAudioUrl = await textToSpeech(textToConvert, selectedLanguage);
      
      if (generatedAudioUrl) {
        setAudioUrl(generatedAudioUrl);
        
        if (audioRef.current) {
          audioRef.current.src = generatedAudioUrl;
          audioRef.current.volume = volume;
          audioRef.current.load();
        }
        
        const newConversion: AudioConversion = {
          id: crypto.randomUUID(),
          text: textToConvert,
          audioUrl: generatedAudioUrl,
          isGenerating: false,
          language: selectedLanguage,
          createdAt: new Date(),
        };
        
        const updatedConversions = [newConversion, ...previousConversions].slice(0, 5);
        setPreviousConversions(updatedConversions);
        
        localStorage.setItem('audioConversions', JSON.stringify(updatedConversions));
        
        onSaveAudioConversion(newConversion);
        
        const successMessage = selectedLanguage === 'hi' ? 
          "टेक्स्ट को सफलतापूर्वक भाषण में परिवर्तित किया गया है" : 
          "Text has been converted to speech successfully";
        
        toast({
          title: selectedLanguage === 'hi' ? "ऑडियो उत्पन्न हुआ" : "Audio generated",
          description: successMessage,
        });

        if (selectedLanguage !== 'hi') {
          speakText(textToConvert, selectedLanguage);
        }
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      const errorMessage = selectedLanguage === 'hi' ? 
        "ऑडियो उत्पन्न करने में विफल। कृपया पुनः प्रयास करें।" : 
        "Failed to generate audio. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const speakHindiDirectly = (textToSpeak: string): boolean => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'hi-IN';
      utterance.volume = volume;
      utterance.rate = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        return false;
      }
      
      const hindiVoice = findHindiVoice(voices);
      if (!hindiVoice) {
        console.warn("No Hindi voice available for direct speech");
        return false;
      }
      
      console.log(`Speaking Hindi using voice: ${hindiVoice.name}`);
      utterance.voice = hindiVoice;
      
      window.speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  };

  const speakText = (textToSpeak: string, language: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const langCode = language === 'hi' ? 'hi-IN' : language;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langCode;
      utterance.volume = volume;
      
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        setTimeout(() => {
          voices = window.speechSynthesis.getVoices();
          setVoiceAndSpeak(utterance, voices, langCode);
        }, 100);
      } else {
        setVoiceAndSpeak(utterance, voices, langCode);
      }
    }
  };

  const setVoiceAndSpeak = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[], langCode: string) => {
    let preferredVoice = null;
    
    if (langCode === 'hi-IN' || langCode === 'hi') {
      preferredVoice = findHindiVoice(voices);
      if (preferredVoice) {
        console.log("Using Hindi voice for speech:", preferredVoice.name);
      } else {
        console.log("No Hindi voice found, using default voice");
      }
    } else {
      preferredVoice = voices.find(voice => voice.lang === langCode);
      
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
          voice.lang.startsWith(langCode.split('-')[0])
        );
      }
    }
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    console.log(`Speaking in ${langCode} using voice:`, preferredVoice?.name || 'default voice');
    window.speechSynthesis.speak(utterance);
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        toast({
          title: "Playback Error",
          description: "Could not play the audio. Please try again.",
          variant: "destructive",
        });
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleTranslateText = async () => {
    if (!text.trim()) {
      const message = selectedLanguage === 'hi' ? 
        "कृपया अनुवाद के लिए कुछ टेक्स्ट दर्ज करें" : 
        "Please enter some text to translate";
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);

    try {
      const targetLanguageName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'selected language';
      
      const message = selectedLanguage === 'hi' ? 
        "टेक्स्ट को हिंदी में अनुवाद किया जा रहा है..." : 
        `Translating text to ${targetLanguageName}...`;
      
      toast({
        title: selectedLanguage === 'hi' ? "अनुवाद हो रहा है" : "Translating",
        description: message,
      });

      const translationResponse = await aiTranslateText(text, selectedLanguage);
      
      if (translationResponse) {
        const translatedText = translationResponse.translatedText;
        setText(translatedText);
        setNeedsTranslation(false);
        
        const successMessage = selectedLanguage === 'hi' ? 
          "आपके टेक्स्ट का हिंदी में सफलतापूर्वक अनुवाद किया गया है!" : 
          `Your text has been translated to ${targetLanguageName} successfully!`;
        
        toast({
          title: selectedLanguage === 'hi' ? "अनुवाद पूरा हुआ" : "Translation complete",
          description: successMessage,
        });
      }
    } catch (error) {
      console.error("Error translating text:", error);
      
      const errorMessage = selectedLanguage === 'hi' ? 
        "टेक्स्ट का अनुवाद करने में विफल। कृपया पुनः प्रयास करें।" : 
        "Failed to translate text. Please try again.";
      
      toast({
        title: "Translation Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const getButtonLabel = (action: string) => {
    if (selectedLanguage === 'hi') {
      switch(action) {
        case 'record': return isRecording ? "रिकॉर्डिंग रोकें" : "भाषण रिकॉर्ड करें";
        case 'generate': return isGeneratingAudio ? "उत्पन्न हो रहा है..." : "ऑडियो उत्पन्न करें";
        case 'translate': return isTranslating ? "अनुवाद हो रहा है..." : "अनुवाद करें";
        default: return action;
      }
    }
    
    switch(action) {
      case 'record': return isRecording ? "Stop Recording" : "Record Speech";
      case 'generate': return isGeneratingAudio ? "Generating..." : "Generate Audio";
      case 'translate': return isTranslating ? "Translating..." : "Translate";
      default: return action;
    }
  };

  const getCardTitle = () => {
    return selectedLanguage === 'hi' ? HINDI_TEXT_SAMPLES.speechConverterTitle : "Speech Converter";
  };

  const getTextareaPlaceholder = () => {
    return selectedLanguage === 'hi' ? "यहां टेक्स्ट टाइप करें या बोलें..." : "Type or speak text here...";
  };

  const getLanguageLabel = () => {
    return selectedLanguage === 'hi' ? "भाषा" : "Language";
  };

  const getRecentConversionsLabel = () => {
    return selectedLanguage === 'hi' ? "हाल के रूपांतरण" : "Recent Conversions";
  };
  
  const showTranslationHint = selectedLanguage === 'hi' && needsTranslation;
  
  const getDesignTheme = () => {
    switch(selectedLanguage) {
      case 'hi':
        return {
          gradient: "from-orange-500/30 via-purple-500/30 to-pink-500/30",
          borderColor: "border-orange-300",
          buttonGradient: "from-orange-500 to-pink-500",
          secondaryColor: "bg-purple-100 text-purple-800 hover:bg-purple-200",
          pulseColor: "bg-orange-500"
        };
      default:
        return {
          gradient: "from-primary/10 to-transparent",
          borderColor: "border-primary/10",
          buttonGradient: "from-primary to-primary/80",
          secondaryColor: "bg-secondary",
          pulseColor: "bg-primary"
        };
    }
  };
  
  const theme = getDesignTheme();
  
  const textContainsTargetLanguageChars = (text: string, language: string): boolean => {
    if (language === 'hi') {
      return containsDevanagariScript(text);
    }
    if (language === 'ar') {
      return /[\u0600-\u06FF]/.test(text); // Arabic script
    }
    if (language === 'zh') {
      return /[\u4E00-\u9FFF]/.test(text); // Chinese characters
    }
    if (language === 'ja') {
      return /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/.test(text); // Japanese scripts
    }
    if (language === 'ko') {
      return /[\uAC00-\uD7AF\u1100-\u11FF]/.test(text); // Korean Hangul
    }
    if (language === 'ru') {
      return /[\u0400-\u04FF]/.test(text); // Cyrillic script
    }
    
    // For other languages, we'll assume English or similar script
    return true;
  };

  return (
    <section className="w-full max-w-4xl mx-auto mt-12 px-4 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`overflow-hidden border ${theme.borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}>
          <CardHeader className={`bg-gradient-to-r ${theme.gradient} py-6`}>
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-3 font-bold">
              <motion.div
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative"
              >
                <Languages className="h-6 w-6 text-primary" />
                <motion.div 
                  className="absolute -top-1 -right-1 h-2 w-2 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className={`block h-2 w-2 rounded-full ${theme.pulseColor}`}></span>
                </motion.div>
              </motion.div>
              {getCardTitle()}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-2"
              >
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                {getLanguageLabel()}
                {selectedLanguage === 'hi' && hindiVoiceFound && (
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full"
                  >
                    ✓ हिंदी आवाज़ मिल गई
                  </motion.span>
                )}
              </label>
              
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className={`w-full border ${theme.borderColor}`}>
                  <SelectValue placeholder={selectedLanguage === 'hi' ? "भाषा चुनें" : "Select language"} />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedLanguage === 'hi' && !hindiVoiceFound && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-amber-600 italic mt-1 p-2 bg-amber-50 rounded-md border border-amber-200"
                >
                  हिंदी आवाज़ नहीं मिली। सर्वोत्तम अनुभव के लिए, कृपया एक हिंदी आवाज़ वाला ब्राउज़र इस्तेमाल करें।
                  <br />
                  (Hindi voice not found. For best experience, please use a browser with Hindi voice support.)
                </motion.div>
              )}
            </div>
            
            <div className="relative">
              <Textarea
                placeholder={getTextareaPlaceholder()}
                className={`min-h-[150px] resize-y border ${theme.borderColor} placeholder:text-muted-foreground/50 ${showTranslationHint ? 'border-amber-300' : ''}`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                dir={selectedLanguage === 'hi' || selectedLanguage === 'ar' ? 'auto' : 'ltr'}
              />
              
              {showTranslationHint && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-amber-600 flex items-center gap-1"
                >
                  <Wand2 className="h-3 w-3" />
                  हिंदी में अनुवाद के लिए अनुवाद बटन पर क्लिक करें
                </motion.div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                className={`flex-1 flex items-center justify-center gap-2 ${isRecording ? "" : `border-${theme.borderColor} hover:bg-primary/5`}`}
                onClick={toggleRecording}
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4" />
                    {getButtonLabel('record')}
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    {getButtonLabel('record')}
                  </>
                )}
              </Button>
              
              <Button
                onClick={generateAudio}
                disabled={!text.trim() || isGeneratingAudio}
                className={`flex-1 bg-gradient-to-r ${theme.buttonGradient}`}
              >
                {isGeneratingAudio ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {getButtonLabel('generate')}
                  </div>
                ) : (
                  getButtonLabel('generate')
                )}
              </Button>

              <Button
                onClick={handleTranslateText}
                variant="secondary"
                className={`flex-1 flex items-center justify-center gap-2 ${selectedLanguage === 'hi' && needsTranslation ? 'animate-pulse' : ''}`}
                disabled={!text.trim() || isTranslating}
              >
                {isTranslating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    {getButtonLabel('translate')}
                  </div>
                ) : (
                  <>
                    <Languages className="h-4 w-4" />
                    {getButtonLabel('translate')}
                  </>
                )}
              </Button>
            </div>
            
            {audioUrl && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-lg border ${theme.borderColor} bg-gradient-to-r ${theme.gradient} backdrop-blur-sm flex flex-wrap items-center gap-4`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlayback}
                    className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                </motion.div>
                
                <div className="flex-1 min-w-[180px]">
                  <div className="h-3 bg-muted-foreground/20 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: isPlaying ? "var(--progress, 0%)" : "0%" }}
                      initial={{ width: "0%" }}
                      animate={{ width: isPlaying ? "var(--progress, 0%)" : "0%" }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-8 w-8 rounded-full"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  
                  <div className="w-24">
                    <Slider
                      value={[volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={handleAudioEnded}
                  onTimeUpdate={() => {
                    if (!audioRef.current) return;
                    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                    document.documentElement.style.setProperty("--progress", `${progress}%`);
                  }}
                  className="hidden"
                />
              </motion.div>
            )}

            {selectedLanguage === 'hi' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-3 rounded-lg border border-orange-200 bg-orange-50"
              >
                <h4 className="text-sm font-medium text-orange-800 mb-2">हिंदी नमूना वाक्य</h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    HINDI_TEXT_SAMPLES.textSample1,
                    HINDI_TEXT_SAMPLES.textSample2,
                    HINDI_TEXT_SAMPLES.textSample3
                  ].map((sample, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-left p-2 rounded bg-white border border-orange-100 text-sm hover:bg-orange-100 transition-colors"
                      onClick={() => setText(sample)}
                    >
                      {sample}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {previousConversions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  {getRecentConversionsLabel()}
                  <motion.span
                    animate={{ 
                      rotate: [0, 5, 0, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Palette className="h-4 w-4 text-primary/70" />
                  </motion.span>
                </h3>
                <div className="space-y-3">
                  {previousConversions.map((conversion) => (
                    <motion.div
                      key={conversion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-lg border ${theme.borderColor} backdrop-blur-sm shadow-sm hover:shadow-md transition-all`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 truncate text-sm" dir={conversion.language === 'hi' || conversion.language === 'ar' ? 'auto' : 'ltr'}>
                          {conversion.text.substring(0, 60)}
                          {conversion.text.length > 60 ? '...' : ''}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">
                            {SUPPORTED_LANGUAGES.find(l => l.code === conversion.language)?.flag}
                          </span>
                          {conversion.audioUrl && (
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full bg-primary/10 hover:bg-primary/20"
                                onClick={() => {
                                  setAudioUrl(conversion.audioUrl);
                                  if (audioRef.current) {
                                    audioRef.current.src = conversion.audioUrl || '';
                                    audioRef.current.play();
                                    setIsPlaying(true);
                                  }
                                  
                                  if (conversion.language === 'hi') {
                                    speakHindiDirectly(conversion.text);
                                  }
                                }}
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className={`bg-gradient-to-r ${theme.gradient} p-4 text-xs text-muted-foreground`}>
            {selectedLanguage === 'hi' ? (
              <>टेक्स्ट को भाषण में परिवर्तित करने के लिए ऊपर दिए गए विकल्पों का उपयोग करें</>
            ) : (
              <>Use the options above to convert text to speech in your chosen language</>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </section>
  );
};

export default AudioConverter;
