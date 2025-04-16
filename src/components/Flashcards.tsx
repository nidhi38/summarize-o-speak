
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p>No flashcards available. Generate flashcards from a document first.</p>
      </div>
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{flashcardSet.title}</h2>
        <p className="text-muted-foreground text-sm">
          {completed.length} of {totalCards} cards studied • 
          {progress}% complete
        </p>
      </div>

      <div className="relative h-64 sm:h-80 w-full perspective">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (flipped ? "-flipped" : "")}
            initial={{ rotateY: flipped ? -180 : 0 }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={handleFlip}
            className="absolute top-0 left-0 w-full h-full cursor-pointer preserve-3d"
          >
            <Card className={`absolute top-0 left-0 w-full h-full p-6 flex items-center justify-center 
                            backface-hidden shadow-xl ${flipped ? "opacity-0" : "opacity-100"}`}>
              <CardContent className="flex items-center justify-center h-full w-full p-0">
                <p className="text-xl font-medium text-center">{currentCard.question}</p>
              </CardContent>
            </Card>

            <Card className={`absolute top-0 left-0 w-full h-full p-6 flex items-center justify-center 
                            backface-hidden rotateY-180 bg-primary/5 ${flipped ? "opacity-100" : "opacity-0"}`}>
              <CardContent className="flex items-center justify-center h-full w-full p-0">
                <p className="text-xl text-center">{currentCard.answer}</p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>

        <Button 
          variant="outline" 
          onClick={handleNext}
          disabled={currentIndex === flashcardSet.cards.length - 1}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-6 mb-4">
        <ProgressBar 
          value={completed.length} 
          max={totalCards} 
          height={8}
          animate={true}
          gradient={true}
          showPercentage={true}
          className="w-full"
        />
      </div>
      
      <div className="mt-4 grid grid-cols-8 gap-1">
        {flashcardSet.cards.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1 rounded-full ${
              completed.includes(idx) ? "bg-primary" : "bg-muted"
            } ${currentIndex === idx ? "opacity-100" : "opacity-60"}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FlashcardComponent;
