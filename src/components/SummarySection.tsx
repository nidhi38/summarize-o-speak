import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Download, Headphones, Languages, Brain, BookOpen, ArrowRight, ChevronDown, ChevronUp, Clock, BarChart2, FileCheck, ListChecks, Book } from "lucide-react";
import { DocumentFile } from "@/lib/types";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProgressBar } from "@/components/ProgressBar";
import FlashcardComponent, { FlashcardSet, Flashcard } from "@/components/Flashcards";
import { formatFileSize, delay, handleApiError } from "@/lib/utils";

// Define types for AI responses
export interface SummaryResponse {
  summary: string;
  keyTakeaways: string[];
  topics: string[];
}

export interface AIInsightsResponse {
  topics: string[];
  sentiment: string;
  complexity: number;
  readingLevel: string;
  wordCount: number;
  readTime: number;
}

interface AIService {
  translateText: (text: string, targetLanguage: string) => Promise<any>;
  textToSpeech: (text: string, language: string) => Promise<string>;
  speechToText: (audioBlob: Blob, language: string) => Promise<any>;
  summarizeText?: (text: string) => Promise<SummaryResponse>;
  generateFlashcards?: (text: string) => Promise<FlashcardSet>;
  getInsights?: (text: string) => Promise<AIInsightsResponse>;
}

interface SummarySectionProps {
  file: DocumentFile | null;
  onTranslate: (text: string, targetLanguage: string) => void;
  onTextToSpeech: (text: string, language: string) => void;
}

