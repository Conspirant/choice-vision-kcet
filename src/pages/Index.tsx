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
      <footer className="sticky bottom-0 left-0 right-0 p-4 text-center text-white bg-gradient-to-t from-black/70 via-black/30 to-transparent text-sm sm:text-base z-40" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
        Created with love by u/infamblackhoodieguy
      </footer>
    </div>
  );
};

export default Index;
