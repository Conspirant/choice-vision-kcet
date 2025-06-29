import DisclaimerBanner from "@/components/DisclaimerBanner";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen royal-gradient">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DisclaimerBanner />
        <Hero />
      </div>
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-white">
        Created with love by u/infamblackhoodieguy
      </footer>
    </div>
  );
};

export default Index;
