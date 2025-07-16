import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import RankInput from "@/components/RankInput";
import OptionEntryTable from "@/components/OptionEntryTable";
import CollegeList from "@/components/CollegeList";
import Instructions from "@/components/Instructions";
import Analytics from "@/components/Analytics";
import UploadedReferences from "@/components/UploadedReferences";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import OfficialResourcesBanner from "@/components/OfficialResourcesBanner";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import CutoffExplorer from "@/components/CutoffExplorer";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
// Use local worker file for Vite compatibility
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// Re-export the Preference type for backward compatibility
export type { Preference } from "@/types";

const Planner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userCategory, setUserCategory] = useState<string>('GM');
  const [selectedOptions, setSelectedOptions] = useState<Array<{
    id: string;
    collegeCode: string;
    branchCode: string;
    collegeName: string;
    branchName: string;
    location: string;
    collegeCourse: string;
    priority: number;
    courseFee?: string;
    collegeAddress?: string;
  }>>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add state for mock allotment popup
  const [showMockAllotmentPopup, setShowMockAllotmentPopup] = useState(true);

  const isMobile = useIsMobile();

  const handleRankSubmit = (rank: number, category: string) => {
    setUserRank(rank);
    setUserCategory(category);
    setCurrentStep(2);
  };

  return (
    <>
    <div className="min-h-screen royal-gradient">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Disclaimer Banner */}
        <DisclaimerBanner />

          {/* Mock Allotment Coming Soon Popup */}
          {showMockAllotmentPopup && (
            <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMockAllotmentPopup(false)} />
              <Card className="relative w-full max-w-md mx-auto my-8 bg-white/95 border-0 shadow-2xl rounded-xl p-6 text-center z-50">
                <div className="flex flex-col items-center gap-3">
                  <div className="text-5xl mb-2">🚀</div>
                  <h2 className="text-2xl font-bold gradient-text mb-2">Mock Allotment Feature</h2>
                  <p className="text-lg text-muted-foreground mb-4">Coming Soon!</p>
                  <p className="text-sm text-gray-600 mb-4">We're working on a new feature to simulate mock allotments based on your preferences and past cutoff data. Stay tuned!</p>
                  <Button onClick={() => setShowMockAllotmentPopup(false)} className="mt-2 px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow">OK</Button>
                </div>
              </Card>
            </div>
          )}

        {/* Official Resources Banner */}
        <OfficialResourcesBanner />

        {/* Enhanced Progress Indicator */}
        <Card className={`p-6 mb-8 glass-card ${isMobile ? 'rounded-2xl p-4' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text">KCET 2025 Mock Option Entry Planner</h1>
              <p className="text-muted-foreground mt-1">Practice your college preferences before the official counseling</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Step {currentStep} of 2</div>
              <div className="text-xs gold-accent font-medium">
                {currentStep === 1 && "Enter Your Details"}
                {currentStep === 2 && "Plan Your Options"}
              </div>
            </div>
          </div>
          {/* Only show desktop warning on desktop */}
          {!isMobile && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-3 rounded mb-2 text-sm font-medium">
              This site is optimized for desktop use and provides the best experience on a computer. Mobile support is provided for convenience, but some features may be limited or look different.
            </div>
          )}
        </Card>

        {/* Step 1: Rank Input */}
        {currentStep === 1 && (
          <div className={`max-w-2xl mx-auto ${isMobile ? 'px-2' : ''}`}>
            <RankInput onRankSubmit={handleRankSubmit} />
          </div>
        )}

        {/* Step 2: Main Planner Interface */}
        {currentStep === 2 && (
          <div className={`space-y-8 ${isMobile ? 'px-1' : ''}`}>
            {/* User Status Bar */}
            <Card className={`p-4 glass-card ${isMobile ? 'rounded-2xl p-3' : ''}`}>
              <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-2 items-start' : ''}`}>
                <div className="flex items-center gap-6">
                  <div className="text-sm">
                    <span className="text-muted-foreground">KCET Rank:</span>
                    <span className="font-bold gold-accent ml-2">{userRank?.toLocaleString()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-bold gold-accent ml-2">{userCategory}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size={isMobile ? "lg" : "sm"}
                  onClick={() => setCurrentStep(1)}
                  className={`border-amber-400/30 hover:bg-amber-950/50 text-foreground ${isMobile ? 'w-full mt-2 py-3 text-base rounded-xl' : ''}`}
                >
                  Change Details
                </Button>
              </div>
            </Card>

            {/* Tabbed Interface */}
            <Tabs defaultValue="entry" className="space-y-6">
              <TabsList className={`grid w-full grid-cols-7 bg-card/50 border border-amber-400/30 ${isMobile ? 'gap-1' : ''}`} style={isMobile ? {gridTemplateColumns: 'repeat(2, 1fr)', fontSize: 18, padding: 4} : {}}>
                <TabsTrigger 
                  value="entry" 
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button ${isMobile ? 'w-full py-3 rounded-xl text-base' : ''}`}
                >
                  Option Entry
                </TabsTrigger>
                <TabsTrigger 
                  value="colleges" 
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button ${isMobile ? 'w-full py-3 rounded-xl text-base' : ''}`}
                >
                  College List
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button ${isMobile ? 'w-full py-3 rounded-xl text-base' : ''}`}
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="resources" 
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button ${isMobile ? 'w-full py-3 rounded-xl text-base' : ''}`}
                >
                  Resources
                </TabsTrigger>
                <TabsTrigger 
                  value="instructions" 
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button ${isMobile ? 'w-full py-3 rounded-xl text-base' : ''}`}
                >
                  Instructions
                </TabsTrigger>
                <TabsTrigger 
                  value="worksheet" 
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button ${isMobile ? 'w-full py-3 rounded-xl text-base' : ''}`}
                >
                  Worksheet
                </TabsTrigger>
              </TabsList>

              <TabsContent value="entry">
                {/* Enhanced PDF Upload UI */}
                <div className="mb-4 flex flex-col items-center">
                  <div
                    className={`w-full max-w-md border-2 border-dashed border-amber-400/60 rounded-xl p-6 bg-amber-50/30 flex flex-col items-center justify-center transition hover:bg-amber-100/60 cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={async e => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type === 'application/pdf') {
                        setUploading(true);
                        setUploadError(null);
                        setUploadedFile(file);
                        try {
                          const parsedOptions = await parsePdfToOptions(file);
                          if (parsedOptions) setSelectedOptions(parsedOptions);
                        } catch (err) {
                          setUploadError('Failed to parse PDF. Please check the file format.');
                        } finally {
                          setUploading(false);
                        }
                      } else {
                        setUploadError('Please upload a valid PDF file.');
                      }
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        setUploadError(null);
                        setUploadedFile(file);
                        try {
                          const parsedOptions = await parsePdfToOptions(file);
                          if (parsedOptions) setSelectedOptions(parsedOptions);
                        } catch (err) {
                          setUploadError('Failed to parse PDF. Please check the file format.');
                        } finally {
                          setUploading(false);
                        }
                      }}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-3xl">📄</div>
                      <div className="font-semibold text-lg text-amber-900">Upload Option Entry PDF</div>
                      <div className="text-xs text-muted-foreground mb-2">Drag & drop or click to select a PDF file</div>
                      {uploadedFile && (
                        <div className="text-xs text-amber-700 font-medium">{uploadedFile.name}</div>
                      )}
                      {uploading && (
                        <div className="text-xs text-amber-600 animate-pulse">Parsing PDF...</div>
                      )}
                      {uploadError && (
                        <div className="text-xs text-red-600 font-medium mt-1">{uploadError}</div>
                      )}
                    </div>
                  </div>
                </div>
                <OptionEntryTable 
                  userRank={userRank} 
                  userCategory={userCategory} 
                  options={selectedOptions}
                  onOptionsChange={setSelectedOptions}
                />
              </TabsContent>

              <TabsContent value="colleges">
                <CollegeList 
                  options={selectedOptions}
                  onOptionsChange={setSelectedOptions}
                />
              </TabsContent>

              <TabsContent value="analytics">
                <Analytics 
                  userRank={userRank} 
                  userCategory={userCategory} 
                  selectedOptions={selectedOptions}
                />
              </TabsContent>

              <TabsContent value="resources">
                <UploadedReferences />
              </TabsContent>

              <TabsContent value="instructions">
                <Instructions />
              </TabsContent>

              <TabsContent value="worksheet">
                <Card className="p-8 glass-card text-center">
                  <div className="text-4xl mb-6">📝</div>
                  <h3 className="text-2xl font-bold gradient-text mb-4">Planning Worksheet</h3>
                  <p className="text-muted-foreground mb-8">
                    Use this space to brainstorm and organize your thoughts before finalizing your option list.
                  </p>
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-6 text-left">
                    <h4 className="font-semibold text-amber-300 mb-3">💡 Planning Questions to Consider:</h4>
                    <ul className="text-amber-200 space-y-2 text-sm">
                      <li>• What are your top 3 preferred branches of engineering?</li>
                      <li>• Are you willing to study outside Bangalore/your home city?</li>
                      <li>• What's your budget for college fees?</li>
                      <li>• Do you prefer government/aided colleges over private ones?</li>
                      <li>• Which colleges have the best placement records in your field?</li>
                      <li>• Have you researched faculty and infrastructure of target colleges?</li>
                    </ul>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
      <footer className="fixed bottom-0 left-0 w-full text-center py-3 text-sm text-muted-foreground opacity-80 bg-background z-50 shadow">
        Created with <span role="img" aria-label="love">❤️</span> by Rishab
      </footer>
    </>
  );
};

// Helper function stub (to be implemented)
async function parsePdfToOptions(file: File): Promise<any[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let allLines: string[] = [];

    // Extract text from all pages, line by line
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      let lastY = null;
      let line = '';
      let lines: string[] = [];
      for (const item of content.items as any[]) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
          lines.push(line.trim());
          line = '';
        }
        line += (item.str + ' ');
        lastY = item.transform[5];
      }
      if (line.trim()) lines.push(line.trim());
      allLines.push(...lines);
    }

    // Remove header/footer lines and empty lines
    allLines = allLines.filter(l =>
      l.trim() &&
      !l.match(/KARNATAKA EXAMINATIONS AUTHORITY/i) &&
      !l.match(/Downloaded Date:/i) &&
      !l.match(/FIRST ROUND OPTIONS LIST/i) &&
      !l.match(/Page \d+\/\d+/i)
    );

    // Find the header row and skip it
    const headerIdx = allLines.findIndex(l => l.match(/Optn\. No/i));
    const dataLines = headerIdx >= 0 ? allLines.slice(headerIdx + 1) : allLines;

    // Debug: Print the first 20 lines after header removal
    console.log('Extracted PDF lines after header:', dataLines.slice(0, 20));

    // Skip all lines before the first option
    const optionStartRegex = /^\d+\s+[A-Z]\d{3,}[A-Z]{2,}/;
    const firstOptionIdx = dataLines.findIndex(line => optionStartRegex.test(line));
    const relevantLines = firstOptionIdx >= 0 ? dataLines.slice(firstOptionIdx) : [];

    // Group lines into option blocks
    const optionBlocks: string[][] = [];
    let currentBlock: string[] = [];
    for (const line of relevantLines) {
      if (optionStartRegex.test(line)) {
        if (currentBlock.length) optionBlocks.push(currentBlock);
        currentBlock = [line];
      } else if (currentBlock.length) {
        currentBlock.push(line);
      }
    }
    if (currentBlock.length) optionBlocks.push(currentBlock);

    // Debug: Print the first 3 option blocks
    console.log('First 3 option blocks:', optionBlocks.slice(0, 3));

    // Parse each block into columns
    const options = [];
    for (const block of optionBlocks) {
      // Join all lines in the block with a single space to preserve word boundaries
      const joined = block.join(' ');
      // Extract optNo and collegeCourse as before
      const parts = joined.split(/\s{2,}/);
      if (parts.length < 3) continue;
      const optNo = parts[0];
      const collegeCourse = parts[1];
      // Join the rest as a single string for robust extraction
      let rest = parts.slice(2).join(' ');
      // --- FIX: Use regex to robustly extract course name, fee, and college name ---
      // Example: "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING 1,12,410 - One Lakh Twelve Thousand Four Hundred Ten New Horizon College ..."
      // Regex: Course name (greedy, up to fee), fee (number with commas), ' - ', words, then college name
      const robustRegex = /^(.*?)(\d{1,3}(?:,\d{2,3})+)[ ]*-[ ]*([A-Za-z ()]+(?:Ten|Twenty|Thirty|Forty|Fifty|Sixty|Seventy|Eighty|Ninety))(.*)$/;
      const match = rest.match(robustRegex);
      let courseName = '', courseFee = '', collegeName = '';
      if (match) {
        courseName = match[1].trim();
        courseFee = `${match[2]} - ${match[3]}`.trim();
        collegeName = match[4].trim();
      } else {
        // Try fallback: look for the first number-with-commas as fee
        const fallbackRegex = /^(.*?)(\d{1,3}(?:,\d{2,3})+)(.*)$/;
        const fallbackMatch = rest.match(fallbackRegex);
        if (fallbackMatch) {
          courseName = fallbackMatch[1].trim();
          courseFee = fallbackMatch[2].trim();
          collegeName = fallbackMatch[3].replace(/^,?\s*/, '');
        } else {
          courseName = rest.trim();
        }
      }
      const collegeCode = collegeCourse.slice(0, 5);
      const branchCode = collegeCourse.slice(5);
      options.push({
        id: optNo,
        priority: Number(optNo),
        collegeCode,
        branchCode,
        collegeName: collegeName.replace(/^,?\s*/, ''),
        branchName: courseName,
        location: '',
        collegeCourse,
        courseFee,
        collegeAddress: collegeName.replace(/^,?\s*/, ''),
      });
    }
    if (options.length === 0) {
      alert("No options found in the uploaded PDF. Please check the format.");
    }
    return options;
  } catch (err) {
    alert("Failed to parse PDF: " + (err instanceof Error ? err.message : err));
    return [];
  }
}

export default Planner;
