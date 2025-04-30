
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, FileText, UploadCloud, Check, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ProgressBar } from "./ProgressBar";
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
  
  const modes = [
    { id: "summarize", label: "Summarize PDF" },
    { id: "extract", label: "Extract Text" },
    { id: "translate", label: "Translate PDF" },
    { id: "annotate", label: "Annotate PDF" },
  ];
  
  const handleUpload = () => {
    setProcessingState("processing");
    
    let counter = 0;
    const interval = setInterval(() => {
      counter += 2;
      setProgress(counter);
      
      if (counter >= 100) {
        clearInterval(interval);
        setProcessingState("complete");
      }
    }, 50);
  };
  
  const resetConverter = () => {
    setProcessingState("idle");
    setProgress(0);
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
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Transform your PDFs with our powerful conversion tools - summarize, extract, translate, and annotate
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=600&q=80" 
                alt="PDF Document" 
                className="rounded-lg shadow-2xl w-full aspect-[3/4] object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg"></div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute bottom-6 left-6 right-6"
              >
                <Card className="bg-black/50 backdrop-blur-sm border-white/10">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">research-document.pdf</h4>
                      <p className="text-xs text-gray-300">26 pages • 4.3 MB</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">
                      <Download className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full h-16 w-16 flex items-center justify-center text-lg font-bold shadow-lg"
                initial={{ rotate: -10, scale: 0.8 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  delay: 0.4
                }}
              >
                New
              </motion.div>
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
                  <Button onClick={handleUpload}>
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
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
                    Converting your PDF using {modes.find(m => m.id === selectedMode)?.label.toLowerCase()}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-medium">Conversion Complete!</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your PDF has been successfully processed
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
                {["Text Extraction", "Language Translation", "Key Point Summary", "Annotations"].map((feature, index) => (
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
