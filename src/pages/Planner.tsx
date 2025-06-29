import { useState } from "react";
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
  }>>([]);

  const handleRankSubmit = (rank: number, category: string) => {
    setUserRank(rank);
    setUserCategory(category);
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen royal-gradient">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Disclaimer Banner */}
        <DisclaimerBanner />

        {/* Official Resources Banner */}
        <OfficialResourcesBanner />

        {/* Enhanced Progress Indicator */}
        <Card className="p-6 mb-8 glass-card">
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
          
          <div className="flex space-x-4 mb-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg glow-button' 
                    : 'bg-purple-800 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 2 && (
                  <div className={`flex-1 h-2 mx-4 rounded-full transition-all duration-300 ${
                    step < currentStep ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-purple-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Step 1: Rank Input */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto">
            <RankInput onRankSubmit={handleRankSubmit} />
          </div>
        )}

        {/* Step 2: Main Planner Interface */}
        {currentStep === 2 && (
          <div className="space-y-8">
            {/* User Status Bar */}
            <Card className="p-4 glass-card">
              <div className="flex items-center justify-between">
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
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  className="border-amber-400/30 hover:bg-amber-950/50 text-foreground"
                >
                  Change Details
                </Button>
              </div>
            </Card>

            {/* Tabbed Interface */}
            <Tabs defaultValue="entry" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 bg-card/50 border border-amber-400/30">
                <TabsTrigger 
                  value="entry" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button"
                >
                  Option Entry
                </TabsTrigger>
                <TabsTrigger 
                  value="colleges" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button"
                >
                  College List
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="resources" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button"
                >
                  Resources
                </TabsTrigger>
                <TabsTrigger 
                  value="instructions" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button"
                >
                  Instructions
                </TabsTrigger>
                <TabsTrigger 
                  value="worksheet" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:glow-button"
                >
                  Worksheet
                </TabsTrigger>
              </TabsList>

              <TabsContent value="entry">
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
  );
};

export default Planner;
