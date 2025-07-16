import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { colleges } from "@/data/colleges";

interface CutoffEntry {
  institute: string;
  institute_code: string;
  course: string;
  category: string;
  cutoff_rank: number;
  year: string;
  round: string;
}

const getUnique = (arr: string[]) => Array.from(new Set(arr)).sort();

const courseMap: Record<string, string> = {
  "AD": "Artificial Intelligence And Data Science",
  "AE": "Aeronautical Engineering",
  "AI": "Artificial Intelligence and Machine Learning",
  "AM": "B.Tech in Computer Science & Engg (AI & ML)",
  "AR": "Architecture",
  "AT": "Automotive Engineering",
  "AU": "Automobile Engineering",
  "BA": "B.Tech (Agri. Engg)",
  "BB": "B.Tech in Electronics & Communication Engineering",
  "BC": "BTech Computer Technology",
  "BD": "Computer Science Engineering - Big Data",
  "BE": "Bio-Electronics Engineering",
  "BF": "B.Tech (Hons) Computer Science and Engg (Data Science)",
  "BG": "B.Tech in Artificial Intelligence and Data Science",
  "BH": "B.Tech in Artificial Intelligence and ML",
  "BI": "Information Technology and Engineering",
  "BJ": "B.Tech in Electrical & Electronics Engineering",
  "BK": "B.Tech in Energy Engineering",
  "BL": "B.Tech in Aerospace Engineering",
  "BM": "Bio Medical Engineering",
  "BN": "B.Tech in Computer Science and Tech (Big Data)",
  "BO": "B.Tech in Bio-Technology",
  "BP": "B.Tech in Civil Engineering",
  "BQ": "B.Tech in Computer Science and Technology",
  "BR": "Biomedical and Robotic Engineering",
  "BS": "Bachelor of Science (Honours)",
  "BT": "Bio Technology",
  "BU": "B.Tech in Computer Science and Info Tech",
  "BV": "B.Tech in Computer Engineering",
  "BW": "B.Tech in Computer Science and Engineering",
  "BX": "B.Tech in Computer Science and Engg (Cyber Security)",
  "BY": "B.Tech in Computer Science and Technology (DevOps)",
  "BZ": "B.Tech in Computer Science and Engg (Data Science)",
  "CA": "Computer Science Engineering - AI, Machine Learning",
  "CB": "Computer Science and Business Systems",
  "CC": "Computer and Communication Engineering",
  "CD": "Computer Science and Design",
  "CE": "Civil Engineering",
  "CF": "Computer Science Engineering - Artificial Intelligence",
  "CG": "Computer Science and Technology",
  "CH": "Chemical Engineering",
  "CI": "Computer Science and Information Technology",
  "CK": "Civil Engineering (Kannada Medium)",
  "CL": "B.Tech in Electronics & Computer Engineering",
  "CM": "Electronics Engineering (VLSI Design & Tech)",
  "CN": "B.Tech in Computer Science and Engg (IoT and Blockchain)",
  "CO": "Computer Engineering",
  "CP": "Civil Engineering and Planning",
  "CQ": "B.Tech in Computer Science and Engineering (IoT)",
  "CR": "Ceramics and Cement Technology",
  "CS": "Computer Science and Engineering",
  "CT": "Construction Technology and Management",
  "CU": "B.Tech in Information Science Engineering",
  "CV": "Civil Environmental Engineering",
  "CW": "B.Tech in Information Technology",
  "CX": "B.Tech in Information Science & Technology",
  "CY": "Computer Science Engineering - Cyber Security",
  "CZ": "B.Tech in Computer Science and Engg (Blockchain)",
  "DA": "B.Tech in Mathematics and Computing",
  "DB": "B.Tech in Mechanical Engineering",
  "DC": "Data Sciences",
  "DD": "B.Tech in Mechatronics Engineering",
  "DE": "B.Tech in Petroleum Engineering",
  "DF": "B.Tech in Robotics and Automation",
  "DG": "Design",
  "DH": "B.Tech in Robotics and Artificial Intelligence",
  "DI": "B.Tech in Robotic Engineering",
  "DJ": "B.Tech in Robotics",
  "DK": "B.Tech in Computer Science and System Engg",
  "DL": "B.Tech in Computer Science",
  "DM": "Computer Science and Engineering (Networks)",
  "DN": "B.Tech in VLSI",
  "DS": "Computer Science Engineering - Data Sciences",
  "EA": "Agriculture Engineering",
  "EB": "Electronics and Communication (Adv Comm Tech)",
  "EC": "Electronics and Communication Engineering",
  "EE": "Electrical and Electronics Engineering",
  "EG": "Energy Engineering",
  "EI": "Electronics and Instrumentation Engineering",
  "EL": "Electronics and Instrumentation Technology",
  "EN": "Environmental Engineering",
  "EP": "BTech Technology and Entrepreneurship",
  "ER": "Electrical and Computer Engineering",
  "ES": "Electronics and Computer Engineering",
  "ET": "Electronics and Telecommunication Engineering",
  "EV": "Electronics Engineering (VLSI Design Technology)",
  "EZ": "Electronics and Computer Science",
  "IB": "Computer Science Engg - IoT including Blockchain",
  "IC": "CS - IoT, Cyber Security (Blockchain)",
  "IE": "Information Science and Engineering",
  "IG": "Information Technology",
  "II": "Electronics and Comm - Industrial Integrated",
  "IM": "Industrial Engineering and Management",
  "IO": "Computer Science Engineering - Internet of Things",
  "IP": "Industrial and Production Engineering",
  "IS": "Information Science and Technology",
  "IT": "Instrumentation Technology",
  "IY": "CS - Information Technology - Cyber Security",
  "IZ": "Information Science",
  "LA": "B.Plan",
  "LC": "Computer Science Engineering - Blockchain",
  "LD": "B.Tech in Computer Science (Data Science)",
  "LE": "B.Tech in Computer Science (AIML)",
  "LF": "B.Tech in Computer Science (Cloud Computing)",
  "LG": "B.Tech in Computer Science (Cyber Security)",
  "LH": "B.Tech in Computer Science (Information Security)",
  "LJ": "B.Tech in CSE (Business Systems)",
  "LK": "B.Tech in Computer Science (IoT)",
  "MC": "Mathematics and Computing",
  "MD": "Medical Electronics",
  "ME": "Mechanical Engineering",
  "MI": "Mining Engineering",
  "MK": "Mechanical Engineering (Kannada Medium)",
  "MM": "Mechanical and Smart Manufacturing",
  "MR": "Marine Engineering",
  "MS": "Manufacturing Science and Engineering",
  "MT": "Mechatronics",
  "NT": "Nano Technology",
  "OP": "Computer Science Engineering - DevOps",
  "OT": "Industrial IoT",
  "PE": "Petrochemical Engineering",
  "PL": "Petroleum Engineering",
  "PM": "Precision Manufacturing",
  "PT": "Polymer Science and Technology",
  "RA": "Robotics and Automation",
  "RB": "Robotics",
  "RI": "Robotics and Artificial Intelligence",
  "RM": "CS - Robotic Engineering - AI and ML",
  "RO": "Automation and Robotics Engineering",
  "SA": "Smart Agritech",
  "SE": "Aerospace Engineering",
  "SS": "Computer Science and System Engineering",
  "ST": "Silk Technology",
  "TC": "Telecommunication Engineering",
  "TE": "Tool Engineering",
  "TI": "Industrial IoT",
  "TX": "Textile Technology",
  "UP": "Planning",
  "UR": "Planning",
  "YA": "B.Tech in Computer Science and Engg (Robotics)",
  "YB": "B.Tech in Computer Science and Engg (Data Analytics)",
  "YC": "B.Tech in Embedded System and VLSI",
  "YD": "B.Tech in Computer Science and Artificial Intelligence",
  "YE": "B.Tech in Civil Construction and Sustainability Engg",
  "YF": "B.Tech in Electrical Engg and Computer Science",
  "YG": "B.Tech in Electronics Engg (VLSI and Embedded)",
  "YH": "Engineering Design",
  "YI": "B.Tech in Mechanical and Aerospace Engg",
  "ZA": "B.Tech in Aeronautical Engineering",
  "ZC": "Computer Science",
  "ZH": "B.Tech in CSE (AI & Data Science)",
  "ZL": "Civil Engineering with Computer Application",
  "ZM": "B.Tech in Computer Science and Design",
  "ZN": "B.Tech in Pharmaceutical Engineering",
  "ZO": "B.Tech in Computer Science and Business Systems",
  "ZQ": "B.Tech in IT Data Analytics",
  "ZR": "Computer Science and Engineering (AI)",
  "ZT": "B.Tech in Mechanical and Smart Manufacturing",
  "ZU": "Cyber Security",
  "ZV": "B.Tech in IT (Augmented Reality)",
  "ZW": "Computer Science and Engineering (AIML)",
};

