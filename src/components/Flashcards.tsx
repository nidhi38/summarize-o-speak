
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Brain, BookOpen } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  cards: Flashcard[];
  createdAt?: Date;
}

interface FlashcardsProps {
  flashcardSet: FlashcardSet | null;
}

const FlashcardComponent = ({ flashcardSet }: FlashcardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Reset state when flashcard set changes
  useEffect(() => {
    setCurrentIndex(0);
    setFlipped(false);
    setCompleted([]);
    setError(null);
  }, [flashcardSet]);

  if (!flashcardSet || !flashcardSet.cards || flashcardSet.cards.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <motion.div 
          className="glass rounded-xl p-8 shadow-glass max-w-md border border-white/10 backdrop-blur-sm"
          whileHover={{ 
            boxShadow: "0 10px 40px rgba(139, 92, 246, 0.2)",
            y: -5
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="text-6xl mb-6"
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20, 
              delay: 0.2 
            }}
          >
            📚
          </motion.div>
          <p className="text-muted-foreground">No flashcards available. Generate flashcards from a document first.</p>
          
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button variant="gradient">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Flashcards
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  const totalCards = flashcardSet.cards.length;
  const currentCard = flashcardSet.cards[currentIndex];
  
  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p>Error loading card. Please try regenerating the flashcards.</p>
      </div>
    );
  }
  
  const handleNext = () => {
    if (currentIndex < flashcardSet.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };
  
  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped && !completed.includes(currentIndex)) {
      setCompleted([...completed, currentIndex]);
    }
  };
  
  const handleReset = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setCompleted([]);
  };

  const progress = Math.round((completed.length / totalCards) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto my-8 px-4"
    >
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-sm"
        >
          {error}
        </motion.div>
      )}
      
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex justify-center items-center mb-2 gap-2">
          <BookOpen className="w-5 h-5 text-primary animate-pulse-soft" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {flashcardSet.title}
          </h2>
        </div>
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Brain className="w-4 h-4 text-green-500" />
          <p>
            {completed.length} of {totalCards} cards studied • 
            <span className={progress === 100 ? "text-green-600 font-medium ml-1" : "ml-1"}>
              {progress}% complete
            </span>
            {progress === 100 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20 
                }}
                className="inline-block ml-1 text-green-500"
              >
                🎉
              </motion.span>
            )}
          </p>
        </div>
      </motion.div>

      <div className="relative h-64 sm:h-80 w-full perspective mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (flipped ? "-flipped" : "")}
            initial={{ rotateY: flipped ? -180 : 0, opacity: 0.5 }}
            animate={{ rotateY: flipped ? 180 : 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={handleFlip}
            className="absolute top-0 left-0 w-full h-full cursor-pointer preserve-3d"
          >
            <Card 
              className={`absolute top-0 left-0 w-full h-full p-6 flex items-center justify-center 
                          backface-hidden shadow-glass hover:shadow-glass-hover ${flipped ? "opacity-0" : "opacity-100"} 
                          border border-white/10 bg-white/5 backdrop-blur-sm dark:bg-black/5 transition-all duration-300`}
            >
              <CardContent className="flex items-center justify-center h-full w-full p-0">
                <motion.p 
                  className="text-xl font-medium text-center"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentCard.question}
                </motion.p>
              </CardContent>
              
              <motion.div 
                className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Tap to flip
              </motion.div>
            </Card>

            <Card 
              className={`absolute top-0 left-0 w-full h-full p-6 flex items-center justify-center 
                          backface-hidden rotateY-180 bg-gradient-to-br from-primary/5 to-purple-500/5 ${flipped ? "opacity-100" : "opacity-0"}
                          border border-primary/20 shadow-glass hover:shadow-glass-hover transition-all duration-300`}
            >
              <CardContent className="flex items-center justify-center h-full w-full p-0">
                <motion.p 
                  className="text-xl text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  {currentCard.answer}
                </motion.p>
              </CardContent>
              
              <motion.div 
                className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-primary/70 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Tap to flip back
              </motion.div>
            </Card>
          </motion.div>
        </AnimatePresence>
        
        {/* Card number indicator */}
        <motion.div 
          className="absolute top-2 right-4 bg-primary/10 text-primary px-2 py-1 text-xs rounded-md font-medium border border-primary/20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {currentIndex + 1} / {totalCards}
        </motion.div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="glass" 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="border-primary/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="glass" 
            onClick={handleReset}
            className="border-primary/20"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="glass" 
            onClick={handleNext}
            disabled={currentIndex === flashcardSet.cards.length - 1}
            className="border-primary/20"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
      
      <div className="mt-8 mb-4">
        <ProgressBar 
          value={completed.length} 
          max={totalCards} 
          height={8}
          animate={true}
          gradient={true}
          showPercentage={false}
          showGlow={true}
          pulseEffect={progress > 75}
          showBubble={true}
          className="w-full"
        />
      </div>
      
      <div className="mt-6 grid grid-cols-8 sm:grid-cols-12 gap-1">
        {flashcardSet.cards.map((_, idx) => (
          <motion.div 
            key={idx}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              backgroundColor: completed.includes(idx) ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
            }}
            transition={{ delay: idx * 0.05 }}
            className={`h-1.5 rounded-full cursor-pointer ${
              currentIndex === idx ? "h-2.5 shadow-[0_0_5px_rgba(139,92,246,0.5)]" : ""
            } transition-all duration-300`}
            onClick={() => {
              setCurrentIndex(idx);
              setFlipped(false);
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FlashcardComponent;
