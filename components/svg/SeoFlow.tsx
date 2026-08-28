'use client';

import { FlowChart, type FlowEdge, type FlowNode } from '@/components/svg/FlowChart';

/* ---------------------------------------------------------------------------
   The n8n SEO FAQ pipeline, redrawn.
   ---------------------------------------------------------------------------
   Two lanes that rejoin. The top lane turns the keyword into a document; the
   bottom lane turns the same question set into summaries, batched through a
   loop so no single request exceeds the model's token limit. The merge at the
   right is where the finished FAQs are written into the document created
   earlier — which is why the document has to be created before the summaries
   are ready, rather than after.
--------------------------------------------------------------------------- */

const W = 180;
const H = 56;
const TOP = 24;
const BOTTOM = 190;

const NODES: FlowNode[] = [
  { id: 'form', x: 20, y: TOP, w: W, h: H, label: 'On form submission', sub: 'trigger', tone: 'accent' },
  { id: 'alsoasked', x: 250, y: TOP, w: W, h: H, label: 'AlsoAsked API', sub: 'POST · questions' },
  { id: 'format', x: 480, y: TOP, w: W, h: H, label: 'Format → Markdown', sub: 'code' },
  { id: 'doc', x: 710, y: TOP, w: W, h: H, label: 'Create Google Doc', sub: 'docs · create' },

  { id: 'chunks', x: 250, y: BOTTOM, w: W, h: H, label: 'Chunk + top 20', sub: 'code' },
  { id: 'loop', x: 480, y: BOTTOM, w: W, h: H, label: 'Loop over items', sub: 'batching' },
  { id: 'openai', x: 710, y: BOTTOM, w: W, h: H, label: 'Summarise', sub: 'OpenAI' },

  { id: 'merge', x: 940, y: 107, w: W, h: H, label: 'Merge', sub: 'combine' },
  { id: 'place', x: 1170, y: 107, w: W, h: H, label: 'Place FAQs', sub: 'docs · update', tone: 'strong' },
];

const EDGES: FlowEdge[] = [
  { from: 'form', to: 'alsoasked' },
  { from: 'alsoasked', to: 'format' },
  { from: 'format', to: 'doc' },
  { from: 'form', to: 'chunks' },
  { from: 'chunks', to: 'loop' },
  { from: 'loop', to: 'openai', label: 'loop' },
  { from: 'openai', to: 'merge', label: 'done' },
  { from: 'doc', to: 'merge' },
  { from: 'merge', to: 'place' },
];

export function SeoFlow() {
  return (
    <FlowChart
      nodes={NODES}
      edges={EDGES}
      width={1370}
      height={280}
      orientation="horizontal"
      idPrefix="seo"
      title="n8n SEO FAQ automation workflow"
      desc="A form submission provides a keyword. The top lane calls the AlsoAsked API, formats the questions into Markdown and creates a Google Doc. The bottom lane chunks the same question set, batches it through a loop into OpenAI for summarisation, and the two lanes merge so the finished FAQs are written into the document."
      className="overflow-hidden rounded-card border border-line"
    />
  );
}