const premiumInputClass = "border-2 border-amber-400 focus:border-amber-500 bg-card text-foreground rounded-lg px-3 py-2 text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300";

const CutoffExplorer: React.FC<{ userRank: number | null; userCategory: string }> = ({ userRank, userCategory }) => {
  const [cutoffs, setCutoffs] = useState<CutoffEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<string>("");
  const [showAllColleges, setShowAllColleges] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);

  // Extract unique filter options
  const allCities = getUnique(colleges.map(c => c.location));
  const allCourses = Object.keys(courseMap);
  const allCategories = getUnique(cutoffs.map(c => c.category));
  const allYears = getUnique(cutoffs.map(c => c.year));

  // For each year, get only the rounds that exist in the data
  const roundsByYear: Record<string, string[]> = {};
  allYears.forEach(year => {
    roundsByYear[year] = getUnique(cutoffs.filter(c => c.year === year).map(c => c.round));
  });

  // Load cutoffs.json
  useEffect(() => {
    setLoading(true);
    fetch("/data/cutoffs.json")
      .then(res => res.json())
      .then(data => {
        setCutoffs(data.cutoffs || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Set defaults when data loads
  useEffect(() => {
    if (!loading && cutoffs.length > 0) {
      setCity(city || allCities[0] || "");
      setCategory(category || userCategory || allCategories[0] || "");
      if (selectedCourses.length === 0) {
        setSelectedCourses(allCourses.slice(0, 5));
      }
    }
    // eslint-disable-next-line
  }, [loading]);

  // Always show all colleges
  const collegesToShow = colleges;
  const collegeCodesToShow = collegesToShow.map(c => c.code);

  // Filter cutoffs by selected colleges, courses, category
  const filtered = cutoffs.filter(c =>
    collegeCodesToShow.includes(c.institute_code) &&
    (selectedCourses.length === 0 || selectedCourses.includes(c.course)) &&
    (category === "" || c.category === category)
  );

  // Group by college, then by branch (course)
  const grouped = collegesToShow.map(col => {
    const branches = selectedCourses;
    return {
      college: col.name + " (" + col.code + ")",
      branches: branches.map(branch => {
        // For each year, for each round, find the cutoff
        const cutoffsByYearRound = allYears.flatMap(year =>
          (roundsByYear[year] || []).map(round => {
            const entry = filtered.find(f => f.institute_code === col.code && f.course === branch && f.year === year && f.round === round);
            return entry ? entry.cutoff_rank : null;
          })
        );
        return {
          branch,
          cutoffsByYearRound
        };
      })
    };
  });

  // For table header: get all year/round pairs in order
  const yearRoundPairs = allYears.flatMap(year => (roundsByYear[year] || []).map(round => ({ year, round })));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4 mb-4 flex flex-wrap gap-4 items-center bg-gradient-to-r from-purple-900/80 to-purple-700/80 border-purple-400">
        <div>
          <label htmlFor="city-select" className="block text-xs font-semibold mb-1 text-purple-200">City</label>
          <select id="city-select" name="city-select" className={premiumInputClass} value={city} onChange={e => setCity(e.target.value)} disabled={showAllColleges}>
            {allCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="show-colleges-select" className="block text-xs font-semibold mb-1 text-purple-200">Show Colleges</label>
          <select id="show-colleges-select" name="show-colleges-select" className={premiumInputClass} value={showAllColleges ? "all" : "city"} onChange={e => setShowAllColleges(e.target.value === "all")}> 
            <option value="city">Colleges in City</option>
            <option value="all">All Colleges (E001–E309)</option>
          </select>
        </div>
        <div className="min-w-[260px]">
          <label htmlFor="courses-select" className="block text-xs font-semibold mb-1 text-purple-200">Courses (Select up to 5)</label>
          <select
            id="courses-select"
            name="courses-select"
            className={premiumInputClass + " h-32 bg-purple-950 text-purple-100 border-purple-400 focus:border-purple-300 focus:ring-purple-400"}
            multiple
            value={selectedCourses}
            onChange={e => {
              const options = Array.from(e.target.selectedOptions).map(o => o.value);
              if (options.length <= 5) setSelectedCourses(options);
            }}
            style={isMobile ? {
              width: '100%',
              fontSize: 18,
              padding: '14px',
              borderRadius: 16,
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)',
              background: '#2e1065',
              maxHeight: '60vh',
              color: '#f3e8ff',
            } : {}}
          >
            {allCourses.map(code => (
              <option key={code} value={code} className="bg-purple-900 text-purple-100">
                {code} – {courseMap[code] || code}
              </option>
            ))}
          </select>
          <div className="text-xs text-purple-300 mt-1">Hold Ctrl/Cmd to select multiple. Max 5.</div>
        </div>
        <div>
          <label htmlFor="category-select" className="block text-xs font-semibold mb-1 text-purple-200">Category</label>
          <select
            id="category-select"
            name="category-select"
            className={premiumInputClass}
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={isMobile ? {
              width: '100%',
              fontSize: 18,
              padding: '14px',
              borderRadius: 16,
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)',
              background: '#fff',
              maxHeight: '60vh',
            } : {}}
          >
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-purple-200">Your Rank</label>
          <Badge className="text-base px-3 py-1 bg-yellow-100 text-yellow-800 border border-amber-300 shadow-sm">{userRank ? userRank.toLocaleString() : "-"}</Badge>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-4 bg-gradient-to-br from-[#2d1e4d] to-[#1a1333] border-purple-400">
        <div className="mb-2 font-semibold text-lg gradient-text text-purple-200">College Cutoff Rankings</div>
        <div className="mb-2 text-sm text-purple-300">
          {loading ? "Loading..." : `Showing ${grouped.length} colleges for selected filters`}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm premium-table">
            <thead>
              <tr className="bg-gradient-to-r from-purple-900/80 to-purple-700/80">
                <th className="px-3 py-2 border-b text-left font-bold text-purple-200">College</th>
                <th className="px-3 py-2 border-b text-left font-bold text-purple-200">Course Code</th>
                {allYears.map(year => (
                  <th key={year} colSpan={roundsByYear[year]?.length || 0} className="px-3 py-2 border-b text-center font-bold text-purple-300 bg-purple-900/60">{year}</th>
                ))}
              </tr>
              <tr className="bg-gradient-to-r from-purple-900/80 to-purple-700/80">
                <th></th>
                <th></th>
                {yearRoundPairs.map(({ year, round }) => (
                  <th key={year + round} className="px-2 py-1 border-b text-center font-semibold text-purple-100">{round}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grouped.length === 0 && !loading && (
                <tr><td colSpan={2 + yearRoundPairs.length} className="text-center py-6 text-purple-400">No data for selected filters.</td></tr>
              )}
              {grouped.map(college => (
                college.branches.map((b, i) => (
                  <tr key={college.college + b.branch} className={i === 0 ? "border-t-2" : ""}>
                    {i === 0 && (
                      <td rowSpan={college.branches.length} className="px-3 py-2 border-b align-top font-medium w-64 text-purple-100 bg-transparent">
                        <span className="inline-block mt-1">{college.college}</span>
                      </td>
                    )}
                    <td className="px-3 py-2 border-b w-32 text-purple-100 bg-transparent font-bold">{b.branch}</td>
                    {b.cutoffsByYearRound.map((cutoff, idx) => (
                      <td key={idx} className="px-2 py-2 border-b text-center bg-transparent text-purple-200 font-semibold">
                        {cutoff !== null ? cutoff : "-"}
                      </td>
                    ))}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CutoffExplorer; 