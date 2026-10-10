import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  collections,
  fabrics,
  formatNaira,
  tailorPresets,
  type Collection,
  type TextileProduct,
} from "@/lib/textile-catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ÀṢỌ House — Considered Cloth, Cut to Measure" },
      {
        name: "description",
        content:
          "Discover fine ceremonial brocade, Swiss voile and considered suiting at ÀṢỌ House. Luxury cloth for the way we dress.",
      },
      { property: "og:title", content: "ÀṢỌ House — Considered Cloth, Cut to Measure" },
      {
        property: "og:description",
        content: "Fine cloth, chosen with care. A study in texture, tradition and modern Nigerian dressing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AtelierStorefront,
});

interface BagItem {
  product: TextileProduct;
  yards: number;
  color: string;
}

const swatchClasses: Record<string, string> = {
  emerald: "bg-fabric-emerald",
  navy: "bg-fabric-navy",
  ivory: "bg-fabric-ivory",
  burgundy: "bg-fabric-burgundy",
};

const swatchLabels: Record<string, string> = {
  emerald: "Emerald",
  navy: "Midnight navy",
  ivory: "Warm ivory",
  burgundy: "Oxblood",
};

function AtelierStorefront() {
  const [activeCollection, setActiveCollection] = useState<Collection>("All fabrics");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<TextileProduct | null>(null);
  const [selectedYards, setSelectedYards] = useState(5);
  const [selectedColor, setSelectedColor] = useState("emerald");
  const [bag, setBag] = useState<BagItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleFabrics = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase();
    return fabrics.filter((product) => {
      const inCollection =
        activeCollection === "All fabrics" || product.category === activeCollection;
      const matchesSearch =
        term.length === 0 ||
        `${product.name} ${product.category} ${product.descriptor} ${product.texture}`
          .toLocaleLowerCase()
          .includes(term);
      return inCollection && matchesSearch;
    });
  }, [activeCollection, searchTerm]);

  const bagYards = bag.reduce((total, item) => total + item.yards, 0);
  const bagTotal = bag.reduce(
    (total, item) => total + item.product.pricePerYard * item.yards,
    0,
  );

  function openProduct(product: TextileProduct) {
    setSelectedProduct(product);
    setSelectedYards(5);
    setSelectedColor(product.swatches[0] ?? "emerald");
  }

  function addToBag(product: TextileProduct, yards: number, color: string) {
    setBag((items) => {
      const match = items.find((item) => item.product.id === product.id && item.color === color);
      if (match) {
        return items.map((item) =>
          item === match ? { ...item, yards: item.yards + yards } : item,
        );
      }
      return [...items, { product, yards, color }];
    });
    setSelectedProduct(null);
    setBagOpen(true);
  }

  function setYardsForItem(productId: string, color: string, change: number) {
    setBag((items) =>
      items.flatMap((item) => {
        if (item.product.id !== productId || item.color !== color) return [item];
        const yards = Math.max(4, item.yards + change);
        return [{ ...item, yards }];
      }),
    );
  }

  function removeFromBag(productId: string, color: string) {
    setBag((items) =>
      items.filter((item) => item.product.id !== productId || item.color !== color),
    );
  }

  function closeMenuAndChoose(collection: Collection) {
    setActiveCollection(collection);
    setMobileMenuOpen(false);
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-background">
      <div className="flex min-h-9 items-center justify-center bg-primary px-4 py-2 text-center text-[10px] font-medium tracking-[0.14em] text-primary-foreground sm:text-[11px]">
        A STUDY IN TEXTURE, TRADITION & MODERN DRESSING
        <span className="mx-2.5 text-gold" aria-hidden="true">✳</span>
        LAGOS · MADE FOR EVERYWHERE
      </div>

      <header className="relative z-20 border-b border-border/80 bg-background">
        <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-4 lg:gap-12">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open collections"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu aria-hidden="true" />
            </Button>
            <a href="#top" aria-label="ÀṢỌ House home" className="group flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center border border-gold text-primary">
                <span className="font-display text-[22px] leading-none">À</span>
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-[18px] font-medium tracking-[0.07em] sm:text-[19px]">ÀṢỌ</span>
                <span className="mt-1.5 text-[8px] font-medium tracking-[0.29em] text-muted-foreground">HOUSE OF TEXTILES</span>
              </span>
            </a>
            <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
              <a className="nav-link" href="#collection">The collection</a>
              <a className="nav-link" href="#atelier">Our atelier</a>
              <a className="nav-link" href="#craft">The craft</a>
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={searchOpen ? "Close search" : "Search the collection"}
              onClick={() => setSearchOpen((open) => !open)}
            >
              {searchOpen ? <X aria-hidden="true" /> : <Search aria-hidden="true" />}
            </Button>
            <Button
              variant="ghost"
              className="relative gap-2 px-2 sm:px-3"
              aria-label={`Shopping bag, ${bag.length} ${bag.length === 1 ? "style" : "styles"}`}
              onClick={() => setBagOpen(true)}
            >
              <ShoppingBag className="size-[18px]" aria-hidden="true" />
              <span className="hidden text-xs sm:inline">Bag</span>
              <span className="flex min-w-5 items-center justify-center border border-gold px-1 text-[10px] leading-[18px] tabular-nums">{bag.length}</span>
            </Button>
          </div>
        </div>
        {searchOpen && (
          <div className="absolute inset-x-0 top-full border-b border-border bg-background px-5 py-3 shadow-sm sm:px-8">
            <label htmlFor="collection-search" className="sr-only">Search the fabric collection</label>
            <div className="mx-auto flex max-w-[1320px] items-center gap-3">
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="collection-search"
                autoFocus
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by cloth, weave or collection…"
                className="h-10 w-full bg-transparent text-sm outline-hidden placeholder:text-muted-foreground"
              />
              {searchTerm && <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>Clear</Button>}
            </div>
          </div>
        )}
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/30 lg:hidden" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setMobileMenuOpen(false);
        }}>
          <nav aria-label="Collections" className="flex h-full w-[min(86vw,380px)] flex-col bg-background px-6 py-7 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-2xl">The collection</span>
              <Button variant="ghost" size="icon" aria-label="Close collections" onClick={() => setMobileMenuOpen(false)}><X aria-hidden="true" /></Button>
            </div>
            {collections.map((collection) => (
              <button
                type="button"
                key={collection}
                className="flex min-h-12 items-center justify-between border-b border-border/70 text-left text-sm"
                onClick={() => closeMenuAndChoose(collection)}
              >
                {collection}<ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
              </button>
            ))}
            <a href="#atelier" onClick={() => setMobileMenuOpen(false)} className="mt-6 text-sm text-muted-foreground">Visit our atelier</a>
          </nav>
        </div>
      )}

      <section id="top" className="relative isolate min-h-[600px] overflow-hidden bg-primary sm:min-h-[660px] lg:min-h-[min(720px,78vh)]">
        <img
          src={fabrics[3]?.image ?? fabrics[0]?.image}
          alt=""
          aria-hidden="true"
          width={1600}
          height={1104}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-[53%_48%] sm:object-center"
        />
        <div className="atelier-hero-shade absolute inset-0" />
        <div className="relative mx-auto flex min-h-[600px] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-20 sm:min-h-[660px] sm:px-8 sm:pb-16 lg:min-h-[min(720px,78vh)] lg:justify-center lg:px-12 lg:pb-10">
          <div className="max-w-[650px] pb-5 text-background">
            <div className="mb-7 inline-flex items-center gap-2 border border-gold/60 px-3 py-2 text-[9px] font-medium tracking-[0.2em] text-gold sm:text-[10px]">
              <Sparkles className="size-3" aria-hidden="true" /> SELECTED CLOTH · LAGOS
            </div>
            <h1 className="max-w-[660px] font-display text-[50px] font-normal leading-[1.02] sm:text-[67px] lg:text-[76px]">
              Considered cloth.<br /><span className="text-gold">A life well worn.</span>
            </h1>
            <p className="mt-6 max-w-[410px] text-[14px] leading-7 text-background/85 sm:text-[15px]">
              A thoughtful edit of fine ceremonial and tailoring textiles, selected for the people and moments that matter.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="atelier" size="lg" className="h-12 gap-3 px-6" asChild>
                <a href="#collection">Explore the collection <ArrowDownRight className="size-4" aria-hidden="true" /></a>
              </Button>
              <a href="#craft" className="inline-flex h-12 items-center gap-2 px-3 text-[12px] text-background/85 transition-colors hover:text-background">
                A little about us <ArrowRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="mt-9 flex items-end justify-between border-t border-background/25 pt-4 text-[9px] tracking-[0.16em] text-background/70 sm:absolute sm:bottom-9 sm:left-8 sm:right-8 sm:mt-0 sm:border-0 sm:pt-0 lg:left-12 lg:right-12">
            <span>01 — CLOTH WITH CHARACTER</span>
            <span className="hidden sm:block">LAGOS · NIGERIA</span>
            <a href="#collection" aria-label="Scroll to the fabric collection" className="group flex items-center gap-2">
              DISCOVER <ArrowDownRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section id="craft" className="border-b border-border bg-secondary/60">
        <div className="mx-auto grid max-w-[1320px] gap-6 px-5 py-9 sm:grid-cols-3 sm:gap-8 sm:px-8 sm:py-10 lg:px-12">
          <ValueNote number="01" title="Chosen, never crowded" text="A considered edit of cloth, selected for a finer finish." />
          <ValueNote number="02" title="Cut to your measure" text="Thoughtful yardage for the outfit you have in mind." />
          <ValueNote number="03" title="Rooted in tradition" text="Nigerian dress, reimagined through beautiful textiles." />
        </div>
      </section>

      <section id="collection" className="scroll-mt-8 pb-20 pt-16 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground">THE CLOTH ROOM — VOL. I</span>
              <h2 className="mt-3 font-display text-[36px] font-normal leading-tight sm:text-[43px]">The collected fabrics</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">For ceremonial dressing, considered tailoring and every day between.</p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 border border-border bg-card px-3 py-2 text-[10px] tracking-wide text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald" aria-hidden="true" /> SAMPLE COLLECTION · SAMPLE PRICES
            </div>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto border-b border-border pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Filter fabrics by collection">
            {collections.map((collection) => (
              <button
                type="button"
                role="tab"
                id={`filter-${collections.indexOf(collection)}`}
                aria-selected={activeCollection === collection}
                key={collection}
                onClick={() => setActiveCollection(collection)}
                className={`min-h-10 shrink-0 border-b-2 px-3 text-[11px] transition-colors sm:px-4 ${
                  activeCollection === collection
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {collection}
              </button>
            ))}
          </div>

          <div className="mt-3 flex min-h-8 items-center justify-between text-[10px] text-muted-foreground" aria-live="polite">
            <span>{visibleFabrics.length} {visibleFabrics.length === 1 ? "cloth" : "cloths"} in this edit</span>
            <span className="hidden items-center gap-1.5 sm:inline-flex">PRICE SHOWN PER YARD <ChevronDown className="size-3" aria-hidden="true" /></span>
          </div>

          {visibleFabrics.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
              <Search className="mb-3 size-5 text-muted-foreground" aria-hidden="true" />
              <p className="font-display text-2xl">No cloth found just yet.</p>
              <Button variant="link" className="mt-2" onClick={() => { setSearchTerm(""); setActiveCollection("All fabrics"); }}>See all fabrics</Button>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-11 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-7">
              {visibleFabrics.map((product, index) => (
                <FabricCard key={product.id} product={product} index={index} onQuickView={openProduct} />
              ))}
            </div>
          )}
          <div className="mt-11 flex flex-col items-center gap-2 border-t border-border pt-6 text-center">
            <CircleHelp className="size-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs leading-5 text-muted-foreground">Between colours, cuts or collections? Every beautiful choice begins with a conversation.</p>
            <a href="#atelier" className="mt-1 text-xs font-semibold text-foreground underline decoration-gold decoration-1 underline-offset-4">Find your cloth with us</a>
          </div>
        </div>
      </section>

      <section id="atelier" className="border-y border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-8 px-5 py-12 sm:px-8 sm:py-14 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <div className="max-w-[650px]">
            <span className="text-[10px] tracking-[0.2em] text-gold">A PERSONAL KIND OF SERVICE</span>
            <h2 className="mt-3 font-display text-[34px] font-normal leading-tight sm:text-[40px]">The right cloth changes everything.</h2>
            <p className="mt-3 max-w-[510px] text-sm leading-6 text-primary-foreground/75">We believe in a slower, more considered way of finding cloth. One fabric, one conversation, one piece made your own.</p>
          </div>
          <div className="flex items-center gap-4 border-t border-primary-foreground/20 pt-5 lg:min-w-[290px] lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <span className="flex size-11 shrink-0 items-center justify-center border border-gold text-gold"><Sparkles className="size-[18px]" aria-hidden="true" /></span>
            <div><p className="font-display text-lg">A note from the atelier</p><p className="mt-1 text-xs text-primary-foreground/70">Your next favourite fabric is in here.</p></div>
          </div>
        </div>
      </section>

      <footer className="bg-background">
        <div className="mx-auto grid max-w-[1320px] gap-9 px-5 py-9 sm:grid-cols-[1fr_auto] sm:items-center sm:px-8 lg:px-12">
          <a href="#top" aria-label="ÀṢỌ House home" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center border border-gold font-display text-lg text-primary">À</span>
            <span><span className="font-display text-base tracking-[0.08em]">ÀṢỌ HOUSE</span><span className="ml-3 text-[10px] text-muted-foreground">CONSIDERED CLOTH, CUT TO MEASURE</span></span>
          </a>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] text-muted-foreground">
            <span>AN INDEPENDENT HOUSE OF TEXTILES</span><span>© ÀṢỌ HOUSE 2026</span>
          </div>
        </div>
      </footer>

      <Dialog open={selectedProduct !== null} onOpenChange={(open) => { if (!open) setSelectedProduct(null); }}>
        {selectedProduct && (
          <DialogContent className="max-h-[92dvh] w-[calc(100%-24px)] max-w-[870px] gap-0 overflow-y-auto border-border bg-background p-0 sm:w-[calc(100%-48px)] sm:max-h-[88dvh]">
            <div className="grid sm:grid-cols-[0.92fr_1.08fr]">
              <div className="relative min-h-[220px] overflow-hidden bg-secondary sm:min-h-[540px]">
                <img src={selectedProduct.image} alt={selectedProduct.imageAlt} width={1024} height={1024} className="absolute inset-0 size-full object-cover" />
                <div className="absolute left-4 top-4 border border-background/60 bg-background/90 px-2.5 py-1.5 text-[9px] tracking-[0.12em] text-foreground">{selectedProduct.reference}</div>
              </div>
              <div className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-9">
                <DialogHeader className="text-left">
                  <span className="text-[9px] tracking-[0.2em] text-muted-foreground">{selectedProduct.category.toUpperCase()} · {selectedProduct.origin.toUpperCase()}</span>
                  <DialogTitle className="mt-2 font-display text-[30px] font-normal leading-tight sm:text-[34px]">{selectedProduct.name}</DialogTitle>
                  <DialogDescription className="pt-1 text-sm">{selectedProduct.descriptor}</DialogDescription>
                </DialogHeader>
                <p className="mt-5 border-y border-border py-3 text-xs leading-6 text-muted-foreground">{selectedProduct.texture}</p>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">{selectedProduct.cut}</p>

                <div className="mt-6">
                  <div className="flex items-end justify-between gap-3">
                    <span className="text-xs font-semibold">Choose your cloth</span>
                    <span className="text-right text-[10px] text-muted-foreground">{swatchLabels[selectedColor] ?? "Selected colour"}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {selectedProduct.swatches.map((color) => (
                      <button
                        type="button"
                        key={color}
                        aria-label={`Choose ${swatchLabels[color] ?? color}`}
                        aria-pressed={selectedColor === color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex size-9 items-center justify-center rounded-full border-2 bg-background p-1 transition-transform hover:scale-105 ${selectedColor === color ? "border-primary" : "border-border"}`}
                      >
                        <span className={`size-full rounded-full border border-foreground/10 ${swatchClasses[color] ?? "bg-muted"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold">Considered cuts</p>
                  <div className="grid gap-2">
                    {tailorPresets.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        aria-pressed={selectedYards === preset.yards}
                        onClick={() => setSelectedYards(preset.yards)}
                        className={`flex min-h-12 items-center justify-between border px-3.5 text-left transition-colors ${selectedYards === preset.yards ? "border-primary bg-secondary/60" : "border-border hover:border-muted-foreground/50"}`}
                      >
                        <span><span className="block text-[11px] font-medium">{preset.label}</span><span className="mt-0.5 block text-[9px] text-muted-foreground">{preset.detail}</span></span>
                        <span className="text-right"><span className="block text-xs tabular-nums">{preset.yards} yds</span>{selectedYards === preset.yards && <Check className="ml-auto mt-1 size-3 text-emerald" aria-hidden="true" />}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      aria-pressed={!tailorPresets.some((preset) => preset.yards === selectedYards)}
                      onClick={() => setSelectedYards(4)}
                      className={`flex min-h-12 items-center justify-between border px-3.5 text-left transition-colors ${!tailorPresets.some((preset) => preset.yards === selectedYards) ? "border-primary bg-secondary/60" : "border-border hover:border-muted-foreground/50"}`}
                    >
                      <span><span className="block text-[11px] font-medium">Custom cut</span><span className="mt-0.5 block text-[9px] text-muted-foreground">Choose in half-yard increments</span></span>
                      <span className="text-xs">Custom</span>
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-y border-border py-4">
                  <span className="text-xs font-semibold">Yards</span>
                  <div className="flex h-9 items-center border border-border">
                    <Button variant="ghost" size="icon" className="size-9 rounded-none" aria-label="Remove half a yard" disabled={selectedYards <= 4} onClick={() => setSelectedYards((yards) => Math.max(4, yards - 0.5))}><Minus className="size-3.5" aria-hidden="true" /></Button>
                    <span className="min-w-[58px] text-center text-xs tabular-nums">{selectedYards.toLocaleString("en-NG")} yd</span>
                    <Button variant="ghost" size="icon" className="size-9 rounded-none" aria-label="Add half a yard" onClick={() => setSelectedYards((yards) => yards + 0.5)}><Plus className="size-3.5" aria-hidden="true" /></Button>
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <span className="text-[10px] text-muted-foreground">{formatNaira(selectedProduct.pricePerYard)} / Yard</span>
                  <span className="text-right"><span className="block text-[9px] text-muted-foreground">YOUR CUT</span><span className="font-display text-[22px]">{formatNaira(selectedProduct.pricePerYard * selectedYards)}</span></span>
                </div>
                <Button variant="atelier" className="mt-4 h-12 w-full" onClick={() => addToBag(selectedProduct, selectedYards, selectedColor)}>
                  <ShoppingBag className="size-4" aria-hidden="true" /> Add to the bag
                </Button>
                <p className="mt-3 text-center text-[9px] text-muted-foreground">Indicative sample price · final availability to be confirmed</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Sheet open={bagOpen} onOpenChange={setBagOpen}>
        <SheetContent className="flex w-[min(100vw,460px)] flex-col gap-0 overflow-y-auto border-border bg-background p-0 sm:max-w-[460px]">
          <div className="border-b border-border px-6 py-6">
            <SheetHeader className="text-left">
              <SheetTitle className="font-display text-[28px] font-normal">Your cloth bag</SheetTitle>
              <SheetDescription className="text-xs">{bag.length ? `${bagYards} yards, thoughtfully chosen.` : "A considered cut starts here."}</SheetDescription>
            </SheetHeader>
          </div>
          {bag.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <span className="flex size-14 items-center justify-center border border-gold text-primary"><ShoppingBag className="size-5" aria-hidden="true" /></span>
              <p className="mt-5 font-display text-[23px]">Nothing in your bag.</p>
              <p className="mt-2 max-w-[260px] text-xs leading-6 text-muted-foreground">Take a look through our collection and save a few yards for later.</p>
              <SheetClose asChild><Button variant="outline" className="mt-5">Return to the cloth room <ArrowRight className="size-3.5" aria-hidden="true" /></Button></SheetClose>
            </div>
          ) : (
            <>
              <div className="flex-1 px-5 py-1">
                {bag.map((item) => (
                  <div className="flex gap-4 border-b border-border py-5" key={`${item.product.id}-${item.color}`}>
                    <div className="relative size-[96px] shrink-0 overflow-hidden bg-secondary">
                      <img src={item.product.image} alt={item.product.imageAlt} width={1024} height={1024} loading="lazy" className="size-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div><p className="font-display text-[17px] leading-tight">{item.product.name}</p><p className="mt-1 text-[9px] tracking-wide text-muted-foreground">{swatchLabels[item.color] ?? "Selected"} · {item.product.reference}</p></div>
                        <Button variant="ghost" size="icon" className="-mr-2 -mt-2 size-8 shrink-0" aria-label={`Remove ${item.product.name} from bag`} onClick={() => removeFromBag(item.product.id, item.color)}><X className="size-3.5" aria-hidden="true" /></Button>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex h-8 items-center border border-border">
                          <Button variant="ghost" size="icon" className="size-7 rounded-none" aria-label={`Remove half a yard of ${item.product.name}`} disabled={item.yards <= 4} onClick={() => setYardsForItem(item.product.id, item.color, -0.5)}><Minus className="size-3" aria-hidden="true" /></Button>
                          <span className="min-w-[47px] text-center text-[10px] tabular-nums">{item.yards.toLocaleString("en-NG")} yd</span>
                          <Button variant="ghost" size="icon" className="size-7 rounded-none" aria-label={`Add half a yard of ${item.product.name}`} onClick={() => setYardsForItem(item.product.id, item.color, 0.5)}><Plus className="size-3" aria-hidden="true" /></Button>
                        </div>
                        <span className="text-right text-xs tabular-nums">{formatNaira(item.product.pricePerYard * item.yards)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border bg-secondary/40 px-6 pb-7 pt-5">
                <div className="flex justify-between text-[10px] text-muted-foreground"><span>Illustrative subtotal</span><span>{formatNaira(bagTotal)}</span></div>
                <p className="mt-3 text-[10px] leading-5 text-muted-foreground">Collection details, availability and final pricing are indicative in this sample. Connected store checkout is not yet enabled.</p>
                <Button variant="atelier" className="mt-5 h-12 w-full" disabled>Checkout unavailable</Button>
                <SheetClose asChild><Button variant="outline" className="mt-2 h-10 w-full gap-2"><ArrowLeft className="size-3.5" aria-hidden="true" />Continue discovering</Button></SheetClose>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}

function ValueNote({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="grid grid-cols-[32px_1fr] gap-x-2.5 gap-y-1">
      <span className="row-span-2 pt-1 font-display text-xs text-gold">{number}</span>
      <p className="text-xs font-semibold">{title}</p>
      <p className="text-[11px] leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}

function FabricCard({ product, index, onQuickView }: {
  product: TextileProduct;
  index: number;
  onQuickView: (product: TextileProduct) => void;
}) {
  return (
    <article className="fabric-card catalog-reveal group min-w-0" style={{ animationDelay: `${index * 65}ms` }}>
      <button type="button" onClick={() => onQuickView(product)} className="relative block aspect-[0.91] w-full cursor-pointer overflow-hidden bg-secondary text-left" aria-label={`View ${product.name}`}>
        <img src={product.image} alt={product.imageAlt} width={1024} height={1024} loading="lazy" className="fabric-image size-full object-cover" />
        <span className="absolute left-3 top-3 bg-background/92 px-2 py-1.5 text-[8px] tracking-[0.1em] text-foreground sm:left-4 sm:top-4 sm:px-2.5 sm:text-[9px]">{product.category.toUpperCase()}</span>
        {product.featured && <span className="absolute right-3 top-3 border border-background/55 bg-primary/85 px-2 py-1.5 text-[8px] tracking-[0.1em] text-primary-foreground sm:right-4 sm:top-4">THE ATELIER EDIT</span>}
        <span className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 bg-background/95 py-3 text-[10px] font-semibold tracking-wide opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 sm:inset-x-4 sm:bottom-4">DISCOVER THE CLOTH <ArrowRight className="size-3.5" aria-hidden="true" /></span>
        <span className="sr-only">Select to choose a cut and colour</span>
      </button>
      <div className="pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-[18px] leading-tight sm:text-[20px]">{product.name}</h3>
            <p className="mt-1 text-[10px] leading-5 text-muted-foreground sm:text-[11px]">{product.descriptor}</p>
          </div>
          <div className="shrink-0 pt-0.5 text-right">
            <p className="text-[8px] uppercase tracking-[0.09em] text-muted-foreground">FROM</p>
            <p className="mt-0.5 text-[12px] font-semibold tabular-nums sm:text-[13px]">{formatNaira(product.pricePerYard)}</p>
            <p className="text-[9px] text-muted-foreground">/ yard</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border/80 pt-2.5">
          <div className="flex items-center gap-1.5" aria-label={`Available colours: ${product.swatches.map((swatch) => swatchLabels[swatch]).join(", ")}`}>
            {product.swatches.map((swatch) => <span key={swatch} className={`size-[11px] rounded-full border border-foreground/10 ${swatchClasses[swatch] ?? "bg-muted"}`} aria-hidden="true" />)}
          </div>
          <span className="text-[9px] text-muted-foreground">{product.origin}</span>
        </div>
      </div>
      <Button variant="outline" size="sm" className="mt-4 h-9 w-full justify-between border-border bg-background text-[10px] font-medium hover:border-primary" onClick={() => onQuickView(product)}>
        Choose your cut <Plus className="size-3.5" aria-hidden="true" />
      </Button>
    </article>
  );
}