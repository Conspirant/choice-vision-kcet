import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, GripVertical, Download, Save, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Preference } from "@/types";

interface PreferenceListProps {
  preferences: Preference[];
  onRemovePreference: (id: string) => void;
  onReorderPreferences: (startIndex: number, endIndex: number) => void;
  userRank: number | null;
  userCategory: string;
}

const PreferenceList = ({ 
  preferences, 
  onRemovePreference, 
  onReorderPreferences,
  userRank,
  userCategory 
}: PreferenceListProps) => {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const { toast } = useToast();

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== dropIndex) {
      onReorderPreferences(draggedItem, dropIndex);
    }
    setDraggedItem(null);
  };

  const getCutoffStatus = (cutoffRank: number | undefined) => {
    if (!cutoffRank || !userRank) return { status: 'unknown', color: 'bg-gray-500' };
    
    if (userRank <= cutoffRank * 0.8) return { status: 'safe', color: 'bg-green-500' };
    if (userRank <= cutoffRank * 1.1) return { status: 'moderate', color: 'bg-yellow-500' };
    return { status: 'reach', color: 'bg-red-500' };
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF Export Started! 📄",
      description: "Your preference list will be downloaded shortly"
    });
  };

  const handleSaveList = () => {
    localStorage.setItem('kcet-preferences', JSON.stringify(preferences));
    toast({
      title: "Preferences Saved! 💾",
      description: "Your list has been saved to your browser"
    });
  };

  if (preferences.length === 0) {
    return (
      <Card className="p-12 glass-card text-center">
        <div className="text-6xl mb-6">📝</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">No Preferences Added Yet</h3>
        <p className="text-gray-600 mb-6">
          Go back to the previous step to add your college and branch preferences
        </p>
        <div className="text-sm text-gray-500">
          💡 Tip: Add at least 50-75 preferences for the best chances
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="p-6 glass-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">Your Preference List</h2>
            <p className="text-gray-600">
              {preferences.length} preferences • Drag to reorder • Click X to remove
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleSaveList}
              variant="outline" 
              className="border-purple-300 hover:bg-purple-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Save List
            </Button>
            <Button 
              onClick={handleExportPDF}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* Preference Cards */}
      <div className="space-y-4">
        {preferences.map((preference, index) => {
          const cutoffStatus = getCutoffStatus(preference.cutoffRank);
          
          return (
            <Card 
              key={preference.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`p-6 glass-card floating-card cursor-move transition-all duration-300 ${
                draggedItem === index ? 'opacity-50 scale-95' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Drag Handle & Rank */}
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                </div>

                {/* College Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {preference.college}
                      </h3>
                      <p className="text-purple-600 font-medium mb-2">
                        {preference.branch}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>📍 {preference.location}</span>
                        {preference.cutoffRank && (
                          <span>🏆 Cutoff: {preference.cutoffRank.toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      {cutoffStatus.status !== 'unknown' && (
                        <Badge className={`${cutoffStatus.color} text-white capitalize`}>
                          {cutoffStatus.status}
                        </Badge>
                      )}

                      {/* Analytics Button */}
                      <Button size="sm" variant="outline" className="border-blue-300 hover:bg-blue-50">
                        <BarChart3 className="h-4 w-4" />
                      </Button>

                      {/* Remove Button */}
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => onRemovePreference(preference.id)}
                        className="border-red-300 hover:bg-red-50 text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary Card */}
      <Card className="p-6 glass-card">
        <h3 className="font-semibold text-gray-800 mb-4">📊 Summary</h3>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">
              {preferences.filter(p => getCutoffStatus(p.cutoffRank).status === 'safe').length}
            </div>
            <div className="text-sm text-green-700">Safe Options</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl">
            <div className="text-2xl font-bold text-yellow-600">
              {preferences.filter(p => getCutoffStatus(p.cutoffRank).status === 'moderate').length}
            </div>
            <div className="text-sm text-yellow-700">Moderate Options</div>
          </div>
          <div className="p-4 bg-red-50 rounded-xl">
            <div className="text-2xl font-bold text-red-600">
              {preferences.filter(p => getCutoffStatus(p.cutoffRank).status === 'reach').length}
            </div>
            <div className="text-sm text-red-700">Reach Options</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">{preferences.length}</div>
            <div className="text-sm text-purple-700">Total Preferences</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PreferenceList;
