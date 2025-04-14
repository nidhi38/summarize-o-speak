
import { DocumentFile, AudioConversion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ChevronRight, FileText, Headphones, Clock, BarChart3, Activity, FileAudio } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";

export interface DashboardProps {
  audioConversions: AudioConversion[];
  processedFile: DocumentFile | null;
}

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
    <section className="w-full max-w-5xl mx-auto mt-10 px-4 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-6"
      >
        {/* Dashboard Header Card */}
        <Card className="bg-gradient-to-r from-violet-500 to-purple-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-7 w-7" />
              Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="opacity-90">View your recent activity and processed files</p>
          </CardContent>
        </Card>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="w-full mb-6 bg-violet-100 dark:bg-violet-900/30">
            <TabsTrigger 
              value="recent" 
              className="flex-1 py-3 data-[state=active]:bg-violet-500 data-[state=active]:text-white"
            >
              <Activity className="h-4 w-4 mr-2" />
              Recent Activity
            </TabsTrigger>
            <TabsTrigger 
              value="files" 
              disabled={!processedFile}
              className="flex-1 py-3 data-[state=active]:bg-violet-500 data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Processed File
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-6">
            <Card className="glass shadow-glass hover:shadow-glass-hover">
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
                          className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 dark:from-violet-900/20 dark:to-purple-900/30 border border-violet-100 dark:border-violet-800/30 shadow-sm"
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
          </TabsContent>
          
          <TabsContent value="files" className="space-y-6">
            {processedFile ? (
              <Card className="glass shadow-glass hover:shadow-glass-hover overflow-hidden">
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
              <Card className="glass shadow-glass hover:shadow-glass-hover">
                <CardContent className="text-center py-10">
                  <FileText className="h-10 w-10 mx-auto text-violet-400 mb-2" />
                  <p className="text-muted-foreground">No file processed yet.</p>
                  <p className="text-sm text-violet-500 mt-1">Upload a document to see its details here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
};

export default Dashboard;

