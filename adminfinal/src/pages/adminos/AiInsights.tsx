import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, RefreshCwIcon, SparklesIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { EmptyState } from '../../components/ui/Primitives';
import { MetricTile, ScoreBar, ExportMenu } from '../../components/adminos/OsPrimitives';
import { useAdminOs } from '../../contexts/AdminOsContext';
import { generateInsights, type GeneratedInsight } from '../../services/adminos/insights';

const tabs = ['All', 'Revenue Opportunity', 'Occupancy', 'Pricing', 'Risk', 'Market Expansion', 'Customer Trend'];

export function AiInsights() {
  const { state, run } = useAdminOs();
  const [tab, setTab] = useState('All');
  const [generatedAt, setGeneratedAt] = useState(() => new Date());

  const insights = useMemo(() => generateInsights(state), [state, generatedAt]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: insights.length };
    tabs.slice(1).forEach((category) => {
      result[category] = insights.filter((insight) => insight.category === category).length;
    });
    return result;
  }, [insights]);

  const rows = tab === 'All' ? insights : insights.filter((insight) => insight.category === tab);
  const highConfidence = insights.filter((insight) => insight.confidence >= 85).length;

  return (
    <div>
      <PageHeader
        title="AI marketplace intelligence"
        subtitle="Patterns found in the current platform data, ranked by confidence, each with somewhere to act."
        actions={
        <div className="flex flex-wrap gap-2">
            <ExportMenu
            title="Marketplace insights"
            entity="Insight"
            rows={rows}
            columns={[
            { header: 'Category', value: (row: GeneratedInsight) => row.category },
            { header: 'Headline', value: (row: GeneratedInsight) => row.headline },
            { header: 'Detail', value: (row: GeneratedInsight) => row.detail },
            { header: 'Estimated impact', value: (row: GeneratedInsight) => row.impact },
            { header: 'Confidence', value: (row: GeneratedInsight) => row.confidence }]
            } />
          
            <Button
            icon={RefreshCwIcon}
            onClick={() => {
              setGeneratedAt(new Date());
              run(
                {
                  type: 'audit.record',
                  entry: {
                    action: 'Re-run marketplace analysis',
                    entityType: 'Insight',
                    entityId: 'insights.generate',
                    entityLabel: 'AI marketplace intelligence',
                    previousState: `${insights.length} insights`,
                    newState: 'Regenerated from current platform state',
                    reason: 'Manual refresh from AI insights'
                  }
                },
                { success: 'Analysis re-run against current data' }
              );
            }}>
            
              Re-run analysis
            </Button>
          </div>
        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="Active insights" value={String(insights.length)} hint={`generated ${generatedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`} tone="accent" />
        <MetricTile label="High confidence" value={String(highConfidence)} hint="85% and above" tone="positive" />
        <MetricTile label="Revenue opportunities" value={String(counts['Revenue Opportunity'] ?? 0)} hint="with quantified upside" onClick={() => setTab('Revenue Opportunity')} />
        <MetricTile label="Risk signals" value={String(counts.Risk ?? 0)} hint="entities needing review" onClick={() => setTab('Risk')} />
      </div>

      <Card className="mt-4">
        <CardHeader title="Insights" subtitle="Highest confidence first" />
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        {rows.length === 0 ?
        <EmptyState
          icon={SparklesIcon}
          title="No insights in this category"
          description="Insights only appear when the underlying data crosses a threshold — a clean marketplace produces fewer of them." /> :


        <ul className="divide-y divide-line">
            {rows.map((insight) =>
          <li key={insight.id} className="px-5 py-5">
                <div className="flex flex-wrap items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/25 text-ink">
                    <SparklesIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[15px] font-semibold tracking-tight text-ink">{insight.headline}</h3>
                      <Badge tone="neutral">{insight.category}</Badge>
                    </div>
                    <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-muted">{insight.detail}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Estimated impact</p>
                        <p className="text-[13px] font-semibold text-ink">{insight.impact}</p>
                      </div>
                      <div className="w-40">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Confidence</p>
                        <div className="mt-1">
                          <ScoreBar value={insight.confidence} />
                        </div>
                      </div>
                      <Link to={insight.actionTo} className="sm:ml-auto">
                        <Button size="sm" variant="primary">
                          {insight.action} <ArrowRightIcon className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
          )}
          </ul>
        }
      </Card>

      <Card className="mt-4">
        <CardHeader title="How these are produced" subtitle="Model inputs" />
        <p className="px-5 py-4 text-[13px] leading-relaxed text-muted">
          Insights are computed from live extension decisions and response times, city occupancy against target, hotel
          visibility, open disputes, unreleased settlements, compliance blockers, and risk scores. Confidence scales
          with the size of the sample behind each pattern, and anything below 70% is suppressed. Approving an
          extension or restoring a hotel changes this list on the next render.
        </p>
      </Card>
    </div>);

}