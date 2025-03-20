
import { useToast } from "@/components/ui/use-toast";

// Type definitions for API responses
interface SummaryResponse {
  summary: string;
  keyTakeaways: string[];
  topics: string[];
}

interface FlashcardSet {
  id: string;
  title: string;
  cards: Flashcard[];
  createdAt: Date;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export const useAIService = () => {
  const { toast } = useToast();
  const API_KEY = "AIzaSyAej0uRSHhL4-6B29iIXiCwIahtPuBSUl4";
  
  const summarizeText = async (text: string): Promise<SummaryResponse | null> => {
    try {
      // In a real implementation, this would call the Gemini API
      // For now, we'll simulate a response
      
      toast({
        title: "Processing with Gemini AI",
        description: "Analyzing your document...",
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const mockResponse: SummaryResponse = {
        summary: `This is an AI-generated summary of the document. 
        The document discusses important concepts and provides valuable insights on the topic.
        The author presents several arguments and supports them with evidence from various sources.`,
        keyTakeaways: [
          "Key point 1: The main argument centers around innovation in technology.",
          "Key point 2: Several case studies demonstrate successful implementations.",
          "Key point 3: Future trends suggest continued growth in this area.",
          "Key point 4: Challenges remain in adoption and implementation."
        ],
        topics: ["Innovation", "Technology", "Research", "Implementation", "Future Trends"]
      };
      
      toast({
        title: "Summary Generated",
        description: "Your AI summary is ready to view",
      });
      
      return mockResponse;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const generateFlashcards = async (text: string): Promise<FlashcardSet | null> => {
    try {
      toast({
        title: "Generating Flashcards",
        description: "Creating study materials from your document...",
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const mockFlashcards: FlashcardSet = {
        id: crypto.randomUUID(),
        title: "Document Study Set",
        createdAt: new Date(),
        cards: [
          {
            id: crypto.randomUUID(),
            question: "What is the main focus of the document?",
            answer: "The document primarily focuses on innovation in technology."
          },
          {
            id: crypto.randomUUID(),
            question: "What evidence supports the main argument?",
            answer: "Several case studies from industry leaders demonstrate successful implementations."
          },
          {
            id: crypto.randomUUID(),
            question: "What future trends are predicted?",
            answer: "Continued growth in adoption and new applications in various sectors."
          },
          {
            id: crypto.randomUUID(),
            question: "What challenges are mentioned?",
            answer: "Challenges in adoption, implementation costs, and training requirements."
          }
        ]
      };
      
      toast({
        title: "Flashcards Ready",
        description: "Your study materials have been created",
      });
      
      return mockFlashcards;
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const getInsights = async (text: string) => {
    try {
      toast({
        title: "Analyzing Content",
        description: "Extracting insights from your document...",
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock insights data
      const mockInsights = {
        readingLevel: "College",
        complexity: 72,
        sentiment: "Neutral",
        topicsDistribution: [
          { name: "Technology", value: 45 },
          { name: "Innovation", value: 30 },
          { name: "Research", value: 15 },
          { name: "Business", value: 10 }
        ],
        wordCount: 1250,
        estimatedReadTime: "6 minutes"
      };
      
      toast({
        title: "Insights Generated",
        description: "AI analysis of your document is complete",
      });
      
      return mockInsights;
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    summarizeText,
    generateFlashcards,
    getInsights,
  };
};

export type { SummaryResponse, FlashcardSet, Flashcard };
