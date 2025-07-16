import DisclaimerBanner from "@/components/DisclaimerBanner";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen royal-gradient flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <DisclaimerBanner />
        <Hero />
      </main>
      <footer className="fixed bottom-0 left-0 w-full text-center py-3 text-sm text-muted-foreground opacity-80 bg-background z-50 shadow">
        Created with <span role="img" aria-label="love">❤️</span> by Rishab
      </footer>
    </div>
  );
};

export default Index;
