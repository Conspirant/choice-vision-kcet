
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-purple-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">KCET Mock Planner</h1>
              <p className="text-xs text-gray-500">2025 Edition</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              onClick={() => navigate('/')}
              className="font-medium"
            >
              Home
            </Button>
            <Button 
              variant={location.pathname === '/planner' ? 'default' : 'ghost'}
              onClick={() => navigate('/planner')}
              className="font-medium"
            >
              Planner
            </Button>
            <Button 
              variant={location.pathname === '/analytics' ? 'default' : 'ghost'}
              onClick={() => navigate('/analytics')}
              className="font-medium"
            >
              Analytics
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/planner')}
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white glow-button"
            >
              Start Planning
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
