
import { motion } from "framer-motion";
import { 
  FileText, 
  Languages, 
  Headphones, 
  Book, 
  Search, 
  Layers, 
  BookOpen, 
  GraduationCap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function SummarizerObjectives() {
  const objectives = [
    {
      title: "Comprehensive Analysis",
      description: "Extract key points from lengthy PDFs and documents to save your valuable time",
      icon: FileText,
      color: "from-violet-500 to-purple-700"
    },
    {
      title: "Multilingual Support",
      description: "Translate and summarize content in multiple languages with high accuracy",
      icon: Languages,
      color: "from-blue-500 to-sky-700"
    },
    {
      title: "Audio Conversion",
      description: "Transform written content into clear, natural-sounding speech",
      icon: Headphones,
      color: "from-green-500 to-emerald-700"
    },
    {
      title: "Study Aid",
      description: "Create concise study materials from textbooks and academic papers",
      icon: Book,
      color: "from-yellow-500 to-amber-700"
    },
    {
      title: "Research Assistant",
      description: "Quickly identify relevant information from research documents",
      icon: Search,
      color: "from-red-500 to-rose-700"
    },
    {
      title: "Content Aggregation",
      description: "Combine insights from multiple sources into cohesive summaries",
      icon: Layers,
      color: "from-pink-500 to-fuchsia-700"
    },
    {
      title: "Information Extraction",
      description: "Pull specific data points and statistics from complex documents",
      icon: BookOpen,
      color: "from-cyan-500 to-teal-700"
    },
    {
      title: "Educational Tool",
      description: "Simplify complex concepts for better understanding and learning",
      icon: GraduationCap,
      color: "from-orange-500 to-amber-700"
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600 mb-4"
          >
            Our Summarizer Objectives
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Discover how our advanced document summarizer can transform the way you work with content
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {objectives.map((objective, index) => (
            <motion.div
              key={objective.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Card className="h-full border border-white/10 glass shadow-glass hover:shadow-glass-hover transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br mb-3 shadow-lg"
                    style={{ backgroundImage: `linear-gradient(to bottom right, ${objective.color.split(' ')[0].replace('from-', '')}, ${objective.color.split(' ')[1].replace('to-', '')})` }}>
                    <objective.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{objective.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{objective.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
