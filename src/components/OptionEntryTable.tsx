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
import PaymentModal from "./PaymentModal";

interface OptionEntry {
  id: string;
  priority: number;
  collegeCode: string;
  collegeName: string;
  branchCode: string;
  branchName: string;
  location: string;
  collegeCourse: string; // New field for combined code
}

interface OptionEntryTableProps {
  userRank: number | null;
  userCategory: string;
  options: OptionEntry[];
  onOptionsChange: (options: OptionEntry[]) => void;
}

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
  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

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

  const exportToPDF = () => {
    // Check if user has paid for PDF export
    const hasPaidForPDF = localStorage.getItem('paid_pdf') === 'true';
    
    if (!hasPaidForPDF) {
      setPendingAction(() => exportToPDF);
      setPaymentModalOpen(true);
      return;
    }

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
      "Fees"
    ];
    const tableRows = options.map((option, idx) => [
      option.collegeCourse,
      option.priority,
      option.collegeName,
      option.location,
      option.branchName,
      "Please refer the PDF"
    ]);

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
      <Card className="p-6 glass-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold gradient-text">Your Option Entry List ({options.length})</h3>
          <div className="flex gap-2">
            <Button 
              onClick={loadSavedOptions} 
              variant="outline" 
              className="border-blue-400/30 hover:bg-blue-950/50"
              disabled={loadingSaved}
            >
              {loadingSaved ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Info className="h-4 w-4 mr-2" />
              )}
              Load Saved
            </Button>
            <Button onClick={saveOptions} variant="outline" className="border-amber-400/30 hover:bg-amber-950/50">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            {options.length > 0 && (
              <Button 
                onClick={clearAllOptions} 
                variant="outline" 
                className="border-red-400/30 hover:bg-red-950/50"
              >
                Clear All
              </Button>
            )}
            <Button onClick={exportToPDF} className="bg-gradient-to-r from-blue-600 to-indigo-600 glow-button">
              <Download className="h-4 w-4 mr-2" />
              {localStorage.getItem('paid_pdf') === 'true' ? 'Export PDF (Unlimited)' : 'Export PDF (₹5)'}
            </Button>
          </div>
        </div>

        {options.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>College Course</TableHead>
                  <TableHead>Option No</TableHead>
                  <TableHead>College Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Fees</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {options.map((option, index) => (
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
                    <TableCell className="font-mono text-sm text-amber-300">{option.collegeCourse}</TableCell>
                    <TableCell className="font-bold text-lg text-center">
                      <Input
                        type="number"
                        value={option.priority}
                        onChange={e => updatePriority(option.id, parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-center premium-input text-sm"
                        min="0"
                        max="999"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{option.collegeName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground font-medium">{option.location}</TableCell>
                    <TableCell className="text-sm text-foreground">{option.branchName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">Please refer the PDF</TableCell>
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        type="pdf"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default OptionEntryTable;
