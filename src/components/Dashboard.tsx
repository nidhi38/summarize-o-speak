import { DocumentFile, AudioConversion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  ChevronRight, FileText, Headphones, Clock, BarChart3, 
  Activity, FileAudio, BookOpen, Brain, PieChart, Sparkles 
} from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart as ReChartPieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import FlashcardComponent from "@/components/Flashcards";

export interface DashboardProps {
  audioConversions: AudioConversion[];
  processedFile: DocumentFile | null;
}

// Sample data for demonstration (would be replaced with real data in production)
const samplePieData = [
  { name: 'Key Points', value: 40, color: '#8B5CF6' },
  { name: 'Context', value: 30, color: '#EC4899' },
  { name: 'Examples', value: 20, color: '#10B981' },
  { name: 'References', value: 10, color: '#F59E0B' }
];

const sampleAIInsights = [
  "The document shows a 75% focus on technical implementation details.",
  "Sentiment analysis indicates a neutral, fact-based tone throughout.",
  "Key terminology suggests this is related to software architecture.",
  "Recommended follow-up: Research more on microservice patterns."
];

const sampleReadBooks = [
  { title: "Design Patterns", progress: 87, author: "Gamma et al." },
  { title: "Clean Code", progress: 100, author: "Robert C. Martin" },
  { title: "The Pragmatic Programmer", progress: 65, author: "Hunt & Thomas" }
];

const sampleFlashcardSet = {
  id: "sample-123",
  title: "Key Concepts Flashcards",
  cards: [
    { id: "1", question: "What is the main purpose of this document?", answer: "To explain the system architecture and implementation details." },
    { id: "2", question: "What technology is primarily discussed?", answer: "Distributed systems and microservices architecture." },
    { id: "3", question: "What is the recommended approach for deployment?", answer: "Containerization using Docker with Kubernetes orchestration." }
  ]
};

const mockFlashcards: FlashcardSet = {
  id: crypto.randomUUID(),
  title: "Document Study Set",
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
    },
    {
      id: crypto.randomUUID(),
      question: "What framework does the author propose?",
      answer: "A comprehensive framework for addressing implementation challenges that focuses on stakeholder engagement and phased deployment."
    }
  ],
  createdAt: new Date(),
};

