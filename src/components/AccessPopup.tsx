import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, ExternalLink, Clock, Shield, Info } from 'lucide-react';

interface AccessPopupProps {
  onAccessGranted: () => void;
}

const AccessPopup: React.FC<AccessPopupProps> = ({ onAccessGranted }) => {
  const [countdown, setCountdown] = useState(5);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanAccess(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Enhanced backdrop with stronger blur and gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/70 to-purple-800/80 backdrop-blur-xl backdrop-saturate-150" />

      {/* Main popup with enhanced styling - now scrollable */}
      <Card className="relative w-full max-w-md sm:max-w-2xl mx-auto my-4 sm:my-8 bg-white/95 backdrop-blur-md border-0 shadow-2xl shadow-purple-500/25 transform transition-all duration-500 hover:scale-105 min-h-fit max-h-[95vh] overflow-y-auto">
        {/* Premium gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-yellow-500 rounded-lg p-[2px] -z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-[6px] h-full w-full"></div>
        </div>
        
        <CardHeader className="text-center pb-4 sm:pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">!</span>
              </div>
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent">
            KCET 2025 Mock Planner
          </CardTitle>
          <p className="text-gray-600 mt-2 font-medium text-xs sm:text-sm md:text-base">
            Practice Tool - Official Resources Required
          </p>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Countdown Timer */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 bg-gradient-to-r from-purple-100 to-yellow-100 rounded-full border border-purple-200">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-purple-700 text-xs sm:text-sm md:text-base">
                {canAccess ? 'Ready to Access' : `${countdown} seconds remaining`}
              </span>
            </div>
          </div>

          {/* Critical Disclaimers */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-2 sm:p-3 md:p-4 rounded-r-lg">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1 text-xs sm:text-sm md:text-base">Critical Disclaimer</h4>
                  <p className="text-red-700 text-xs md:text-sm leading-relaxed">
                    This is a <strong>practice tool only</strong>. For official KCET 2025 option entry, 
                    you must use the official KEA website. This tool helps you practice your choices 
                    but cannot be used for actual submission.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-2 sm:p-3 md:p-4 rounded-r-lg">
              <div className="flex items-start gap-2 sm:gap-3">
                <Info className="w-5 h-5 md:w-6 md:h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1 text-xs sm:text-sm md:text-base">Important Notice</h4>
                  <p className="text-blue-700 text-xs md:text-sm leading-relaxed">
                    Always refer to official KEA resources for the most up-to-date information. 
                    Cutoff data and college information may change. This tool uses historical data 
                    for practice purposes only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Official Links */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-2 sm:p-3 md:p-4">
            <h4 className="font-semibold text-green-800 mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm md:text-base">
              <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
              Official KCET 2025 Resources
            </h4>
            <div className="space-y-1 sm:space-y-2">
              <a 
                href="https://cet.karnataka.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-green-700 hover:text-green-800 text-xs md:text-sm font-medium hover:underline transition-colors"
              >
                → Official KEA Website (cet.karnataka.gov.in)
              </a>
              <a 
                href="https://cet.karnataka.gov.in/option-entry" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-green-700 hover:text-green-800 text-xs md:text-sm font-medium hover:underline transition-colors"
              >
                → Official Option Entry Portal
              </a>
              <a 
                href="https://cet.karnataka.gov.in/seat-allocation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-green-700 hover:text-green-800 text-xs md:text-sm font-medium hover:underline transition-colors"
              >
                → Seat Allocation Information
              </a>
            </div>
          </div>

          {/* Access Button - Always visible */}
          <div className="text-center pt-4 sticky bottom-0 bg-white/95 backdrop-blur-sm rounded-t-lg">
            <Button
              onClick={onAccessGranted}
              disabled={!canAccess}
              className={`w-full py-3 px-4 sm:px-6 text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                canAccess
                  ? 'bg-gradient-to-r from-purple-600 to-yellow-600 hover:from-purple-700 hover:to-yellow-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canAccess ? (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 md:w-5 md:h-5" />
                  Access Practice Tool
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 md:w-5 md:h-5" />
                  Please Wait...
                </span>
              )}
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              By accessing this tool, you acknowledge that this is for practice purposes only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessPopup; 