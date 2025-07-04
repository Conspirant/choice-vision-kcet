import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle, Upload, Info } from "lucide-react";

interface AnalyticsProps {
  userRank: number | null;
  userCategory: string;
  selectedOptions: Array<{
    collegeCode: string;
    branchCode: string;
    collegeName: string;
    branchName: string;
  }>;
}

const Analytics = ({ userRank, userCategory, selectedOptions }: AnalyticsProps) => {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cutoffData, setCutoffData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedRound, setSelectedRound] = useState<string>("");
  // Tab state
  const [activeTab, setActiveTab] = useState<'analytics' | 'recommendations' | 'community'>('analytics');
  // Recommendations tab state
  const [recYear, setRecYear] = useState<string>("");
  const [recRound, setRecRound] = useState<string>("");
  const [recCourse, setRecCourse] = useState<string>("");
  const [recCategory, setRecCategory] = useState<string>("");

  // Fetch cutoffs.json on mount
  useEffect(() => {
    setFetching(true);
    fetch("/data/cutoffs.json")
      .then(res => res.json())
      .then(data => {
        setCutoffData(data);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, []);

  // Extract all years and rounds
  const allYears = useMemo(() => cutoffData ? Array.from(new Set(cutoffData.cutoffs.map((c: any) => c.year))).sort().reverse() : [], [cutoffData]);
  // Only show rounds available for the selected year
  const roundsForSelectedYear = useMemo(() => {
    if (!cutoffData || !selectedYear) return [];
    return Array.from(new Set(cutoffData.cutoffs.filter((c: any) => c.year === selectedYear).map((c: any) => c.round))).sort().reverse();
  }, [cutoffData, selectedYear]);

  // For Recommendations tab
  const recAllYears = useMemo(() => cutoffData ? Array.from(new Set(cutoffData.cutoffs.map((c: any) => c.year))).sort().reverse() : [], [cutoffData]);
  const recRoundsForYear = useMemo(() => {
    if (!cutoffData || !recYear) return [];
    return Array.from(new Set(cutoffData.cutoffs.filter((c: any) => c.year === recYear).map((c: any) => c.round))).sort().reverse();
  }, [cutoffData, recYear]);
  const recCoursesForYearRound = useMemo(() => {
    if (!cutoffData || !recYear || !recRound) return [];
    return Array.from(new Set(cutoffData.cutoffs.filter((c: any) => c.year === recYear && c.round === recRound).map((c: any) => c.course))).sort();
  }, [cutoffData, recYear, recRound]);
  const recCategoriesForYearRoundCourse = useMemo(() => {
    if (!cutoffData || !recYear || !recRound || !recCourse) return [];
    return Array.from(new Set(cutoffData.cutoffs.filter((c: any) => c.year === recYear && c.round === recRound && c.course === recCourse).map((c: any) => c.category))).sort();
  }, [cutoffData, recYear, recRound, recCourse]);

  // Set default year/round after data loads or when year changes
  useEffect(() => {
    if (allYears.length && !selectedYear) setSelectedYear(allYears[0] as string);
  }, [allYears]);
  useEffect(() => {
    if (roundsForSelectedYear.length && !selectedRound) setSelectedRound(roundsForSelectedYear[0] as string);
    else if (!roundsForSelectedYear.length) setSelectedRound("");
    else if (selectedRound && !roundsForSelectedYear.includes(selectedRound)) setSelectedRound(roundsForSelectedYear[0] as string);
  }, [roundsForSelectedYear]);

  // Recommendations tab: set default year/round/category
  useEffect(() => {
    if (recAllYears.length && !recYear) setRecYear(recAllYears[0] as string);
  }, [recAllYears]);
  useEffect(() => {
    if (recRoundsForYear.length && !recRound) setRecRound(recRoundsForYear[0] as string);
    else if (!recRoundsForYear.length) setRecRound("");
    else if (recRound && !recRoundsForYear.includes(recRound)) setRecRound(recRoundsForYear[0] as string);
  }, [recRoundsForYear]);
  useEffect(() => {
    if (recCoursesForYearRound.length && !recCourse) setRecCourse(recCoursesForYearRound[0] as string);
    else if (!recCoursesForYearRound.length) setRecCourse("");
    else if (recCourse && !recCoursesForYearRound.includes(recCourse)) setRecCourse(recCoursesForYearRound[0] as string);
  }, [recCoursesForYearRound]);
  useEffect(() => {
    // Default to user's category if available, else first available
    if (recCategoriesForYearRoundCourse.length) {
      if (!recCategory || !recCategoriesForYearRoundCourse.includes(recCategory)) {
        if (recCategoriesForYearRoundCourse.includes(userCategory)) setRecCategory(userCategory);
        else setRecCategory(recCategoriesForYearRoundCourse[0] as string);
      }
    } else {
      setRecCategory("");
    }
    // eslint-disable-next-line
  }, [recCategoriesForYearRoundCourse, userCategory]);

  // Recommendation logic: show all possible colleges for the selected course, year, round, and category
  const recommendedColleges = useMemo(() => {
    if (!cutoffData || !recYear || !recRound || !recCourse || !recCategory || !userRank) return [];
    // Group by institute_code, course
    const groups: Record<string, any> = {};
    for (const c of cutoffData.cutoffs) {
      if (
        c.year === recYear &&
        c.round === recRound &&
        c.course === recCourse &&
        c.category === recCategory &&
        c.cutoff_rank >= userRank - 5000 &&
        c.cutoff_rank <= 200000
      ) {
        const key = `${c.institute_code}|${c.course}`;
        if (!groups[key] || c.cutoff_rank < groups[key].cutoff_rank) {
          groups[key] = c;
        }
      }
    }
    return Object.values(groups).map((rec: any) => ({
      ...rec,
      qualifies: userRank && rec.category.toUpperCase() === userCategory.toUpperCase() && userRank <= rec.cutoff_rank
    })).sort((a: any, b: any) => a.cutoff_rank - b.cutoff_rank);
  }, [cutoffData, userRank, userCategory, recYear, recRound, recCourse, recCategory]);

  // Enhanced matching logic with multiple fallback strategies
  const findBestMatch = (option: any, year: string, round: string) => {
    if (!cutoffData) return null;
    
    // Strategy 1: Exact match for selected year/round with user's category
    let bestEntry = cutoffData.cutoffs.find((c: any) => 
      c.institute_code === option.collegeCode &&
      c.course.toUpperCase() === option.branchCode.toUpperCase() &&
      c.category.toUpperCase() === userCategory.toUpperCase() &&
      c.year === year &&
      c.round === round
    );
    
    if (bestEntry) return bestEntry;
    
    // Strategy 2: Exact match for selected year/round with any category
    bestEntry = cutoffData.cutoffs.find((c: any) => 
      c.institute_code === option.collegeCode &&
      c.course.toUpperCase() === option.branchCode.toUpperCase() &&
      c.year === year &&
      c.round === round
    );
    
    if (bestEntry) return bestEntry;
    
    // Strategy 3: Same college, any course, user's category, selected year/round
    bestEntry = cutoffData.cutoffs.find((c: any) => 
      c.institute_code === option.collegeCode &&
      c.category.toUpperCase() === userCategory.toUpperCase() &&
      c.year === year &&
      c.round === round
    );
    
    if (bestEntry) return bestEntry;
    
    // Strategy 4: Same college, any course, any category, selected year/round
    bestEntry = cutoffData.cutoffs.find((c: any) => 
      c.institute_code === option.collegeCode &&
      c.year === year &&
      c.round === round
    );
    
    if (bestEntry) return bestEntry;
    
    // Strategy 5: Same college, same course, user's category, any year/round
    bestEntry = cutoffData.cutoffs.find((c: any) => 
      c.institute_code === option.collegeCode &&
      c.course.toUpperCase() === option.branchCode.toUpperCase() &&
      c.category.toUpperCase() === userCategory.toUpperCase()
    );
    
    if (bestEntry) return bestEntry;
    
    // Strategy 6: Same college, same course, any category, any year/round
    bestEntry = cutoffData.cutoffs.find((c: any) => 
      c.institute_code === option.collegeCode &&
      c.course.toUpperCase() === option.branchCode.toUpperCase()
    );
    
    return bestEntry;
  };

  // Improved matching logic for selected options, show year/round for each, filtered by selected year/round
  const analyzeOptions = () => {
    if (!userRank || !cutoffData || !selectedYear || !selectedRound) return;
    setLoading(true);
    setTimeout(() => {
      const analysis = selectedOptions.map(option => {
        const bestEntry = findBestMatch(option, selectedYear, selectedRound);
        
        let status = "Unknown";
        let probability = 0;
        let cutoffRank = bestEntry ? bestEntry.cutoff_rank : "No data";
        let cutoffYear = bestEntry ? bestEntry.year : "-";
        let cutoffRound = bestEntry ? bestEntry.round : "-";
        let matchType = "No match";
        
        if (bestEntry) {
          // Determine match type
          if (bestEntry.institute_code === option.collegeCode && 
              bestEntry.course.toUpperCase() === option.branchCode.toUpperCase() &&
              bestEntry.category.toUpperCase() === userCategory.toUpperCase() &&
              bestEntry.year === selectedYear && bestEntry.round === selectedRound) {
            matchType = "Exact match";
          } else if (bestEntry.institute_code === option.collegeCode && 
                     bestEntry.course.toUpperCase() === option.branchCode.toUpperCase() &&
                     bestEntry.year === selectedYear && bestEntry.round === selectedRound) {
            matchType = "Course match (different category)";
          } else if (bestEntry.institute_code === option.collegeCode &&
                     bestEntry.year === selectedYear && bestEntry.round === selectedRound) {
            matchType = "College match (different course)";
          } else if (bestEntry.institute_code === option.collegeCode &&
                     bestEntry.course.toUpperCase() === option.branchCode.toUpperCase()) {
            matchType = "Historical data (different year/round)";
          } else {
            matchType = "College only match";
          }
          
          if (userRank <= bestEntry.cutoff_rank) {
            status = "High Chance";
            probability = Math.min(95, 85 + Math.random() * 10);
          } else if (userRank <= bestEntry.cutoff_rank * 1.2) {
            status = "Moderate Chance";
            probability = Math.min(75, 45 + Math.random() * 30);
          } else {
            status = "Low Chance";
            probability = Math.min(30, Math.random() * 30);
          }
        }
        
        return {
          college: option.collegeName,
          branch: option.branchName,
          combination: `${option.collegeCode}${option.branchCode}`,
          status,
          probability,
          cutoffRank,
          cutoffYear,
          cutoffRound,
          matchType
        };
      });
      setAnalysisData(analysis);
      setLoading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "High Chance": return "#10B981";
      case "Moderate Chance": return "#F59E0B";
      case "Low Chance": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const statusDistribution = analysisData?.reduce((acc: any, item: any) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const chartData = analysisData?.map((item: any, index: number) => ({
    name: `${item.combination}`,
    probability: item.probability,
    fill: getStatusColor(item.status)
  })) || [];

  const pieData = Object.entries(statusDistribution).map(([status, count]) => ({
    name: status,
    value: count,
    fill: getStatusColor(status)
  }));

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-t-lg font-bold ${activeTab === 'analytics' ? 'bg-purple-900 text-yellow-300 border-b-4 border-yellow-400' : 'bg-purple-950 text-purple-300'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-bold ${activeTab === 'recommendations' ? 'bg-purple-900 text-yellow-300 border-b-4 border-yellow-400' : 'bg-purple-950 text-purple-300'}`}
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-bold ${activeTab === 'community' ? 'bg-blue-900 text-cyan-200 border-b-4 border-cyan-400' : 'bg-blue-950 text-cyan-300'}`}
          onClick={() => setActiveTab('community')}
        >
          Community Resources
        </button>
      </div>
      
      {/* BETA BANNER */}
      <Card className="p-4 mb-4 bg-gradient-to-r from-yellow-900/80 to-purple-900/80 border-4 border-yellow-400 text-center">
        <span className="text-2xl font-bold text-yellow-300">⚠️ Analytics & Recommendations are Beta Features and Under Maintenance ⚠️<br/>Do not make sole decisions from these two features. Cross-check with official sources before proceeding. We are not responsible for any consequences.</span>
      </Card>

      {activeTab === 'analytics' && (
        <>
          {/* Header */}
          <Card className="p-6 glass-card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold gradient-text mb-2">Admission Analytics</h3>
                <p className="text-muted-foreground">
                  Real-time analysis based on your rank ({userRank?.toLocaleString()}) and selected options
                </p>
                <div className="flex gap-4 mt-2">
                  <div>
                    <label className="text-xs text-amber-300 font-bold">Year:</label>
                    <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="ml-2 rounded bg-purple-950 text-yellow-300 px-2 py-1">
                      {allYears.map((year: string) => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-amber-300 font-bold">Round:</label>
                    <select value={selectedRound} onChange={e => setSelectedRound(e.target.value)} className="ml-2 rounded bg-purple-950 text-yellow-300 px-2 py-1">
                      {roundsForSelectedYear.map((round: string) => <option key={round} value={round}>{round}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <Button 
                onClick={analyzeOptions}
                disabled={!userRank || selectedOptions.length === 0 || loading || !cutoffData}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 glow-button"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {loading ? "Analyzing..." : "Analyze Options"}
              </Button>
            </div>
          </Card>

          {/* Data Source Info */}
          {cutoffData && !fetching && (
            <Card className="p-4 glass-card border-green-500/50">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-300">Real Cutoff Data Loaded</p>
                  <p className="text-xs text-muted-foreground">
                    Using {cutoffData.metadata?.total_entries?.toLocaleString() || 'real'} cutoff entries from {cutoffData.metadata?.total_files_processed || 'multiple'} sources.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Data Source Warning */}
          {(!cutoffData || fetching) && (
            <Card className="p-4 glass-card border-amber-500/50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-amber-300">Loading Data</p>
                  <p className="text-xs text-muted-foreground">
                    Loading cutoff data. Please wait...
                  </p>
                </div>
              </div>
            </Card>
          )}

          {fetching ? (
            <Card className="p-6 glass-card text-center">
              <div className="text-lg text-muted-foreground">Loading cutoff data...</div>
            </Card>
          ) : analysisData && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <Card className="p-3 sm:p-4 glass-card">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-green-400" />
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-green-400">
                        {analysisData.filter((item: any) => item.status === "High Chance").length}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">High Chance Options</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4 glass-card">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-amber-400" />
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-amber-400">
                        {analysisData.filter((item: any) => item.status === "Moderate Chance").length}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Moderate Chance</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4 glass-card">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-red-400" />
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-red-400">
                        {analysisData.filter((item: any) => item.status === "Low Chance").length}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Low Chance Options</div>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
                <Card className="p-3 sm:p-6 glass-card">
                  <h4 className="text-base sm:text-lg font-semibold gradient-text mb-4">Admission Probability by Option</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" tick={{ fill: '#D1D5DB', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#D1D5DB' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(75, 0, 130, 0.9)', 
                          border: '1px solid #F59E0B',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="probability" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
                <Card className="p-3 sm:p-6 glass-card">
                  <h4 className="text-base sm:text-lg font-semibold gradient-text mb-4">Status Distribution</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              
              {/* Detailed Results */}
              <Card className="p-2 sm:p-6 glass-card">
                <h4 className="text-base sm:text-lg font-semibold gradient-text mb-4">Detailed Analysis</h4>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-amber-400/30">
                        <th className="text-left py-2 px-2 sm:px-4 text-muted-foreground">College-Course</th>
                        <th className="text-left py-2 px-2 sm:px-4 text-muted-foreground">Status</th>
                        <th className="text-left py-2 px-2 sm:px-4 text-muted-foreground">Probability</th>
                        <th className="text-left py-2 px-2 sm:px-4 text-muted-foreground">Cutoff Rank</th>
                        <th className="text-left py-2 px-2 sm:px-4 text-muted-foreground">Year</th>
                        <th className="text-left py-2 px-2 sm:px-4 text-muted-foreground">Round</th>
                        <th className="text-left py-2 px-2 sm:px-4 text-muted-foreground">Match Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisData.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-purple-800/30">
                          <td className="py-2 px-2 sm:px-4 font-mono text-amber-300">{item.combination}</td>
                          <td className="py-2 px-2 sm:px-4">
                            <span className="font-semibold" style={{ color: getStatusColor(item.status) }}>{item.status}</span>
                          </td>
                          <td className="py-2 px-2 sm:px-4">{item.probability}%</td>
                          <td className="py-2 px-2 sm:px-4">{item.cutoffRank}</td>
                          <td className="py-2 px-2 sm:px-4">{item.cutoffYear}</td>
                          <td className="py-2 px-2 sm:px-4">{item.cutoffRound}</td>
                          <td className="py-2 px-2 sm:px-4">{item.matchType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}

          {!userRank && (
            <Card className="p-8 glass-card text-center">
              <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold gradient-text mb-2">Enter Your Rank First</h4>
              <p className="text-muted-foreground">
                Please enter your KCET rank to get personalized admission analytics.
              </p>
            </Card>
          )}

          {userRank && selectedOptions.length === 0 && (
            <Card className="p-8 glass-card text-center">
              <Info className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold gradient-text mb-2">No Options Added</h4>
              <p className="text-muted-foreground">
                Please add some college options in the Option Entry tab to analyze them.
              </p>
            </Card>
          )}

          {userRank && selectedOptions.length > 0 && !analysisData && !loading && (
            <Card className="p-8 glass-card text-center">
              <TrendingUp className="h-12 w-12 text-amber-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold gradient-text mb-2">Ready to Analyze!</h4>
              <p className="text-muted-foreground mb-4">
                You have {selectedOptions.length} option{selectedOptions.length > 1 ? 's' : ''} ready for analysis.
              </p>
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-4 text-left max-w-2xl mx-auto">
                <h5 className="font-semibold text-amber-300 mb-2">💡 How to use Analytics:</h5>
                <ol className="text-sm text-amber-200 space-y-1">
                  <li>1. Select the year and round you want to analyze (defaults to latest available)</li>
                  <li>2. Click "Analyze Options" to get admission probability predictions</li>
                  <li>3. View charts showing your chances and detailed breakdown</li>
                  <li>4. Check the "Match Type" column to see how data was matched</li>
                  <li>5. Use the Recommendations tab to discover new options</li>
                </ol>
              </div>
            </Card>
          )}
        </>
      )}
      
      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <>
          <Card className="p-6 glass-card">
            <h3 className="text-2xl font-bold gradient-text mb-4">Recommended Colleges Based on Your Rank</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <label className="text-xs text-amber-300 font-bold">Year:</label>
                <select value={recYear} onChange={e => setRecYear(e.target.value)} className="ml-2 rounded bg-purple-950 text-yellow-300 px-2 py-1">
                  {recAllYears.map((year: string) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-amber-300 font-bold">Round:</label>
                <select value={recRound} onChange={e => setRecRound(e.target.value)} className="ml-2 rounded bg-purple-950 text-yellow-300 px-2 py-1">
                  {recRoundsForYear.map((round: string) => <option key={round} value={round}>{round}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-amber-300 font-bold">Course:</label>
                <select value={recCourse} onChange={e => setRecCourse(e.target.value)} className="ml-2 rounded bg-purple-950 text-yellow-300 px-2 py-1">
                  {recCoursesForYearRound.map((course: string) => <option key={course} value={course}>{course}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-amber-300 font-bold">Category:</label>
                <select value={recCategory} onChange={e => setRecCategory(e.target.value)} className="ml-2 rounded bg-purple-950 text-yellow-300 px-2 py-1">
                  {recCategoriesForYearRoundCourse.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <p className="text-xs text-amber-300 mb-2">
              <b>Showing recommendations for course {recCourse}, year {recYear}, round {recRound}, category {recCategory}. Only colleges where cutoff is within 5,000 ranks before your rank up to 200,000 are shown.</b>
            </p>
            {recommendedColleges.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-amber-400/30">
                      <th className="text-left py-2 px-4 text-muted-foreground">Institute</th>
                      <th className="text-left py-2 px-4 text-muted-foreground">Course</th>
                      <th className="text-left py-2 px-4 text-muted-foreground">Category</th>
                      <th className="text-left py-2 px-4 text-muted-foreground">Cutoff Rank</th>
                      <th className="text-left py-2 px-4 text-muted-foreground">Year</th>
                      <th className="text-left py-2 px-4 text-muted-foreground">Round</th>
                      <th className="text-left py-2 px-4 text-muted-foreground">Qualifies?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendedColleges.map((rec: any, idx: number) => (
                      <tr key={idx} className="border-b border-purple-800/30">
                        <td className="py-2 px-4 font-medium text-foreground">{rec.institute}</td>
                        <td className="py-2 px-4 font-mono text-amber-300">{rec.course}</td>
                        <td className="py-2 px-4">{rec.category}</td>
                        <td className="py-2 px-4">{rec.cutoff_rank}</td>
                        <td className="py-2 px-4">{rec.year}</td>
                        <td className="py-2 px-4">{rec.round}</td>
                        <td className="py-2 px-4 font-bold">
                          {rec.qualifies === undefined ? "-" : rec.qualifies ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-lg text-muted-foreground py-8">
                No recommendations found for your selection.
              </div>
            )}
          </Card>
        </>
      )}
      
      {/* Community Resources Tab */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          {/* KCET Community */}
          <Card className="p-8 mb-4 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 border-4 border-cyan-400 text-center shadow-xl">
            <div className="flex flex-col items-center gap-4">
              <span className="text-5xl mb-2">👾</span>
              <h2 className="text-3xl font-bold text-cyan-200 mb-2">KCET Community Resources</h2>
              <p className="text-lg text-cyan-100 mb-4 max-w-2xl">
                Huge thanks to the <span className="font-bold text-orange-300">r/kcet</span> mods and community for their amazing support, guides, and Q&A. If you need more info, real experiences, or want to ask questions, check out these resources:
              </p>
              <div className="flex flex-col gap-4 w-full max-w-xl mx-auto">
                <a
                  href="https://www.reddit.com/r/kcet/comments/1ktkpay/kcet_post_result_guidelines_cutoff_counseling/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold text-lg shadow-md hover:scale-105 transition"
                >
                  📋 KCET Post-Result Guidelines, Cutoff & Counseling (by r/kcet mods)
                </a>
                <a
                  href="https://www.reddit.com/r/kcet/comments/1l5q9u9/a_detailed_guide_on_how_to_choose_a_college/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold text-lg shadow-md hover:scale-105 transition"
                >
                  🏫 A Detailed Guide on How to Choose a College (by r/kcet mods)
                </a>
                <a
                  href="https://www.reddit.com/r/kcet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg shadow-md hover:scale-105 transition"
                >
                  💬 Ask a Question or Get Help on r/kcet (the community is very helpful!)
                </a>
              </div>
              <p className="mt-6 text-cyan-200 text-base">
                <b>Note:</b> These are external resources. Always cross-check official info, but the r/kcet community is a great place for real advice and support!
              </p>
            </div>
          </Card>

          {/* Engineering College Subreddits */}
          <Card className="p-8 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-4 border-purple-400 text-center shadow-xl">
            <div className="flex flex-col items-center gap-4">
              <span className="text-5xl mb-2">🏛️</span>
              <h2 className="text-3xl font-bold text-purple-200 mb-2">KCET & COMEDK College Communities</h2>
              <p className="text-lg text-purple-100 mb-6 max-w-2xl">
                Connect with students and alumni from colleges that participate in KCET and COMEDK counseling. Get real insights about campus life, academics, placements, and more!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
                {/* Real College Communities */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-yellow-300 border-b border-yellow-400 pb-2">Real College Communities</h3>
                  <a href="https://www.reddit.com/r/PESU/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-medium hover:scale-105 transition">🏛️ PES University (r/PESU)</a>
                  <a href="https://www.reddit.com/r/AmritaUniversity/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 text-white font-medium hover:scale-105 transition">🌸 Amrita University (r/AmritaUniversity)</a>
                  <a href="https://www.reddit.com/r/ManipalUniversity/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:scale-105 transition">🌴 Manipal University (r/ManipalUniversity)</a>
                  <a href="https://www.reddit.com/r/VITUniversity/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium hover:scale-105 transition">⚡ VIT University (r/VITUniversity)</a>
                  <a href="https://www.reddit.com/r/ChristUniversity/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-medium hover:scale-105 transition">🏛️ Christ University (r/ChristUniversity)</a>
                </div>

                {/* General Engineering Communities */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-blue-300 border-b border-blue-400 pb-2">General Communities</h3>
                  <a href="https://www.reddit.com/r/EngineeringStudents/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 text-white font-medium hover:scale-105 transition">🎓 Engineering Students (r/EngineeringStudents)</a>
                  <a href="https://www.reddit.com/r/india/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium hover:scale-105 transition">🇮🇳 India Community (r/india)</a>
                  <a href="https://www.reddit.com/r/Indian_Academia/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:scale-105 transition">📚 Indian Academia (r/Indian_Academia)</a>
                  <a href="https://www.reddit.com/r/developersIndia/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-medium hover:scale-105 transition">💻 Developers India (r/developersIndia)</a>
                  <a href="https://www.reddit.com/r/IndianTeenagers/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:scale-105 transition">👥 Indian Teenagers (r/IndianTeenagers)</a>
                </div>

                {/* College Discussion Forums */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-green-300 border-b border-green-400 pb-2">College Discussion Forums</h3>
                  <a href="https://www.reddit.com/r/CollegeAdmissions/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-medium hover:scale-105 transition">🎓 College Admissions (r/CollegeAdmissions)</a>
                  <a href="https://www.reddit.com/r/ApplyingToCollege/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium hover:scale-105 transition">📝 Applying to College (r/ApplyingToCollege)</a>
                  <a href="https://www.reddit.com/r/CollegeMajors/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium hover:scale-105 transition">📚 College Majors (r/CollegeMajors)</a>
                  <a href="https://www.reddit.com/r/CollegeLife/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-medium hover:scale-105 transition">🏠 College Life (r/CollegeLife)</a>
                  <a href="https://www.reddit.com/r/StudentLife/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium hover:scale-105 transition">👨‍🎓 Student Life (r/StudentLife)</a>
                </div>

                {/* Tech & Career Communities */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-orange-300 border-b border-orange-400 pb-2">Tech & Career</h3>
                  <a href="https://www.reddit.com/r/cscareerquestions/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium hover:scale-105 transition">💼 CS Career Questions (r/cscareerquestions)</a>
                  <a href="https://www.reddit.com/r/learnprogramming/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:scale-105 transition">💻 Learn Programming (r/learnprogramming)</a>
                  <a href="https://www.reddit.com/r/techsupport/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 text-white font-medium hover:scale-105 transition">🔧 Tech Support (r/techsupport)</a>
                  <a href="https://www.reddit.com/r/ITCareerQuestions/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:scale-105 transition">💼 IT Career Questions (r/ITCareerQuestions)</a>
                  <a href="https://www.reddit.com/r/Engineering/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 text-white font-medium hover:scale-105 transition">⚙️ Engineering (r/Engineering)</a>
                </div>

                {/* Indian Student Communities */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-cyan-300 border-b border-cyan-400 pb-2">Indian Student Communities</h3>
                  <a href="https://www.reddit.com/r/Indian_Academia/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-medium hover:scale-105 transition">📚 Indian Academia (r/Indian_Academia)</a>
                  <a href="https://www.reddit.com/r/IndianTeenagers/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium hover:scale-105 transition">👥 Indian Teenagers (r/IndianTeenagers)</a>
                  <a href="https://www.reddit.com/r/IndianStudents/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium hover:scale-105 transition">🎓 Indian Students (r/IndianStudents)</a>
                  <a href="https://www.reddit.com/r/IndianGradStudents/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:scale-105 transition">🎓 Indian Grad Students (r/IndianGradStudents)</a>
                  <a href="https://www.reddit.com/r/IndianAcademia/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium hover:scale-105 transition">📖 Indian Academia (r/IndianAcademia)</a>
                </div>

                {/* Alternative Resources */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-pink-300 border-b border-pink-400 pb-2">Alternative Resources</h3>
                  <a href="https://www.quora.com/topic/Engineering-Colleges-in-India" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:scale-105 transition">❓ Quora Engineering Colleges</a>
                  <a href="https://www.collegeconfidential.com" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium hover:scale-105 transition">🎓 College Confidential</a>
                  <a href="https://www.studentsforum.in" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-medium hover:scale-105 transition">💬 Students Forum India</a>
                  <a href="https://www.shiksha.com" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:scale-105 transition">📚 Shiksha.com</a>
                  <a href="https://www.careers360.com" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:scale-105 transition">🎯 Careers360</a>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-400/30 rounded-lg max-w-4xl">
                <h4 className="text-lg font-bold text-yellow-300 mb-2">💡 How to Use These Communities:</h4>
                <ul className="text-sm text-yellow-200 space-y-1 text-left">
                  <li>• <strong>Search first:</strong> Use the search bar to find existing discussions about your questions</li>
                  <li>• <strong>Be specific:</strong> Include your rank, category, and specific concerns in your posts</li>
                  <li>• <strong>Follow rules:</strong> Each subreddit has its own rules - read them before posting</li>
                  <li>• <strong>Be respectful:</strong> These are real students and alumni sharing their experiences</li>
                  <li>• <strong>Cross-verify:</strong> Always double-check information with official sources</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Additional Resources */}
          <Card className="p-8 bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border-4 border-emerald-400 text-center shadow-xl">
            <div className="flex flex-col items-center gap-4">
              <span className="text-5xl mb-2">📚</span>
              <h2 className="text-3xl font-bold text-emerald-200 mb-2">Additional Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-emerald-300">Official Resources</h3>
                  <a href="https://cet.karnataka.gov.in" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium hover:scale-105 transition">🏛️ Official KEA Website</a>
                  <a href="https://www.aicte-india.org" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:scale-105 transition">📋 AICTE Official Portal</a>
                  <a href="https://www.nirfindia.org" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:scale-105 transition">🏆 NIRF Rankings</a>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-emerald-300">Student Forums</h3>
                  <a href="https://www.quora.com/topic/Engineering-Colleges-in-India" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:scale-105 transition">❓ Quora Engineering Colleges</a>
                  <a href="https://www.collegeconfidential.com" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium hover:scale-105 transition">🎓 College Confidential</a>
                  <a href="https://www.studentsforum.in" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-medium hover:scale-105 transition">💬 Students Forum India</a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;
