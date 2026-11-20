import { Kanban, Sparkles } from "lucide-react";
import { getPipelineBoardData } from "../../actions/pipeline-actions";
import { PipelineClient } from "./pipeline-client";

export default async function SalesPipelinePage() {
  const { deals, metrics } = await getPipelineBoardData();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Kanban className="h-6 w-6 text-primary" />
          Sales Pipeline & Revenue Operations
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track prospect discussions, stage progressions, deal values, and monthly recurring retainers across Chennai clients.
        </p>
      </div>

      {/* Main Kanban Board */}
      <PipelineClient initialDeals={deals} metrics={metrics} />
    </div>
  );
}
