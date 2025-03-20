import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Download, Headphones, Languages, Brain, BookOpen, ArrowRight, ChevronDown, ChevronUp, Clock, BarChart2, FileCheck, ListChecks, Book } from "lucide-react";
import { DocumentFile } from "@/lib/types";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";
import { useAIService, SummaryResponse, FlashcardSet } from "@/lib/AIService";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import Flashcards from "@/components/Flashcards";

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
  const { toast } = useToast();
  const { summarizeText, generateFlashcards, getInsights } = useAIService();

  if (!file) return null;

  const handleCopy = () => {
    if (!file.summary) return;
    
    navigator.clipboard.writeText(file.summary);
    setCopied(true);
    
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied to clipboard",
      description: "Summary copied to clipboard successfully",
    });
  };

  const handleDownload = () => {
    if (!file.summary) return;
    
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
  };

  const handleTranslate = () => {
    if (!file.summary) return;
    onTranslate(file.summary, targetLanguage);
  };

  const handleTextToSpeech = () => {
    if (!file.summary) return;
    onTextToSpeech(file.summary, targetLanguage);
  };

  const handleAISummarize = async () => {
    if (!file.summary) return;
    
    toast({
      title: "Generating AI Summary",
      description: "Please wait while we process your document...",
    });
    
    const summary = await summarizeText(file.summary);
    setAiSummary(summary);
    setActiveTab("ai-summary");
  };
  
  const handleGenerateFlashcards = async () => {
    if (!file.summary) return;
    
    toast({
      title: "Creating Flashcards",
      description: "Generating learning materials from your document...",
    });
    
    const cards = await generateFlashcards(file.summary);
    setFlashcards(cards);
    setActiveTab("flashcards");
  };
  
  const handleGenerateInsights = async () => {
    if (!file.summary) return;
    
    toast({
      title: "Analyzing Content",
      description: "Generating insights from your document...",
    });
    
    await getInsights(file.summary);
    setActiveTab("insights");
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
            <AnimatePresence>
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
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round((readingMetrics.timeSaved / readingMetrics.estimatedReadTime) * 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                          className="h-2 bg-primary rounded-full"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          You're saving {readingMetrics.timeSaved} minutes by reading this summary instead of the full document.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

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
                              className="flex-1 flex items-center gap-2 glass"
                            >
                              <Languages className="h-4 w-4" />
                              Translate
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button
                              variant="secondary"
                              onClick={handleTextToSpeech}
                              className="flex-1 flex items-center gap-2"
                            >
                              <Headphones className="h-4 w-4" />
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
                          <Button onClick={handleAISummarize} className="w-full flex items-center gap-2 h-14 rounded-xl bg-gradient-to-r from-primary to-primary/80">
                            <Brain className="h-5 w-5" />
                            <span className="font-medium">Generate AI Summary</span>
                          </Button>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -5 }} 
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button onClick={handleGenerateFlashcards} variant="outline" className="w-full flex items-center gap-2 h-14 rounded-xl glass">
                            <BookOpen className="h-5 w-5" />
                            <span className="font-medium">Create Flashcards</span>
                          </Button>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -5 }} 
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button onClick={handleGenerateInsights} variant="secondary" className="w-full flex items-center gap-2 h-14 rounded-xl">
                            <BarChart2 className="h-5 w-5" />
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
                            className="inline-block mb-3"
                          >
                            <Brain className="h-12 w-12 text-primary/60" />
                          </motion.div>
                          <h3 className="text-xl font-medium mb-4">Generate AI Summary</h3>
                          <p className="text-muted-foreground mb-6 max-w-md">
                            Use advanced AI to create an enhanced summary with key takeaways and main topics
                          </p>
                          <Button onClick={handleAISummarize} className="px-6 bg-gradient-to-r from-primary to-primary/80">
                            <Brain className="mr-2 h-4 w-4" />
                            Generate Now
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="flashcards" className="pt-4">
                    {flashcards ? (
                      <Flashcards flashcardSet={flashcards} />
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
                              y: [0, -10, 0],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block mb-3"
                          >
                            <BookOpen className="h-12 w-12 text-primary/60" />
                          </motion.div>
                          <h3 className="text-xl font-medium mb-4">Create Learning Flashcards</h3>
                          <p className="text-muted-foreground mb-6 max-w-md">
                            Generate interactive flashcards to help you remember the key concepts from this document
                          </p>
                          <Button onClick={handleGenerateFlashcards} className="px-6 bg-gradient-to-r from-primary to-primary/80">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Generate Flashcards
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="insights" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0,0,0,0.1)" }}
                        className="transition-all duration-300"
                      >
                        <Card className="glass shadow-glass border border-white/10 backdrop-blur-xl overflow-hidden">
                          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Brain className="h-5 w-5 text-primary/70" />
                              Content Analysis
                            </CardTitle>
                            <CardDescription>AI-generated insights about this document</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-6">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Reading Level:</span>
                              <span className="font-medium">College</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Content Complexity:</span>
                              <span className="font-medium">Advanced (72/100)</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Overall Sentiment:</span>
                              <span className="font-medium">Neutral</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Word Count:</span>
                              <span className="font-medium">1,250 words</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Reading Time:</span>
                              <span className="font-medium">~6 minutes</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0,0,0,0.1)" }}
                        className="transition-all duration-300"
                      >
                        <Card className="glass shadow-glass border border-white/10 backdrop-blur-xl overflow-hidden">
                          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <BarChart2 className="h-5 w-5 text-primary/70" />
                              Topic Distribution
                            </CardTitle>
                            <CardDescription>Main subjects covered in the document</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              {[
                                { topic: "Technology", percentage: 45 },
                                { topic: "Innovation", percentage: 30 },
                                { topic: "Research", percentage: 15 },
                                { topic: "Business", percentage: 10 }
                              ].map((item, index) => (
                                <motion.div 
                                  key={index}
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: "100%" }}
                                  transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                                >
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>{item.topic}</span>
                                    <span>{item.percentage}%</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${item.percentage}%` }}
                                      transition={{ delay: 0.5 + (index * 0.1), duration: 0.7, ease: "easeOut" }}
                                      className="bg-primary rounded-full h-2"
                                    />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0,0,0,0.1)" }}
                        className="col-span-1 md:col-span-2 transition-all duration-300"
                      >
                        <Card className="glass shadow-glass border border-white/10 backdrop-blur-xl overflow-hidden">
                          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: [0, 5, 0, -5, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                              >
                                <Brain className="h-5 w-5 text-primary/70" />
                              </motion.div>
                              Related Concepts
                            </CardTitle>
                            <CardDescription>Key concepts connected to this document</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4, duration: 0.5 }}
                              className="flex flex-wrap gap-3"
                            >
                              {[
                                "Artificial Intelligence", "Machine Learning", "Neural
