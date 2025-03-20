
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Book, FileText, BookOpen, Brain, Clock } from "lucide-react";

interface DashboardProps {
  recentSummaries?: any[];
  userStats?: {
    documentsProcessed: number;
    flashcardsCreated: number;
    totalWordsSummarized: number;
    avgReadingTime: number;
  };
}

const Dashboard = ({ recentSummaries = [], userStats }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for the dashboard
  const mockSummaries = [
    {
      id: "1",
      title: "The Psychology of Money",
      date: "2023-10-15",
      wordCount: 1250,
      topics: ["Finance", "Psychology", "Wealth"]
    },
    {
      id: "2",
      title: "Atomic Habits",
      date: "2023-10-10",
      wordCount: 980,
      topics: ["Self-help", "Productivity", "Habits"]
    },
    {
      id: "3",
      title: "Deep Work",
      date: "2023-10-05",
      wordCount: 1100,
      topics: ["Productivity", "Focus", "Career"]
    }
  ];
  
  const summariesToDisplay = recentSummaries.length > 0 ? recentSummaries : mockSummaries;
  
  const mockStats = {
    documentsProcessed: 12,
    flashcardsCreated: 87,
    totalWordsSummarized: 13500,
    avgReadingTime: 5.2
  };
  
  const stats = userStats || mockStats;
  
  const topicData = [
    { name: "Self-help", value: 40 },
    { name: "Business", value: 25 },
    { name: "Technology", value: 20 },
    { name: "Science", value: 15 }
  ];
  
  const activityData = [
    { name: "Mon", summaries: 2 },
    { name: "Tue", summaries: 1 },
    { name: "Wed", summaries: 3 },
    { name: "Thu", summaries: 0 },
    { name: "Fri", summaries: 2 },
    { name: "Sat", summaries: 4 },
    { name: "Sun", summaries: 2 }
  ];
  
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto py-8 px-4"
    >
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="summaries">My Summaries</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Documents Processed
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.documentsProcessed}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Flashcards Created
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.flashcardsCreated}</div>
                <p className="text-xs text-muted-foreground">
                  +12 from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Words Summarized
                </CardTitle>
                <Book className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalWordsSummarized.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +1,200 from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Reading Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgReadingTime} min</div>
                <p className="text-xs text-muted-foreground">
                  -0.5 from last week
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Topic Distribution</CardTitle>
                <CardDescription>
                  Most common topics in your summaries
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topicData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {topicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>
                  Number of summaries created per day
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="summaries" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="summaries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Summaries</CardTitle>
              <CardDescription>
                Your latest document summaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summariesToDisplay.map((summary) => (
                  <div 
                    key={summary.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      <Book className="h-10 w-10 text-primary" />
                      <div>
                        <h3 className="font-medium">{summary.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(summary.date).toLocaleDateString()} · {summary.wordCount} words
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {summary.topics.slice(0, 2).map((topic) => (
                        <span 
                          key={topic} 
                          className="text-xs bg-secondary px-2 py-1 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Driven Insights</CardTitle>
              <CardDescription>
                Deeper analysis of your reading patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="text-sm font-medium">Complexity Level</h3>
                    <span className="text-sm text-muted-foreground">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Your reading material tends to be at an advanced college level
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="text-sm font-medium">Reading Efficiency</h3>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Using our summaries saves you 85% of reading time on average
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-4">Content Interests</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>Technology</span>
                        <span className="text-sm font-medium">32%</span>
                      </div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>Business</span>
                        <span className="text-sm font-medium">24%</span>
                      </div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>Psychology</span>
                        <span className="text-sm font-medium">20%</span>
                      </div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>Science</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-4">Recommended Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      Artificial Intelligence
                    </div>
                    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      Neuroscience
                    </div>
                    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      Behavioral Economics
                    </div>
                    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      Innovation
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Dashboard;
