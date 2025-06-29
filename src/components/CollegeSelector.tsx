import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Plus, MapPin, School, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Preference } from "@/types";
import { colleges } from "@/data/colleges";

interface CollegeSelectorProps {
  onAddPreference: (preference: Omit<Preference, 'id'>) => void;
  userRank: number | null;
  onNext: () => void;
}

const branches = [
  "Computer Science and Engineering",
  "Information Science and Engineering", 
  "Electronics and Communication Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical and Electronics Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Aeronautical Engineering",
  "Industrial Engineering"
];

const CollegeSelector = ({ onAddPreference, userRank, onNext }: CollegeSelectorProps) => {
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [collegeSearch, setCollegeSearch] = useState<string>('');
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);
  const { toast } = useToast();

  // Filter colleges based on search inside dropdown
  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    college.code.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    college.location.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const handleAddPreference = () => {
    if (!selectedCollege || !selectedBranch) {
      toast({
        title: "Missing Information",
        description: "Please select both college and branch",
        variant: "destructive"
      });
      return;
    }

    const college = colleges.find(c => c.code === selectedCollege);
    if (!college) return;

    const preference: Omit<Preference, 'id'> = {
      college: college.name,
      branch: selectedBranch,
      location: college.location,
      cutoffRank: Math.floor(Math.random() * 50000) + 5000, // Mock cutoff data
      category: 'GM'
    };

    onAddPreference(preference);
    setRecentlyAdded(prev => [...prev, `${college.name} - ${selectedBranch}`]);
    setSelectedCollege('');
    setSelectedBranch('');
    setCollegeSearch('');
    toast({
      title: "Preference Added! ✅",
      description: `${college.name} - ${selectedBranch} added to your list`
    });
  };

  return (
    <div className="space-y-8">
      {/* Search and Add Section */}
      <Card className="p-8 glass-card">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏫</div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Select Your Preferences</h2>
          <p className="text-gray-600">Choose colleges and branches in your preferred order</p>
        </div>
        <div className="space-y-6">
          {/* College Selection with integrated search in dropdown */}
          <div className="space-y-2">
            <Label className="text-lg font-medium flex items-center gap-2">
              <School className="h-5 w-5 text-purple-600" />
              Select College *
            </Label>
            <Select value={selectedCollege} onValueChange={value => {
              setSelectedCollege(value);
              setCollegeSearch(""); // Clear search after selection
            }}>
              <SelectTrigger className="h-12 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl premium-select">
                <SelectValue placeholder="Select College" />
              </SelectTrigger>
              <SelectContent className="bg-white border-purple-200 max-h-80 p-0">
                <div className="sticky top-0 z-10 bg-white p-2 border-b border-purple-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search by name, code, or location..."
                      value={collegeSearch}
                      onChange={e => setCollegeSearch(e.target.value)}
                      className="pl-10 h-10 text-base border border-purple-200 focus:border-purple-500 rounded-lg mb-1 premium-input"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {(collegeSearch ? filteredColleges : colleges).length > 0 ? (
                    (collegeSearch ? filteredColleges : colleges).map(college => (
                      <SelectItem key={college.code} value={college.code}>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium text-foreground">{college.code} - {college.name}</span>
                          <span className="text-sm text-gray-500 ml-4 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {college.location}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">No colleges found.</div>
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>
          {/* Branch Selection (unchanged) */}
          <div className="space-y-2">
            <Label className="text-lg font-medium flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Select Branch *
            </Label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="h-12 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl">
                <SelectValue placeholder="Choose a branch" />
              </SelectTrigger>
              <SelectContent className="bg-white border-purple-200 max-h-60">
                {branches.map((branch) => (
                  <SelectItem key={branch.name} value={branch.name}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Add Button (unchanged) */}
          <Button 
            onClick={handleAddPreference}
            className="w-full h-12 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl glow-button font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add to Preferences
          </Button>
        </div>
      </Card>

      {/* Recently Added */}
      {recentlyAdded.length > 0 && (
        <Card className="p-6 glass-card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ✨ Recently Added
          </h3>
          <div className="space-y-2">
            {recentlyAdded.slice(-3).map((item, index) => (
              <div key={index} className="text-sm text-gray-600 bg-green-50 p-2 rounded-lg">
                ✅ {item}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Continue Button */}
      <div className="text-center">
        <Button 
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-12 py-6 text-lg rounded-2xl glow-button font-semibold"
        >
          Review My Preferences 📋
        </Button>
      </div>
    </div>
  );
};

export default CollegeSelector;
