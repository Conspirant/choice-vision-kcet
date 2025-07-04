import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-purple-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 md:w-10 md:h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
              <span className="text-white font-bold text-xl md:text-lg">K</span>
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
              variant={location.pathname === '/faq' ? 'default' : 'ghost'}
              onClick={() => navigate('/faq')}
              className="font-medium"
            >
              FAQ
            </Button>
            <Button 
              variant={location.pathname === '/reviews' ? 'default' : 'ghost'}
              onClick={() => navigate('/reviews')}
              className="font-medium"
            >
              Reviews
            </Button>
            <Button 
              variant={location.pathname === '/tour' ? 'default' : 'ghost'}
              onClick={() => navigate('/tour')}
              className="font-medium"
            >
              Guided Tour
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white glow-button"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-purple-200/50 shadow-lg animate-fade-in-down">
          <div className="flex flex-col py-2 px-2 space-y-2">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
              className="w-full justify-start"
            >
              Home
            </Button>
            <Button 
              variant={location.pathname === '/planner' ? 'default' : 'ghost'}
              onClick={() => { setMobileMenuOpen(false); navigate('/planner'); }}
              className="w-full justify-start"
            >
              Planner
            </Button>
            <Button 
              variant={location.pathname === '/faq' ? 'default' : 'ghost'}
              onClick={() => { setMobileMenuOpen(false); navigate('/faq'); }}
              className="w-full justify-start"
            >
              FAQ
            </Button>
            <Button 
              variant={location.pathname === '/reviews' ? 'default' : 'ghost'}
              onClick={() => { setMobileMenuOpen(false); navigate('/reviews'); }}
              className="w-full justify-start"
            >
              Reviews
            </Button>
            <Button 
              variant={location.pathname === '/tour' ? 'default' : 'ghost'}
              onClick={() => { setMobileMenuOpen(false); navigate('/tour'); }}
              className="w-full justify-start"
            >
              Guided Tour
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
