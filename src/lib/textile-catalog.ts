import brocadeImage from "@/assets/fabric-brocade.jpg";
import voileImage from "@/assets/fabric-voile.jpg";
import suitingImage from "@/assets/fabric-suiting.jpg";
import heroImage from "@/assets/textile-hero.jpg";

export const collections = [
  "All fabrics",
  "Shadda & Brocade",
  "Swiss Voile Lace",
  "Murarka",
  "William Marks",
  "Cashmere & Wool",
  "Atiku & Handloom",
] as const;

export type Collection = (typeof collections)[number];

export interface TextileProduct {
  id: string;
  name: string;
  descriptor: string;
  category: Exclude<Collection, "All fabrics">;
  pricePerYard: number;
  image: string;
  imageAlt: string;
  reference: string;
  origin: string;
  texture: string;
  cut: string;
  swatches: readonly string[];
  featured?: boolean;
}

export const fabrics: TextileProduct[] = [
  {
    id: "royal-shadda",
    name: "Royal Shadda",
    descriptor: "A modern heirloom in emerald & gold.",
    category: "Shadda & Brocade",
    pricePerYard: 45000,
    image: brocadeImage,
    imageAlt: "Emerald brocade with woven antique-gold motifs",
    reference: "AS–014 / EMERALD",
    origin: "Made for the occasion",
    texture: "Raised gold jacquard · silky hand · ceremonial weight",
    cut: "A generous, fluid drape for Babban Riga and special occasions.",
    swatches: ["emerald", "navy", "burgundy"],
    featured: true,
  },
  {
    id: "voile-heritage",
    name: "Swiss Voile Heritage",
    descriptor: "Light-catching lace, intricately worked.",
    category: "Swiss Voile Lace",
    pricePerYard: 62000,
    image: voileImage,
    imageAlt: "Fine ivory Swiss voile lace with openwork detail",
    reference: "AS–027 / IVORY",
    origin: "Swiss finish",
    texture: "Openwork embroidery · airy touch · softly luminous",
    cut: "A finely detailed voile for a distinguished ceremonial kaftan.",
    swatches: ["ivory", "emerald", "navy"],
    featured: true,
  },
  {
    id: "midnight-wool",
    name: "Midnight Cashmere Blend",
    descriptor: "A refined twill with a quiet, soft sheen.",
    category: "Cashmere & Wool",
    pricePerYard: 38000,
    image: suitingImage,
    imageAlt: "Textured midnight-navy cashmere-blend suiting cloth",
    reference: "AS–032 / MIDNIGHT",
    origin: "English mill finish",
    texture: "Fine twill weave · soft hand · all-season weight",
    cut: "A balanced weight for tailored jackets and considered separates.",
    swatches: ["navy", "burgundy", "emerald"],
    featured: true,
  },
  {
    id: "murarka-royal",
    name: "Murarka Royal Weave",
    descriptor: "A sculpted weave with elegant movement.",
    category: "Murarka",
    pricePerYard: 52000,
    image: heroImage,
    imageAlt: "Richly textured green Murarka-style ceremonial cloth",
    reference: "AS–041 / ROYAL",
    origin: "Artisan selected",
    texture: "Dimensional woven pattern · soft luster · substantial hand",
    cut: "An expressive weave with a handsome silhouette and easy drape.",
    swatches: ["emerald", "navy"],
  },
  {
    id: "atiku-studio",
    name: "Atiku Studio Cloth",
    descriptor: "An enduring staple, chosen for its clean hand.",
    category: "Atiku & Handloom",
    pricePerYard: 24000,
    image: suitingImage,
    imageAlt: "Closely woven blue-black Atiku studio cloth",
    reference: "AS–056 / INDIGO",
    origin: "Artisan selected",
    texture: "Subtle grain · breathable construction · easy care",
    cut: "A dependable foundation for everyday kaftans and trousers.",
    swatches: ["navy", "emerald"],
  },
  {
    id: "william-marks-no-8",
    name: "William Marks No. 8",
    descriptor: "A crisp English suiting with a subtle glint.",
    category: "William Marks",
    pricePerYard: 41000,
    image: suitingImage,
    imageAlt: "Subtle wool suiting with refined navy twill texture",
    reference: "AS–068 / NAVY",
    origin: "English mill finish",
    texture: "Compact twill · resilient hand · understated sheen",
    cut: "A polished, comfortable suiting cloth for day-to-evening tailoring.",
    swatches: ["navy", "burgundy"],
  },
];

export const tailorPresets = [
  { label: "Complete Babban Riga", detail: "3-piece", yards: 10 },
  { label: "Kaftan & Trouser", detail: "Standard", yards: 5 },
  { label: "Traditional Top", detail: "Top only", yards: 4 },
] as const;

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}