
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, FileText, UploadCloud, Check, ChevronDown, FileIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ProgressBar } from "./ProgressBar";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PDFConverter() {
  const [selectedMode, setSelectedMode] = useState<string>("summarize");
  const [processingState, setProcessingState] = useState<"idle" | "processing" | "complete">("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const { toast } = useToast();
  
  const modes = [
    { id: "summarize", label: "Summarize PDF" },
    { id: "extract", label: "Extract Text" },
    { id: "translate", label: "Translate PDF" },
    { id: "annotate", label: "Annotate PDF" },
    { id: "convert", label: "Convert Format" },
  ];
  
  const handleUpload = (e?: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
    }
    
    setProcessingState("processing");
    
    toast({
      title: "Processing started",
      description: `Converting document using ${modes.find(m => m.id === selectedMode)?.label.toLowerCase()}`,
    });
    
    let counter = 0;
    const interval = setInterval(() => {
      counter += 2;
      setProgress(counter);
      
      if (counter >= 100) {
        clearInterval(interval);
        setProcessingState("complete");
        
        toast({
          title: "Conversion complete",
          description: "Your document has been successfully processed",
        });
      }
    }, 50);
  };
  
  const resetConverter = () => {
    setProcessingState("idle");
    setProgress(0);
    setFileName("");
    setFileSize("");
  };

  return (
    <section className="py-12 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-4"
          >
            Advanced PDF Converter
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Transform your PDFs with our powerful conversion tools - summarize, extract, translate, and annotate. 
            Our AI-powered system analyzes document structure, identifies key sections, and processes content 
            with advanced natural language processing to deliver high-quality results tailored to your needs.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass rounded-xl border border-white/20 p-8 shadow-glass"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-center">
                <FileText className="w-20 h-20 text-primary opacity-80" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-center">Document Transformation Hub</h3>
                <p className="text-muted-foreground text-center">
                  Our PDF converter supports multiple file formats and provides intelligent document processing 
                  with semantic understanding of your content. Extract insights, translate to 50+ languages, 
                  or create concise summaries with our state-of-the-art technology.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Multiple Formats</p>
                      <p className="text-xs text-muted-foreground">PDF, DOCX, TXT, HTML</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/10">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Smart Processing</p>
                      <p className="text-xs text-muted-foreground">AI-powered analysis</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {fileName && (
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="font-medium text-sm mb-1">Current document:</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm">{fileName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{fileSize}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-xl border border-white/20 p-6 shadow-glass"
          >
            <h3 className="text-2xl font-bold mb-6">Convert Your PDF</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select Conversion Mode</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {modes.find(m => m.id === selectedMode)?.label}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {modes.map((mode) => (
                      <DropdownMenuItem 
                        key={mode.id} 
                        onClick={() => setSelectedMode(mode.id)}
                        className="cursor-pointer"
                      >
                        {mode.id === selectedMode && (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        {mode.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {processingState === "idle" ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="text-lg font-medium mb-2">Upload Your PDF</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your file here, or click to browse
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleUpload}
                  />
                  <label htmlFor="file-upload">
                    <Button as="span" tabIndex={0} className="cursor-pointer">
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                  </label>
                </div>
              ) : processingState === "processing" ? (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Processing...</h4>
                  <ProgressBar 
                    value={progress} 
                    animated 
                    striped 
                    gradient
                    height={8}
                    rounded="md"
                    showPercentage
                  />
                  <p className="text-sm text-muted-foreground">
                    Converting your document using {modes.find(m => m.id === selectedMode)?.label.toLowerCase()}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-medium">Conversion Complete!</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your document has been successfully processed with {modes.find(m => m.id === selectedMode)?.label.toLowerCase()}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="default">
                      <Download className="h-4 w-4 mr-2" />
                      Download Result
                    </Button>
                    <Button variant="outline" onClick={resetConverter}>
                      Process Another PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h4 className="text-sm font-medium mb-3">Supported Features</h4>
              <div className="grid grid-cols-2 gap-2">
                {["Text Extraction", "Language Translation", "Key Point Summary", "Annotations", "Format Conversion", "Data Tables", "Image Extraction"].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-xs">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
