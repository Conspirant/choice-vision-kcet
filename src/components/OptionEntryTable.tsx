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
import { useIsMobile } from "@/hooks/use-mobile";

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
  comments?: string; // Free-form comment field
  courseFee?: string; // New field for course fee
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

const PAGE_SIZE = 20;

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
  const [commentInput, setCommentInput] = useState<string>("");
  const isMobile = useIsMobile();
  const [showAutoAddLimitPopup, setShowAutoAddLimitPopup] = useState(false);

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

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredOptions.length / PAGE_SIZE);
  const paginatedOptions = filteredOptions.length > 30
    ? filteredOptions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : filteredOptions;

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
      collegeCourse: collegeCourse,
      courseFee: 'please refer pdf'
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

  // Helper to get comments for PDF (now just returns the string)
  const getCommentsSummary = (comments?: OptionEntry["comments"]): string => {
    return comments || "";
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
      // Use the parsed courseFee if available, otherwise fallback to 'please refer pdf'
      const fee = option.courseFee && option.courseFee.trim() ? option.courseFee : 'please refer pdf';
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
        overflow: 'linebreak',
        halign: 'center',
        valign: 'middle',
        cellPadding: 2,
        font: "helvetica",
      },
      alternateRowStyles: {
        fillColor: [230, 220, 255],
      },
      columnStyles: {
        0: { cellWidth: 24 }, // College Course
        1: { cellWidth: 18 }, // Option No
        2: { cellWidth: 38 }, // College Name
        3: { cellWidth: 32 }, // Location
        4: { cellWidth: 38 }, // Course Name
        5: { cellWidth: 24 }, // Fees
        6: {
          cellWidth: 120, // Comments column wide
          halign: 'left',
          fontSize: 12,
          cellPadding: 6,
          overflow: 'linebreak',
        }
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
      Object.entries(bestCutoffByCollege)
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
              collegeCourse: `${college.code}${branchCode}`,
              courseFee: 'please refer pdf'
            });
            seenPairs.add(pairKey);
          }
        });
    });
    // Limit to 5-6 options only
    const limitedOptions = allOptions.slice(0, 6);
    onOptionsChange(limitedOptions);
    setShowAutoAddLimitPopup(true);
    toast({
      title: "Options Auto-generated! 🚀",
      description: `Generated ${limitedOptions.length} options for ${autoBranches.map(bc => branches.find(b => b.code === bc)?.name || bc).join(", ")}`
    });
  };

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
      opt.id === id ? { ...opt, comments: commentInput } : opt
    );
    onOptionsChange(updatedOptions);
    setEditingCommentsId(null);
    setCommentInput("");
    localStorage.setItem('kcet-options', JSON.stringify(updatedOptions));
  };

  return (
    <div className="space-y-6">
      {/* Desktop-optimized notice */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-3 rounded mb-2 text-sm font-medium">
        This site is optimized for desktop use and provides the best experience on a computer. Mobile support is provided for convenience, but some features may be limited or look different.
      </div>
      {/* Add Option Form */}
      <Card className={`p-6 glass-card ${isMobile ? 'rounded-2xl p-4' : ''}`}>
        <h3 className="text-xl font-bold gradient-text mb-4">Add New Option</h3>
        <div className={`grid md:grid-cols-3 gap-4 ${isMobile ? 'gap-2' : ''}`}>
          <div className="col-span-3 md:col-span-1">
            <label htmlFor="college-select" className="block text-sm font-medium mb-2 text-foreground">College</label>
            <Select value={selectedCollege} onValueChange={value => {
              setSelectedCollege(value);
              setCollegeSearch("");
            }}>
              <SelectTrigger id="college-select" name="college-select" className="h-14 text-xl border-2 border-amber-400 focus:border-amber-500 rounded-2xl premium-select w-full shadow-md">
                <SelectValue placeholder="Select College" />
              </SelectTrigger>
              <SelectContent>
                <div className="sticky top-0 z-10 bg-card p-2 border-b border-amber-100">
                  <div className="relative">
                    <Input
                      placeholder="Search by name or code..."
                      value={collegeSearch}
                      onChange={e => setCollegeSearch(e.target.value)}
                      className="pl-10 h-10 text-base border border-amber-200 focus:border-amber-500 rounded-lg mb-1 premium-input min-h-[44px]"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {(collegeSearch ? filteredColleges : colleges).length > 0 ? (
                    (collegeSearch ? filteredColleges : colleges).map(college => (
                      <SelectItem key={college.code} value={college.code} className="min-h-[44px] md:min-h-[36px] text-base md:text-sm">
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
          
          <div className="col-span-3 md:col-span-1">
            <label htmlFor="branch-select" className="block text-sm font-medium mb-2 text-foreground">Branch</label>
            <Select value={selectedBranch} onValueChange={value => {
              setSelectedBranch(value);
              setBranchSearch("");
            }}>
              <SelectTrigger id="branch-select" name="branch-select" className="h-14 text-xl border-2 border-amber-400 focus:border-amber-500 rounded-2xl w-full shadow-md">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <div className="sticky top-0 z-10 bg-card p-2 border-b border-amber-100">
                  <div className="relative">
                    <Input
                      placeholder="Search by name or code..."
                      value={branchSearch}
                      onChange={e => setBranchSearch(e.target.value)}
                      className="pl-10 h-10 text-base border border-amber-200 focus:border-amber-500 rounded-lg mb-1 premium-input min-h-[44px]"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {(branchSearch ? filteredBranches : branches).length > 0 ? (
                    (branchSearch ? filteredBranches : branches).map(branch => (
                      <SelectItem key={branch.code} value={branch.code} className="min-h-[44px] md:min-h-[36px] text-base md:text-sm">
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
          
          <div className="flex items-end w-full md:w-auto">
            <Button 
              onClick={addOption}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 glow-button font-semibold py-4 text-xl rounded-2xl shadow-lg"
            >
              <Plus className="h-6 w-6 mr-2" />
              Add Option
            </Button>
          </div>
        </div>
      </Card>

      {/* Fee Information Card */}
      <Card className={`p-4 glass-card ${isMobile ? 'rounded-2xl p-3 mt-2' : ''}`}>
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

      {/* Options Table or Card List */}
      <Card className={`p-2 sm:p-6 glass-card ${isMobile ? 'rounded-2xl p-2 mt-2' : ''}`}>
        <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 ${isMobile ? 'gap-3' : ''}`}>
          <h3 className={`text-lg sm:text-xl font-bold gradient-text ${isMobile ? 'mb-2' : ''}`}>Your Option Entry List ({options.length})</h3>
          <div className={`flex flex-wrap gap-2 w-full ${isMobile ? 'flex-col' : ''}`}>
            <Input
              type="text"
              placeholder="Search your options..."
              value={optionSearch}
              onChange={e => setOptionSearch(e.target.value)}
              className={`w-full sm:w-64 mb-2 sm:mb-0 border-amber-400/50 focus:border-amber-500 rounded-lg text-base ${isMobile ? 'py-3 text-base rounded-xl' : ''}`}
              style={{ maxWidth: 260 }}
            />
            <Button 
              onClick={loadSavedOptions} 
              variant="outline" 
              className={`border-blue-400/30 hover:bg-blue-950/50 text-xs sm:text-base px-2 sm:px-4 font-semibold ${isMobile ? 'w-full py-3 text-base rounded-xl' : ''}`}
              disabled={loadingSaved}
            >
              {loadingSaved ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Info className="h-4 w-4 mr-2" />
              )}
              Load Saved
            </Button>
            <Button onClick={saveOptions} variant="outline" className={`border-amber-400/30 hover:bg-amber-950/50 text-xs sm:text-base px-2 sm:px-4 font-semibold ${isMobile ? 'w-full py-3 text-base rounded-xl' : ''}`}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            {options.length > 0 && (
              <Button 
                onClick={clearAllOptions} 
                variant="outline" 
                className={`border-red-400/30 hover:bg-red-950/50 text-xs sm:text-base px-2 sm:px-4 font-semibold ${isMobile ? 'w-full py-3 text-base rounded-xl' : ''}`}
              >
                Clear All
              </Button>
            )}
            <Button onClick={exportToPDF} className={`bg-gradient-to-r from-blue-600 to-indigo-600 glow-button text-xs sm:text-base px-2 sm:px-4 font-semibold ${isMobile ? 'w-full py-3 text-base rounded-xl' : ''}`}>
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
              className={`border-green-400/30 hover:bg-green-950/50 text-xs sm:text-base px-2 sm:px-4 font-semibold ${isMobile ? 'w-full py-3 text-base rounded-xl' : ''}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Auto-generate Options
            </Button>
          </div>
        </div>
          <div className="overflow-x-auto">
          <div className="relative">
            <Table className="w-full min-w-[900px] text-xs sm:text-sm border-separate border-spacing-0">
              <TableHeader className="sticky top-0 z-10 bg-background shadow border-b border-amber-400/60">
                <TableRow>
                  <TableHead className="bg-background sticky top-0 z-20 border-b border-amber-400/60">Optn. No</TableHead>
                  <TableHead className="bg-background sticky top-0 z-20 border-b border-amber-400/60">College Course</TableHead>
                  <TableHead className="bg-background sticky top-0 z-20 border-b border-amber-400/60">Course Name</TableHead>
                  <TableHead className="bg-background sticky top-0 z-20 border-b border-amber-400/60">Course Fee per Annum (Rs)</TableHead>
                  <TableHead className="bg-background sticky top-0 z-20 border-b border-amber-400/60">College Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filteredOptions.length > 30 ? paginatedOptions : filteredOptions).map((option, index) => (
                  <TableRow 
                    key={option.collegeCourse + '-' + option.priority + '-' + index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`cursor-move border-b border-amber-400/20 ${
                      index % 2 === 0 ? 'bg-amber-50/10' : 'bg-amber-950/10 hover:bg-amber-950/20'
                    }`}
                  >
                    <TableCell className="font-bold text-xs sm:text-lg text-center align-middle whitespace-nowrap">{option.priority}</TableCell>
                    <TableCell className="font-mono text-xs sm:text-sm text-amber-300 align-middle whitespace-nowrap">{option.collegeCourse}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-foreground align-middle whitespace-normal max-w-[220px]" title={option.branchName}>{option.branchName}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-muted-foreground align-middle whitespace-nowrap">{option.courseFee || 'please refer pdf'}</TableCell>
                    <TableCell className="font-medium text-xs sm:text-base text-foreground align-middle whitespace-normal max-w-[260px]" title={option.collegeName}>{option.collegeName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            {filteredOptions.length > 30 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
                <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Auto-generate branch selection dialog */}
      {autoDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overscroll-contain">
          <div className="bg-card p-4 rounded-xl shadow-xl w-full max-w-xs sm:max-w-md mx-2 overflow-y-auto max-h-[90vh]">
            <h4 className="text-lg font-bold mb-4">Select Branches/Courses</h4>
            <div className="max-h-60 overflow-y-auto mb-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overscroll-contain">
          <div className="bg-card p-4 rounded-xl shadow-xl w-full max-w-xs sm:max-w-md mx-2 overflow-y-auto max-h-[90vh]">
            <h4 className="text-lg font-bold mb-4">Edit Notes</h4>
            <label htmlFor={`note-textarea-${editingNoteId}`} className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              id={`note-textarea-${editingNoteId}`}
              name={`note-textarea-${editingNoteId}`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overscroll-contain">
          <div className="bg-card p-4 rounded-xl shadow-xl w-full max-w-xs sm:max-w-md mx-2 overflow-y-auto max-h-[90vh]">
            <h4 className="text-lg font-bold mb-4">Option Comments</h4>
            <label htmlFor={`comment-textarea-${editingCommentsId}`} className="block text-sm font-medium mb-2">Comments</label>
            <textarea
              id={`comment-textarea-${editingCommentsId}`}
              name={`comment-textarea-${editingCommentsId}`}
              className="w-full h-48 border rounded-lg p-2 mb-4 text-black"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              placeholder="Write your comments here... (You can write as much as you want!)"
              style={{ minHeight: 120, maxHeight: 400 }}
            />
            <div className="flex justify-end gap-2">
              <Button onClick={() => setEditingCommentsId(null)} variant="outline">Cancel</Button>
              <Button onClick={() => handleCommentsSave(editingCommentsId!)} disabled={commentInput.trim() === ""}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Add Limit Popup */}
      {showAutoAddLimitPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overscroll-contain">
          <div className="bg-card p-6 rounded-xl shadow-xl w-full max-w-md mx-2 overflow-y-auto max-h-[90vh] text-center">
            <h2 className="text-2xl font-bold mb-3 gradient-text">Notice</h2>
            <p className="mb-4 text-base text-muted-foreground">
              <strong>Feature Development Paused</strong><br/><br/>
              The automatic option generation feature is currently limited to a small set of colleges (5-6) for demonstration purposes only.<br/><br/>
              Further development of this feature has been paused, and the full auto-add functionality is not available at this time. If you require the complete list of eligible colleges for your rank, please contact the developer directly.<br/><br/>
              Thank you for your understanding and interest in this project.
            </p>
            <Button onClick={() => setShowAutoAddLimitPopup(false)} className="mt-2 px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow">OK</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionEntryTable;
