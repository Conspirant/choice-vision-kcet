import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface RankInputProps {
  onRankSubmit: (rank: number, category: string) => void;
}

const RankInput = ({ onRankSubmit }: RankInputProps) => {
  const [rank, setRank] = useState<string>('');
  const [category, setCategory] = useState<string>('GM');
  const [stream, setStream] = useState<string>('Engineering');
  const { toast } = useToast();

  const validateRank = (rank: number): boolean => {
    if (isNaN(rank) || rank < 1 || rank > 200000) {
      toast({
        title: "Invalid Rank",
        description: "Please enter a valid rank between 1 and 2,00,000",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const rankNumber = parseInt(rank);
    if (!validateRank(rankNumber)) return;
    
    onRankSubmit(rankNumber, category);
    
    toast({
      title: "Details Saved! ✅",
      description: `Rank: ${rankNumber.toLocaleString()}, Category: ${category}`
    });
  };

  return (
    <Card className="p-8 glass-card">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🎯</div>
        <h2 className="text-3xl font-bold gradient-text mb-4">Enter Your KCET Details</h2>
        <p className="text-muted-foreground">
          Provide your rank and category to get personalized college recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="rank" className="text-sm font-medium mb-3 block text-foreground">
              KCET Rank *
            </Label>
            <Input
              id="rank"
              type="number"
              placeholder="Enter your rank"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="premium-input text-lg h-12"
              min="1"
              max="200000"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Valid range: 1 to 2,00,000</p>
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium mb-3 block text-foreground">
              Category *
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="premium-select h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GM">GM - General Merit</SelectItem>
                <SelectItem value="GMK">GMK - General Merit (Kannada Medium)</SelectItem>
                <SelectItem value="GMR">GMR - General Merit (Rural)</SelectItem>
                <SelectItem value="1G">1G - Category 1 (General)</SelectItem>
                <SelectItem value="1K">1K - Category 1 (Kannada Medium)</SelectItem>
                <SelectItem value="1R">1R - Category 1 (Rural)</SelectItem>
                <SelectItem value="2AG">2AG - Category 2A (General)</SelectItem>
                <SelectItem value="2AK">2AK - Category 2A (Kannada Medium)</SelectItem>
                <SelectItem value="2AR">2AR - Category 2A (Rural)</SelectItem>
                <SelectItem value="2BG">2BG - Category 2B (General)</SelectItem>
                <SelectItem value="2BR">2BR - Category 2B (Rural)</SelectItem>
                <SelectItem value="3AG">3AG - Category 3A (General)</SelectItem>
                <SelectItem value="3AR">3AR - Category 3A (Rural)</SelectItem>
                <SelectItem value="3BG">3BG - Category 3B (General)</SelectItem>
                <SelectItem value="3BK">3BK - Category 3B (Kannada Medium)</SelectItem>
                <SelectItem value="3BR">3BR - Category 3B (Rural)</SelectItem>
                <SelectItem value="SCK">SCK - Scheduled Caste (Kannada Medium)</SelectItem>
                <SelectItem value="SCR">SCR - Scheduled Caste (Rural)</SelectItem>
                <SelectItem value="STK">STK - Scheduled Tribe (Kannada Medium)</SelectItem>
                <SelectItem value="STR">STR - Scheduled Tribe (Rural)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="stream" className="text-sm font-medium mb-3 block text-foreground">
              Stream
            </Label>
            <Select value={stream} onValueChange={setStream}>
              <SelectTrigger className="premium-select h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Architecture">Architecture</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-6">
          <Button 
            type="submit" 
            size="lg"
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold start-planning-glow h-14 text-lg"
          >
            🚀 Start Planning Your Options
          </Button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-amber-950/20 border border-amber-500/30 rounded-lg">
        <h4 className="font-semibold text-amber-300 mb-2">💡 Quick Tips:</h4>
        <ul className="text-amber-200 space-y-1 text-sm">
          <li>• Your rank determines which colleges you can realistically target</li>
          <li>• Category reservation applies to government and aided colleges</li>
          <li>• Lower ranks have better chances at premium institutions</li>
        </ul>
      </div>
    </Card>
  );
};

export default RankInput;
