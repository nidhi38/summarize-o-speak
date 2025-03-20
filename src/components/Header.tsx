
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/lib/constants";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  language: string;
  setLanguage: (language: string) => void;
}

const Header = ({ language, setLanguage }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  
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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12 flex items-center justify-between ${
        scrolled ? 'glass shadow-glass' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Summarizer
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>
                {currentLanguage.flag} {currentLanguage.name}
              </span>
            </Button>
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
    </header>
  );
};

export default Header;
