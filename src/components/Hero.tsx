import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-10 px-2 sm:py-16 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-6 animate-slide-in leading-tight">
          <span className="gradient-text">Plan Your Future,</span>
          <br />
          <span className="text-gray-700">One Choice at a Time</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-base sm:text-xl md:text-2xl text-gray-600 mb-8 font-light leading-relaxed animate-slide-in animation-delay-150">
          Visualize and organize your KCET 2025 college preferences with our 
          <br className="hidden md:block" />
          intuitive mock planner. Practice makes perfect! ✨
        </p>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-12 max-w-3xl mx-auto">
          <div className="glass-card p-4 sm:p-6 rounded-2xl floating-card">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-800 mb-2">Smart Planning</h3>
            <p className="text-gray-600 text-sm">
              Organize your preferences with drag-and-drop simplicity
            </p>
          </div>
          
          <div className="glass-card p-4 sm:p-6 rounded-2xl floating-card animation-delay-200">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-800 mb-2">Cutoff Analytics</h3>
            <p className="text-gray-600 text-sm">
              View previous year trends and make informed decisions
            </p>
          </div>
          
          <div className="glass-card p-4 sm:p-6 rounded-2xl floating-card animation-delay-400">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="font-semibold text-gray-800 mb-2">Save & Export</h3>
            <p className="text-gray-600 text-sm">
              Export your preferences as PDF for easy reference
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={() => navigate('/planner')}
          size="lg" 
          className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-4 md:px-12 md:py-6 text-lg rounded-2xl glow-button animate-glow font-semibold shadow-lg"
        >
          🚀 Start Planning Now
        </Button>

        {/* Motivational Quote */}
        <div className="mt-10 sm:mt-16 p-4 sm:p-6 glass-card rounded-2xl max-w-2xl mx-auto">
          <p className="text-base sm:text-lg font-medium text-gray-700 italic">
            "Your rank doesn't define your future. Your plan does."
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">- Every successful student</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
