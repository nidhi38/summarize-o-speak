import { DocumentFile, AudioConversion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ChevronRight, FileText, Headphones, Clock } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

export interface DashboardProps {
  audioConversions: AudioConversion[];
  processedFile: DocumentFile | null;
}

const Dashboard = ({ audioConversions, processedFile }: DashboardProps) => {
  return (
    <section className="w-full max-w-4xl mx-auto mt-12 px-4 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass hover:shadow-glass-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl">Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="recent" className="w-full">
              <TabsList>
                <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                <TabsTrigger value="files" disabled={!processedFile}>
                  Processed File
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="space-y-4">
                <h3 className="text-lg font-medium">Recent Audio Conversions</h3>
                <div className="space-y-3">
                  {audioConversions.length > 0 ? (
                    audioConversions.map((conversion) => (
                      <motion.div
                        key={conversion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 rounded-lg bg-muted/30 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 truncate text-sm">
                            {conversion.text.substring(0, 60)}
                            {conversion.text.length > 60 ? '...' : ''}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {SUPPORTED_LANGUAGES.find(l => l.code === conversion.language)?.flag}
                            </span>
                            <a href={conversion.audioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              <Headphones className="h-4 w-4" />
                            </a>
                            <span className="text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 inline-block mr-1" />
                              {conversion.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No recent audio conversions.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="files" className="space-y-4">
                {processedFile ? (
                  <>
                    <h3 className="text-lg font-medium">Processed File Details</h3>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <h4 className="text-sm font-semibold">File Name:</h4>
                        <p className="text-sm">{processedFile.name}</p>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                        <h4 className="text-sm font-semibold">Summary:</h4>
                        <p className="text-sm">{processedFile.summary}</p>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                        <h4 className="text-sm font-semibold">Language:</h4>
                        <p className="text-sm">{SUPPORTED_LANGUAGES.find(l => l.code === processedFile.language)?.name}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No file processed yet.</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default Dashboard;
