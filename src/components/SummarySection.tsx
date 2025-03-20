import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Download, Headphones, Languages } from "lucide-react";
import { DocumentFile } from "@/lib/types";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SummarySectionProps {
  file: DocumentFile | null;
  onTranslate: (text: string, targetLanguage: string) => void;
  onTextToSpeech: (text: string, language: string) => void;
}

const SummarySection = ({ file, onTranslate, onTextToSpeech }: SummarySectionProps) => {
  const [copied, setCopied] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(DEFAULT_LANGUAGE);
  const { toast } = useToast();

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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-12 px-4"
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
          <div className="p-4 rounded-lg bg-muted/50 min-h-[200px]">
            {file.summary || "Processing summary..."}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
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
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default SummarySection;
