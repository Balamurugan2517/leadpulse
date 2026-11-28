"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, MapPin, Building2, Sliders, Clock, Loader2, Radar, Database } from "lucide-react";
import { PAN_INDIA_LOCATIONS } from "@leadpulse/domain";

interface DiscoverySearchFormProps {
  initialLocality: string;
  initialCategory: string;
  initialLimit: number;
  initialRadius?: number;
  initialSource?: string;
}

export function DiscoverySearchForm({
  initialLocality,
  initialCategory,
  initialLimit = 25,
  initialRadius = 5,
  initialSource = "OSM",
}: DiscoverySearchFormProps) {
  const router = useRouter();

  const findInitialHierarchy = (code: string) => {
    for (const s of PAN_INDIA_LOCATIONS) {
      for (const c of s.cities) {
        if (c.code === code) return { stateCode: s.code, cityCode: c.code, localityCode: code };
        for (const l of c.localities) {
          if (l.code === code) return { stateCode: s.code, cityCode: c.code, localityCode: code };
        }
      }
    }
    return { stateCode: "TN", cityCode: "CHENNAI", localityCode: "ALL_CHENNAI" };
  };

  const initialHier = findInitialHierarchy(initialLocality);

  const [selectedState, setSelectedState] = useState(initialHier.stateCode);
  const [selectedCity, setSelectedCity] = useState(initialHier.cityCode);
  const [selectedLocality, setSelectedLocality] = useState(initialHier.localityCode);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "CLINIC");
  const [selectedLimit, setSelectedLimit] = useState(initialLimit || 25);
  const [selectedRadius, setSelectedRadius] = useState(initialRadius || 5);
  const [selectedSource, setSelectedSource] = useState(initialSource || "OSM");

  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("");
  const [timeLeftSec, setTimeLeftSec] = useState(3);

  const activeState = PAN_INDIA_LOCATIONS.find((s) => s.code === selectedState) || PAN_INDIA_LOCATIONS[0];
  const activeCities = activeState.cities;
  const activeCity = activeCities.find((c) => c.code === selectedCity) || activeCities[0];
  const activeLocalities = activeCity.localities;

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    const newState = PAN_INDIA_LOCATIONS.find((s) => s.code === stateCode) || PAN_INDIA_LOCATIONS[0];
    const newCity = newState.cities[0];
    setSelectedCity(newCity.code);
    setSelectedLocality(newCity.localities[0]?.code || newCity.code);
  };

  const handleCityChange = (cityCode: string) => {
    setSelectedCity(cityCode);
    const newCity = activeCities.find((c) => c.code === cityCode) || activeCities[0];
    setSelectedLocality(newCity.localities[0]?.code || newCity.code);
  };

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setProgress(10);
    setTimeLeftSec(3);
    setCurrentPhase(`Phase 1/4: Querying ${selectedSource} within ${selectedRadius} km radius...`);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 35) {
          setCurrentPhase("Phase 2/4: Resolving spatial coordinates & filtering target category...");
          setTimeLeftSec(2);
          return prev + 25;
        } else if (prev < 70) {
          setCurrentPhase("Phase 3/4: Deduplicating records & verifying phone/address fields...");
          setTimeLeftSec(1);
          return prev + 30;
        } else if (prev < 95) {
          setCurrentPhase("Phase 4/4: Computing lead demand score and digital gap analysis...");
          setTimeLeftSec(0);
          return 96;
        } else {
          clearInterval(timer);
          return 100;
        }
      });
    }, 550);

    setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      setCurrentPhase("Scan Completed! Loading unique prospects...");
      router.push(
        `/dashboard/discovery?locality=${selectedLocality}&category=${selectedCategory}&limit=${selectedLimit}&radius=${selectedRadius}&source=${selectedSource}`
      );
      setTimeout(() => setIsScanning(false), 600);
    }, 2200);
  };

  const categories = [
    { label: "Dental & Clinics", value: "CLINIC" },
    { label: "Tuition & Coaching", value: "EDUCATION" },
    { label: "Restaurants & Cafes", value: "RESTAURANT" },
    { label: "CA & Professionals", value: "PROFESSIONAL" },
    { label: "Salons, Spas & Services", value: "SERVICES" },
    { label: "All Categories", value: "ALL" },
  ];

  const limits = [10, 25, 50, 100, 250, 500, 1000];
  const radiusOptions = [
    { label: "3 km (Hyper-Local)", value: 3 },
    { label: "5 km (Neighborhood)", value: 5 },
    { label: "10 km (City Zone)", value: 10 },
  ];
  const sources = [
    { label: "OpenStreetMap (Overpass Free)", value: "OSM" },
    { label: "Startup India & MSME Registry", value: "STARTUP_INDIA" },
    { label: "All Free Sources (OSM + Startup India)", value: "ALL" },
  ];

  return (
    <div className="space-y-4">
      <form onSubmit={handleStartScan} className="space-y-4">
        {/* Geographic Cascading Selectors */}
        <div>
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Target Location (PAN India)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">1. State / UT</span>
              <select
                value={selectedState}
                disabled={isScanning}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#CBD5CC] rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {PAN_INDIA_LOCATIONS.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">2. District / City</span>
              <select
                value={selectedCity}
                disabled={isScanning}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#CBD5CC] rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {activeCities.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">3. Locality / Area</span>
              <select
                value={selectedLocality}
                disabled={isScanning}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#CBD5CC] rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {activeLocalities.map((loc) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category, Radius, Source & Limit Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              Industry / Category
            </label>
            <select
              value={selectedCategory}
              disabled={isScanning}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#CBD5CC] rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Radar className="h-3.5 w-3.5 text-primary" />
              Search Radius
            </label>
            <select
              value={selectedRadius}
              disabled={isScanning}
              onChange={(e) => setSelectedRadius(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#CBD5CC] rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {radiusOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-primary" />
              Lead Source
            </label>
            <select
              value={selectedSource}
              disabled={isScanning}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#CBD5CC] rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {sources.map((src) => (
                <option key={src.value} value={src.value}>
                  {src.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-primary" />
              Scan Limit
            </label>
            <select
              value={selectedLimit}
              disabled={isScanning}
              onChange={(e) => setSelectedLimit(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#CBD5CC] rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {limits.map((l) => (
                <option key={l} value={l}>
                  {l} Leads
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="submit"
            disabled={isScanning}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#5E806A] text-white text-xs font-semibold hover:bg-[#456451] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning Geographical Nodes...
              </>
            ) : (
              <>
                <Compass className="h-4 w-4" />
                Run Discovery Scan
              </>
            )}
          </button>

          <span className="text-[11px] text-muted-foreground">
            Scope: <strong className="text-foreground">{activeCity.name} ({selectedLocality.replace(/_/g, " ")})</strong> • Radius: <strong className="text-foreground">{selectedRadius} km</strong> • Max: <strong className="text-foreground">{selectedLimit}</strong>
          </span>
        </div>
      </form>

      {/* Live Scan Execution Progress Bar */}
      {isScanning && (
        <div className="p-4 rounded-xl border border-[#D2E3D5] bg-[#E8F0E8]/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#26352C] flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-[#5E806A] animate-spin" />
              {currentPhase}
            </span>
            <span className="font-mono text-[#456451] font-bold flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeLeftSec > 0 ? `~${timeLeftSec}s remaining` : "Completing..."}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#D2E3D5] overflow-hidden">
            <div
              className="h-full bg-[#5E806A] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#647067]">
            <span>Source: {selectedSource} • Deduplication Active</span>
            <span className="font-bold">{progress}% Completed</span>
          </div>
        </div>
      )}
    </div>
  );
}
