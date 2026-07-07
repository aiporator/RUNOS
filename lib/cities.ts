// City landing pages — local SEO front doors for the founding-club program.
// Landmarks are well-known public geography, used for flavor only; no claim
// is made that a specific club already runs there until one actually does.

export interface CityInfo {
  slug: string;
  name: string;
  country: string;
  landmarks: string[];
  blurb: string;
}

export const CITIES: CityInfo[] = [
  {
    slug: 'cologne',
    name: 'Cologne',
    country: 'Germany',
    landmarks: ['the Rhine promenade (Rheinufer)', 'the Stadtwald loop', 'the Cathedral bridges'],
    blurb: 'A flat, river-hugging city built for weeknight loops and Sunday long runs alike.',
  },
  {
    slug: 'dusseldorf',
    name: 'Düsseldorf',
    country: 'Germany',
    landmarks: ['the Rheinuferpromenade', 'Nordpark', 'the Hofgarten'],
    blurb: 'Riverside paths and a compact old town make it easy to run door-to-door.',
  },
  {
    slug: 'frankfurt',
    name: 'Frankfurt',
    country: 'Germany',
    landmarks: ['the Mainufer riverbank', 'Grüneburgpark', 'the Palmengarten'],
    blurb: 'A skyline city with a genuinely runnable river path threading straight through it.',
  },
  {
    slug: 'munich',
    name: 'München',
    country: 'Germany',
    landmarks: ['the Englischer Garten', 'the Isar river trail', 'Olympiapark'],
    blurb: 'Among the best park systems in Europe for a club that wants a real trail feel in a big city.',
  },
  {
    slug: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    landmarks: ['Tempelhofer Feld', 'Tiergarten', 'the Spree riverside path'],
    blurb: "A sprawling city where the club, not the commute, decides where you run next.",
  },
  {
    slug: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    landmarks: ['Vondelpark', 'the canal ring', 'Amsterdamse Bos'],
    blurb: 'Flat, dense, and already built for anyone who moves under their own power.',
  },
  {
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    landmarks: ['the Bois de Boulogne', 'the Seine riverbanks', 'Champ de Mars'],
    blurb: 'Landmark-dense routes that make even a Tuesday tempo run feel like an occasion.',
  },
  {
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    landmarks: ['the Ronda Litoral beachfront', 'Parc de la Ciutadella', 'the Collserola hills'],
    blurb: 'Beachfront miles in the morning, hill repeats in the afternoon — one city, two training grounds.',
  },
];

export function getCity(slug: string): CityInfo | undefined {
  return CITIES.find((c) => c.slug === slug);
}
