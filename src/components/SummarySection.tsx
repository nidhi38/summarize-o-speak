
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Download, Headphones, Languages, Brain, BookOpen, ArrowRight, ChevronDown, ChevronUp, Clock, BarChart2, FileCheck, ListChecks } from "lucide-react";
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
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Mock data for the detailed view
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-12 px-4"
    >
      <Card className="glass hover:shadow-glass-hover transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              <span>Document Summary</span>
            </CardTitle>
            <CardDescription className="mt-1">
              {file.name} • {new Date().toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="relative"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy summary</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download summary</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpandedView(!expandedView)}
            >
              {expandedView ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Toggle view</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {expandedView && (
            <motion.div 
              className="pb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div 
                  variants={itemVariants}
                  className="bg-primary/5 rounded-lg p-4 flex items-center gap-3"
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
                  className="bg-primary/5 rounded-lg p-4 flex items-center gap-3"
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
                  className="bg-primary/5 rounded-lg p-4 flex items-center gap-3"
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

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Document Structure</h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {documentStructure.map((section, index) => (
                      <AccordionItem key={index} value={`section-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{section.title}</span>
                              <span className="text-xs text-muted-foreground">Pages {section.pageRange}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{section.wordCount} words</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                            <p>This section covers the key points related to {section.title.toLowerCase()}. 
                            The content is approximately {(section.wordCount / readingMetrics.totalWords * 100).toFixed(1)}% of the total document.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Reading Efficiency</h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between mb-3 gap-3">
                    <div className="flex-1 text-center p-3 bg-primary/5 rounded-lg">
                      <div className="text-sm text-muted-foreground">Full Reading Time</div>
                      <div className="text-xl font-medium">{readingMetrics.estimatedReadTime} minutes</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 sm:rotate-0" />
                    </div>
                    <div className="flex-1 text-center p-3 bg-primary/5 rounded-lg">
                      <div className="text-sm text-muted-foreground">Summary Reading Time</div>
                      <div className="text-xl font-medium">{readingMetrics.summaryReadTime} minutes</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Time Efficiency</span>
                      <span className="text-sm font-medium">
                        {Math.round((readingMetrics.timeSaved / readingMetrics.estimatedReadTime) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.round((readingMetrics.timeSaved / readingMetrics.estimatedReadTime) * 100)} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      You're saving {readingMetrics.timeSaved} minutes by reading this summary instead of the full document.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="summary">Basic Summary</TabsTrigger>
              <TabsTrigger value="ai-summary">AI Summary</TabsTrigger>
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="pt-4">
              <div className="p-4 rounded-lg bg-muted/50 min-h-[200px]">
                {file.summary || "Processing summary..."}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Target Language</label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          {language.flag} {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleTranslate}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Languages className="h-4 w-4" />
                    Translate
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleTextToSpeech}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Headphones className="h-4 w-4" />
                    Listen
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleAISummarize} className="w-full flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Generate AI Summary
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleGenerateFlashcards} variant="outline" className="w-full flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Create Flashcards
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleGenerateInsights} variant="secondary" className="w-full flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    Analyze Content
                  </Button>
                </motion.div>
              </div>
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
                    <div className="p-4 rounded-lg bg-muted/50 border border-muted">
                      {aiSummary.summary}
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <h3 className="text-lg font-medium mb-2">Key Takeaways</h3>
                    <ul className="space-y-2">
                      {aiSummary.keyTakeaways.map((point, index) => (
                        <motion.li 
                          key={index} 
                          variants={itemVariants}
                          className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                        >
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs">
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
                          className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {topic}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-4">
                    <Button onClick={handleTextToSpeech} className="flex items-center gap-2">
                      <Headphones className="h-4 w-4" />
                      Listen to AI Summary
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="min-h-[300px] flex items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button onClick={handleAISummarize} className="flex items-center gap-2">
                      <Brain className="mr-2 h-4 w-4" />
                      Generate AI Summary
                    </Button>
                  </motion.div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="flashcards" className="pt-4">
              {flashcards ? (
                <Flashcards flashcardSet={flashcards} />
              ) : (
                <div className="min-h-[300px] flex items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button onClick={handleGenerateFlashcards} className="flex items-center gap-2">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Generate Flashcards
                    </Button>
                  </motion.div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="insights" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Content Analysis</CardTitle>
                      <CardDescription>AI-generated insights about this document</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Topic Distribution</CardTitle>
                      <CardDescription>Main subjects covered in the document</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Technology</span>
                            <span>45%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary rounded-full h-2" style={{ width: "45%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Innovation</span>
                            <span>30%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary rounded-full h-2" style={{ width: "30%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Research</span>
                            <span>15%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary rounded-full h-2" style={{ width: "15%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Business</span>
                            <span>10%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary rounded-full h-2" style={{ width: "10%" }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="col-span-1 md:col-span-2"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Related Concepts</CardTitle>
                      <CardDescription>Key concepts connected to this document</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {[
                          "Artificial Intelligence", "Machine Learning", "Neural Networks", 
                          "Deep Learning", "Natural Language Processing", "Computer Vision",
                          "Robotics", "Data Science", "Big Data", "Cloud Computing", 
                          "Internet of Things", "Cybersecurity"
                        ].map((concept, index) => (
                          <motion.span 
                            key={index}
                            className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.07)" }}
                          >
                            {concept}
                          </motion.span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Explore More
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default SummarySection;
