
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import { Book, FileText, BookOpen, Brain, Clock, ListChecks, FileUp, Download, Calendar, ArrowUpRight } from "lucide-react";

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

  const monthlyData = [
    { name: "Jan", summaries: 12 },
    { name: "Feb", summaries: 19 },
    { name: "Mar", summaries: 15 },
    { name: "Apr", summaries: 22 },
    { name: "May", summaries: 18 },
    { name: "Jun", summaries: 24 }
  ];
  
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto py-8 px-4"
    >
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="summaries">My Summaries</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div {...animationProps} transition={{ delay: 0.1 }}>
              <Card className="hover:shadow-glass-hover transition-all">
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
            </motion.div>
            
            <motion.div {...animationProps} transition={{ delay: 0.2 }}>
              <Card className="hover:shadow-glass-hover transition-all">
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
            </motion.div>
            
            <motion.div {...animationProps} transition={{ delay: 0.3 }}>
              <Card className="hover:shadow-glass-hover transition-all">
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
            </motion.div>
            
            <motion.div {...animationProps} transition={{ delay: 0.4 }}>
              <Card className="hover:shadow-glass-hover transition-all">
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
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div {...animationProps} transition={{ delay: 0.5 }}>
              <Card className="col-span-1 hover:shadow-glass-hover transition-all">
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
            </motion.div>
            
            <motion.div {...animationProps} transition={{ delay: 0.6 }}>
              <Card className="col-span-1 hover:shadow-glass-hover transition-all">
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
            </motion.div>
          </div>
        </TabsContent>
        
        <TabsContent value="summaries" className="space-y-6">
          <motion.div {...animationProps}>
            <Card className="hover:shadow-glass-hover transition-all">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Summaries</CardTitle>
                  <CardDescription>
                    Your latest document summaries
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  <span>Upload New</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summariesToDisplay.map((summary, index) => (
                    <motion.div 
                      key={summary.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-primary/5 transition-colors"
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
                      <div className="flex items-center space-x-2">
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
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6">
                  <Button variant="outline" size="sm">Previous</Button>
                  <div className="text-sm text-muted-foreground">Page 1 of 3</div>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...animationProps} transition={{ delay: 0.3 }}>
            <Card className="hover:shadow-glass-hover transition-all">
              <CardHeader>
                <CardTitle>Reading Queue</CardTitle>
                <CardDescription>Documents you've saved to read later</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { title: "Clean Code", author: "Robert C. Martin", saved: "2 days ago" },
                    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", saved: "1 week ago" },
                    { title: "Sapiens", author: "Yuval Noah Harari", saved: "2 weeks ago" }
                  ].map((book, i) => (
                    <motion.div 
                      key={i} 
                      className="p-3 border rounded-md flex justify-between items-center"
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    >
                      <div>
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-muted-foreground">by {book.author}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Saved {book.saved}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...animationProps} transition={{ delay: 0.1 }}>
              <Card className="hover:shadow-glass-hover transition-all">
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
            </motion.div>

            <motion.div {...animationProps} transition={{ delay: 0.2 }}>
              <Card className="hover:shadow-glass-hover transition-all">
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>Track your knowledge retention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Flashcard Mastery</h3>
                      <span className="text-sm bg-primary/10 px-2 py-1 rounded-full">64%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "64%" }}></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">Subject Proficiency</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Business</span>
                          <span>78%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-500 rounded-full h-2" style={{ width: "78%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Technology</span>
                          <span>65%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-blue-500 rounded-full h-2" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Science</span>
                          <span>42%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-yellow-500 rounded-full h-2" style={{ width: "42%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Recent Achievements</h3>
                    <div className="space-y-2">
                      {[
                        { title: "5-Day Streak", icon: <ListChecks className="h-5 w-5 text-green-500" />, date: "Oct 15" },
                        { title: "10 Summaries", icon: <Book className="h-5 w-5 text-blue-500" />, date: "Oct 12" },
                        { title: "50 Flashcards", icon: <BookOpen className="h-5 w-5 text-purple-500" />, date: "Oct 8" }
                      ].map((achievement, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-md border">
                          <div className="flex items-center gap-3">
                            {achievement.icon}
                            <span>{achievement.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{achievement.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...animationProps} transition={{ delay: 0.1 }}>
              <Card className="hover:shadow-glass-hover transition-all">
                <CardHeader>
                  <CardTitle>Monthly Usage</CardTitle>
                  <CardDescription>Your summary activity over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="summaries" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...animationProps} transition={{ delay: 0.2 }}>
              <Card className="hover:shadow-glass-hover transition-all">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative pl-6 border-l-2 border-muted pb-6">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary"></div>
                      <div className="text-sm">
                        <p className="font-medium">Generated AI Summary</p>
                        <p className="text-muted-foreground">The Psychology of Money</p>
                        <p className="text-xs text-muted-foreground mt-1">Today, 9:30 AM</p>
                      </div>
                    </div>

                    <div className="relative pl-6 border-l-2 border-muted pb-6">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-500"></div>
                      <div className="text-sm">
                        <p className="font-medium">Created Flashcards</p>
                        <p className="text-muted-foreground">Atomic Habits - 12 cards</p>
                        <p className="text-xs text-muted-foreground mt-1">Yesterday, 4:15 PM</p>
                      </div>
                    </div>

                    <div className="relative pl-6 border-l-2 border-muted pb-6">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-500"></div>
                      <div className="text-sm">
                        <p className="font-medium">Uploaded Document</p>
                        <p className="text-muted-foreground">Deep Work - 325 pages</p>
                        <p className="text-xs text-muted-foreground mt-1">Oct 15, 2023</p>
                      </div>
                    </div>

                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-purple-500"></div>
                      <div className="text-sm">
                        <p className="font-medium">Converted to Audio</p>
                        <p className="text-muted-foreground">Thinking, Fast and Slow</p>
                        <p className="text-xs text-muted-foreground mt-1">Oct 12, 2023</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="col-span-1 lg:col-span-2" {...animationProps} transition={{ delay: 0.3 }}>
              <Card className="hover:shadow-glass-hover transition-all">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Scheduled reminders and study sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { 
                        title: "Study Session", 
                        description: "Atomic Habits flashcards",
                        date: "Tomorrow, 10:00 AM",
                        icon: <BookOpen className="h-8 w-8 text-primary" />
                      },
                      { 
                        title: "Weekly Review", 
                        description: "Review all summaries from this week",
                        date: "Sat, Oct 21, 9:00 AM",
                        icon: <Calendar className="h-8 w-8 text-green-500" /> 
                      },
                      { 
                        title: "Reading Goal", 
                        description: "25 pages remaining",
                        date: "Due in 2 days",
                        icon: <ArrowUpRight className="h-8 w-8 text-blue-500" />
                      }
                    ].map((event, i) => (
                      <motion.div
                        key={i}
                        className="border rounded-lg p-4 flex flex-col"
                        whileHover={{ 
                          y: -5,
                          boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>{event.icon}</div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <p className="text-sm text-muted-foreground flex-grow">{event.description}</p>
                        <p className="text-xs font-medium mt-2 text-primary">{event.date}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Dashboard;
