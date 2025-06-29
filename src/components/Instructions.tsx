import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, List, Download, Save, Move } from "lucide-react";

const Instructions = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 glass-card">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-2xl font-bold gradient-text">How to Use This Tool</h2>
          <p className="text-gray-600 mt-2">
            Complete guide to planning your KCET 2025 option entry
          </p>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Getting Started */}
        <Card className="p-6 glass-card">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold">Getting Started</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Badge className="bg-purple-100 text-purple-800 mt-1">1</Badge>
              <div>
                <p className="font-medium">Enter Your Details</p>
                <p className="text-gray-600">Provide your KCET rank, category, and other eligibility information</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-purple-100 text-purple-800 mt-1">2</Badge>
              <div>
                <p className="font-medium">Browse Colleges</p>
                <p className="text-gray-600">Explore our database of engineering colleges with fees and locations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-purple-100 text-purple-800 mt-1">3</Badge>
              <div>
                <p className="font-medium">Add Options</p>
                <p className="text-gray-600">Select college and branch combinations to build your preference list</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Option Entry Process */}
        <Card className="p-6 glass-card">
          <div className="flex items-center gap-3 mb-4">
            <List className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold">Option Entry Process</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Badge className="bg-green-100 text-green-800 mt-1">✓</Badge>
              <div>
                <p className="font-medium">Select College & Branch</p>
                <p className="text-gray-600">Choose from dropdown menus with all available options</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-green-100 text-green-800 mt-1">✓</Badge>
              <div>
                <p className="font-medium">Auto-Priority Assignment</p>
                <p className="text-gray-600">Options are automatically numbered in order of addition</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-green-100 text-green-800 mt-1">✓</Badge>
              <div>
                <p className="font-medium">View Fees & Details</p>
                <p className="text-gray-600">See college type, location, and fee structure for each option</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Drag & Drop Guide */}
        <Card className="p-6 glass-card">
          <div className="flex items-center gap-3 mb-4">
            <Move className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold">Reordering Options</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="font-medium text-purple-800 mb-2">💡 Drag & Drop Instructions</p>
              <ul className="text-purple-700 space-y-1">
                <li>• Click and hold the grip icon (⋮⋮) on any row</li>
                <li>• Drag the row to your desired position</li>
                <li>• Release to drop in the new position</li>
                <li>• Priorities will automatically renumber</li>
              </ul>
            </div>
            <p className="text-gray-600">
              <strong>Tip:</strong> Your first option has the highest priority. Arrange carefully!
            </p>
          </div>
        </Card>

        {/* Save & Export */}
        <Card className="p-6 glass-card">
          <div className="flex items-center gap-3 mb-4">
            <Save className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold">Save & Export</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="font-medium">Export to PDF</p>
                <p className="text-gray-600">Generate a KEA-style printout of your option list</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Save className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <p className="font-medium">Save Progress</p>
                <p className="text-gray-600">Your options are saved in your browser for later editing</p>
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-yellow-800 text-xs">
                <strong>⚠️ Important:</strong> Make sure to download your PDF before closing the browser. 
                Saved data is stored locally and may be lost if you clear browser data.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pro Tips */}
      <Card className="p-6 glass-card">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-semibold">Pro Tips for Option Entry</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="font-medium text-green-600">✅ Best Practices</p>
            <ul className="text-gray-600 space-y-1">
              <li>• Fill all available option slots (usually 75+)</li>
              <li>• Include a mix of reach, target, and safe options</li>
              <li>• Prioritize by genuine preference, not just rank</li>
              <li>• Consider location, campus, and placement records</li>
              <li>• Double-check college codes before submission</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-red-600">❌ Common Mistakes</p>
            <ul className="text-gray-600 space-y-1">
              <li>• Filling too few options</li>
              <li>• Only choosing colleges in one city</li>
              <li>• Ignoring government/aided colleges</li>
              <li>• Not considering branch preferences</li>
              <li>• Leaving gaps in option numbering</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Instructions;
