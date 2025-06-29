import { Card } from "@/components/ui/card";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Define categories
type ResourceCategory = 'cutoffs' | 'option-entry' | 'general';

interface ResourceFile {
  id: number;
  name: string;
  url: string;
  type: string;
  size: string;
  category: ResourceCategory;
  description?: string;
  year?: string;
}

const uploadedFiles: ResourceFile[] = [
  // Cutoff Resources
  {
    id: 1,
    name: "KCET 2024 Round 1 Cutoffs.pdf",
    url: "/resources/kcet-2024-round1-cutoffs.pdf",
    type: "pdf",
    size: "840 KB",
    category: "cutoffs",
    description: "Official cutoff ranks for Round 1 counseling",
    year: "2024"
  },
  {
    id: 2,
    name: "KCET 2024 Round 2 Cutoffs.pdf",
    url: "/resources/kcet-2024-round2-cutoffs.pdf",
    type: "pdf",
    size: "830 KB",
    category: "cutoffs",
    description: "Official cutoff ranks for Round 2 counseling",
    year: "2024"
  },
  {
    id: 3,
    name: "KCET 2024 Round 3 (Extended) Cutoffs.pdf",
    url: "/resources/kcet-2024-round3(extended)-cutoffs.pdf",
    type: "pdf",
    size: "792 KB",
    category: "cutoffs",
    description: "Official cutoff ranks for Round 3 (Extended) counseling",
    year: "2024"
  },
  {
    id: 4,
    name: "KCET 2024 Mock Round 1 Cutoffs.pdf",
    url: "/resources/kcet-2024-mock-round1-cutoffs.pdf",
    type: "pdf",
    size: "840 KB",
    category: "cutoffs",
    description: "Mock cutoff ranks for Round 1",
    year: "2024"
  },
  {
    id: 5,
    name: "KCET 2024 Mock Round 2 Cutoffs.pdf",
    url: "/resources/kcet-2024-mock-round2-cutoffs.pdf",
    type: "pdf",
    size: "840 KB",
    category: "cutoffs",
    description: "Mock cutoff ranks for Round 2",
    year: "2024"
  },
  {
    id: 6,
    name: "KCET 2023 Round 1 Cutoffs.pdf",
    url: "/resources/kcet-2023-round1-cutoffs.pdf",
    type: "pdf",
    size: "726 KB",
    category: "cutoffs",
    description: "Historical cutoff data for reference",
    year: "2023"
  },
  {
    id: 7,
    name: "KCET 2023 Round 2 Cutoffs.pdf",
    url: "/resources/kcet-2023-round2-cutoffs.pdf",
    type: "pdf",
    size: "728 KB",
    category: "cutoffs",
    description: "Historical cutoff data for reference",
    year: "2023"
  },
  {
    id: 8,
    name: "KCET 2023 Round 3 (Extended) Cutoffs.pdf",
    url: "/resources/kcet-2023-round3(extended)-cutoffs.pdf",
    type: "pdf",
    size: "712 KB",
    category: "cutoffs",
    description: "Historical extended round cutoff data",
    year: "2023"
  },
  // Option Entry Resources
  {
    id: 9,
    name: "UGCET-2025 Seat Allocation Workshop.pdf",
    url: "/resources/UGCET-2025-seat-allocation-workshop.pdf",
    type: "pdf",
    size: "3.0 MB",
    category: "option-entry",
    description: "Official workshop guide for option entry process"
  },
  {
    id: 10,
    name: "FEE STRUCTURE 2025.pdf",
    url: "/resources/FEE-STRUCTURE-2025.pdf",
    type: "pdf",
    size: "51 KB",
    category: "option-entry",
    description: "Complete fee structure for all colleges"
  }
];

const categoryConfig = {
  cutoffs: {
    title: "📊 Cutoff Data",
    description: "Official cutoff ranks from previous years",
    color: "from-red-500/20 to-orange-500/20",
    iconColor: "text-red-400",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30"
  },
  "option-entry": {
    title: "📝 Option Entry Guides",
    description: "Resources for the option entry process",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30"
  },
  general: {
    title: "📚 General Resources",
    description: "General information and guides",
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30"
  }
};

const UploadedReferences = () => {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>('cutoffs');

  const groupedFiles = uploadedFiles.reduce((acc, file) => {
    if (!acc[file.category]) {
      acc[file.category] = [];
    }
    acc[file.category].push(file);
    return acc;
  }, {} as Record<ResourceCategory, ResourceFile[]>);

  const currentFiles = groupedFiles[activeCategory] || [];

  return (
    <Card className="p-6 glass-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20">
          <FileText className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold gradient-text">📂 Resource Library</h3>
          <p className="text-xs text-muted-foreground">Download official documents and guides</p>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as ResourceCategory)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-amber-400/30">
          {Object.entries(categoryConfig).map(([category, config]) => (
            <TabsTrigger 
              key={category}
              value={category} 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{config.title.split(' ')[0]}</span>
                <Badge className={config.badgeColor}>
                  {groupedFiles[category as ResourceCategory]?.length || 0}
                </Badge>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content for each category */}
        {Object.entries(categoryConfig).map(([category, config]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color}`}>
                <FileText className={`h-4 w-4 ${config.iconColor}`} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{config.title}</h4>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </div>
            </div>

            <div className="grid gap-3">
              {groupedFiles[category as ResourceCategory]?.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-4 rounded-lg bg-purple-950/30 border border-purple-700/30 hover:bg-purple-950/50 transition-colors">
                  <div className="p-2 rounded bg-purple-800/50">
                    <FileText className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-foreground hover:text-amber-400 truncate"
                        download
                      >
                        {file.name}
                      </a>
                      {file.year && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {file.year}
                        </Badge>
                      )}
                    </div>
                    {file.description && (
                      <p className="text-xs text-muted-foreground mb-1">{file.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded bg-amber-950/50 border border-amber-500/30 hover:bg-amber-950/70 transition-colors"
                      title="View in new tab"
                    >
                      <ExternalLink className="h-3 w-3 text-amber-400" />
                    </a>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded bg-amber-950/50 border border-amber-500/30 hover:bg-amber-950/70 transition-colors"
                      title="Download"
                      download
                    >
                      <Download className="h-3 w-3 text-amber-400" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {(!groupedFiles[category as ResourceCategory] || groupedFiles[category as ResourceCategory].length === 0) && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No resources in this category</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default UploadedReferences;
