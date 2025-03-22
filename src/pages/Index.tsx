
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FileUploader from "@/components/FileUploader";
import SummarySection from "@/components/SummarySection";
import AudioConverter from "@/components/AudioConverter";
import Dashboard from "@/components/Dashboard";
import { DocumentFile, AudioConversion } from "@/lib/types";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@/lib/constants";

const Index = () => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [processedFile, setProcessedFile] = useState<DocumentFile | null>(null);
  const [audioConversions, setAudioConversions] = useState<AudioConversion[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load saved state from localStorage on component mount
  useEffect(() => {
    // Load saved audio conversions
    const savedAudioConversions = localStorage.getItem('audioConversions');
    if (savedAudioConversions) {
      try {
        setAudioConversions(JSON.parse(savedAudioConversions));
      } catch (e) {
        console.error("Error loading saved audio conversions:", e);
      }
    }

    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Load last processed file if available
    const savedFile = localStorage.getItem('lastProcessedFile');
    if (savedFile) {
      try {
        setProcessedFile(JSON.parse(savedFile));
      } catch (e) {
        console.error("Error loading saved file:", e);
      }
    }
  }, []);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileProcessed = (file: DocumentFile) => {
    setProcessedFile(file);
    
    // Save to localStorage for persistence
    localStorage.setItem('lastProcessedFile', JSON.stringify(file));
    
    toast({
      title: "File processed",
      description: "Your document has been processed successfully!",
    });
  };

  const handleTranslate = (text: string, targetLanguage: string) => {
    // In a real implementation, this would call a translation API like:
    // - Google Translate API
    // - Microsoft Translator API
    // - DeepL API
    
    toast({
      title: "Translation in progress",
      description: `Translating to ${SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name}...`,
    });
    
    // Simulate translation delay
    setTimeout(() => {
      const translatedPrefix = `[Translated to ${SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name}] `;
      
      // Update the processed file with translated content
      setProcessedFile(prev => {
        if (!prev) return null;
        
        const translatedFile = {
          ...prev,
          summary: translatedPrefix + prev.summary,
          language: targetLanguage
        };
        
        // Save the translated file to localStorage
        localStorage.setItem('lastProcessedFile', JSON.stringify(translatedFile));
        
        return translatedFile;
      });
      
      // Save preferred language
      localStorage.setItem('preferredLanguage', targetLanguage);
      setLanguage(targetLanguage);
      
      toast({
        title: "Translation complete",
        description: "Your summary has been translated successfully!",
      });
    }, 1500);
  };

  const handleTextToSpeech = (text: string, language: string) => {
    toast({
      title: "Generating audio",
      description: "Converting text to speech...",
    });
    
    // Create and use SpeechSynthesis for immediate feedback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      
      // Try to find a voice that matches the language
      const voices = window.speechSynthesis.getVoices();
      const langVoice = voices.find(voice => voice.lang.startsWith(language.split('-')[0]));
      if (langVoice) {
        utterance.voice = langVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
    
    // Create a more permanent audio conversion
    setTimeout(() => {
      // Simulate generating an audio file
      const newConversion: AudioConversion = {
        id: crypto.randomUUID(),
        text,
        isGenerating: false,
        language,
        createdAt: new Date(),
        // In a real implementation, this would be a URL to an audio file
        audioUrl: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=="
      };
      
      // Update the audio conversions
      const updatedConversions = [newConversion, ...audioConversions.slice(0, 4)];
      setAudioConversions(updatedConversions);
      
      // Save to localStorage
      localStorage.setItem('audioConversions', JSON.stringify(updatedConversions));
      
      toast({
        title: "Audio generated",
        description: "Your text has been converted to speech. Check the Audio Converter section.",
      });
    }, 1500);
  };

  const handleSaveAudioConversion = (conversion: AudioConversion) => {
    const updatedConversions = [conversion, ...audioConversions.slice(0, 4)];
    setAudioConversions(updatedConversions);
    localStorage.setItem('audioConversions', JSON.stringify(updatedConversions));
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  return (
    <div className="min-h-screen">
      <Header 
        language={language} 
        setLanguage={(newLang) => {
          setLanguage(newLang);
          localStorage.setItem('preferredLanguage', newLang);
        }} 
        onDashboardToggle={toggleDashboard}
      />
      
      <main>
        {showDashboard ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard 
              audioConversions={audioConversions}
              processedFile={processedFile}
            />
          </motion.div>
        ) : (
          <>
            <Hero scrollToContent={scrollToContent} />
            
            <div ref={contentRef} className="pt-16">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="container px-4 sm:px-6 pb-16"
              >
                <div className="text-center mb-10">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold"
                  >
                    Upload Your Document
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-muted-foreground mt-2"
                  >
                    Upload PDF, DOC, or TXT files to extract the key information
                  </motion.p>
                </div>
                
                <FileUploader 
                  onFileProcessed={handleFileProcessed} 
                  language={language}
                />
                
                <AnimatePresence>
                  {processedFile && (
                    <SummarySection 
                      file={processedFile} 
                      onTranslate={handleTranslate}
                      onTextToSpeech={handleTextToSpeech}
                    />
                  )}
                </AnimatePresence>
                
                <div className="text-center my-16">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold"
                  >
                    {language === 'hi' ? 'ऑडियो रूपांतरण' : 'Audio Conversion'}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-muted-foreground mt-2"
                  >
                    {language === 'hi' 
                      ? 'कई भाषाओं में टेक्स्ट और भाषण के बीच रूपांतरण करें' 
                      : 'Convert between text and speech in multiple languages'}
                  </motion.p>
                </div>
                
                <AudioConverter 
                  language={language}
                  onSaveAudioConversion={handleSaveAudioConversion}
                />
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
