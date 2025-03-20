
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  scrollToContent: () => void;
}

const Hero = ({ scrollToContent }: HeroProps) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-10 relative">
      <div className="max-w-4xl mx-auto text-center space-y-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-pulse-soft">
            Transform your documents instantly
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
        >
          Extract the essence of your{" "}
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            documents
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          Summarizer uses advanced AI technology to extract key information from your PDFs and 
          documents. Save time with multilingual summaries and audio conversions.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <button 
            className="btn-primary group"
            onClick={scrollToContent}
          >
            Get Started
          </button>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToContent}
      >
        <ArrowDown className="w-6 h-6 text-muted-foreground animate-float" />
      </motion.div>
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10">
        <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full filter blur-3xl opacity-70" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full filter blur-3xl opacity-70" />
      </div>
    </section>
  );
};

export default Hero;
