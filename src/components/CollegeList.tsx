import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, MapPin, Info, Plus } from "lucide-react";
import { colleges, branches, type College } from "@/data/colleges";

interface OptionEntry {
  id: string;
  priority: number;
  collegeCode: string;
  collegeName: string;
  branchCode: string;
  branchName: string;
  location: string;
  collegeCourse: string;
}

interface CollegeListProps {
  options?: OptionEntry[];
  onOptionsChange?: (options: OptionEntry[]) => void;
}

const CollegeList = ({ options = [], onOptionsChange }: CollegeListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("code");
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [priority, setPriority] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const uniqueLocations = Array.from(new Set(colleges.map(c => c.location))).sort();

  const filteredAndSortedColleges = useMemo(() => {
    let filtered = colleges.filter(college => {
      const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           college.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           college.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === "all" || college.type === typeFilter;
      const matchesLocation = locationFilter === "all" || college.location === locationFilter;
      
      return matchesSearch && matchesType && matchesLocation;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "location":
          return a.location.localeCompare(b.location);
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return a.code.localeCompare(b.code);
      }
    });

    return filtered;
  }, [searchTerm, typeFilter, locationFilter, sortBy]);

  const getTypeColor = (type: College['type']) => {
    switch (type) {
      case 'Government':
        return 'bg-green-950/50 text-green-300 border-green-800/50';
      case 'Aided Private':
        return 'bg-blue-950/50 text-blue-300 border-blue-800/50';
      case 'Private Unaided':
        return 'bg-purple-950/50 text-purple-300 border-purple-800/50';
      case 'SNQ':
        return 'bg-orange-950/50 text-orange-300 border-orange-800/50';
      default:
        return 'bg-gray-950/50 text-gray-300 border-gray-800/50';
    }
  };

  const handleAddOption = () => {
    if (!selectedCollege || !selectedBranch || !onOptionsChange) return;

    const branch = branches.find(b => b.code === selectedBranch);
    if (!branch) return;

    const collegeCourse = `${selectedCollege.code}${branch.code}`;
    
    const newOption: OptionEntry = {
      id: Date.now().toString(),
      priority: priority,
      collegeCode: selectedCollege.code,
      collegeName: selectedCollege.name,
      branchCode: branch.code,
      branchName: branch.name,
      location: selectedCollege.location,
      collegeCourse: collegeCourse
    };

    onOptionsChange([...options, newOption]);
    
    // Reset form
    setSelectedBranch("");
    setPriority(1);
    setIsDialogOpen(false);
  };

  const openAddDialog = (college: College) => {
    setSelectedCollege(college);
    setPriority(options.length + 1);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 glass-card">
        <h2 className="text-2xl font-bold gradient-text mb-4">College Database</h2>
        <p className="text-muted-foreground mb-4">
          Browse through {colleges.length} engineering colleges with detailed information.
        </p>
        
        {/* Fee Information */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 p-3 bg-blue-950/20 rounded-lg border border-blue-800/30">
          <Info className="h-5 w-5 text-blue-400" />
          <p className="text-sm text-blue-300">
            <strong>Fee Information:</strong> Fees will be auto-filled once KEA publishes the official fee matrix for 2025.
          </p>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search colleges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 premium-input"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="premium-select">
              <SelectValue placeholder="College Type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-purple-500/30">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Government">Government</SelectItem>
              <SelectItem value="Aided Private">Aided Private</SelectItem>
              <SelectItem value="Private Unaided">Private Unaided</SelectItem>
              <SelectItem value="SNQ">SNQ</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="premium-select">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-card border-purple-500/30 max-h-60">
              <SelectItem value="all">All Locations</SelectItem>
              {uniqueLocations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="premium-select">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-card border-purple-500/30">
              <SelectItem value="code">College Code</SelectItem>
              <SelectItem value="name">College Name</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="text-sm text-muted-foreground flex items-center">
            Showing {filteredAndSortedColleges.length} colleges
          </div>
        </div>
      </Card>

      {/* College Table */}
      <Card className="p-6 glass-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/30">
                <TableHead className="text-muted-foreground">Code</TableHead>
                <TableHead className="text-muted-foreground">College Name</TableHead>
                <TableHead className="text-muted-foreground">Location</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground text-center">Add to Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedColleges.map((college) => (
                <TableRow key={college.code} className="hover:bg-purple-950/20 border-purple-500/20">
                  <TableCell className="font-mono font-medium text-purple-400">
                    {college.code}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {college.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {college.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getTypeColor(college.type)} font-medium`}>
                      {college.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 border-amber-400/30 hover:bg-amber-950/50 text-amber-400"
                      onClick={() => openAddDialog(college)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Option Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-amber-400/30">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Add {selectedCollege?.name} to Options
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">College</label>
              <div className="p-3 bg-purple-950/30 border border-purple-700/30 rounded-lg">
                <div className="font-medium text-foreground">{selectedCollege?.name}</div>
                <div className="text-sm text-muted-foreground">{selectedCollege?.location}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Course/Branch</label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="premium-select">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className="bg-card border-amber-400/30 max-h-60">
                  {branches.map(branch => (
                    <SelectItem key={branch.code} value={branch.code}>
                      <span className="font-medium">{branch.code} - {branch.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Priority Order</label>
              <Input
                type="number"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
                className="premium-input"
                min="1"
                max="999"
                placeholder="Enter priority number"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleAddOption}
                disabled={!selectedBranch}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 glow-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Options
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-amber-400/30 hover:bg-amber-950/50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollegeList;
