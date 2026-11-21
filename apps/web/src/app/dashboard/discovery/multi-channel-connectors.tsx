"use client";

import { useState, useTransition } from "react";
import {
  MapPin,
  Youtube,
  Instagram,
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Phone,
  MessageCircle,
  Plus,
  Loader2,
} from "lucide-react";
import {
  runGooglePlacesDiscoveryAction,
  runYouTubeDiscoveryAction,
  analyzeSocialProfileAction,
} from "../../actions/discovery-actions";
import { importDiscoveredLeadsAction } from "../../actions/discovery-actions";

export function MultiChannelConnectors() {
  const [activeTab, setActiveTab] = useState<"PLACES" | "YOUTUBE" | "SOCIAL">("PLACES");
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Google Places state
  const [placesQuery, setPlacesQuery] = useState("Clinics in Adyar Chennai");
  const [placesApiKey, setPlacesApiKey] = useState("");
  const [placesResults, setPlacesResults] = useState<any[]>([]);

  // YouTube state
  const [youtubeQuery, setYoutubeQuery] = useState("Maths Coaching Chennai");
  const [youtubeApiKey, setYoutubeApiKey] = useState("");
  const [youtubeResults, setYoutubeResults] = useState<any[]>([]);

  // Social profile state
  const [socialUrl, setSocialUrl] = useState("https://instagram.com/chennaicupcakes");
  const [socialBio, setSocialBio] = useState(
    "Custom cakes & desserts in Chennai! Order via WhatsApp 9840123456 or linktr.ee/chennaicupcakes. No walk-ins, DM to book!"
  );
  const [socialBusinessName, setSocialBusinessName] = useState("Chennai Cupcakes & Confectionery");
  const [socialAnalysis, setSocialAnalysis] = useState<any | null>(null);

  // Handlers
  const handleSearchPlaces = () => {
    setStatusMessage(null);
    startTransition(async () => {
      try {
        const results = await runGooglePlacesDiscoveryAction(placesQuery, placesApiKey);
        setPlacesResults(results);
      } catch (err: any) {
        setStatusMessage(`Failed to search Google Places: ${err.message}`);
      }
    });
  };

  const handleSearchYouTube = () => {
    setStatusMessage(null);
    startTransition(async () => {
      try {
        const results = await runYouTubeDiscoveryAction(youtubeQuery, youtubeApiKey);
        setYoutubeResults(results);
      } catch (err: any) {
        setStatusMessage(`Failed to query YouTube: ${err.message}`);
      }
    });
  };

  const handleAnalyzeSocial = () => {
    setStatusMessage(null);
    startTransition(async () => {
      try {
        const result = await analyzeSocialProfileAction({
          profileUrl: socialUrl,
          bioText: socialBio,
          explicitName: socialBusinessName,
        });
        setSocialAnalysis(result);
      } catch (err: any) {
        setStatusMessage(`Failed to analyze social profile: ${err.message}`);
      }
    });
  };

  const handleImportLead = (lead: any) => {
    startTransition(async () => {
      try {
        const res = await importDiscoveredLeadsAction([lead]);
        setStatusMessage(`Successfully imported ${lead.name} into CRM!`);
      } catch (err: any) {
        setStatusMessage(`Import failed: ${err.message}`);
      }
    });
  };

  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Social & Extended Discovery Connectors
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Query Google Places, YouTube Channels, and Meta/LinkedIn profiles with automatic website gap detection.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("PLACES")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === "PLACES" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Google Places
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("YOUTUBE")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === "YOUTUBE" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Youtube className="h-3.5 w-3.5 text-red-500" />
            YouTube
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("SOCIAL")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === "SOCIAL" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Instagram className="h-3.5 w-3.5 text-pink-500" />
            Meta / LinkedIn
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {statusMessage}
        </div>
      )}

      {/* Tab 1: Google Places */}
      {activeTab === "PLACES" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold">Search Query / Niche (PAN India)</label>
              <input
                type="text"
                value={placesQuery}
                onChange={(e) => setPlacesQuery(e.target.value)}
                placeholder="e.g. Spa in Villivakkam, Dentists in Bangalore, Tuition in Madurai"
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>Google Places API Key</span>
                <span className="text-[10px] text-muted-foreground font-normal">(Optional / Free Mock)</span>
              </label>
              <input
                type="password"
                value={placesApiKey}
                onChange={(e) => setPlacesApiKey(e.target.value)}
                placeholder="Leave blank for free mock mode"
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSearchPlaces}
              disabled={isPending}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
              Search Google Places
            </button>
          </div>

          {placesResults.length > 0 && (
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden mt-4">
              {placesResults.map((item, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{item.place.name}</span>
                      {item.place.rating && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold text-[10px]">
                          ★ {item.place.rating} ({item.place.userRatingsTotal || 0})
                        </span>
                      )}
                      {!item.place.hasOfficialWebsite ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-[10px]">
                          No Website (Prime Lead)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-bold text-[10px]">
                          Has Website
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">📍 {item.place.formattedAddress}</p>
                    <p className="text-muted-foreground flex items-center gap-3">
                      <span>📞 {item.place.phone || "No phone listed"}</span>
                      <span>🌐 {item.place.website || "None"}</span>
                    </p>
                    <p className="text-primary font-medium text-[11px] mt-1">{item.place.opportunitySummary}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleImportLead(item.lead)}
                      disabled={isPending}
                      className="px-3 py-1.5 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white font-semibold rounded-md flex items-center gap-1 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Import Lead
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: YouTube Channels */}
      {activeTab === "YOUTUBE" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold">Local Business YouTube Niche</label>
              <input
                type="text"
                value={youtubeQuery}
                onChange={(e) => setYoutubeQuery(e.target.value)}
                placeholder="e.g. Dental clinic Chennai or Yoga Adyar"
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>YouTube API Key</span>
                <span className="text-[10px] text-muted-foreground font-normal">(Optional / Free Mock)</span>
              </label>
              <input
                type="password"
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                placeholder="Leave blank for free mock mode"
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSearchYouTube}
              disabled={isPending}
              className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
              Search YouTube Channels
            </button>
          </div>

          {youtubeResults.length > 0 && (
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden mt-4">
              {youtubeResults.map((item, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{item.channel.title}</span>
                      <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold text-[10px]">
                        🎬 {item.channel.videoCount} videos
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold text-[10px]">
                        👥 {item.channel.subscriberCount?.toLocaleString()} subscribers
                      </span>
                      {!item.channel.hasOfficialWebsite && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-[10px]">
                          No Website in Bio
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{item.channel.description}</p>
                    <p className="text-muted-foreground flex items-center gap-3">
                      <span>📞 {item.channel.detectedPhone || "No phone in bio"}</span>
                      <span>✉️ {item.channel.detectedEmail || "No email in bio"}</span>
                    </p>
                    <p className="text-primary font-medium text-[11px] mt-1">{item.channel.opportunitySummary}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleImportLead(item.lead)}
                      disabled={isPending}
                      className="px-3 py-1.5 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white font-semibold rounded-md flex items-center gap-1 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Import Lead
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Meta / LinkedIn Assisted Extraction */}
      {activeTab === "SOCIAL" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Social Profile URL</label>
              <input
                type="text"
                value={socialUrl}
                onChange={(e) => setSocialUrl(e.target.value)}
                placeholder="https://instagram.com/businessname"
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Business Name (Optional)</label>
              <input
                type="text"
                value={socialBusinessName}
                onChange={(e) => setSocialBusinessName(e.target.value)}
                placeholder="Leave blank to extract from handle"
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold">Profile Bio Text (Copy & Paste from Profile)</label>
            <textarea
              rows={3}
              value={socialBio}
              onChange={(e) => setSocialBio(e.target.value)}
              placeholder="Paste the Instagram / Facebook / LinkedIn bio text..."
              className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAnalyzeSocial}
              disabled={isPending}
              className="px-4 py-2 bg-pink-600 text-white text-xs font-semibold rounded-lg hover:bg-pink-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Analyze Social Presence Gaps
            </button>
          </div>

          {socialAnalysis && (
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3 mt-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-sm">
                  {socialAnalysis.analysis.handle} ({socialAnalysis.analysis.platform})
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    socialAnalysis.analysis.linkType === "AGGREGATOR_LINK"
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : socialAnalysis.analysis.linkType === "NO_LINK"
                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                      : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  }`}
                >
                  Link Type: {socialAnalysis.analysis.linkType}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                <p>📞 Phone: {socialAnalysis.analysis.detectedPhone || "None detected"}</p>
                <p>✉️ Email: {socialAnalysis.analysis.detectedEmail || "None detected"}</p>
                <p>🔗 Bio Link: {socialAnalysis.analysis.primaryWebsite || "None"}</p>
                <p>🎯 Recommended Service: {socialAnalysis.analysis.recommendedServiceCode}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-card border border-border text-primary font-medium">
                💡 Diagnosis: {socialAnalysis.analysis.opportunityDiagnosis}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleImportLead(socialAnalysis.lead)}
                  disabled={isPending}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white font-semibold rounded-md flex items-center gap-1 hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Import to CRM
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
