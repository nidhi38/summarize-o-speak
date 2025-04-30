
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  File, 
  X, 
  Check, 
  AlertCircle,
  FileCheck,
  FilePlus
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { DocumentFile, FileStatus } from "@/lib/types";
import { MAX_FILE_SIZE, SUPPORTED_FILE_TYPES } from "@/lib/constants";
import { Button } from "./ui/button";

interface FileUploaderProps {
  onFileProcessed: (file: DocumentFile) => void;
  language: string;
}

const FileUploader = ({ onFileProcessed, language }: FileUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      return "File type not supported. Please upload a PDF or text document.";
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`;
    }
    
    return null;
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const fileArray = Array.from(fileList);
    
    fileArray.forEach(file => {
      const error = validateFile(file);
      
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        return;
      }
      
      const newFile: DocumentFile = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0,
        uploadDate: new Date(),
        language
      };
      
      setFiles(prev => [...prev, newFile]);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        
        if (progress >= 100) {
          clearInterval(interval);
          progress = 100;
          
          // Simulate processing
          setFiles(prev => 
            prev.map(f => 
              f.id === newFile.id 
                ? { ...f, status: 'processing' as FileStatus, progress: 100 } 
                : f
            )
          );
          
          toast({
            title: "Processing",
            description: `Analyzing document content and generating insights...`,
          });
          
          // Simulate completion after processing
          setTimeout(() => {
            const summary = `This comprehensive analysis of ${file.name} reveals several key insights. The document primarily focuses on [main topic], with significant emphasis on [key point 1], [key point 2], and [key point 3]. The author presents a compelling argument for [main argument], supported by evidence from [source 1] and [source 2]. There are notable sections addressing [important section 1] and [important section 2], which contribute to the overall thesis. The methodology employed demonstrates [methodology characteristics], leading to findings that suggest [primary findings]. These conclusions have important implications for [field or application], particularly regarding [specific implication]. Future research could explore [research direction 1] or [research direction 2] to further develop these concepts.`;
            
            const processedFile = {
              ...newFile,
              status: 'completed' as FileStatus,
              progress: 100,
              summary,
              url: URL.createObjectURL(file)
            };
            
            setFiles(prev => 
              prev.map(f => 
                f.id === newFile.id ? processedFile : f
              )
            );
            
            onFileProcessed(processedFile);
            
            toast({
              title: "Analysis Complete",
              description: "Your document has been processed and insights are ready to view.",
              variant: "default",
            });
          }, 2000);
        } else {
          setFiles(prev => 
            prev.map(f => 
              f.id === newFile.id ? { ...f, progress } : f
            )
          );
        }
      }, 200);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const openFileSelector = () => {
    inputRef.current?.click();
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    toast({
      title: "File removed",
      description: "The file has been removed from the queue.",
    });
  };

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4">
      <div
        className={`relative flex flex-col items-center justify-center w-full p-8 rounded-xl transition-all ${
          dragActive 
            ? "border-2 border-dashed border-primary bg-primary/5" 
            : "border-2 border-dashed border-muted glass"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept={SUPPORTED_FILE_TYPES.join(",")}
          onChange={handleChange}
        />
        
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 opacity-70 blur-md"></div>
          <div className="relative bg-background dark:bg-slate-900 rounded-full p-3">
            <Upload className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mt-6 mb-2">
          {language === 'hi' ? 'अपनी फ़ाइलें खींचें और छोड़ें' : 'Drag & drop your files'}
        </h3>
        
        <p className="text-muted-foreground text-center mb-4 max-w-md">
          {language === 'hi' 
            ? 'PDF, DOC, DOCX और TXT फाइलों के लिए समर्थन, 10MB तक' 
            : 'Our intelligent document processor supports PDF, DOC, DOCX, and TXT files up to 10MB. Get instant summaries, key insights, and more.'}
        </p>
        
        <div className="flex gap-4">
          <Button 
            variant="gradient"
            onClick={openFileSelector}
            className="flex items-center"
          >
            <FilePlus className="mr-2 h-4 w-4" />
            {language === 'hi' ? 'फ़ाइलें चुनें' : 'Select Files'}
          </Button>
          
          <Button variant="outline">
            Learn About Processing
          </Button>
        </div>
        
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-violet-500" />
            <span className="text-xs">Smart Recognition</span>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-purple-500" />
            <span className="text-xs">Key Point Extraction</span>
          </div>
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-indigo-500" />
            <span className="text-xs">Secure Processing</span>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8"
          >
            <h3 className="text-lg font-medium mb-4">Uploaded Files</h3>
            
            <div className="space-y-4">
              {files.map(file => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center p-4 rounded-lg glass"
                >
                  <div className="flex-shrink-0 mr-4">
                    <File className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium truncate" style={{ maxWidth: "200px" }}>
                          {file.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {(file.status === 'uploading' || file.status === 'processing') && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {file.status === 'uploading' ? 'Uploading' : 'Processing'}... {Math.round(file.progress || 0)}%
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FileUploader;
