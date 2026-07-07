// Craft-specific iconography for /workshops/[type] — same hand-drawn
// language as components/icons/vertical-icons.tsx (rounded strokes,
// currentColor, one small volt accent per mark). Pottery reuses WorkshopIcon
// from the vertical set since a vase-on-a-wheel already reads as pottery.
import type { SVGProps } from 'react';
import type { WorkshopTypeId } from '@/lib/workshop-types';
import { WorkshopIcon as PotteryIcon } from './vertical-icons';

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

/** Woodworking — a handsaw, teeth and all. */
export function WoodworkingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="4.2" cy="19.6" r="1.7" fill="var(--icon-accent, #cdfb50)" stroke="none" />
      <path d="M5.4 18.4 19.5 4.3" />
      <path d="M7.4 15.4 8.7 16.7M9.8 13 11.1 14.3M12.2 10.6 13.5 11.9M14.6 8.2 15.9 9.5" />
    </svg>
  );
}

/** Cooking — a pot with steam rising. */
export function CookingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 11.5h15v4.5a2.5 2.5 0 0 1-2.5 2.5h-10a2.5 2.5 0 0 1-2.5-2.5z" />
      <path d="M4.5 12.8h-2M19.5 12.8h2" />
      <path d="M9.5 9c0-1.4 1.4-1.4 1.4-2.8S9.5 4.8 9.5 3.5" />
      <circle cx="14.3" cy="6.2" r="0.9" fill="var(--icon-accent, #cdfb50)" stroke="none" />
    </svg>
  );
}

/** Photography — a camera, aperture lit. */
export function PhotographyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="7.5" width="19" height="12" rx="2.2" />
      <rect x="9" y="4.3" width="6" height="3.2" rx="1" />
      <circle cx="12" cy="13.6" r="3.4" />
      <circle cx="12" cy="13.6" r="1" fill="var(--icon-accent, #cdfb50)" stroke="none" />
    </svg>
  );
}

/** Painting — a brush, drip and all. */
export function PaintingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 20.5 15 11.5" />
      <path d="M13.8 10.3c.9-.9 2.5-2.5 3.6-3.6 1-.9 2.4.5 1.5 1.5-1.1 1.1-2.7 2.7-3.6 3.6z" />
      <path d="M17.4 6.7 19 5.1" />
      <circle cx="6" cy="20.5" r="1.15" fill="var(--icon-accent, #cdfb50)" stroke="none" />
    </svg>
  );
}

/** Jewelry — a faceted gem above a ring band. */
export function JewelryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="16" r="4.6" />
      <path d="M12 5.2 15.4 9 12 12.8 8.6 9Z" />
      <path d="M8.6 9h6.8M12 5.2v7.6" />
      <circle cx="12" cy="7.6" r="0.85" fill="var(--icon-accent, #cdfb50)" stroke="none" />
    </svg>
  );
}

/** Floristry — a five-petal bloom on a stem. */
export function FloristryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 12v8.5M12 16.5c-1.8 0-3-1.2-3.6-2.4M12 16.5c1.8 0 3-1.2 3.6-2.4" />
      <circle cx="12" cy="6.6" r="1.9" />
      <circle cx="16" cy="9" r="1.9" />
      <circle cx="8" cy="9" r="1.9" />
      <circle cx="14.4" cy="12.4" r="1.9" />
      <circle cx="9.6" cy="12.4" r="1.9" />
      <circle cx="12" cy="9.6" r="1.3" fill="var(--icon-accent, #cdfb50)" stroke="none" />
    </svg>
  );
}

/** Textile — a threaded needle, looping. */
export function TextileIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8.5 4.3 17 19.6" />
      <ellipse cx="9.3" cy="5.7" rx="1.05" ry="1.6" transform="rotate(-30 9.3 5.7)" />
      <path d="M9.3 5.7c-3.4.6-5.6 3.7-4.3 6.6 1.3 2.8 5.2 3 6.7.6" />
      <circle cx="11.7" cy="12.9" r="0.95" fill="var(--icon-accent, #cdfb50)" stroke="none" />
    </svg>
  );
}

export { PotteryIcon };

export const WORKSHOP_TYPE_ICONS: Record<WorkshopTypeId, (props: IconProps) => React.JSX.Element> = {
  pottery: PotteryIcon,
  woodworking: WoodworkingIcon,
  cooking: CookingIcon,
  photography: PhotographyIcon,
  painting: PaintingIcon,
  jewelry: JewelryIcon,
  floristry: FloristryIcon,
  textile: TextileIcon,
};

export function WorkshopTypeIcon({ id, className }: { id: WorkshopTypeId; className?: string }) {
  const Icon = WORKSHOP_TYPE_ICONS[id];
  return <Icon className={className} />;
}
