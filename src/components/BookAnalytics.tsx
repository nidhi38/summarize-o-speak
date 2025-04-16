
import { useState } from "react";
import { motion } from "framer-motion";
import { Book, BookOpen, Bookmark } from "lucide-react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ProgressBar } from "@/components/ProgressBar";

interface BookProgress {
  title: string;
  author: string;
  progress: number;
  coverColor: string;
}

interface BookCategory {
  name: string;
  value: number;
  color: string;
}

interface BookAnalyticsProps {
  initialBooks?: BookProgress[];
  initialCategories?: BookCategory[];
}

const DEFAULT_BOOKS: BookProgress[] = [
  { title: "Design Patterns", progress: 87, author: "Gamma et al.", coverColor: "#8B5CF6" },
  { title: "Clean Code", progress: 100, author: "Robert C. Martin", coverColor: "#EC4899" },
  { title: "The Pragmatic Programmer", progress: 65, author: "Hunt & Thomas", coverColor: "#10B981" }
];

const DEFAULT_CATEGORIES: BookCategory[] = [
  { name: 'Completed', value: 5, color: '#10B981' }, // Green
  { name: 'In Progress', value: 3, color: '#8B5CF6' }, // Purple
  { name: 'To Read', value: 8, color: '#F59E0B' } // Orange
];

export function BookAnalytics({ initialBooks = DEFAULT_BOOKS, initialCategories = DEFAULT_CATEGORIES }: BookAnalyticsProps) {
  const [books] = useState<BookProgress[]>(initialBooks);
  const [categories] = useState<BookCategory[]>(initialCategories);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Books read pie chart */}
      <div className="md:col-span-1">
        <h3 className="text-center font-medium mb-2 flex items-center justify-center gap-2">
          <BookOpen className="h-4 w-4 text-violet-500" />
          <span>Books Summary</span>
        </h3>
        <div className="h-64">
          <ChartContainer 
            config={{
              completed: { theme: { light: "#10B981", dark: "#10B981" } },
              inProgress: { theme: { light: "#8B5CF6", dark: "#8B5CF6" } },
              toRead: { theme: { light: "#F59E0B", dark: "#F59E0B" } }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={(entry) => entry.name}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Books progress bars */}
      <div className="md:col-span-2 flex flex-col justify-center space-y-4">
        {books.map((book, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/30 border border-indigo-100 dark:border-indigo-800/30 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div 
                className="h-8 w-8 rounded-md flex items-center justify-center"
                style={{ backgroundColor: book.coverColor }}
              >
                <Book className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold truncate">{book.title}</h4>
                <p className="text-xs text-muted-foreground">{book.author}</p>
              </div>
              {book.progress === 100 && (
                <Bookmark className="h-4 w-4 text-green-500" />
              )}
            </div>
            <ProgressBar 
              value={book.progress} 
              color={book.coverColor} 
              className="mt-2"
              showPercentage
              height={8}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
