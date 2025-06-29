import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Phone, Calendar, AlertTriangle, Download } from "lucide-react";

const OfficialResourcesBanner = () => {
  return (
    <Card className="p-4 glass-card border-2 border-red-500/30 bg-gradient-to-r from-red-950/20 to-orange-950/20 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-500/20">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-400">🚨 OFFICIAL KCET RESOURCES</h3>
            <p className="text-red-300 text-sm">Practice tool only - Always refer to official sources</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-red-500/30 hover:bg-red-950/50 text-red-400"
            onClick={() => window.open('https://cetonline.karnataka.gov.in', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Official Website
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-500/30 hover:bg-red-950/50 text-red-400"
            onClick={() => {
              // This would typically open a dialog with more details
              alert('For official information, visit cetonline.karnataka.gov.in\n\nThis tool is for practice only!');
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Info Bulletin
          </Button>
        </div>
      </div>
      
      {/* Collapsible Details */}
      <div className="mt-3 pt-3 border-t border-red-500/20">
        <div className="grid md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 text-red-300">
            <ExternalLink className="h-3 w-3" />
            <span>cetonline.karnataka.gov.in</span>
          </div>
          <div className="flex items-center gap-2 text-red-300">
            <Phone className="h-3 w-3" />
            <span>Contact KEA directly</span>
          </div>
          <div className="flex items-center gap-2 text-red-300">
            <Calendar className="h-3 w-3" />
            <span>Check official dates</span>
          </div>
          <div className="flex items-center gap-2 text-red-300">
            <AlertTriangle className="h-3 w-3" />
            <span>Practice tool only</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OfficialResourcesBanner; 