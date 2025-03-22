
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Pause, Volume2, VolumeX, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AudioConversion } from "@/lib/types";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/lib/constants";
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

  const setupSpeechRecognition = () => {
    const windowWithSpeech = window as WindowWithSpeechRecognition;
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = selectedLanguage;

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

  useEffect(() => {
    // Update recognition language when selected language changes
    if (recognition) {
      recognition.lang = selectedLanguage;
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
        
        toast({
          title: "Recording started",
          description: "Speak clearly into your microphone",
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
    
    toast({
      title: "Recording stopped",
      description: "Speech converted to text successfully",
    });
  };
  
  const generateAudio = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert to speech",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingAudio(true);
    
    try {
      const languageName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'selected language';
      
      toast({
        title: "Generating audio",
        description: `Converting text to speech in ${languageName}...`,
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
        
        toast({
          title: "Audio generated",
          description: "Text has been converted to speech successfully",
        });

        // Also use speech synthesis for immediate feedback
        speakText(text, selectedLanguage);
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({
        title: "Error",
        description: "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };
  
  // Function to use Speech Synthesis API for speaking text
  const speakText = (textToSpeak: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = language;
      utterance.volume = volume;
      
      // Find a voice that matches the selected language
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(language.split('-')[0]) || 
        voice.lang === language
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Hindi voice specific handling
      if (language === 'hi') {
        const hindiVoice = voices.find(voice => 
          voice.lang === 'hi-IN' || 
          voice.name.includes('Hindi')
        );
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }
      }
      
      window.speechSynthesis.speak(utterance);
    }
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
      toast({
        title: "Error",
        description: "Please enter some text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);

    try {
      const targetLanguageName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'selected language';
      
      toast({
        title: "Translating",
        description: `Translating text to ${targetLanguageName}...`,
      });

      // Use the AIService translation method
      const translationResponse = await aiTranslateText(text, selectedLanguage);
      
      if (translationResponse) {
        const translatedText = translationResponse.translatedText;
        setText(translatedText);
        
        toast({
          title: "Translation complete",
          description: `Your text has been translated to ${targetLanguageName} successfully!`,
        });
      }
    } catch (error) {
      console.error("Error translating text:", error);
      toast({
        title: "Translation Error",
        description: "Failed to translate text. Please try again.",
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
  
  return (
    <section className="w-full max-w-3xl mx-auto mt-12 px-4 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass hover:shadow-glass-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl">Speech Converter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              placeholder="Type or speak text here..."
              className="min-h-[150px] resize-y"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                className="flex-1 flex items-center justify-center gap-2"
                onClick={toggleRecording}
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Record Speech
                  </>
                )}
              </Button>
              
              <Button
                onClick={generateAudio}
                disabled={!text.trim() || isGeneratingAudio}
                className="flex-1"
              >
                {isGeneratingAudio ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  "Generate Audio"
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
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Translating...
                  </div>
                ) : (
                  <>
                    <Languages className="h-4 w-4" />
                    Translate
                  </>
                )}
              </Button>
            </div>
            
            {audioUrl && (
              <div className="mt-4 p-4 rounded-lg bg-muted/50 flex flex-wrap items-center gap-4">
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
              </div>
            )}

            {previousConversions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Recent Conversions</h3>
                <div className="space-y-3">
                  {previousConversions.map((conversion) => (
                    <motion.div
                      key={conversion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg bg-muted/30 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 truncate text-sm">
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