const Dashboard = ({ audioConversions, processedFile }: DashboardProps) => {
  // Function to format date properly
  const formatDate = (dateValue: Date | string | number) => {
    try {
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Unknown date";
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto mt-10 px-4 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-6"
      >
        {/* Dashboard Header Card */}
        <Card className="overflow-hidden bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="relative">
            <motion.div 
              className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-96 h-96 rounded-full bg-white absolute -right-12 -top-12"></div>
              <div className="w-64 h-64 rounded-full bg-white absolute -left-12 -bottom-12"></div>
            </motion.div>
            <CardTitle className="text-3xl font-bold flex items-center gap-2 z-10">
              <BarChart3 className="h-7 w-7" />
              Insights Dashboard
            </CardTitle>
            <CardDescription className="text-white/90 z-10">
              View your documents analysis, summaries and AI insights
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="opacity-90">Interactive visualizations and personalized content analytics</p>
          </CardContent>
        </Card>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="w-full mb-6 bg-violet-100 dark:bg-violet-900/30 p-1 rounded-xl">
            <TabsTrigger 
              value="recent" 
              className="flex-1 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              <Activity className="h-4 w-4 mr-2" />
              Recent Activity
            </TabsTrigger>
            <TabsTrigger 
              value="files" 
              className="flex-1 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              <FileText className="h-4 w-4 mr-2" />
              Processed Files
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="flex-1 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger 
              value="flashcards" 
              className="flex-1 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              <FileText className="h-4 w-4 mr-2" />
              Flashcards
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-6">
            {/* Audio Conversions Card */}
            <Card className="glass backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border border-white/20 shadow-xl hover:shadow-violet-200/20 dark:hover:shadow-violet-900/20 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium flex items-center">
                  <FileAudio className="h-5 w-5 mr-2 text-violet-500" />
                  Recent Audio Conversions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {audioConversions && audioConversions.length > 0 ? (
                  <div className="grid gap-3">
                    {audioConversions.map((conversion) => {
                      // Ensure conversion.createdAt is treated as a Date
                      const createdAt = conversion.createdAt instanceof Date 
                        ? conversion.createdAt 
                        : new Date(conversion.createdAt || Date.now());
                        
                      return (
                        <motion.div
                          key={conversion.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 dark:from-violet-900/20 dark:to-purple-900/30 border border-violet-100 dark:border-violet-800/30 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1 truncate text-sm">
                              <span className="font-medium">
                                {conversion.text.substring(0, 60)}
                                {conversion.text.length > 60 ? '...' : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-violet-600 dark:text-violet-300">
                              <span className="text-sm flex items-center gap-1 bg-violet-100 dark:bg-violet-900/50 px-2 py-1 rounded-full">
                                {SUPPORTED_LANGUAGES.find(l => l.code === conversion.language)?.flag}
                                {SUPPORTED_LANGUAGES.find(l => l.code === conversion.language)?.name}
                              </span>
                              <a 
                                href={conversion.audioUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:text-violet-800 dark:hover:text-violet-200 transition-colors bg-violet-100 dark:bg-violet-900/50 p-2 rounded-full"
                              >
                                <Headphones className="h-4 w-4" />
                              </a>
                              <span className="text-xs text-violet-500 dark:text-violet-400 flex items-center">
                                <Clock className="h-3 w-3 inline-block mr-1" />
                                {formatDate(createdAt)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-violet-50 dark:bg-violet-900/10 rounded-lg">
                    <Headphones className="h-10 w-10 mx-auto text-violet-400 mb-2" />
                    <p className="text-muted-foreground">No recent audio conversions.</p>
                    <p className="text-sm text-violet-500 mt-1">Convert text to speech to see your history here.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reading Statistics */}
            <Card className="glass backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border border-white/20 shadow-xl hover:shadow-violet-200/20 dark:hover:shadow-violet-900/20 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-violet-500" />
                  Reading Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sampleReadBooks.map((book, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/30 border border-indigo-100 dark:border-indigo-800/30 shadow-sm"
                    >
                      <h4 className="font-semibold truncate">{book.title}</h4>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                      <div className="mt-2 h-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-right mt-1 text-indigo-600 dark:text-indigo-400">
                        {book.progress}% completed
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="files" className="space-y-6">
            {processedFile ? (
              <Card className="glass backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border border-white/20 shadow-xl hover:shadow-violet-200/20 dark:hover:shadow-violet-900/20 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-violet-300/20 to-purple-500/30 rounded-bl-full -z-10"></div>
                <CardHeader>
                  <CardTitle className="text-xl font-medium flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-violet-500" />
                    Processed File Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border border-violet-100 dark:border-violet-800/30 p-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-900/10 dark:to-purple-900/10">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center space-x-2 pb-2 border-b border-violet-100 dark:border-violet-800/30">
                        <FileText className="h-5 w-5 text-violet-500" />
                        <h4 className="text-sm font-semibold">File Name:</h4>
                        <p className="text-sm">{processedFile.name}</p>
                      </div>
                      <div className="flex items-start space-x-2 pb-2 border-b border-violet-100 dark:border-violet-800/30">
                        <ChevronRight className="h-5 w-5 text-violet-500 mt-0.5" />
                        <h4 className="text-sm font-semibold">Summary:</h4>
                        <p className="text-sm flex-1">{processedFile.summary}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ChevronRight className="h-5 w-5 text-violet-500" />
                        <h4 className="text-sm font-semibold">Language:</h4>
                        <p className="text-sm flex items-center gap-1">
                          <span className="text-sm bg-violet-100 dark:bg-violet-900/50 px-2 py-0.5 rounded-full">
                            {SUPPORTED_LANGUAGES.find(l => l.code === processedFile.language)?.flag}
                            {SUPPORTED_LANGUAGES.find(l => l.code === processedFile.language)?.name}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border border-white/20 shadow-xl hover:shadow-violet-200/20 dark:hover:shadow-violet-900/20 transition-all duration-300 overflow-hidden">
                <CardContent className="text-center py-10">
                  <FileText className="h-10 w-10 mx-auto text-violet-400 mb-2" />
                  <p className="text-muted-foreground">No file processed yet.</p>
                  <p className="text-sm text-violet-500 mt-1">Upload a document to see its details here.</p>
                </CardContent>
              </Card>
            )}
            
            {/* Content Breakdown - Pie Chart */}
            <Card className="glass backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border border-white/20 shadow-xl hover:shadow-violet-200/20 dark:hover:shadow-violet-900/20 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-violet-500" />
                  Content Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ChartContainer 
                    config={{
                      primary: { theme: { light: "#8B5CF6", dark: "#A78BFA" } },
                      secondary: { theme: { light: "#EC4899", dark: "#F472B6" } },
                      tertiary: { theme: { light: "#10B981", dark: "#34D399" } },
                      quaternary: { theme: { light: "#F59E0B", dark: "#FBBF24" } }
                    }}
                  >
                    <ReChartPieChart>
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                      <Pie
                        data={samplePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label
                      >
                        {samplePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                    </ReChartPieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="glass backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border border-white/20 shadow-xl hover:shadow-violet-200/20 dark:hover:shadow-violet-900/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-medium flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-violet-500" />
                  AI Analysis Insights
                </CardTitle>
                <CardDescription>
                  Automated analysis and insights generated from your documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {sampleAIInsights.map((insight, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg flex items-start gap-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-violet-900/20 dark:to-purple-900/30 border border-violet-100 dark:border-violet-800/30 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <Sparkles className="h-5 w-5 text-violet-500 mt-0.5 shrink-0" />
                      <p>{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flashcards" className="space-y-6">
            <Card className="glass backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border border-white/20 shadow-xl hover:shadow-violet-200/20 dark:hover:shadow-violet-900/20 transition-all duration-300 p-4">
              <FlashcardComponent flashcardSet={mockFlashcards} />
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
};

export default Dashboard;
