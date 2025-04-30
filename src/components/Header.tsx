
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Globe, LayoutDashboard, Menu, X } from "lucide-react";
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
        scrolled ? 'glass shadow-glass' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center">
        <motion.h1 
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent"
        >
          Summarizer
        </motion.h1>
      </div>
      
      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-4">
        {onDashboardToggle && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDashboardToggle} 
              className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </motion.div>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary">
                <Globe className="h-4 w-4" />
                <span>
                  {currentLanguage.flag} {currentLanguage.name}
                </span>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 glass">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                className={`flex items-center gap-2 cursor-pointer transition-colors ${
                  lang.code === language ? 'bg-primary/10 text-primary' : ''
                }`}
                onClick={() => setLanguage(lang.code)}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-foreground hover:bg-primary/10"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 glass shadow-glass p-4 flex flex-col gap-3"
          >
            {onDashboardToggle && (
              <Button 
                variant="ghost" 
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
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <Button
                  key={lang.code}
                  variant="ghost"
                  size="sm"
                  className={`flex items-center justify-start gap-2 ${
                    lang.code === language ? 'bg-primary/10 text-primary' : ''
                  }`}
                  onClick={() => {
                    setLanguage(lang.code);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span>{lang.flag}</span>
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
