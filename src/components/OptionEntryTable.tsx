import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, GripVertical, Download, Save, Info, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { colleges, branches, type College } from "@/data/colleges";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Popover } from "@/components/ui/popover";

export interface OptionEntry {
  id: string;
  priority: number;
  collegeCode: string;
  collegeName: string;
  branchCode: string;
  branchName: string;
  location: string;
  collegeCourse: string; // New field for combined code
  notes?: string; // Optional notes field
  comments?: {
    placement?: string;
    infrastructure?: string;
    hostel?: string;
    other?: string;
  };
}

interface OptionEntryTableProps {
  userRank: number | null;
  userCategory: string;
  options: OptionEntry[];
  onOptionsChange: (options: OptionEntry[]) => void;
}

// Top/famous college codes (from web/NIRF, matched to colleges.ts)
// const TOP_COLLEGE_CODES = [
//   ...
// ];

const OptionEntryTable = ({ userRank, userCategory, options, onOptionsChange }: OptionEntryTableProps) => {
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [collegeSearch, setCollegeSearch] = useState<string>('');
  const [branchSearch, setBranchSearch] = useState<string>('');
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  const [showBranchSuggestions, setShowBranchSuggestions] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const { toast } = useToast();
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [autoBranches, setAutoBranches] = useState<string[]>([]);
  const [autoDialogOpen, setAutoDialogOpen] = useState(false);
  const [cutoffs, setCutoffs] = useState<any[]>([]);
  const [optionSearch, setOptionSearch] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>("");
  const [editingCommentsId, setEditingCommentsId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{placement: string; infrastructure: string; hostel: string; other: string}>({placement: "", infrastructure: "", hostel: "", other: ""});

  // Load saved options on mount
  useEffect(() => {
    const savedOptions = localStorage.getItem('kcet-options');
    if (savedOptions && options.length === 0) {
      try {
        const parsed = JSON.parse(savedOptions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onOptionsChange(parsed);
          toast({
            title: "Options Loaded! 📂",
            description: `Loaded ${parsed.length} saved options from your previous session.`
          });
        }
      } catch (error) {
        console.error('Error loading saved options:', error);
      }
    }
  }, []);

  // Fetch cutoffs.json at runtime
  useEffect(() => {
    fetch("/data/cutoffs.json")
      .then(res => res.json())
      .then(data => setCutoffs(data.cutoffs || data))
      .catch(err => {
        toast({
          title: "Error loading cutoffs",
          description: "Could not load cutoffs.json",
          variant: "destructive"
        });
      });
  }, []);

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    college.code.toLowerCase().includes(collegeSearch.toLowerCase())
  );
  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(branchSearch.toLowerCase()) ||
    branch.code.toLowerCase().includes(branchSearch.toLowerCase())
  );

  const addOption = () => {
    if (!selectedCollege || !selectedBranch) {
      toast({
        title: "Missing Information",
        description: "Please select both college and branch",
        variant: "destructive"
      });
      return;
    }

    const college = colleges.find(c => c.code === selectedCollege);
    const branch = branches.find(b => b.code === selectedBranch);
    if (!college || !branch) return;

    // Generate the combined CollegeCourse code
    const collegeCourse = `${college.code}${branch.code}`;

    const newOption: OptionEntry = {
      id: Date.now().toString(),
      priority: options.length + 1,
      collegeCode: college.code,
      collegeName: college.name,
      branchCode: branch.code,
      branchName: branch.name,
      location: college.location,
      collegeCourse: collegeCourse
    };

    onOptionsChange([...options, newOption]);
    setSelectedCollege('');
    setSelectedBranch('');
    
    toast({
      title: "Option Added! ✅",
      description: `Added ${college.name} (${college.location}) - ${branch.name} (${collegeCourse})`
    });
  };

  const updatePriority = (id: string, newPriority: number) => {
    if (newPriority === 0) {
      // Remove option if priority is set to 0
      const newOptions = options.filter(opt => opt.id !== id);
      const reorderedOptions = newOptions.map((opt, index) => ({
        ...opt,
        priority: index + 1
      }));
      onOptionsChange(reorderedOptions);
      toast({
        title: "Option Removed! 🗑️",
        description: "Option deleted by setting priority to 0"
      });
      return;
    }

    const updatedOptions = options.map(opt => 
        opt.id === id ? { ...opt, priority: newPriority } : opt
    ).sort((a, b) => a.priority - b.priority);
    onOptionsChange(updatedOptions);
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== dropIndex) {
      const newOptions = [...options];
      const [draggedOption] = newOptions.splice(draggedItem, 1);
      newOptions.splice(dropIndex, 0, draggedOption);
      const reorderedOptions = newOptions.map((opt, index) => ({
        ...opt,
        priority: index + 1
      }));
      onOptionsChange(reorderedOptions);
    }
    setDraggedItem(null);
  };

  const saveOptions = () => {
    localStorage.setItem('kcet-options', JSON.stringify(options));
    toast({
      title: "Options Saved! 💾",
      description: `${options.length} options saved successfully`
    });
  };

  const loadSavedOptions = () => {
    setLoadingSaved(true);
    const savedOptions = localStorage.getItem('kcet-options');
    if (savedOptions) {
      try {
        const parsed = JSON.parse(savedOptions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onOptionsChange(parsed);
          toast({
            title: "Options Loaded! 📂",
            description: `Loaded ${parsed.length} saved options.`
          });
        } else {
          toast({
            title: "No Saved Options",
            description: "No previously saved options found.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error Loading Options",
          description: "Failed to load saved options.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "No Saved Options",
        description: "No previously saved options found.",
        variant: "destructive"
      });
    }
    setLoadingSaved(false);
  };

  const clearAllOptions = () => {
    onOptionsChange([]);
    localStorage.removeItem('kcet-options');
    toast({
      title: "Options Cleared! 🗑️",
      description: "All options have been removed."
    });
  };

  // Helper to combine comments for PDF
  const getCommentsSummary = (comments?: OptionEntry["comments"]): string => {
    if (!comments) return "";
    const parts = [];
    if (comments.placement) parts.push(`Placement: ${comments.placement}`);
    if (comments.infrastructure) parts.push(`Infra: ${comments.infrastructure}`);
    if (comments.hostel) parts.push(`Hostel: ${comments.hostel}`);
    if (comments.other) parts.push(`Other: ${comments.other}`);
    return parts.join(" | ");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    // Premium header
    doc.setFillColor(75, 0, 130); // Royal purple
    doc.rect(0, 0, 297, 30, "F");
    doc.setTextColor(255, 215, 0); // Gold
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("KCET 2025 Option Entry List", 148, 18, { align: "center" });

    // Candidate info
    doc.setFontSize(12);
    doc.setTextColor(75, 0, 130);
    doc.setFont("helvetica", "normal");
    doc.text(
      `KCET Rank: ${userRank?.toLocaleString() || "Not specified"}    Category: ${userCategory}    Generated: ${new Date().toLocaleString()}`,
      10,
      38
    );

    // Table data
    const tableColumn = [
      "College Course",
      "Option No",
      "College Name",
      "Location",
      "Course Name",
      "Fees",
      "Comments"
    ];
    const tableRows = options.map((option, idx) => {
      let college = colleges.find(c => c.code === option.collegeCode);
      if (!college) {
        college = colleges.find(c => c.name === option.collegeName);
      }
      const fee = 'please refer pdf';
      console.log('PDF Export:', { option, found: !!college, fee });
      return [
        option.collegeCourse,
        option.priority,
        option.collegeName,
        option.location,
        option.branchName,
        fee,
        getCommentsSummary(option.comments)
      ];
    });

    // Table styling
    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [255, 215, 0], // Gold
        textColor: [75, 0, 130], // Purple
        fontStyle: "bold",
        fontSize: 12,
      },
      bodyStyles: {
        fillColor: [245, 240, 255],
        textColor: [75, 0, 130],
        fontSize: 11,
      },
      alternateRowStyles: {
        fillColor: [230, 220, 255],
      },
      styles: {
        halign: "center",
        valign: "middle",
        cellPadding: 2,
        font: "helvetica",
      },
      margin: { left: 10, right: 10 },
      didDrawPage: (data) => {
        // Add a gold line below the header
        doc.setDrawColor(255, 215, 0);
        doc.setLineWidth(1.5);
        doc.line(10, 32, 287, 32);
      },
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Generated by KCET Mock Planner | Not affiliated with KEA", 148, 205, { align: "center" });

    doc.save("KCET_Option_Entry_List.pdf");
    toast({
      title: "PDF Exported! 📄",
      description: "Your option entry list has been downloaded as a PDF."
    });
  };

  const handlePaymentSuccess = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const autoGenerateOptions = () => {
    if (!userRank || !userCategory) {
      toast({
        title: "Missing Info",
        description: "Please enter your rank and category first.",
        variant: "destructive"
      });
      return;
    }
    if (!autoBranches || autoBranches.length === 0) {
      setAutoDialogOpen(true);
      return;
    }
    if (!cutoffs || cutoffs.length === 0) {
      toast({
        title: "Cutoffs not loaded",
        description: "Cutoff data is not available yet.",
        variant: "destructive"
      });
      return;
    }
    // To avoid duplicate (college, branch) pairs
    const seenPairs = new Set<string>();
    let allOptions: OptionEntry[] = [];
    let priority = 1;
    autoBranches.forEach((branchCode) => {
      // Top colleges for this branch
      // const topColleges = colleges.filter(col => TOP_COLLEGE_CODES.includes(col.code));
      // topColleges.forEach((college) => {
      //   const pairKey = `${college.code}-${branchCode}`;
      //   if (!seenPairs.has(pairKey)) {
      //     allOptions.push({
      //       id: `auto-top-${college.code}-${branchCode}`,
      //       priority: priority++,
      //       collegeCode: college.code,
      //       collegeName: college.name,
      //       branchCode: branchCode,
      //       branchName: branches.find(b => b.code === branchCode)?.name || branchCode,
      //       location: college.location,
      //       collegeCourse: `${college.code}${branchCode}`
      //     });
      //     seenPairs.add(pairKey);
      //   }
      // });
      // Eligible colleges by cutoff (any year/round, best cutoff)
      const bestCutoffByCollege: Record<string, number> = {};
      cutoffs.forEach((c: any) => {
        if (
          c.course === branchCode &&
          c.category === userCategory &&
          typeof c.cutoff_rank === "number" &&
          c.cutoff_rank >= userRank
        ) {
          if (
            bestCutoffByCollege[c.institute_code] === undefined ||
            c.cutoff_rank < bestCutoffByCollege[c.institute_code]
          ) {
            bestCutoffByCollege[c.institute_code] = c.cutoff_rank;
          }
        }
      });
      // Remove top colleges from eligible list for this branch
      // const topCodes = new Set(topColleges.map(c => c.code));
      Object.entries(bestCutoffByCollege)
        .filter(([collegeCode]) => !topCodes.has(collegeCode))
        .sort((a, b) => {
          // Sort by the closest cutoff above the user's rank (smallest positive difference)
          const diffA = a[1] - userRank;
          const diffB = b[1] - userRank;
          return diffA - diffB;
        })
        .forEach(([collegeCode]) => {
          const college = colleges.find(col => col.code === collegeCode);
          const pairKey = `${collegeCode}-${branchCode}`;
          if (college && !seenPairs.has(pairKey)) {
            allOptions.push({
              id: `auto-eligible-${college.code}-${branchCode}`,
              priority: priority++,
              collegeCode: college.code,
              collegeName: college.name,
              branchCode: branchCode,
              branchName: branches.find(b => b.code === branchCode)?.name || branchCode,
              location: college.location,
              collegeCourse: `${college.code}${branchCode}`
            });
            seenPairs.add(pairKey);
          }
        });
    });
    onOptionsChange(allOptions);
    toast({
      title: "Options Auto-generated! 🚀",
      description: `Generated ${allOptions.length} options for ${autoBranches.map(bc => branches.find(b => b.code === bc)?.name || bc).join(", ")}`
    });
  };

  // Filtered options for table
  const filteredOptions = options.filter(option => {
    const search = optionSearch.toLowerCase();
    return (
      option.collegeName.toLowerCase().includes(search) ||
      option.collegeCode.toLowerCase().includes(search) ||
      option.branchName.toLowerCase().includes(search) ||
      option.branchCode.toLowerCase().includes(search) ||
      option.location.toLowerCase().includes(search)
    );
  });

  const handleNoteSave = (id: string) => {
    const updatedOptions = options.map(opt =>
      opt.id === id ? { ...opt, notes: noteInput } : opt
    );
    onOptionsChange(updatedOptions);
    setEditingNoteId(null);
    setNoteInput("");
    localStorage.setItem('kcet-options', JSON.stringify(updatedOptions));
  };

  const handleCommentsSave = (id: string) => {
    const updatedOptions = options.map(opt =>
      opt.id === id ? { ...opt, comments: { ...commentInput } } : opt
    );
    onOptionsChange(updatedOptions);
    setEditingCommentsId(null);
    setCommentInput({placement: "", infrastructure: "", hostel: "", other: ""});
    localStorage.setItem('kcet-options', JSON.stringify(updatedOptions));
  };

  return (
    <div className="space-y-6">
      {/* Add Option Form */}
      <Card className="p-6 glass-card">
        <h3 className="text-xl font-bold gradient-text mb-4">Add New Option</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">College</label>
            <Select value={selectedCollege} onValueChange={value => {
              setSelectedCollege(value);
              setCollegeSearch("");
            }}>
              <SelectTrigger className="h-12 text-lg border-2 border-amber-400 focus:border-amber-500 rounded-xl premium-select">
                <SelectValue placeholder="Select College" />
              </SelectTrigger>
              <SelectContent className="bg-card border-amber-400/30 max-h-80 p-0">
                <div className="sticky top-0 z-10 bg-card p-2 border-b border-amber-100">
                  <div className="relative">
                    <Input
                      placeholder="Search by name or code..."
                      value={collegeSearch}
                      onChange={e => setCollegeSearch(e.target.value)}
                      className="pl-10 h-10 text-base border border-amber-200 focus:border-amber-500 rounded-lg mb-1 premium-input"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {(collegeSearch ? filteredColleges : colleges).length > 0 ? (
                    (collegeSearch ? filteredColleges : colleges).map(college => (
                      <SelectItem key={college.code} value={college.code}>
                        <span className="font-medium text-foreground">{college.code} - {college.name}</span>
                        <span className="block text-xs text-muted-foreground">{college.location}</span>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">No colleges found.</div>
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Branch</label>
            <Select value={selectedBranch} onValueChange={value => {
              setSelectedBranch(value);
              setBranchSearch("");
            }}>
              <SelectTrigger className="h-12 text-lg border-2 border-amber-400 focus:border-amber-500 rounded-xl premium-select">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent className="bg-card border-amber-400/30 max-h-80 p-0">
                <div className="sticky top-0 z-10 bg-card p-2 border-b border-amber-100">
                  <div className="relative">
                    <Input
                      placeholder="Search by name or code..."
                      value={branchSearch}
                      onChange={e => setBranchSearch(e.target.value)}
                      className="pl-10 h-10 text-base border border-amber-200 focus:border-amber-500 rounded-lg mb-1 premium-input"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {(branchSearch ? filteredBranches : branches).length > 0 ? (
                    (branchSearch ? filteredBranches : branches).map(branch => (
                      <SelectItem key={branch.code} value={branch.code}>
                        <span className="font-medium text-foreground">{branch.code} - {branch.name}</span>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">No branches found.</div>
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={addOption}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 glow-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        </div>
      </Card>

      {/* Fee Information Card */}
      <Card className="p-4 glass-card">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-foreground">Fee Information</p>
            <p className="text-xs text-muted-foreground">
              Fees will be auto-filled once KEA publishes the official fee matrix for 2025.
            </p>
          </div>
        </div>
      </Card>

      {/* Options Table */}
      <Card className="p-2 sm:p-6 glass-card">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h3 className="text-lg sm:text-xl font-bold gradient-text">Your Option Entry List ({options.length})</h3>
          <div className="flex flex-wrap gap-2">
            {/* Search bar for filtering options */}
            <Input
              type="text"
              placeholder="Search your options..."
              value={optionSearch}
              onChange={e => setOptionSearch(e.target.value)}
              className="w-full sm:w-64 mb-2 sm:mb-0 border-amber-400/50 focus:border-amber-500 rounded-lg text-base"
              style={{ maxWidth: 260 }}
            />
            <Button 
              onClick={loadSavedOptions} 
              variant="outline" 
              className="border-blue-400/30 hover:bg-blue-950/50 text-xs sm:text-base px-2 sm:px-4"
              disabled={loadingSaved}
            >
              {loadingSaved ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Info className="h-4 w-4 mr-2" />
              )}
              Load Saved
            </Button>
            <Button onClick={saveOptions} variant="outline" className="border-amber-400/30 hover:bg-amber-950/50 text-xs sm:text-base px-2 sm:px-4">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            {options.length > 0 && (
              <Button 
                onClick={clearAllOptions} 
                variant="outline" 
                className="border-red-400/30 hover:bg-red-950/50 text-xs sm:text-base px-2 sm:px-4"
              >
                Clear All
              </Button>
            )}
            <Button onClick={exportToPDF} className="bg-gradient-to-r from-blue-600 to-indigo-600 glow-button text-xs sm:text-base px-2 sm:px-4">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button
              onClick={() => {
                if (!selectedBranch) setAutoDialogOpen(true);
                else {
                  setAutoBranches([selectedBranch]);
                  autoGenerateOptions();
                }
              }}
              variant="outline"
              className="border-green-400/30 hover:bg-green-950/50 text-xs sm:text-base px-2 sm:px-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Auto-generate Options
            </Button>
          </div>
        </div>

        {filteredOptions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="min-w-[600px] text-xs sm:text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>College Course</TableHead>
                  <TableHead>Option No</TableHead>
                  <TableHead>College Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOptions.map((option, index) => (
                  <TableRow 
                    key={option.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`cursor-move transition-all duration-200 border-amber-400/20 ${
                      draggedItem === index ? 'opacity-50 bg-amber-950/30' : 'hover:bg-amber-950/20'
                    }`}
                  >
                    <TableCell className="font-mono text-xs sm:text-sm text-amber-300">{option.collegeCourse}</TableCell>
                    <TableCell className="font-bold text-xs sm:text-lg text-center">
                      <Input
                        type="number"
                        value={option.priority}
                        onChange={e => updatePriority(option.id, parseInt(e.target.value) || 0)}
                        className="w-12 sm:w-16 h-8 text-center premium-input text-xs sm:text-sm"
                        min="0"
                        max="999"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-xs sm:text-base text-foreground">{option.collegeName}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-muted-foreground font-medium">{option.location}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-foreground">{option.branchName}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-muted-foreground">
                      {(() => {
                        const college = colleges.find(c => c.code === option.collegeCode);
                        return college && college.fees ? `${college.fees.toLocaleString()}/-` : "-";
                      })()}
                    </TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => {
                        setEditingNoteId(option.id);
                        setNoteInput(option.notes || "");
                      }}>
                        📝
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => {
                        setEditingCommentsId(option.id);
                        const c = option.comments || {};
                        setCommentInput({
                          placement: c.placement || "",
                          infrastructure: c.infrastructure || "",
                          hostel: c.hostel || "",
                          other: c.other || ""
                        });
                      }}>
                        💬
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h4 className="text-xl font-semibold text-muted-foreground mb-2">No Options Added Yet</h4>
            <p className="text-muted-foreground mb-4">Add your first college and branch preference above</p>
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-4 max-w-md mx-auto">
              <h5 className="font-semibold text-amber-300 mb-2">💡 Tips:</h5>
              <ul className="text-sm text-amber-200 space-y-1 text-left">
                <li>• Set priority to 0 to remove an option</li>
                <li>• Drag and drop to reorder options</li>
                <li>• Save your options to avoid losing them</li>
                <li>• Use the Analytics tab to analyze your chances</li>
                <li>• Export to PDF for offline reference (₹5 - unlimited downloads)</li>
              </ul>
            </div>
          </div>
        )}
      </Card>

      {/* Auto-generate branch selection dialog */}
      {autoDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-card p-6 rounded-xl shadow-xl w-full max-w-md">
            <h4 className="text-lg font-bold mb-4">Select Branches/Courses</h4>
            <div className="max-h-80 overflow-y-auto mb-4">
              {branches.map(branch => (
                <label key={branch.code} className="flex items-center space-x-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoBranches.includes(branch.code)}
                    onChange={e => {
                      if (e.target.checked) {
                        setAutoBranches(prev => [...prev, branch.code]);
                      } else {
                        setAutoBranches(prev => prev.filter(code => code !== branch.code));
                      }
                    }}
                  />
                  <span className="font-medium text-foreground">{branch.code} - {branch.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <Button onClick={() => setAutoDialogOpen(false)} variant="outline">Cancel</Button>
              <Button
                onClick={() => {
                  setAutoDialogOpen(false);
                  autoGenerateOptions();
                }}
                disabled={autoBranches.length === 0}
              >
                Generate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {editingNoteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-card p-6 rounded-xl shadow-xl w-full max-w-md">
            <h4 className="text-lg font-bold mb-4">Edit Notes</h4>
            <textarea
              className="w-full h-32 border rounded-lg p-2 mb-4"
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="Add your notes here..."
            />
            <div className="flex justify-end gap-2">
              <Button onClick={() => setEditingNoteId(null)} variant="outline">Cancel</Button>
              <Button onClick={() => handleNoteSave(editingNoteId!)} disabled={noteInput.trim() === ""}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {editingCommentsId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-card p-6 rounded-xl shadow-xl w-full max-w-md">
            <h4 className="text-lg font-bold mb-4">Option Comments</h4>
            <div className="mb-2">
              <label className="block font-medium mb-1">Placement</label>
              <textarea
                className="w-full h-16 border rounded-lg p-2 mb-2 text-black"
                value={commentInput.placement}
                onChange={e => setCommentInput({...commentInput, placement: e.target.value})}
                placeholder="Write about placements..."
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium mb-1">Infrastructure</label>
              <textarea
                className="w-full h-16 border rounded-lg p-2 mb-2 text-black"
                value={commentInput.infrastructure}
                onChange={e => setCommentInput({...commentInput, infrastructure: e.target.value})}
                placeholder="Write about infrastructure..."
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium mb-1">Hostel</label>
              <textarea
                className="w-full h-16 border rounded-lg p-2 mb-2 text-black"
                value={commentInput.hostel}
                onChange={e => setCommentInput({...commentInput, hostel: e.target.value})}
                placeholder="Write about hostel..."
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Other</label>
              <textarea
                className="w-full h-16 border rounded-lg p-2 text-black"
                value={commentInput.other}
                onChange={e => setCommentInput({...commentInput, other: e.target.value})}
                placeholder="Other comments..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setEditingCommentsId(null)} variant="outline">Cancel</Button>
              <Button onClick={() => handleCommentsSave(editingCommentsId!)} disabled={Object.values(commentInput).every(v => v.trim() === "")}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionEntryTable;
