'use client';

import { FlowChart, type FlowEdge, type FlowNode } from '@/components/svg/FlowChart';

/* ---------------------------------------------------------------------------
   The Demand IQ → HubSpot Zap, redrawn.
   ---------------------------------------------------------------------------
   Three steps run for every contact, then the tree branches twice: first on
   prospect type, then — under Hero only — on what happened on the call. Each
   leaf writes to HubSpot with its own field mapping, which is the whole point
   of branching rather than writing once at the end.

   Laid out on a 880-unit grid with a 440 centre line, so the trunk runs dead
   straight and the two branch columns sit symmetrically either side.
--------------------------------------------------------------------------- */

const W = 180;
const H = 54;

const NODES: FlowNode[] = [
  { id: 'trigger', x: 350, y: 16, w: W, h: H, step: '1', label: 'New contact', sub: 'Demand IQ', tone: 'accent' },
  { id: 'prospect', x: 350, y: 100, w: W, h: H, step: '2', label: 'Get prospect by ID', sub: 'Demand IQ' },
  { id: 'report', x: 350, y: 184, w: W, h: H, step: '3', label: 'Get report + fields', sub: 'Demand IQ' },
  { id: 'split', x: 350, y: 268, w: W, h: H, step: '4', label: 'Split into paths', sub: 'Paths' },

  /* Left branch — Hero, which splits again on the call outcome. */
  { id: 'heroCond', x: 120, y: 372, w: W, h: H, step: '5', label: 'Path conditions', sub: 'Paths' },
  { id: 'heroSplit', x: 120, y: 456, w: W, h: H, step: '6', label: 'Split into paths', sub: 'Paths' },
  { id: 'notHomeCond', x: 20, y: 560, w: W, h: H, step: '7', label: 'Path conditions', sub: 'Paths' },
  { id: 'notHomeWrite', x: 20, y: 644, w: W, h: H, step: '8', label: 'Create contact', sub: 'HubSpot', tone: 'strong' },
  { id: 'talkCond', x: 230, y: 560, w: W, h: H, step: '9', label: 'Path conditions', sub: 'Paths' },
  { id: 'talkWrite', x: 230, y: 644, w: W, h: H, step: '10', label: 'Create contact', sub: 'HubSpot', tone: 'strong' },

  /* Right branch — Journey, a single hop to HubSpot. */
  { id: 'journeyCond', x: 570, y: 372, w: W, h: H, step: '11', label: 'Path conditions', sub: 'Paths' },
  { id: 'journeyWrite', x: 570, y: 456, w: W, h: H, step: '12', label: 'Create contact', sub: 'HubSpot', tone: 'strong' },
];

const EDGES: FlowEdge[] = [
  { from: 'trigger', to: 'prospect' },
  { from: 'prospect', to: 'report' },
  { from: 'report', to: 'split' },
  { from: 'split', to: 'heroCond', label: 'Hero' },
  { from: 'split', to: 'journeyCond', label: 'Journey' },
  { from: 'heroCond', to: 'heroSplit' },
  { from: 'heroSplit', to: 'notHomeCond', label: 'Not home' },
  { from: 'heroSplit', to: 'talkCond', label: 'Talk to customer' },
  { from: 'notHomeCond', to: 'notHomeWrite' },
  { from: 'talkCond', to: 'talkWrite' },
  { from: 'journeyCond', to: 'journeyWrite' },
];

export function DemandIqFlow() {
  return (
    <FlowChart
      nodes={NODES}
      edges={EDGES}
      width={880}
      height={714}
      orientation="vertical"
      idPrefix="diq"
      title="Demand IQ to HubSpot Zapier workflow"
      desc="A twelve-step Zap. A new contact in Demand IQ triggers a lookup of the full prospect and its report, then a path split on prospect type. The Hero path splits again on call outcome — not home, or talk to customer — and each of the three leaves creates a contact in HubSpot."
      className="overflow-hidden rounded-card border border-line"
    />
  );
}
