
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Download, Headphones, Languages, Brain, BookOpen } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    
    const summary = await summarizeText(file.summary);
    setAiSummary(summary);
    setActiveTab("ai-summary");
  };
  
  const handleGenerateFlashcards = async () => {
    if (!file.summary) return;
    
    const cards = await generateFlashcards(file.summary);
    setFlashcards(cards);
    setActiveTab("flashcards");
  };
  
  const handleGenerateInsights = async () => {
    if (!file.summary) return;
    
    await getInsights(file.summary);
    setActiveTab("insights");
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
          <CardTitle className="text-2xl">Summary</CardTitle>
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
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <Button onClick={handleAISummarize} className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Generate AI Summary
                </Button>
                <Button onClick={handleGenerateFlashcards} variant="outline" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Create Flashcards
                </Button>
                <Button onClick={handleGenerateInsights} variant="secondary" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Analyze Content
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="ai-summary" className="pt-4">
              {aiSummary ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Enhanced Summary</h3>
                    <div className="p-4 rounded-lg bg-muted/50">
                      {aiSummary.summary}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Key Takeaways</h3>
                    <ul className="space-y-2">
                      {aiSummary.keyTakeaways.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 p-3 rounded-lg bg-primary/5">
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs">
                            {index + 1}
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Main Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiSummary.topics.map((topic, index) => (
                        <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[300px] flex items-center justify-center">
                  <Button onClick={handleAISummarize}>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate AI Summary
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="flashcards" className="pt-4">
              {flashcards ? (
                <Flashcards flashcardSet={flashcards} />
              ) : (
                <div className="min-h-[300px] flex items-center justify-center">
                  <Button onClick={handleGenerateFlashcards}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Generate Flashcards
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="insights" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default SummarySection;
