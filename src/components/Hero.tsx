
import { motion } from "framer-motion";
import { ArrowDown, FileText, Sparkles, Book, Zap, Globe } from "lucide-react";
import { Button } from "./ui/button";

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
          <div className="inline-block px-4 py-1.5 rounded-full glass text-primary text-sm font-medium mb-6 
                          border border-primary/20 shadow-sm flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
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
          <motion.span 
            className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent sparkle inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            documents
          </motion.span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4"
        >
          Summarizer uses advanced AI technology to extract key information from PDFs, docs, and images.
          Save time with multilingual summaries, audio conversions, and intuitive document analysis.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center glass rounded-lg p-4 shadow-glass w-[280px] text-center border border-white/20"
          >
            <FileText className="w-6 h-6 text-primary mr-2" />
            <span>Comprehensive PDF Analysis</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center glass rounded-lg p-4 shadow-glass w-[280px] text-center border border-white/20"
          >
            <Book className="w-6 h-6 text-violet-500 mr-2" />
            <span>Multilingual Document Support</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center glass rounded-lg p-4 shadow-glass w-[280px] text-center border border-white/20"
          >
            <Zap className="w-6 h-6 text-yellow-500 mr-2" />
            <span>Enhanced Audio Conversions</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center glass rounded-lg p-4 shadow-glass w-[280px] text-center border border-white/20"
          >
            <Globe className="w-6 h-6 text-blue-500 mr-2" />
            <span>Cross-Language Translation</span>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Button 
            variant="neon"
            size="xl"
            className="group"
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
          </Button>
          
          <Button 
            variant="outline3d" 
            size="xl"
            onClick={() => window.open('#', '_blank')}
          >
            See Examples
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 relative w-full max-w-2xl mx-auto"
        >
          <div className="aspect-[16/9] rounded-lg shadow-2xl border border-white/20 overflow-hidden bg-black/20 backdrop-blur-sm">
            <div className="w-full h-full bg-gradient-to-br from-violet-500/20 via-transparent to-fuchsia-500/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80" 
                alt="Document analysis preview" 
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <Button variant="gradient" size="lg" className="absolute bottom-6">
                Watch Demo
              </Button>
            </div>
          </div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-4 border-background bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-xl flex items-center justify-center text-white font-bold text-xl"
          >
            New!
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToContent}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowDown className="w-6 h-6 text-primary animate-bounce" />
      </motion.div>
      
      {/* Enhanced background elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10">
        <div className="absolute -top-[40%] -left-[15%] w-[70%] h-[70%] bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full filter blur-3xl opacity-70 animate-pulse-soft" />
        <div className="absolute -bottom-[40%] -right-[15%] w-[70%] h-[70%] bg-gradient-to-tl from-blue-500/20 to-purple-500/20 rounded-full filter blur-3xl opacity-70 animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full filter blur-2xl opacity-60 animate-float" />
        
        {/* 3D rotating object */}
        <motion.div 
          className="absolute left-[10%] top-[20%] w-24 h-24 md:w-32 md:h-32 opacity-20"
          animate={{ 
            rotateY: [0, 360], 
            rotateX: [0, 180], 
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear" 
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl" />
        </motion.div>
        
        {/* Animated particles */}
        <div className="hidden md:block">
          {[...Array(10)].map((_, i) => (
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
        
        {/* Floating decorative elements */}
        <div className="hidden lg:block">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`decorative-${i}`}
              className="absolute"
              style={{
                left: `${20 + i * 30}%`,
                top: `${50 + (i % 2) * 30}%`,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, i % 2 === 0 ? 5 : -5, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + i,
                ease: "easeInOut"
              }}
            >
              <div className={`w-${8 + i * 4} h-${8 + i * 4} rounded-${i % 2 === 0 ? 'full' : 'md'} bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm border border-white/10`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
