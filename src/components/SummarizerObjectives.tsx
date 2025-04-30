
import { motion } from "framer-motion";
import { 
  FileText, 
  Languages, 
  Headphones, 
  Book, 
  Search, 
  Layers, 
  BookOpen, 
  GraduationCap,
  Sparkles,
  Brain,
  FileSearch,
  BarChart3,
  Database,
  Repeat,
  Globe
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export function SummarizerObjectives() {
  const objectives = [
    {
      title: "Comprehensive Analysis",
      description: "Our advanced algorithms extract key points from lengthy PDFs and documents, saving you valuable time while ensuring no important information is missed. The system identifies main arguments, supporting evidence, and conclusions.",
      icon: FileText,
      color: "from-violet-500 to-purple-700"
    },
    {
      title: "Multilingual Support",
      description: "Translate and summarize content in multiple languages with high accuracy. Our NLP models understand context and cultural nuances across 50+ languages to deliver precise translations and summaries tailored to your target audience.",
      icon: Languages,
      color: "from-blue-500 to-sky-700"
    },
    {
      title: "Audio Conversion",
      description: "Transform written content into clear, natural-sounding speech with our advanced text-to-speech technology. Customize voice, speed, and emphasis for perfect audio renditions of your documents in multiple languages and accents.",
      icon: Headphones,
      color: "from-green-500 to-emerald-700"
    },
    {
      title: "Study Aid",
      description: "Create concise study materials from textbooks and academic papers. Our AI identifies key concepts, theoretical frameworks, important formulas, and critical analyses to help students and researchers focus on the most valuable content.",
      icon: Book,
      color: "from-yellow-500 to-amber-700"
    },
    {
      title: "Research Assistant",
      description: "Quickly identify relevant information from research documents with our semantic search capabilities. The system understands research methodologies, statistical significance, and interdisciplinary connections to surface the most pertinent findings.",
      icon: Search,
      color: "from-red-500 to-rose-700"
    },
    {
      title: "Content Aggregation",
      description: "Combine insights from multiple sources into cohesive summaries with proper attribution. Our system recognizes contradictory viewpoints, identifies consensus across sources, and presents a balanced synthesis of the collective knowledge.",
      icon: Layers,
      color: "from-pink-500 to-fuchsia-700"
    },
    {
      title: "Information Extraction",
      description: "Pull specific data points, statistics, and key metrics from complex documents. The system recognizes tables, charts, and numerical data embedded in text, enabling detailed quantitative analysis from qualitative sources.",
      icon: BookOpen,
      color: "from-cyan-500 to-teal-700"
    },
    {
      title: "Educational Tool",
      description: "Simplify complex concepts for better understanding and learning. Our adaptive algorithms adjust explanation complexity based on target audience, breaking down advanced topics into digestible components while preserving accuracy.",
      icon: GraduationCap,
      color: "from-orange-500 to-amber-700"
    },
    {
      title: "Semantic Understanding",
      description: "Our AI comprehends document context beyond keywords, understanding implicit connections, metaphors, and domain-specific terminology to provide truly intelligent summaries that capture the essence of complex content.",
      icon: Brain,
      color: "from-indigo-500 to-blue-700"
    },
    {
      title: "Pattern Recognition",
      description: "Identify trends, patterns and recurring themes across multiple documents. The system recognizes evolving narratives and changing perspectives when analyzing chronological content from similar sources.",
      icon: Sparkles,
      color: "from-purple-500 to-violet-700"
    },
    {
      title: "Document Comparison",
      description: "Analyze similarities and differences between multiple documents with side-by-side comparison features. Quickly identify unique perspectives, common arguments, and complementary information across related sources.",
      icon: FileSearch,
      color: "from-teal-500 to-green-700"
    },
    {
      title: "Visual Insights",
      description: "Generate charts, graphs and visual representations of document content. Transform complex textual information into intuitive visualizations that reveal patterns and relationships not immediately obvious in text form.",
      icon: BarChart3,
      color: "from-rose-500 to-red-700"
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
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Discover how our advanced document summarizer can transform the way you work with content. 
            Leveraging cutting-edge artificial intelligence and natural language processing, our platform 
            delivers comprehensive insights, precise translations, and contextual understanding from your documents.
            From academic research to business intelligence, our tools adapt to your specific needs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  <CardDescription className="text-sm">
                    {objective.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="mx-auto max-w-4xl glass border-white/10 shadow-glass">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Advanced Document Intelligence</h3>
              <p className="text-muted-foreground mb-6">
                Our platform goes beyond simple text extraction to deliver true document intelligence. 
                By combining cutting-edge AI models with domain-specific training, we provide insights 
                that understand the context, importance, and relationships within your documents.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Knowledge Base</h4>
                  <p className="text-sm text-muted-foreground">Trained on millions of documents across disciplines</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <Repeat className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Continuous Learning</h4>
                  <p className="text-sm text-muted-foreground">Models that improve with each document processed</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Global Context</h4>
                  <p className="text-sm text-muted-foreground">Cultural and linguistic intelligence built-in</p>
                </div>
              </div>
              
              <Button size="lg" variant="gradient">
                Explore All Features
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
