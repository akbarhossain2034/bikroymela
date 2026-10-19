import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LOCATIONS } from '../data/mockData';
import { Search, MapPin, X, ChevronRight, Check, ChevronDown } from 'lucide-react';

export const HeroSearch: React.FC = () => {
  const { 
    lang, 
    t, 
    searchQuery, 
    setSearchQuery, 
    selectedDivision, 
    setSelectedDivision,
    selectedArea,
    setSelectedArea,
    ads 
  } = useApp();

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [activeDivisionTab, setActiveDivisionTab] = useState<string>('Dhaka');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Quick suggestions based on ads
  const suggestions = [
    'iPhone 14 Pro Max',
    'Yamaha FZ-S',
    'MacBook Pro',
    'ফ্ল্যাট বিক্রয়',
    'Used Android',
    'Laptop Core i5',
    'Honda CB'
  ];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLocationLabel = selectedArea 
    ? `${selectedArea}, ${selectedDivision}` 
    : (selectedDivision ? selectedDivision : (lang === 'bn' ? 'সমগ্র বাংলাদেশ' : 'All Bangladesh'));

  return (
    <div className="bg-[#007460] pt-6 pb-12 px-4 sm:px-6 lg:px-8 text-white relative">
      <div className="max-w-5xl mx-auto text-center mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 text-balance">
          {lang === 'bn' ? 'কেনাবেচা করুন সবচেয়ে সহজে ও নিরাপদে' : 'Buy & Sell Easily and Securely'}
        </h1>
        <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto">
          {lang === 'bn' 
            ? 'হাজারো ভেরিফাইড বিক্রেতার পুরাতন ও নতুন পণ্য খুঁজুন অথবা বিনামূল্যে বিজ্ঞাপন দিন' 
            : 'Explore thousands of verified new & used products or post your ad for free'}
        </p>
      </div>

      {/* Main Search & Location Box */}
      <div ref={searchContainerRef} className="max-w-5xl 2xl:max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-2 sm:p-2.5 flex flex-col md:flex-row gap-2 relative z-30">
        
        {/* Location Picker Button */}
        <button
          type="button"
          onClick={() => setLocationModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg md:w-60 shrink-0 text-left transition-colors font-medium border border-slate-200 cursor-pointer shadow-2xs group"
          title="ক্লিক করে বিভাগ, জেলা বা এলাকা নির্বাচন করুন"
        >
          <MapPin className="w-4 h-4 text-[#007460] shrink-0" />
          <span className="truncate flex-1 font-semibold text-slate-800">{currentLocationLabel}</span>
          {(selectedDivision || selectedArea) ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDivision(null);
                setSelectedArea(null);
              }}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
              title="লোকেশন মুছুন"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-emerald-700 transition-colors shrink-0" />
          )}
        </button>

        {/* Search Input Box */}
        <div className="relative flex-1">
          <div className="flex items-center px-3 bg-slate-50 border border-slate-200 rounded-lg focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSuggestionsOpen(true);
              }}
              onFocus={() => setSuggestionsOpen(true)}
              placeholder={t.searchPlaceholder}
              className="w-full px-2.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete / Instant Suggestions */}
          {suggestionsOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="p-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                {lang === 'bn' ? 'জনপ্রিয় সার্চ সাজেশন' : 'Popular Search Suggestions'}
              </div>
              <div className="py-1">
                {suggestions
                  .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(s);
                        setSuggestionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        {s}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Submit Button */}
        <button
          type="button"
          onClick={() => setSuggestionsOpen(false)}
          className="px-6 py-2.5 bg-[#007460] hover:bg-[#005e4e] text-white font-semibold text-xs sm:text-sm rounded-lg shadow transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>{lang === 'bn' ? 'সার্চ করুন' : 'Search'}</span>
        </button>

      </div>

      {/* Location Picker Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full text-slate-800 overflow-hidden">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-300" />
                <h3 className="font-semibold text-base sm:text-lg">
                  {lang === 'bn' ? 'লোকেশন নির্বাচন করুন' : 'Select Location'}
                </h3>
              </div>
              <button 
                onClick={() => setLocationModalOpen(false)}
                className="text-white hover:text-emerald-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Location Input & Reset Bar */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  placeholder={lang === 'bn' ? 'জেলা বা এলাকার নাম লিখে খুঁজুন (উদাঃ মিরপুর, বগুড়া, কুমিল্লা)...' : 'Search district or area...'}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <button
                onClick={() => {
                  setSelectedDivision(null);
                  setSelectedArea(null);
                  setLocationSearchQuery('');
                  setLocationModalOpen(false);
                }}
                className="text-xs font-bold text-[#007460] hover:underline flex items-center gap-1.5 shrink-0 self-center"
              >
                <span>✓</span>
                <span>{lang === 'bn' ? 'সমগ্র বাংলাদেশ (সকল লোকেশন)' : 'All Bangladesh'}</span>
              </button>
            </div>

            {/* If search query entered, show filtered list directly across all 8 divisions */}
            {locationSearchQuery.trim() ? (
              <div className="p-3 max-h-96 overflow-y-auto space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {lang === 'bn' ? 'খুঁজে পাওয়া জেলা ও এলাকাসমূহ:' : 'Matching locations:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {LOCATIONS.flatMap(loc => 
                    loc.areas
                      .filter(a => a.toLowerCase().includes(locationSearchQuery.toLowerCase()))
                      .map(area => ({ area, division: loc.division, divisionBn: loc.divisionBn }))
                  ).map(({ area, division, divisionBn }) => (
                    <button
                      key={`${division}-${area}`}
                      onClick={() => {
                        setSelectedDivision(division);
                        setSelectedArea(area);
                        setLocationSearchQuery('');
                        setLocationModalOpen(false);
                      }}
                      className="text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-xs flex items-center justify-between transition-colors"
                    >
                      <span className="font-semibold text-slate-800">{area}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        {divisionBn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 max-h-96 overflow-y-auto">
                {/* Divisions List */}
                <div className="border-r border-slate-200 p-2 divide-y divide-slate-100">
                  <div className="px-2 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>{lang === 'bn' ? '৮টি বিভাগ' : '8 Divisions'}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1 rounded">৬৪ জেলা</span>
                  </div>
                  {LOCATIONS.map((loc) => {
                    const isSelected = activeDivisionTab === loc.division;
                    return (
                      <button
                        key={loc.division}
                        onClick={() => setActiveDivisionTab(loc.division)}
                        className={`w-full text-left px-3 py-2 text-xs sm:text-sm font-medium flex items-center justify-between rounded-md transition-colors ${
                          isSelected 
                            ? 'bg-emerald-50 text-emerald-800 font-semibold' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{lang === 'bn' ? loc.divisionBn : loc.division}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({loc.areas.length})</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Areas in selected division */}
                <div className="p-2">
                  <div className="px-2 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>{lang === 'bn' ? `${activeDivisionTab} বিভাগের প্রধান এলাকাসমূহ` : `Areas in ${activeDivisionTab}`}</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {/* Option to select the entire division */}
                    <button
                      onClick={() => {
                        setSelectedDivision(activeDivisionTab);
                        setSelectedArea(null);
                        setLocationModalOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-[#007460] hover:bg-emerald-50 rounded flex items-center justify-between"
                    >
                      <span>{lang === 'bn' ? `সমগ্র ${activeDivisionTab}` : `All of ${activeDivisionTab}`}</span>
                      {selectedDivision === activeDivisionTab && !selectedArea && (
                        <Check className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>

                    {LOCATIONS.find(l => l.division === activeDivisionTab)?.areas.map((area) => {
                      const isPicked = selectedDivision === activeDivisionTab && selectedArea === area;
                      return (
                        <button
                          key={area}
                          onClick={() => {
                            setSelectedDivision(activeDivisionTab);
                            setSelectedArea(area);
                            setLocationModalOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs sm:text-sm rounded flex items-center justify-between transition-colors ${
                            isPicked 
                              ? 'bg-emerald-100/70 font-semibold text-emerald-900' 
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span>{area}</span>
                          {isPicked && <Check className="w-4 h-4 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setLocationModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
