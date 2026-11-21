"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Compass, MapPin, Building2, Sliders, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { PAN_INDIA_LOCATIONS } from "@leadpulse/domain";

interface DiscoverySearchFormProps {
  initialLocality: string;
  initialCategory: string;
  initialLimit: number;
}

export function DiscoverySearchForm({
  initialLocality,
  initialCategory,
  initialLimit = 25,
}: DiscoverySearchFormProps) {
  const router = useRouter();

  // Find initial state and city from initialLocality code
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

  // Scanning progress state
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("");
  const [timeLeftSec, setTimeLeftSec] = useState(3);

  // Filtered lists
  const activeState = PAN_INDIA_LOCATIONS.find((s) => s.code === selectedState) || PAN_INDIA_LOCATIONS[0];
  const activeCities = activeState.cities;
  const activeCity = activeCities.find((c) => c.code === selectedCity) || activeCities[0];
  const activeLocalities = activeCity.localities;

  // Handle cascading state change
  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    const newState = PAN_INDIA_LOCATIONS.find((s) => s.code === stateCode) || PAN_INDIA_LOCATIONS[0];
    const newCity = newState.cities[0];
    setSelectedCity(newCity.code);
    setSelectedLocality(newCity.localities[0]?.code || newCity.code);
  };

  // Handle cascading city change
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
    setCurrentPhase("Phase 1/4: Querying OpenStreetMap spatial nodes...");

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 35) {
          setCurrentPhase("Phase 2/4: Resolving geographical bounding boxes...");
          setTimeLeftSec(2);
          return prev + 25;
        } else if (prev < 70) {
          setCurrentPhase("Phase 3/4: Filtering category taxonomy & extracting verified contacts...");
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
    }, 600);

    setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      setCurrentPhase("Scan Completed! Loading prospects...");
      router.push(
        `/dashboard/discovery?locality=${selectedLocality}&category=${selectedCategory}&limit=${selectedLimit}`
      );
      setTimeout(() => setIsScanning(false), 800);
    }, 2400);
  };

  const categories = [
    { label: "Dental & Clinics", value: "CLINIC" },
    { label: "Tuition & Coaching", value: "EDUCATION" },
    { label: "Restaurants & Cafes", value: "RESTAURANT" },
    { label: "CA & Professionals", value: "PROFESSIONAL" },
    { label: "Salons & Services", value: "SERVICES" },
    { label: "All Categories", value: "ALL" },
  ];

  const limits = [10, 25, 50, 100, 250, 500, 1000];

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
            {/* State Select */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">1. State / UT</span>
              <select
                value={selectedState}
                disabled={isScanning}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {PAN_INDIA_LOCATIONS.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District / City Select */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">2. District / City</span>
              <select
                value={selectedCity}
                disabled={isScanning}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {activeCities.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Locality / Area Select */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">3. Locality / Area</span>
              <select
                value={selectedLocality}
                disabled={isScanning}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
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

        {/* Category & Limit Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              Target Industry / Category
            </label>
            <select
              value={selectedCategory}
              disabled={isScanning}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
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
              <Sliders className="h-3.5 w-3.5 text-primary" />
              Scan Quantity Limit
            </label>
            <select
              value={selectedLimit}
              disabled={isScanning}
              onChange={(e) => setSelectedLimit(Number(e.target.value))}
              className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {limits.map((l) => (
                <option key={l} value={l}>
                  {l} Leads
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button & Progress Indicator */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="submit"
            disabled={isScanning}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 cursor-pointer"
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
            Scope: <strong className="text-foreground">{activeCity.name} ({selectedLocality.replace(/_/g, " ")})</strong> • Limit: <strong className="text-foreground">{selectedLimit} leads</strong>
          </span>
        </div>
      </form>

      {/* Live Scan Execution Progress Bar (ENH-002) */}
      {isScanning && (
        <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-primary animate-spin" />
              {currentPhase}
            </span>
            <span className="font-mono text-primary font-bold flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeLeftSec > 0 ? `~${timeLeftSec}s remaining` : "Completing..."}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Querying: Overpass ODbL Open Data</span>
            <span className="font-bold">{progress}% Completed</span>
          </div>
        </div>
      )}
    </div>
  );
}