const SummarySection = ({ file, onTranslate, onTextToSpeech }: SummarySectionProps) => {
  const [copied, setCopied] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(DEFAULT_LANGUAGE);
  const [aiSummary, setAiSummary] = useState<SummaryResponse | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardSet | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [expandedView, setExpandedView] = useState(false);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
    translate: false,
    tts: false,
    summary: false,
    flashcards: false,
    insights: false
  });
  const [error, setError] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsightsResponse | null>(null);

  const { toast } = useToast();
  
  // Mock AI service - in a real app, this would be imported from a service file
  const mockAIService: AIService = {
    translateText: async (text, lang) => ({translated: text, language: lang}),
    textToSpeech: async (text, lang) => "audio-url",
    speechToText: async (blob, lang) => ({text: "transcribed text", language: lang}),
    
    // Mock implementations of the missing methods
    summarizeText: async (text) => {
      await delay(1500); // Simulate API delay
      return {
        summary: `Enhanced AI summary of: ${text.slice(0, 100)}...`,
        keyTakeaways: [
          "The document discusses key technological innovations",
          "It addresses implementation challenges in various contexts",
          "Several case studies are presented to support the findings",
          "Recommendations are made for future applications"
        ],
        topics: ["Technology", "Innovation", "Implementation", "Research"]
      };
    },
    
    generateFlashcards: async (text) => {
      await delay(1500); // Simulate API delay
      return {
        id: crypto.randomUUID(),
        title: "Study Flashcards",
        cards: [
          {
            id: crypto.randomUUID(),
            question: "What is the main topic of the document?",
            answer: "Technological innovation and implementation strategies."
          },
          {
            id: crypto.randomUUID(),
            question: "What challenges are addressed?",
            answer: "Implementation barriers in various organizational contexts."
          },
          {
            id: crypto.randomUUID(),
            question: "What evidence supports the findings?",
            answer: "Case studies from several industry sectors."
          },
          {
            id: crypto.randomUUID(),
            question: "What future applications are suggested?",
            answer: "Integration with existing systems and expansion to new domains."
          }
        ]
      };
    },
    
    getInsights: async (text) => {
      await delay(1500); // Simulate API delay
      return {
        topics: ["Technology", "Innovation", "Research", "Implementation"],
        sentiment: "Neutral",
        complexity: 72,
        readingLevel: "College",
        wordCount: text.split(/\s+/).length,
        readTime: Math.round(text.split(/\s+/).length / 200) // Avg reading speed of 200 wpm
      };
    }
  };
  
  if (!file) return null;

  const handleCopy = () => {
    if (!file.summary) return;
    
    try {
      navigator.clipboard.writeText(file.summary);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied to clipboard",
        description: "Summary copied to clipboard successfully",
      });
    } catch (error) {
      console.error("Copy failed:", error);
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
      });
    }
  };

  const handleDownload = () => {
    if (!file.summary) return;
    
    try {
      const blob = new Blob([file.summary], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      
      a.href = url;
      a.download = `${file.name.split(".")[0]}-summary.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Summary downloaded",
        description: "Your summary has been downloaded successfully",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Could not download summary. Please try again.",
      });
    }
  };

  const handleTranslate = async () => {
    if (!file.summary) return;
    
    try {
      setIsLoading({...isLoading, translate: true});
      setError(null);
      onTranslate(file.summary, targetLanguage);
      
      toast({
        title: "Translation in progress",
        description: "Your summary is being translated...",
      });
    } catch (error) {
      setError(handleApiError(error));
      toast({
        variant: "destructive",
        title: "Translation failed",
        description: "Could not translate summary. Please try again.",
      });
    } finally {
      setIsLoading({...isLoading, translate: false});
    }
  };

  const handleTextToSpeech = async () => {
    if (!file.summary) return;
    
    try {
      setIsLoading({...isLoading, tts: true});
      setError(null);
      onTextToSpeech(file.summary, targetLanguage);
      
      toast({
        title: "Audio conversion in progress",
        description: "Your summary is being converted to speech...",
      });
    } catch (error) {
      setError(handleApiError(error));
      toast({
        variant: "destructive",
        title: "Text-to-speech failed",
        description: "Could not convert text to speech. Please try again.",
      });
    } finally {
      setIsLoading({...isLoading, tts: false});
    }
  };

  const handleAISummarize = async () => {
    if (!file.summary) return;
    
    try {
      setIsLoading({...isLoading, summary: true});
      setError(null);
      
      toast({
        title: "Generating AI Summary",
        description: "Please wait while we process your document...",
      });
      
      if (mockAIService.summarizeText) {
        const summary = await mockAIService.summarizeText(file.summary);
        setAiSummary(summary);
        setActiveTab("ai-summary");
        
        toast({
          title: "Summary generated",
          description: "AI summary has been generated successfully",
        });
      } else {
        throw new Error("Summarize function not available");
      }
    } catch (error) {
      setError(handleApiError(error));
      toast({
        variant: "destructive",
        title: "Summary generation failed",
        description: "Could not generate AI summary. Please try again.",
      });
    } finally {
      setIsLoading({...isLoading, summary: false});
    }
  };
  
  const handleGenerateFlashcards = async () => {
    if (!file.summary) return;
    
    try {
      setIsLoading({...isLoading, flashcards: true});
      setError(null);
      
      toast({
        title: "Creating Flashcards",
        description: "Generating learning materials from your document...",
      });
      
      if (mockAIService.generateFlashcards) {
        const cards = await mockAIService.generateFlashcards(file.summary);
        setFlashcards(cards);
        setActiveTab("flashcards");
        
        toast({
          title: "Flashcards created",
          description: "Learning materials have been generated successfully",
        });
      } else {
        throw new Error("Flashcard generation not available");
      }
    } catch (error) {
      setError(handleApiError(error));
      toast({
        variant: "destructive",
        title: "Flashcard generation failed",
        description: "Could not generate flashcards. Please try again.",
      });
    } finally {
      setIsLoading({...isLoading, flashcards: false});
    }
  };
  
  const handleGenerateInsights = async () => {
    if (!file.summary) return;
    
    try {
      setIsLoading({...isLoading, insights: true});
      setError(null);
      
      toast({
        title: "Analyzing Content",
        description: "Generating insights from your document...",
      });
      
      if (mockAIService.getInsights) {
        const insightsData = await mockAIService.getInsights(file.summary);
        setAiInsights(insightsData);
        setActiveTab("insights");
        
        toast({
          title: "Insights generated",
          description: "Document insights have been analyzed successfully",
        });
      } else {
        throw new Error("Insight generation not available");
      }
    } catch (error) {
      setError(handleApiError(error));
      toast({
        variant: "destructive",
        title: "Insight generation failed",
        description: "Could not generate document insights. Please try again.",
      });
    } finally {
      setIsLoading({...isLoading, insights: false});
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const popUpVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const documentStructure = [
    { title: "Introduction", pageRange: "1-3", wordCount: 750 },
    { title: "Key Concepts", pageRange: "4-12", wordCount: 2200 },
    { title: "Case Studies", pageRange: "13-18", wordCount: 1500 },
    { title: "Analysis", pageRange: "19-25", wordCount: 1800 },
    { title: "Conclusion", pageRange: "26-30", wordCount: 950 }
  ];

  const readingMetrics = {
    totalPages: 30,
    totalWords: 7200,
    estimatedReadTime: 36, // minutes
    summaryReadTime: 5, // minutes
    timeSaved: 31 // minutes
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="w-full max-w-4xl mx-auto mt-12 px-4"
    >
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}
      
      <motion.div variants={popUpVariants}>
        <Card className="glass hover:shadow-glass-hover transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
              <CardTitle className="text-2xl flex items-center gap-2">
                <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.3 }}>
                  <FileCheck className="h-5 w-5 text-primary" />
                </motion.div>
                <span>Document Summary</span>
              </CardTitle>
              <CardDescription className="mt-1">
                {file.name} • {new Date().toLocaleDateString()}
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {formatFileSize(file.size || 0)}
                </span>
              </CardDescription>
            </motion.div>
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="relative"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy summary</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download summary</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpandedView(!expandedView)}
                >
                  {expandedView ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span className="sr-only">Toggle view</span>
                </Button>
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {expandedView && (
              <motion.div 
                className="pb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                    className="bg-primary/5 rounded-lg p-4 flex items-center gap-3 transition-all duration-300"
                  >
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Book className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Pages</div>
                      <div className="text-xl font-semibold">{readingMetrics.totalPages}</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                    className="bg-primary/5 rounded-lg p-4 flex items-center gap-3 transition-all duration-300"
                  >
                    <div className="bg-primary/10 p-2 rounded-full">
                      <ListChecks className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Word Count</div>
                      <div className="text-xl font-semibold">{readingMetrics.totalWords.toLocaleString()}</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                    className="bg-primary/5 rounded-lg p-4 flex items-center gap-3 transition-all duration-300"
                  >
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Time Saved</div>
                      <div className="text-xl font-semibold">{readingMetrics.timeSaved} min</div>
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  variants={itemVariants}
                  className="mb-6"
                >
                  <h3 className="text-lg font-medium mb-2">Document Structure</h3>
                  <div className="bg-muted/30 rounded-lg p-4 backdrop-blur-sm">
                    <Accordion type="single" collapsible className="w-full">
                      {documentStructure.map((section, index) => (
                        <AccordionItem key={index} value={`section-${index}`}>
                          <motion.div whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }} className="rounded-md">
                            <AccordionTrigger className="hover:no-underline px-3">
                              <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{section.title}</span>
                                  <span className="text-xs text-muted-foreground">Pages {section.pageRange}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{section.wordCount} words</span>
                              </div>
                            </AccordionTrigger>
                          </motion.div>
                          <AccordionContent className="px-3">
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="text-sm text-muted-foreground pl-4 border-l-2 border-muted"
                            >
                              <p>This section covers the key points related to {section.title.toLowerCase()}. 
                              The content is approximately {(section.wordCount / readingMetrics.totalWords * 100).toFixed(1)}% of the total document.</p>
                            </motion.div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-4">
                  <h3 className="text-lg font-medium mb-3">Reading Efficiency</h3>
                  <div className="bg-muted/30 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row justify-between mb-3 gap-3">
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="flex-1 text-center p-3 bg-primary/5 rounded-lg"
                      >
                        <div className="text-sm text-muted-foreground">Full Reading Time</div>
                        <div className="text-xl font-medium">{readingMetrics.estimatedReadTime} minutes</div>
                      </motion.div>
                      <div className="flex items-center justify-center">
                        <motion.div 
                          animate={{ x: [0, 10, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                          <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 sm:rotate-0" />
                        </motion.div>
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="flex-1 text-center p-3 bg-primary/5 rounded-lg"
                      >
                        <div className="text-sm text-muted-foreground">Summary Reading Time</div>
                        <div className="text-xl font-medium">{readingMetrics.summaryReadTime} minutes</div>
                      </motion.div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Time Efficiency</span>
                        <span className="text-sm font-medium">
                          {Math.round((readingMetrics.timeSaved / readingMetrics.estimatedReadTime) * 100)}%
                        </span>
                      </div>
                      <ProgressBar 
                        value={readingMetrics.timeSaved} 
                        max={readingMetrics.estimatedReadTime}
                        height={8}
                        gradient={true}
                        animate={true}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        You're saving {readingMetrics.timeSaved} minutes by reading this summary instead of the full document.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="summary" className="transition-all duration-300">Basic Summary</TabsTrigger>
                <TabsTrigger value="ai-summary" className="transition-all duration-300">AI Summary</TabsTrigger>
                <TabsTrigger value="flashcards" className="transition-all duration-300">Flashcards</TabsTrigger>
                <TabsTrigger value="insights" className="transition-all duration-300">AI Insights</TabsTrigger>
              </TabsList>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="summary" className="pt-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="p-6 rounded-lg glass shadow-glass min-h-[200px]">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="prose prose-sm max-w-none"
                        >
                          {file.summary || "Processing summary..."}
                        </motion.div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <div className="flex-1 space-y-2">
                          <label className="text-sm font-medium">Target Language</label>
                          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                            <SelectTrigger className="w-full glass border-0 shadow-glass">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent className="glass">
                              {SUPPORTED_LANGUAGES.map((language) => (
                                <SelectItem key={language.code} value={language.code}>
                                  {language.flag} {language.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-end gap-2">
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button
                              variant="outline"
                              onClick={handleTranslate}
                              disabled={isLoading.translate}
                              className="flex-1 flex items-center gap-2 glass"
                            >
                              {isLoading.translate ? (
                                <div className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                              ) : (
                                <Languages className="h-4 w-4" />
                              )}
                              Translate
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button
                              variant="secondary"
                              onClick={handleTextToSpeech}
                              disabled={isLoading.tts}
                              className="flex-1 flex items-center gap-2"
                            >
                              {isLoading.tts ? (
                                <div className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                              ) : (
                                <Headphones className="h-4 w-4" />
                              )}
                              Listen
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                      
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -5 }} 
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button 
                            onClick={handleAISummarize} 
                            disabled={isLoading.summary}
                            className="w-full flex items-center gap-2 h-14 rounded-xl bg-gradient-to-r from-primary to-primary/80"
                          >
                            {isLoading.summary ? (
                              <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                            ) : (
                              <Brain className="h-5 w-5" />
                            )}
                            <span className="font-medium">Generate AI Summary</span>
                          </Button>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -5 }} 
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button 
                            onClick={handleGenerateFlashcards} 
                            disabled={isLoading.flashcards}
                            variant="outline" 
                            className="w-full flex items-center gap-2 h-14 rounded-xl glass"
                          >
                            {isLoading.flashcards ? (
                              <div className="h-5 w-5 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                            ) : (
                              <BookOpen className="h-5 w-5" />
                            )}
                            <span className="font-medium">Create Flashcards</span>
                          </Button>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -5 }} 
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button 
                            onClick={handleGenerateInsights}
                            disabled={isLoading.insights}
                            variant="secondary" 
                            className="w-full flex items-center gap-2 h-14 rounded-xl"
                          >
                            {isLoading.insights ? (
                              <div className="h-5 w-5 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                            ) : (
                              <BarChart2 className="h-5 w-5" />
                            )}
                            <span className="font-medium">Analyze Content</span>
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="ai-summary" className="pt-4">
                    {aiSummary ? (
                      <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                      >
                        <motion.div variants={itemVariants}>
                          <h3 className="text-lg font-medium mb-2">Enhanced Summary</h3>
                          <div className="p-6 rounded-lg glass shadow-glass border border-primary/10">
                            {aiSummary.summary}
                          </div>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                          <h3 className="text-lg font-medium mb-2">Key Takeaways</h3>
                          <ul className="space-y-3">
                            {aiSummary.keyTakeaways.map((point, index) => (
                              <motion.li 
                                key={index} 
                                variants={itemVariants}
                                whileHover={{ x: 5 }}
                                className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10 shadow-sm transition-all duration-300"
                              >
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs mt-0.5">
                                  {index + 1}
                                </span>
                                <span>{point}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                          <h3 className="text-lg font-medium mb-2">Main Topics</h3>
                          <div className="flex flex-wrap gap-2">
                            {aiSummary.topics.map((topic, index) => (
                              <motion.span 
                                key={index} 
                                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium shadow-sm"
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.04)" }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {topic}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-4">
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button onClick={handleTextToSpeech} className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 px-6 py-6 h-12 rounded-xl">
                              <Headphones className="h-4 w-4" />
                              <span className="font-medium">Listen to AI Summary</span>
                            </Button>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="min-h-[300px] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div 
                          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }} 
                          whileTap={{ scale: 0.95 }}
                          className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-transparent text-center"
                        >
                          <motion.div 
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, 0, -5, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="flex justify-center mb-4"
                          >
                            <Brain className="h-12 w-12 text-primary/40" />
                          </motion.div>
                          <h3 className="text-lg font-medium mb-2">No AI Summary Yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Generate an enhanced AI summary to get key takeaways from your document
                          </p>
                          <Button 
                            onClick={handleAISummarize}
                            disabled={isLoading.summary}
                            className="bg-primary/80 hover:bg-primary"
                          >
                            {isLoading.summary ? (
                              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                            ) : null}
                            Generate Now
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="flashcards" className="pt-4">
                    {flashcards ? (
                      <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <FlashcardComponent flashcardSet={flashcards} />
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="min-h-[300px] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div 
                          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }} 
                          whileTap={{ scale: 0.95 }}
                          className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-transparent text-center"
                        >
                          <motion.div 
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, 0, -5, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="flex justify-center mb-4"
                          >
                            <BookOpen className="h-12 w-12 text-primary/40" />
                          </motion.div>
                          <h3 className="text-lg font-medium mb-2">No Flashcards Yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Generate flashcards to help you study and memorize key information
                          </p>
                          <Button 
                            onClick={handleGenerateFlashcards}
                            disabled={isLoading.flashcards}
                            className="bg-primary/80 hover:bg-primary"
                          >
                            {isLoading.flashcards ? (
                              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                            ) : null}
                            Create Flashcards
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="insights" className="pt-4">
                    {aiInsights ? (
                      <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                      >
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <motion.div 
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="p-4 rounded-lg bg-primary/5 flex flex-col items-center justify-center"
                          >
                            <h4 className="font-medium text-muted-foreground mb-1">Sentiment</h4>
                            <p className="text-2xl font-semibold">{aiInsights.sentiment}</p>
                          </motion.div>
                          <motion.div 
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="p-4 rounded-lg bg-primary/5 flex flex-col items-center justify-center"
                          >
                            <h4 className="font-medium text-muted-foreground mb-1">Complexity</h4>
                            <p className="text-2xl font-semibold">{aiInsights.complexity}/100</p>
                          </motion.div>
                          <motion.div 
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="p-4 rounded-lg bg-primary/5 flex flex-col items-center justify-center"
                          >
                            <h4 className="font-medium text-muted-foreground mb-1">Reading Level</h4>
                            <p className="text-2xl font-semibold">{aiInsights.readingLevel}</p>
                          </motion.div>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                          <h3 className="text-lg font-medium mb-2">Reading Statistics</h3>
                          <div className="p-4 rounded-lg bg-primary/5">
                            <div className="flex justify-between mb-2">
                              <span>Word Count</span>
                              <span className="font-medium">{aiInsights.wordCount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                              <span>Estimated Reading Time</span>
                              <span className="font-medium">{aiInsights.readTime} min</span>
                            </div>
                            
                            <h4 className="text-sm font-medium mb-2">Topic Distribution</h4>
                            <div className="space-y-2">
                              {aiInsights.topics.map((topic, index) => (
                                <div key={index}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>{topic}</span>
                                    <span>{Math.round(100 / aiInsights.topics.length)}%</span>
                                  </div>
                                  <ProgressBar 
                                    value={100 / aiInsights.topics.length} 
                                    max={100}
                                    gradient={true}
                                    height={6}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="min-h-[300px] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div 
                          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }} 
                          whileTap={{ scale: 0.95 }}
                          className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-transparent text-center"
                        >
                          <motion.div 
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, 0, -5, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="flex justify-center mb-4"
                          >
                            <BarChart2 className="h-12 w-12 text-primary/40" />
                          </motion.div>
                          <h3 className="text-lg font-medium mb-2">No Insights Yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Analyze your document to get detailed insights and statistics
                          </p>
                          <Button 
                            onClick={handleGenerateInsights}
                            disabled={isLoading.insights}
                            className="bg-primary/80 hover:bg-primary"
                          >
                            {isLoading.insights ? (
                              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                            ) : null}
                            Analyze Content
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
};

export default SummarySection;
