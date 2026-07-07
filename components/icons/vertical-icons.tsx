// Custom vertical iconography — hand-drawn, not a generic icon-library set.
// Each mark shares one language: rounded strokes, currentColor, and a small
// solid volt accent dot echoing the logo's pulse-dot. Sized via className
// (e.g. "h-5 w-5") the same way lucide icons are used elsewhere in the app.
import type { SVGProps } from 'react';
import type { VerticalId } from '@/lib/verticals';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

/** Running club — a runner mid-stride, front knee driving up. */
export function RunningClubIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="15.2" cy="5.4" r="1.9" fill="var(--icon-accent, #cdfb50)" stroke="none" />
      <path d="M13.6 7.6 10.4 12.6" />
      <path d="M10.4 12.6 6.4 14.6 4.4 19.4" />
      <path d="M10.4 12.6 14.6 14.4 17.6 11" />
      <path d="M12.4 9.4 9.4 11.2" />
    </svg>
  );
}

/** Gym — a loaded barbell. */
export function GymIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="6.5" y1="12" x2="17.5" y2="12" />
      <rect x="2" y="8.5" width="3" height="7" rx="1" fill="var(--icon-accent, #cdfb50)" stroke="none" />
      <rect x="19" y="8.5" width="3" height="7" rx="1" />
      <rect x="5.5" y="9.8" width="2" height="4.4" rx="0.8" />
      <rect x="16.5" y="9.8" width="2" height="4.4" rx="0.8" />
    </svg>
  );
}

/** Fitness studio — a single continuous flow line, yoga/movement in one breath. */
export function FitnessStudioIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 16c2.8-7.5 7-7.5 8.5-2s5.7 5.5 8.5-2" />
      <circle cx="3.5" cy="16" r="1.1" fill="var(--icon-accent, #cdfb50)" stroke="none" />
      <circle cx="20.5" cy="12" r="1.1" fill="var(--icon-accent, #cdfb50)" stroke="none" />
    </svg>
  );
}

/** Workshop — a vase on a potter's wheel. Built for Töpferkurse specifically. */
export function WorkshopIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="12" cy="19.3" rx="7.6" ry="1.7" />
      <path d="M9.7 7.2c-1.1 2-1.8 4-1.4 6.7.4 2.7 1.6 4.2 3.7 4.2s3.3-1.5 3.7-4.2c.4-2.7-.3-4.7-1.4-6.7" />
      <ellipse cx="12" cy="7" rx="2.2" ry="0.85" fill="var(--icon-accent, #cdfb50)" stroke="none" />
    </svg>
  );
}

/** Community — three linked nodes, the same dot language as the logo. */
export function CommunityIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 8.4 7.3 15.6" />
      <path d="M12 8.4 16.7 15.6" />
      <path d="M7.3 16.6h9.4" />
      <circle cx="12" cy="7.2" r="2" fill="var(--icon-accent, #cdfb50)" stroke="none" />
      <circle cx="6.4" cy="17" r="1.7" />
      <circle cx="17.6" cy="17" r="1.7" />
    </svg>
  );
}

export const VERTICAL_ICONS: Record<VerticalId, (props: IconProps) => React.JSX.Element> = {
  'running-club': RunningClubIcon,
  gym: GymIcon,
  'fitness-studio': FitnessStudioIcon,
  workshop: WorkshopIcon,
  community: CommunityIcon,
};

/** Convenience wrapper — `<VerticalIcon id={vertical.id} className="h-4 w-4" />`. */
export function VerticalIcon({ id, className }: { id: VerticalId; className?: string }) {
  const Icon = VERTICAL_ICONS[id];
  return <Icon className={className} />;
}
