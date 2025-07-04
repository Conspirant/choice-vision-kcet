import React, { useState } from "react";
import { colleges } from "@/data/colleges";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const CollegeReviews = () => {
  const isMobile = useIsMobile();
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [reviewSource, setReviewSource] = useState<'google' | 'shiksha'>('google');
  const [collegeSearch, setCollegeSearch] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const college = colleges.find(c => c.code === selectedCollege);
  const filteredColleges = colleges.filter(col =>
    col.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    col.code.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full royal-gradient flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col w-full items-center justify-start p-0 m-0">
        <div className="w-full max-w-5xl px-2 sm:px-4 pt-4 sm:pt-8 sticky top-0 z-30 bg-white/90 shadow-md border-b border-amber-100" style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}>
          <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-6 gradient-text">College Reviews</h2>
          <div className="relative mb-2 w-full">
            <input
              type="text"
              placeholder="Search by college name or code..."
              value={collegeSearch}
              onChange={e => {
                setCollegeSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="w-full p-4 sm:p-3 border border-amber-400 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 text-lg sm:text-base text-black bg-white text-ellipsis shadow-sm"
              style={{ width: '100%', fontSize: isMobile ? '1.1rem' : '1rem', minHeight: 48, borderRadius: 14 }}
              autoComplete="off"
            />
            {showSuggestions && collegeSearch && filteredColleges.length > 0 && (
              <ul className="absolute z-20 w-full bg-white border border-amber-400 rounded shadow max-h-60 overflow-y-auto scroll-smooth divide-y divide-amber-100">
                {filteredColleges.slice(0, 10).map(col => (
                  <li
                    key={col.code}
                    className="px-4 py-4 sm:py-3 cursor-pointer hover:bg-amber-100 text-black text-ellipsis whitespace-nowrap overflow-hidden text-lg sm:text-base"
                    style={{ fontSize: isMobile ? '1.1rem' : '1rem', minHeight: 48 }}
                    onMouseDown={() => {
                      setSelectedCollege(col.code);
                      setCollegeSearch(`${col.code} - ${col.name}`);
                      setShowSuggestions(false);
                    }}
                  >
                    {col.code} - {col.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <select
              className="border rounded p-4 sm:p-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow w-full text-lg sm:text-base"
              value={selectedCollege}
              onChange={e => setSelectedCollege(e.target.value)}
              style={{ fontSize: isMobile ? '1.1rem' : '1rem', minHeight: 48, borderRadius: 14 }}
            >
              <option value="">Select a college...</option>
              {filteredColleges.map(col => (
                <option key={col.code} value={col.code} className="text-ellipsis whitespace-nowrap overflow-hidden">
                  {col.code} - {col.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {college && (
          <div className="w-full flex-1 flex flex-col items-center justify-start pt-2 sm:pt-6 pb-[90px] sm:pb-0">
            <div className="w-full max-w-5xl px-2 sm:px-4">
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-ellipsis whitespace-nowrap overflow-hidden">{college.name}</h3>
              <p className="mb-2 text-muted-foreground text-sm sm:text-base text-ellipsis whitespace-nowrap overflow-hidden">{college.location}</p>
              <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
                <Button variant={reviewSource === 'google' ? 'default' : 'outline'} onClick={() => setReviewSource('google')} className="w-full sm:w-auto text-lg sm:text-base py-4 sm:py-2">Google Reviews</Button>
                <Button variant={reviewSource === 'shiksha' ? 'default' : 'outline'} onClick={() => setReviewSource('shiksha')} className="w-full sm:w-auto text-lg sm:text-base py-4 sm:py-2">Shiksha Reviews</Button>
              </div>
            </div>
            <div className="w-full flex-1 flex flex-col items-center justify-center px-2 sm:px-0">
              {reviewSource === 'google' ? (
                <div className="w-full flex flex-col items-center justify-center py-8 sm:py-16">
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(college.name + " reviews")}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto px-8 py-6 sm:py-4 text-lg fixed sm:static bottom-0 left-0 right-0 z-40 rounded-none sm:rounded mt-4 shadow-lg sm:shadow-none" style={{ maxWidth: 600, borderRadius: isMobile ? 0 : 8 }}>Open Google Reviews in New Tab</Button>
                  </a>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-8 sm:py-16">
                  <a href={`https://www.shiksha.com/search/?q=${encodeURIComponent(college.name)}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto px-8 py-6 sm:py-4 text-lg fixed sm:static bottom-0 left-0 right-0 z-40 rounded-none sm:rounded mt-4 shadow-lg sm:shadow-none" style={{ maxWidth: 600, borderRadius: isMobile ? 0 : 8 }}>Open Shiksha Reviews in New Tab</Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="block sm:hidden" style={{ height: 24 }} />
    </div>
  );
};

export default CollegeReviews; 