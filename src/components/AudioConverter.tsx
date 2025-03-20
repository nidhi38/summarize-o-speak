
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Pause } from "lucide-react";
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

interface AudioConverterProps {
  language: string;
  onSaveAudioConversion: (conversion: AudioConversion) => void;
}

const AudioConverter = ({ language, onSaveAudioConversion }: AudioConverterProps) => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language || DEFAULT_LANGUAGE);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const startRecording = async () => {
    try {
      // In a real implementation, this would use the Web Speech API
      // or other speech recognition service
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
      
      // Simulate recording after 3 seconds
      setTimeout(() => {
        stopRecording();
      }, 3000);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    
    // Simulate transcription result
    setText("This is a simulated transcription of your speech. In a real implementation, this would be the actual transcription from the speech recognition service.");
    
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
      // In a real implementation, this would call a text-to-speech API
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple audio blob for demonstration
      // In a real implementation, this would be the response from the TTS API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.value = 0.5;
      oscillator.frequency.value = 440;
      oscillator.type = 'sine';
      
      const startTime = audioContext.currentTime;
      const duration = 2;
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
      
      // Record the oscillator
      const recorder = audioContext.createMediaStreamDestination();
      gainNode.connect(recorder);
      
      const mediaRecorder = new MediaRecorder(recorder.stream);
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Save the audio conversion
        const newConversion: AudioConversion = {
          id: crypto.randomUUID(),
          text,
          audioUrl: url,
          isGenerating: false,
          language: selectedLanguage,
          createdAt: new Date(),
        };
        
        onSaveAudioConversion(newConversion);
        
        setIsGeneratingAudio(false);
        
        toast({
          title: "Audio generated",
          description: "Text has been converted to speech successfully",
        });
      };
      
      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), duration * 1000);
    } catch (error) {
      console.error("Error generating audio:", error);
      setIsGeneratingAudio(false);
      
      toast({
        title: "Error",
        description: "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
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
            </div>
            
            {audioUrl && (
              <div className="mt-4 p-4 rounded-lg bg-muted/50 flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayback}
                  className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <div className="flex-1">
                  <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: isPlaying ? "var(--progress, 0%)" : "0%" }} />
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
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default AudioConverter;
