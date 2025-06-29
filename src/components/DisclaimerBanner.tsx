
import { AlertTriangle, Shield } from "lucide-react";

const DisclaimerBanner = () => {
  return (
    <div className="bg-gradient-to-r from-red-900/20 via-orange-900/20 to-yellow-900/20 border-l-4 border-red-500 p-6 mb-6 rounded-lg glass-card">
      <div className="flex items-start">
        <AlertTriangle className="h-6 w-6 text-red-400 mt-0.5 mr-4 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-bold text-red-200 mb-2 text-lg">
            🚨 IMPORTANT DISCLAIMER - READ CAREFULLY 🚨
          </p>
          <div className="bg-red-950/40 p-4 rounded-lg border border-red-800/30 mb-3">
            <p className="text-red-100 font-semibold text-base leading-relaxed">
              This is a <strong className="text-red-200 text-lg">MOCK PLANNER FOR PRACTICE ONLY</strong> and not the official KEA website. 
              This platform is <strong className="text-red-200 text-lg">NOT AFFILIATED WITH KEA (Karnataka Examinations Authority)</strong> or any official government body.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-950/40 p-3 rounded-lg border border-blue-800/30">
            <Shield className="h-5 w-5 text-blue-400" />
            <p className="text-blue-100 font-medium">
              Use this tool to <strong>practice and organize your preferences</strong> before the official option entry window opens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
