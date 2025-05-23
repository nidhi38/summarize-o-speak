
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Globe, LayoutDashboard, Menu, X, Sparkles } from "lucide-react";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/lib/constants";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  language: string;
  setLanguage: (language: string) => void;
  onDashboardToggle?: () => void;
}

const Header = ({ language, setLanguage, onDashboardToggle }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === language) || 
                          SUPPORTED_LANGUAGES.find(lang => lang.code === DEFAULT_LANGUAGE)!;

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-6 md:px-12 flex items-center justify-between ${
        scrolled ? 'glass shadow-glass backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center">
        <motion.h1 
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="text-2xl font-bold"
        >
          <motion.span 
            className="bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent flex items-center"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
            Summarizer
          </motion.span>
        </motion.h1>
      </div>
      
      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-4">
        {onDashboardToggle && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="glass" 
              size="sm" 
              onClick={onDashboardToggle} 
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </motion.div>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="glass" size="sm" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>
                  {currentLanguage.flag} {currentLanguage.name}
                </span>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 glass backdrop-blur-lg border border-white/10">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                className={`flex items-center gap-2 cursor-pointer transition-colors ${
                  lang.code === language ? 'bg-primary/10 text-primary' : ''
                }`}
                onClick={() => setLanguage(lang.code)}
              >
                <motion.span whileHover={{ scale: 1.2 }}>{lang.flag}</motion.span>
                <span>{lang.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="shiny" size="sm" className="flex items-center gap-2">
            <span>Premium</span>
          </Button>
        </motion.div>
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button 
          variant="glass" 
          size="icon" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-foreground"
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, height: 'auto', backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, height: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 glass shadow-glass p-4 flex flex-col gap-3 border-t border-white/10"
          >
            {onDashboardToggle && (
              <Button 
                variant="glass" 
                size="sm" 
                onClick={() => {
                  onDashboardToggle();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            )}
            
            <Button 
              variant="shiny" 
              size="sm" 
              className="flex items-center justify-center gap-2 w-full"
            >
              <span>Premium</span>
            </Button>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <Button
                  key={lang.code}
                  variant="glass"
                  size="sm"
                  className={`flex items-center justify-start gap-2 ${
                    lang.code === language ? 'bg-primary/10 text-primary border-primary/30' : ''
                  }`}
                  onClick={() => {
                    setLanguage(lang.code);
                    setMobileMenuOpen(false);
                  }}
                >
                  <motion.span whileHover={{ scale: 1.2 }}>{lang.flag}</motion.span>
                  <span>{lang.name}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
