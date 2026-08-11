import { WorkflowCanvas } from '@/components/svg/WorkflowCanvas';
import { SectionShell } from '@/components/ui/SectionShell';
import { workflowCopy } from '@/lib/content';

/**
 * S5b — the workflow canvas.
 *
 * Sits between the services grid and the impact figures: services say what we
 * build, this shows what one actually looks like, and the numbers then say what
 * it delivers.
 */
export function Workflow() {
  return (
    <SectionShell
      id="workflow"
      eyebrow={workflowCopy.eyebrow}
      heading={workflowCopy.heading}
      sub={workflowCopy.sub}
      className="defer-paint"
    >
      <WorkflowCanvas />
    </SectionShell>
  );
}
