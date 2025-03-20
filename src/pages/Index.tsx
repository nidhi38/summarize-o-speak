
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FileUploader from "@/components/FileUploader";
import SummarySection from "@/components/SummarySection";
import AudioConverter from "@/components/AudioConverter";
import { DocumentFile, AudioConversion } from "@/lib/types";
import { DEFAULT_LANGUAGE } from "@/lib/constants";

const Index = () => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [processedFile, setProcessedFile] = useState<DocumentFile | null>(null);
  const [audioConversions, setAudioConversions] = useState<AudioConversion[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileProcessed = (file: DocumentFile) => {
    setProcessedFile(file);
    
    toast({
      title: "File processed",
      description: "Your document has been processed successfully!",
    });
  };

  const handleTranslate = (text: string, targetLanguage: string) => {
    // In a real implementation, this would call a translation API
    // For now, we'll just simulate translation
    toast({
      title: "Translation in progress",
      description: "Your summary is being translated...",
    });
    
    // Simulate translation delay
    setTimeout(() => {
      const translatedPrefix = `[Translated to ${targetLanguage}] `;
      
      setProcessedFile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          summary: translatedPrefix + prev.summary,
          language: targetLanguage
        };
      });
      
      toast({
        title: "Translation complete",
        description: "Your summary has been translated successfully!",
      });
    }, 1500);
  };

  const handleTextToSpeech = (text: string, language: string) => {
    // In a real implementation, this would call a text-to-speech API
    // For now, we'll just simulate TTS
    toast({
      title: "Generating audio",
      description: "Converting text to speech...",
    });
    
    // Simulate TTS delay
    setTimeout(() => {
      // Create a new audio conversion
      const newConversion: AudioConversion = {
        id: crypto.randomUUID(),
        text,
        isGenerating: false,
        language,
        createdAt: new Date()
      };
      
      setAudioConversions(prev => [newConversion, ...prev]);
      
      toast({
        title: "Audio generated",
        description: "Your text has been converted to speech. Check the Audio Converter section.",
      });
    }, 1500);
  };

  const handleSaveAudioConversion = (conversion: AudioConversion) => {
    setAudioConversions(prev => [conversion, ...prev.slice(0, 4)]);
  };

  return (
    <div className="min-h-screen">
      <Header language={language} setLanguage={setLanguage} />
      
      <main>
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
                Audio Conversion
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-muted-foreground mt-2"
              >
                Convert between text and speech in multiple languages
              </motion.p>
            </div>
            
            <AudioConverter 
              language={language}
              onSaveAudioConversion={handleSaveAudioConversion}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
