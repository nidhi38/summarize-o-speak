
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Pause, Volume2, VolumeX, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Add TypeScript interface for speech recognition
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
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const { translateText: aiTranslateText, textToSpeech } = useAIService();
  
  useEffect(() => {
    // Load previously stored conversions from localStorage
    const storedConversions = localStorage.getItem('audioConversions');
    if (storedConversions) {
      try {
        const parsedConversions = JSON.parse(storedConversions);
        setPreviousConversions(parsedConversions.slice(0, 5)); // Keep only the last 5
      } catch (e) {
        console.error("Error loading stored conversions:", e);
      }
    }

    // Load available voices for speech synthesis
    loadVoices();

    // Set up speech recognition if available
    const windowWithSpeech = window as WindowWithSpeechRecognition;
    if (windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition) {
      setupSpeechRecognition();
    }

    // Clean up on unmount
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const loadVoices = () => {
    if ('speechSynthesis' in window) {
      // If voices are already loaded
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesList(voices);
        const hindiVoice = findHindiVoice(voices);
        setHindiVoiceFound(!!hindiVoice);
      } else {
        // Wait for voices to be loaded
        window.speechSynthesis.onvoiceschanged = () => {
          const updatedVoices = window.speechSynthesis.getVoices();
          setVoicesList(updatedVoices);
          const hindiVoice = findHindiVoice(updatedVoices);
          setHindiVoiceFound(!!hindiVoice);
        };
      }
    }
  };

  const findHindiVoice = (voices: SpeechSynthesisVoice[]) => {
    return voices.find(voice => 
      voice.lang === 'hi-IN' || 
      voice.lang.startsWith('hi') ||
      voice.name.toLowerCase().includes('hindi')
    );
  };

  // Set up speech recognition with the correct language setting
  const setupSpeechRecognition = () => {
    const windowWithSpeech = window as WindowWithSpeechRecognition;
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    
    // Set language for recognition
    // For Hindi, explicitly use hi-IN as the recognition language code
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
        title: "Recognition Error",
        description: "There was a problem with speech recognition.",
        variant: "destructive",
      });
      setIsRecording(false);
    };

    setRecognition(recognitionInstance);
  };

  // Update recognition language when selected language changes
  useEffect(() => {
    if (recognition) {
      // For Hindi, explicitly use hi-IN as the recognition language code
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
          "माइक्रोफ़ोन में स्पष्ट रूप से बोलें" : 
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
        description: "Could not access microphone. Please check permissions.",
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
      const languageName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'selected language';
      
      const message = selectedLanguage === 'hi' ? 
        "टेक्स्ट को हिंदी भाषण में परिवर्तित किया जा रहा है..." : 
        `Converting text to speech in ${languageName}...`;
      
      toast({
        title: selectedLanguage === 'hi' ? "ऑडियो उत्पन्न हो रहा है" : "Generating audio",
        description: message,
      });

      // Use the textToSpeech service from AIService
      const generatedAudioUrl = await textToSpeech(text, selectedLanguage);
      
      if (generatedAudioUrl) {
        setAudioUrl(generatedAudioUrl);
        
        // Create a proper object for the audio element
        if (audioRef.current) {
          audioRef.current.src = generatedAudioUrl;
          audioRef.current.volume = volume;
          audioRef.current.load();
        }
        
        // Create and save the audio conversion
        const newConversion: AudioConversion = {
          id: crypto.randomUUID(),
          text,
          audioUrl: generatedAudioUrl,
          isGenerating: false,
          language: selectedLanguage,
          createdAt: new Date(),
        };
        
        // Update the previous conversions
        const updatedConversions = [newConversion, ...previousConversions].slice(0, 5);
        setPreviousConversions(updatedConversions);
        
        // Save to localStorage for persistence
        localStorage.setItem('audioConversions', JSON.stringify(updatedConversions));
        
        // Send to parent component
        onSaveAudioConversion(newConversion);
        
        const successMessage = selectedLanguage === 'hi' ? 
          "टेक्स्ट को सफलतापूर्वक भाषण में परिवर्तित किया गया है" : 
          "Text has been converted to speech successfully";
        
        toast({
          title: selectedLanguage === 'hi' ? "ऑडियो उत्पन्न हुआ" : "Audio generated",
          description: successMessage,
        });

        // Also use speech synthesis for immediate feedback
        speakText(text, selectedLanguage);
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
  
  // Function to use Speech Synthesis API for speaking text
  const speakText = (textToSpeak: string, language: string) => {
    if ('speechSynthesis' in window) {
      // For Hindi, make sure we're using the correct language code
      const langCode = language === 'hi' ? 'hi-IN' : language;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langCode;
      utterance.volume = volume;
      
      // Make sure the speech synthesis has loaded voices
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // If voices haven't loaded yet, wait a bit and try again
        setTimeout(() => {
          voices = window.speechSynthesis.getVoices();
          setVoiceAndSpeak(utterance, voices, langCode);
        }, 100);
      } else {
        setVoiceAndSpeak(utterance, voices, langCode);
      }
    }
  };
  
  // Helper function to set voice and speak
  const setVoiceAndSpeak = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[], langCode: string) => {
    // Try finding exact language match
    let preferredVoice = voices.find(voice => voice.lang === langCode);
    
    // If not found, try finding partial match (e.g., 'hi' in 'hi-IN')
    if (!preferredVoice) {
      preferredVoice = voices.find(voice => 
        voice.lang.startsWith(langCode.split('-')[0])
      );
    }
    
    // Special handling for Hindi
    if (langCode === 'hi-IN' || langCode === 'hi') {
      const hindiVoice = voices.find(voice => 
        voice.lang === 'hi-IN' || 
        voice.lang.startsWith('hi') ||
        voice.name.toLowerCase().includes('hindi')
      );
      
      if (hindiVoice) {
        preferredVoice = hindiVoice;
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

      // Use the AIService translation method
      const translationResponse = await aiTranslateText(text, selectedLanguage);
      
      if (translationResponse) {
        const translatedText = translationResponse.translatedText;
        setText(translatedText);
        
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
    return selectedLanguage === 'hi' ? "भाषण कनवर्टर" : "Speech Converter";
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
  
  return (
    <section className="w-full max-w-3xl mx-auto mt-12 px-4 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass hover:shadow-glass-hover transition-all duration-300 overflow-hidden border border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
            <CardTitle className="text-2xl flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Languages className="h-5 w-5 text-primary" />
              </motion.div>
              {getCardTitle()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">{getLanguageLabel()}</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full glass border-primary/10">
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
                <div className="text-xs text-amber-500 italic mt-1">
                  हिंदी आवाज़ नहीं मिली। सर्वोत्तम अनुभव के लिए, कृपया एक हिंदी आवाज़ वाला ब्राउज़र इस्तेमाल करें।
                  <br />
                  (Hindi voice not found. For best experience, please use a browser with Hindi voice support.)
                </div>
              )}
            </div>
            
            <Textarea
              placeholder={getTextareaPlaceholder()}
              className="min-h-[150px] resize-y glass border-primary/10 placeholder:text-muted-foreground/50"
              value={text}
              onChange={(e) => setText(e.target.value)}
              dir={selectedLanguage === 'hi' || selectedLanguage === 'ar' ? 'auto' : 'ltr'}
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                className="flex-1 flex items-center justify-center gap-2 border-primary/20 hover:bg-primary/5"
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
                className="flex-1 bg-gradient-to-r from-primary to-primary/80"
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
                className="flex-1 flex items-center justify-center gap-2"
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
                className="mt-4 p-4 rounded-lg glass border border-primary/10 flex flex-wrap items-center gap-4"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayback}
                  className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <div className="flex-1 min-w-[180px]">
                  <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: isPlaying ? "var(--progress, 0%)" : "0%" }} />
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

            {previousConversions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">{getRecentConversionsLabel()}</h3>
                <div className="space-y-3">
                  {previousConversions.map((conversion) => (
                    <motion.div
                      key={conversion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg glass border border-primary/5 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 truncate text-sm" dir={conversion.language === 'hi' || conversion.language === 'ar' ? 'auto' : 'ltr'}>
                          {conversion.text.substring(0, 60)}
                          {conversion.text.length > 60 ? '...' : ''}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {SUPPORTED_LANGUAGES.find(l => l.code === conversion.language)?.flag}
                          </span>
                          {conversion.audioUrl && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => {
                                setAudioUrl(conversion.audioUrl);
                                if (audioRef.current) {
                                  audioRef.current.src = conversion.audioUrl || '';
                                  audioRef.current.play();
                                  setIsPlaying(true);
                                }
                              }}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default AudioConverter;
