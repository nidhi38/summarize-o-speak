
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  scrollToContent: () => void;
}

const Hero = ({ scrollToContent }: HeroProps) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-10 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 
                          border border-primary/20 shadow-sm">
            <span className="shimmer">Transform your documents instantly</span>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
        >
          Extract the essence of your{" "}
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent sparkle">
            documents
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4"
        >
          Summarizer uses advanced AI technology to extract key information from your PDFs and 
          documents. Save time with multilingual summaries and audio conversions.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <button 
            className="btn-primary group"
            onClick={scrollToContent}
          >
            Get Started
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 1, 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 0.8 
              }}
              className="inline-block ml-2"
            >
              →
            </motion.span>
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
        <ArrowDown className="w-6 h-6 text-muted-foreground animate-bounce" />
      </motion.div>
      
      {/* Enhanced background elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10">
        <div className="absolute -top-[40%] -left-[15%] w-[70%] h-[70%] bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full filter blur-3xl opacity-70 animate-pulse-soft" />
        <div className="absolute -bottom-[40%] -right-[15%] w-[70%] h-[70%] bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full filter blur-3xl opacity-70 animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full filter blur-2xl opacity-60 animate-float" />
        
        {/* Animated particles */}
        <div className="hidden md:block">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20"
              style={{
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -100 - 50],
                x: [0, Math.random() * 50 - 25],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: Math.random() * 10 + 10,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
