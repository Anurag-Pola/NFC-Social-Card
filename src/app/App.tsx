import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import {
  Phone,
  Mail,
  MapPin,
  RotateCw,
  Printer,
  Sparkles,
  Check,
  Sliders,
  LayoutGrid,
  ArrowRight,
  Download,
  Loader2
} from "lucide-react";
import victoryLogo from "../../assests/logo.svg";

// ── Victory Hotels Brand Logo Component ──────────────────────────────────────
// Renders the official crest from assests/logo.svg (star + winged V + ring).
// The source file draws the crest inside a 1500x1500 canvas with wide empty
// margins, so we crop to the mark's tight bounds below — otherwise it renders
// at roughly half size and sits off-centre. Re-measure these if logo.svg is
// re-exported.
const CREST_BOX = { x: 388, y: 357, w: 749, h: 686, canvas: 1500 };

// The artwork's own gold peaks near white, which has almost no luminance
// contrast against a cream card — the mark dissolves and only its edges read,
// which looks like stray outlines. "gold-deep" re-fills the crest with a
// gradient kept well below the paper tone, so use it on light backgrounds.
const CREST_FILL = {
  "gold-deep":
    "linear-gradient(135deg, #E0B23F 0%, #B4820F 34%, #8A5E0C 62%, #C9992A 88%, #A2740F 100%)",
  silver: "linear-gradient(135deg, #FFFFFF 0%, #B8C2CC 50%, #E2E8F0 100%)",
  dark: "#1f2937",
  white: "#ffffff"
} as const;

export const VictoryHotelsLogo = ({
  size = 48,
  variant = "gold",
  customColor
}: {
  size?: number;
  variant?: "gold" | "gold-deep" | "silver" | "dark" | "white" | "custom";
  customColor?: string;
}) => {
  // `size` is the crest width; height follows the mark's natural aspect ratio.
  const k = size / CREST_BOX.w;
  const artwork = {
    position: "absolute" as const,
    left: -CREST_BOX.x * k,
    top: -CREST_BOX.y * k,
    width: CREST_BOX.canvas * k,
    height: CREST_BOX.canvas * k,
    maxWidth: "none"
  };

  // Gold keeps the artwork's own metallic gradient; the other variants recolour
  // the mark by using its alpha as a CSS mask.
  const fill =
    variant === "custom"
      ? customColor ?? CREST_FILL.dark
      : CREST_FILL[variant as Exclude<typeof variant, "gold" | "custom">];

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        overflow: "hidden",
        width: size,
        height: CREST_BOX.h * k,
        flexShrink: 0
      }}
    >
      {variant === "gold" ? (
        <img src={victoryLogo} alt="Victory Hotels & Resorts" style={artwork} />
      ) : (
        <span
          role="img"
          aria-label="Victory Hotels & Resorts"
          style={{
            ...artwork,
            background: fill,
            WebkitMaskImage: `url(${victoryLogo})`,
            maskImage: `url(${victoryLogo})`,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat"
          }}
        />
      )}
    </span>
  );
};

// ── Physical NFC Chip Touchpoint Overlay (100% Static Print-Ready Vector) ─────
// Positioned vertically centered (top 50%) and horizontally at the end of the card (right edge).
// Features Wi-Fi/NFC contactless signal icon & text turned 90 degrees clockwise with static concentric ripples.
const NFCChipTouchpoint = ({
  color = "#D4AF37",
  textColor = "rgba(255, 255, 255, 0.5)",
  glowColor = "rgba(212, 175, 55, 0.15)"
}: {
  color?: string;
  textColor?: string;
  glowColor?: string;
}) => (
  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-row items-center justify-center pointer-events-none z-30 select-none">
    {/* Concentric Static Ripple Rings around embedded NFC chip (No Animation - Print Ready) */}
    <div className="relative flex items-center justify-center w-[64px] h-[64px]">
      {/* Outer Static Ripple Ring 3 */}
      <div
        className="absolute w-[60px] h-[60px] rounded-full border border-dashed opacity-40"
        style={{ borderColor: color }}
      />
      {/* Outer Static Ripple Ring 2 */}
      <div
        className="absolute w-[46px] h-[46px] rounded-full border opacity-55"
        style={{ borderColor: color, background: glowColor }}
      />
      {/* Inner Static Ripple Ring 1 */}
      <div
        className="absolute w-[34px] h-[34px] rounded-full border opacity-80"
        style={{ borderColor: color }}
      />

      {/* Center NFC Chip Print Target with Wi-Fi / Contactless Signal Icon turned 90 degrees clockwise */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
        style={{ backgroundColor: color, color: "#0a0a0d" }}
      >
        <div className="rotate-90 flex items-center justify-center">
          {/* Wi-Fi / Contactless Signal Wave Icon */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.55a11 11 0 0 1 14 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M8.5 15.55a6 6 0 0 1 7 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="12" cy="18.5" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>

    {/* Sideways Text Label turned 90 degrees clockwise */}
    <div className="w-4 h-[64px] flex items-center justify-center -ml-1">
      <span
        className="text-[5.5px] tracking-[0.25em] uppercase font-bold rotate-90 origin-center whitespace-nowrap"
        style={{ color: textColor }}
      >
        TAP HERE
      </span>
    </div>
  </div>
);

// ── Design Preset Interfaces & Data ───────────────────────────────────────
export interface ManagerCardData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  tagline: string;
  qrLink: string;
}

export const DEFAULT_VICTORY_DATA: ManagerCardData = {
  name: "Vittal Jadhav",
  title: "Corporate General Manager",
  company: "Victory Hotels",
  phone: "+91 9849545958",
  email: "vittal.j@victoryhotels.in",
  website: "www.victoryhotels.in",
  address: "E-601 Giridhari Executive Park Suncity, Hyderabad-500058",
  tagline: "Executive Hospitality & Service Excellence",
  qrLink: "https://victoryhotels.in/vcard/vittal-jadhav"
};

export interface DesignStyle {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  badge: string;
}

export const DESIGN_STYLES: DesignStyle[] = [
  {
    id: "royal-gold",
    name: "24K Royal Obsidian",
    category: "Luxury Metal",
    tagline: "Brushed Obsidian & Metallic Gold",
    description: "Deep matte black titanium alloy with 24K gold foil trim line & right-edge NFC chip target.",
    badge: "Most Executive"
  },
  {
    id: "classic-heritage",
    name: "Classic Heritage Ivory",
    category: "Textured Paper",
    tagline: "Elevated Marble & Gold Embossed",
    description: "Traditional paper card layout with right-edge centered NFC chip print target & gold logo.",
    badge: "Original Re-Imagined"
  },
  {
    id: "midnight-sapphire",
    name: "Midnight Sapphire & Rose Gold",
    category: "Modern 5-Star",
    tagline: "Deep Navy & Metallic Rose Gold",
    description: "Dark midnight hue with cyan-rose gold accents and right-edge contactless NFC tap zone.",
    badge: "5-Star Resort Vibe"
  },
  {
    id: "champagne-silk",
    name: "Champagne Silk & Walnut",
    category: "Boutique Luxury",
    tagline: "Warm Champagne & Deep Charcoal",
    description: "Soft satin champagne backdrop with walnut serif typography & right-edge chip print overlay.",
    badge: "Warm Hospitality"
  },
  {
    id: "cyber-glass",
    name: "Frosted Cyber-Glassmorphism",
    category: "Digital NFC",
    tagline: "Translucent Epoxy & Gold Circuits",
    description: "Futuristic frosted glass panel with dynamic light refraction and embedded right-edge NFC target.",
    badge: "Smart NFC Card"
  }
];

// ── Individual Card Renderer Component ─────────────────────────────────────
interface RenderCardProps {
  styleId: string;
  data: ManagerCardData;
  flipped: boolean;
  onFlip?: () => void;
  scale?: number;
}

export function RenderExecutiveCard({ styleId, data, flipped, onFlip, scale = 1 }: RenderCardProps) {
  const containerStyle = {
    width: "340px",
    height: "194px",
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: "center center"
  };

  // Stacked brand lockup used on the Royal Obsidian back: the first word sits
  // large in serif caps, any remaining words become the tracked gold sub-line
  // ("Victory Hotels" → VICTORY / HOTELS).
  const [brandLead, ...brandRest] = data.company.trim().split(/\s+/);
  const brandSub = brandRest.join(" · ");

  // 1. ROYAL GOLD & OBSIDIAN (24K Gold Alloy)
  if (styleId === "royal-gold") {
    return (
      <div
        className="relative rounded-none overflow-hidden cursor-pointer select-none shadow-2xl"
        style={containerStyle}
        onClick={onFlip}
      >
        {/* Card Front */}
        {!flipped ? (
          <div
            className="w-full h-full p-4 flex flex-col justify-between relative border border-[#D4AF37]/30"
            style={{
              background: "linear-gradient(135deg, #0a0a0d 0%, #1a1921 50%, #0a0a0d 100%)"
            }}
          >
            {/* Fine Brushed Texture Overlay */}
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)"
              }}
            />

            {/* Right Edge Vertically Centered NFC Chip Touchpoint Target */}
            <NFCChipTouchpoint color="#F5D061" textColor="rgba(245,208,97,0.7)" glowColor="rgba(212,175,55,0.12)" />

            {/* Header: Name & Title (Left) + Logo (Center-Right) */}
            {/* Brand mark, pinned to the top-right corner */}
            <div className="absolute top-3 right-3 z-20">
              <VictoryHotelsLogo size={28} variant="gold" />
            </div>

            <div className="flex justify-between items-start z-10 max-w-[245px]">
              <div className="flex flex-col text-left">
                <h2
                  className="text-base font-bold tracking-tight text-transparent bg-clip-text leading-tight"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #FFF2B2 0%, #D4AF37 50%, #F5D061 100%)",
                    fontFamily: "'Cinzel', serif"
                  }}
                >
                  {data.name}
                </h2>
                <p className="text-[9.5px] font-medium text-white/70 tracking-wide mt-0.5">
                  {data.title}
                </p>
              </div>
            </div>

            {/* Center divider line with gold gradient */}
            <div
              className="w-[245px] h-[1px] my-1 z-10"
              style={{
                background:
                  "linear-gradient(90deg, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.1) 100%)"
              }}
            />

            {/* Footer Contact Details */}
            <div className="flex justify-between items-end z-10 text-left max-w-[245px]">
              <div className="flex flex-col gap-0.5 text-[8.5px] text-white/80 font-light w-full">
                <p className="flex items-center gap-1 font-medium text-[#F5D061]">
                  <Phone size={9} className="text-[#D4AF37]" />
                  <span>{data.phone}</span>
                </p>
                <p className="flex items-center gap-1 text-white/60 truncate">
                  <Mail size={9} className="text-[#D4AF37]" />
                  <span>{data.email}</span>
                </p>
                <p className="flex items-center gap-1 text-white/50 text-[7.5px] leading-tight truncate">
                  <MapPin size={9} className="flex-shrink-0 text-[#D4AF37]" />
                  <span className="truncate">{data.address}</span>
                </p>
              </div>
            </div>

            {/* Bottom 24K Gold Foil Strip */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{
                background:
                  "linear-gradient(90deg, #B38728 0%, #FBF5B7 50%, #B38728 100%)"
              }}
            />
          </div>
        ) : (
          /* Card Back */
          <div
            className="w-full h-full p-5 flex items-center justify-between relative border border-[#D4AF37]/30"
            style={{
              background: "linear-gradient(135deg, #08080a 0%, #16151c 100%)"
            }}
          >
            {/* Fine woven texture behind the lockup */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.055) 0.5px, transparent 0.5px)",
                backgroundSize: "3px 3px"
              }}
            />

            {/* Company side: Victory Hotels only — stacked crest over wordmark,
                vertically centred on the left. No personal details. */}
            <div className="flex flex-col items-center justify-center h-full z-10 w-[178px]">
              <VictoryHotelsLogo size={46} variant="gold" />

              <span
                className="text-[19px] leading-none text-[#F7F3E8] mt-2 whitespace-nowrap"
                style={{
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.3em",
                  marginRight: "-0.3em"
                }}
              >
                {brandLead.toUpperCase()}
              </span>

              {brandSub && (
                <span
                  className="text-[6.5px] font-semibold text-[#D4AF37] mt-1.5 whitespace-nowrap"
                  style={{ letterSpacing: "0.42em", marginRight: "-0.42em" }}
                >
                  {brandSub.toUpperCase()}
                </span>
              )}

              <span className="text-[7.5px] text-white/45 mt-3">{data.website}</span>
            </div>

            {/* QR Code Frame */}
            <div className="z-10 p-1.5 rounded-xl bg-gradient-to-tr from-[#B38728] via-[#FBF5B7] to-[#B38728] shadow-lg">
              <div className="bg-[#0a0a0d] p-1.5 rounded-lg">
                <QRCodeSVG value={data.qrLink} size={72} bgColor="transparent" fgColor="#F5D061" level="M" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. CLASSIC HERITAGE IVORY (Elevated Traditional Marble)
  if (styleId === "classic-heritage") {
    return (
      <div
        className="relative rounded-none overflow-hidden cursor-pointer select-none shadow-xl border border-stone-300"
        style={containerStyle}
        onClick={onFlip}
      >
        {!flipped ? (
          <div
            className="w-full h-full p-4 flex flex-col justify-between relative text-stone-900"
            style={{
              background: "#FAF8F5",
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(240, 235, 224, 0.6) 0%, rgba(250, 248, 245, 1) 100%)"
            }}
          >
            {/* Right Edge Vertically Centered NFC Chip Touchpoint Target */}
            <NFCChipTouchpoint color="#9E7D3B" textColor="#654b1f" glowColor="rgba(158,125,59,0.12)" />

            {/* Gold Trim Bottom Line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[4px]"
              style={{
                background: "linear-gradient(90deg, #9E7D3B 0%, #D4AF37 50%, #9E7D3B 100%)"
              }}
            />

            {/* Top Row: Name & Title (Left) + Phone (Right) */}
            <div className="flex justify-between items-start text-left z-10 max-w-[245px]">
              <div>
                <h2
                  className="text-base font-bold text-stone-900 leading-tight"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {data.name}
                </h2>
                <p className="text-[9.5px] font-semibold text-amber-800 tracking-wide">
                  {data.title}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-stone-800 flex items-center justify-end gap-1">
                  <Phone size={8} className="text-amber-700" />
                  <span>{data.phone}</span>
                </p>
              </div>
            </div>

            {/* Center Logo & Company Title */}
            <div className="flex flex-col items-center justify-center my-auto z-10 max-w-[245px]">
              <VictoryHotelsLogo size={38} variant="gold-deep" />
              <h3
                className="text-xs font-extrabold tracking-wider text-stone-900 mt-1"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {data.company}
              </h3>
            </div>

            {/* Footer Address Bar */}
            <div className="w-[245px] pt-1.5 border-t border-stone-300/80 z-10 text-center">
              <p className="text-[8px] text-stone-600 font-medium tracking-tight truncate">
                {data.address}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full p-5 flex items-center justify-between relative bg-[#F7F4EE] text-stone-900 border-b-4 border-amber-600"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(220,210,190,0.2) 1px, transparent 1px)",
              backgroundSize: "12px 12px"
            }}
          >
            <div className="flex flex-col text-left justify-between h-full py-1 z-10 max-w-[170px]">
              <div>
                <VictoryHotelsLogo size={32} variant="gold-deep" />
                <h4 className="text-xs font-bold text-stone-900 mt-1">{data.company}</h4>
                <p className="text-[8.5px] text-amber-800 font-medium">{data.tagline}</p>
              </div>
              <div>
                <p className="text-[8px] text-stone-500">Scan QR or Tap card to save contact</p>
                <p className="text-[9px] font-bold text-stone-800 mt-0.5">{data.website}</p>
              </div>
            </div>

            <div className="bg-white p-2 rounded-xl border border-stone-300 shadow-md">
              <QRCodeSVG value={data.qrLink} size={72} bgColor="#FFFFFF" fgColor="#27251F" level="M" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. MIDNIGHT SAPPHIRE & ROSE GOLD (Modern 5-Star Resort)
  if (styleId === "midnight-sapphire") {
    return (
      <div
        className="relative rounded-none overflow-hidden cursor-pointer select-none shadow-2xl border border-cyan-900/40"
        style={containerStyle}
        onClick={onFlip}
      >
        {!flipped ? (
          <div
            className="w-full h-full p-4 flex flex-col justify-between relative text-white"
            style={{
              background: "linear-gradient(135deg, #09111e 0%, #132238 60%, #080d17 100%)"
            }}
          >
            {/* Right Edge Vertically Centered NFC Chip Touchpoint Target */}
            <NFCChipTouchpoint color="#38BDF8" textColor="#38BDF8" glowColor="rgba(56,189,248,0.12)" />

            {/* Ambient Cyan Soft Glow */}
            <div className="absolute top-[-30px] right-[-30px] w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-start z-10 text-left max-w-[245px]">
              <div>
                <span className="text-[7.5px] uppercase tracking-[0.2em] text-cyan-400 font-bold">
                  5-Star Hospitality
                </span>
                <h2 className="text-base font-bold text-white tracking-tight leading-tight mt-0.5">
                  {data.name}
                </h2>
                <p className="text-[9.5px] text-rose-300 font-medium">{data.title}</p>
              </div>
              <VictoryHotelsLogo size={34} variant="custom" customColor="#F4A261" />
            </div>

            <div className="flex justify-between items-end z-10 text-left max-w-[245px]">
              <div className="flex flex-col gap-0.5 text-[8.5px] text-slate-300 w-full">
                <p className="font-semibold text-rose-300 flex items-center gap-1">
                  <Phone size={9} className="text-cyan-400" /> {data.phone}
                </p>
                <p className="text-slate-400 flex items-center gap-1 truncate">
                  <Mail size={9} className="text-cyan-400" /> {data.email}
                </p>
                <p className="text-slate-400 flex items-center gap-1 text-[7.5px] truncate">
                  <MapPin size={9} className="text-cyan-400 flex-shrink-0" /> {data.address}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full p-5 flex items-center justify-between relative text-white"
            style={{
              background: "linear-gradient(135deg, #070c14 0%, #101c2e 100%)"
            }}
          >
            <div className="flex flex-col text-left justify-between h-full py-1 z-10">
              <VictoryHotelsLogo size={32} variant="custom" customColor="#F4A261" />
              <div>
                <p className="text-[8px] uppercase tracking-widest text-cyan-400">
                  {data.company}
                </p>
                <p className="text-xs font-bold text-white">{data.name}</p>
                <p className="text-[8.5px] text-slate-400">{data.title}</p>
              </div>
              <p className="text-[7.5px] text-slate-500">Tap to connect via NFC</p>
            </div>

            <div className="bg-slate-900/90 p-2 rounded-xl border border-cyan-500/30 shadow-lg">
              <QRCodeSVG value={data.qrLink} size={72} bgColor="transparent" fgColor="#38BDF8" level="M" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. SATIN CHAMPAGNE SILK (Boutique Executive)
  if (styleId === "champagne-silk") {
    return (
      <div
        className="relative rounded-none overflow-hidden cursor-pointer select-none shadow-xl border border-amber-200"
        style={containerStyle}
        onClick={onFlip}
      >
        {!flipped ? (
          <div
            className="w-full h-full p-4 flex flex-col justify-between relative text-stone-900"
            style={{
              background: "linear-gradient(135deg, #F9F6F0 0%, #EFE8DA 100%)"
            }}
          >
            {/* Right Edge Vertically Centered NFC Chip Touchpoint Target */}
            <NFCChipTouchpoint color="#B8860B" textColor="#443525" glowColor="rgba(184,134,11,0.12)" />

            <div className="flex justify-between items-center z-10 text-left border-b border-amber-900/10 pb-2 max-w-[245px]">
              <div>
                <h2
                  className="text-base font-bold text-stone-900 leading-tight"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {data.name}
                </h2>
                <p className="text-[9.5px] font-semibold text-amber-900">{data.title}</p>
              </div>
              <VictoryHotelsLogo size={32} variant="gold-deep" />
            </div>

            <div className="flex justify-between items-end z-10 text-left pt-1 max-w-[245px]">
              <div className="flex flex-col gap-0.5 text-[8.5px] text-stone-700">
                <p className="font-bold text-amber-950">{data.phone}</p>
                <p className="text-stone-600">{data.email}</p>
                <p className="text-[7.5px] text-stone-500 truncate">{data.address}</p>
              </div>
              <span className="text-[7px] uppercase tracking-widest text-amber-800 font-bold bg-amber-200/50 px-2 py-0.5 rounded-full">
                {data.company}
              </span>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full p-5 flex items-center justify-between relative bg-[#EFE8DA] text-stone-900"
            onClick={onFlip}
          >
            <div className="flex flex-col text-left justify-between h-full py-1">
              <VictoryHotelsLogo size={30} variant="gold-deep" />
              <div>
                <p className="text-[8px] uppercase tracking-wider text-amber-900 font-semibold">
                  Victory Hotels Executive
                </p>
                <p className="text-xs font-bold text-stone-900">{data.name}</p>
              </div>
              <p className="text-[8px] text-stone-500">{data.website}</p>
            </div>

            <div className="bg-white p-2 rounded-xl shadow-md border border-amber-200">
              <QRCodeSVG value={data.qrLink} size={72} bgColor="#FFF" fgColor="#443525" level="M" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // 5. FROSTED CYBER-GLASSMORPHISM (Digital Smart NFC)
  return (
    <div
      className="relative rounded-none overflow-hidden cursor-pointer select-none shadow-2xl border border-white/20"
      style={containerStyle}
      onClick={onFlip}
    >
      {/* Background Glow Blobs */}
      <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-36 h-36 bg-amber-500/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-indigo-500/30 rounded-full blur-2xl" />
      </div>

      {!flipped ? (
        <div
          className="w-full h-full p-4 flex flex-col justify-between relative z-10 text-white backdrop-blur-xl bg-white/[0.05]"
        >
          {/* Right Edge Vertically Centered NFC Chip Touchpoint Target */}
          <NFCChipTouchpoint color="#FBBF24" textColor="#FBBF24" glowColor="rgba(251,191,36,0.15)" />

          <div className="flex justify-between items-start text-left max-w-[245px]">
            <div>
              <span className="text-[7px] uppercase tracking-[0.3em] font-bold text-amber-400">
                Digital NFC Card
              </span>
              <h2 className="text-base font-bold text-white leading-tight mt-0.5">{data.name}</h2>
              <p className="text-[9.5px] text-amber-200/90 font-medium">{data.title}</p>
            </div>
            <VictoryHotelsLogo size={34} variant="gold" />
          </div>

          <div className="flex justify-between items-end text-left max-w-[245px]">
            <div className="flex flex-col gap-0.5 text-[8.5px] text-white/80 w-full">
              <p className="font-semibold text-amber-300">{data.phone}</p>
              <p className="text-white/60 truncate">{data.email}</p>
              <p className="text-white/40 text-[7.5px] truncate">{data.address}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full p-5 flex items-center justify-between relative z-10 text-white backdrop-blur-xl bg-white/[0.06]">
          <div className="flex flex-col text-left justify-between h-full py-1">
            <VictoryHotelsLogo size={28} variant="gold" />
            <div>
              <p className="text-[8px] uppercase tracking-wider text-amber-400 font-semibold">
                {data.company}
              </p>
              <p className="text-xs font-bold text-white">{data.name}</p>
            </div>
            <p className="text-[7.5px] text-white/50">Tap NFC or scan QR code</p>
          </div>

          <div className="bg-white/90 p-2 rounded-xl shadow-lg border border-white/40">
            <QRCodeSVG value={data.qrLink} size={72} bgColor="transparent" fgColor="#111" level="M" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main App Application Component ─────────────────────────────────────────
export default function App() {
  const [data, setData] = useState<ManagerCardData>(DEFAULT_VICTORY_DATA);
  const [selectedStyleId, setSelectedStyleId] = useState<string>("royal-gold");
  const [previewFlipped, setPreviewFlipped] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"inspector" | "gallery">("gallery");

  const currentStyle =
    DESIGN_STYLES.find((s) => s.id === selectedStyleId) || DESIGN_STYLES[0];

  const handlePrint = () => {
    window.print();
  };

  // PNG export. Capturing the on-screen preview would only ever catch whichever
  // side happens to be flipped up, so each design is also rendered into an
  // off-screen stage holding front and back together; that pair is what we
  // rasterise, giving one file with both sides.
  const exportRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (styleId: string) => {
    const node = exportRefs.current[styleId];
    if (!node || downloadingId) return;

    setDownloadingId(styleId);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 4, cacheBust: true });
      const slug = (value: string) =>
        value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${slug(data.name)}-${styleId}-card.png`;
      link.click();
    } catch (error) {
      console.error("Card PNG export failed", error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between py-6 px-4 md:px-10 text-slate-100"
      style={{
        background:
          "radial-gradient(ellipse 95% 75% at 50% 10%, #0d111a 0%, #04060a 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* Dynamic Printing CSS for Standard CR-80 Card Blueprint */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            .no-print { display: none !important; }
            .print-only {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              background: white !important;
              min-height: 100vh !important;
              width: 100vw !important;
              padding: 20px !important;
              margin: 0 !important;
            }
            .card-unit {
              width: 3.5in !important;
              height: 2.0in !important;
              page-break-inside: avoid !important;
            }
          }
          .print-only { display: none; }
        `
        }}
      />

      {/* App Header (No Print) */}
      <header className="no-print flex flex-col md:flex-row justify-between items-center gap-4 mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 p-[1px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <VictoryHotelsLogo size={24} variant="gold" />
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h1
                className="text-lg font-extrabold text-white tracking-tight"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Victory Hotels
              </h1>
              <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                Executive NFC Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Card Designs for Corporate General Manager · Vittal Jadhav
            </p>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("gallery")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              viewMode === "gallery"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <LayoutGrid size={14} />
            <span>5-Design Gallery</span>
          </button>
          <button
            onClick={() => setViewMode("inspector")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              viewMode === "inspector"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Sliders size={14} />
            <span>Custom Inspector</span>
          </button>
          <button
            onClick={() => handleDownload(selectedStyleId)}
            disabled={downloadingId !== null}
            title={`Download ${currentStyle.name} as PNG (front & back)`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadingId ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            <span>{downloadingId ? "Preparing…" : "Download PNG"}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:brightness-110 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>
        </div>
      </header>

      {/* Typo Correction Banner Notice */}
      <div className="no-print max-w-7xl w-full mx-auto mb-6 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Check size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300">
                Right-Edge NFC Chip Target & Wi-Fi Icon Applied
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                Updated Layout
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              NFC Chip touchpoint graphic with Wi-Fi signal waves & 90° clockwise text is centered vertically at the right end of the card.
            </p>
          </div>
        </div>
        <button
          onClick={() => setData(DEFAULT_VICTORY_DATA)}
          className="hidden md:flex items-center gap-1 text-[11px] text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl hover:bg-amber-500/20"
        >
          <RotateCw size={12} /> Reset Victory Defaults
        </button>
      </div>

      {/* MAIN GALLERY VIEW */}
      {viewMode === "gallery" && (
        <main className="no-print max-w-7xl w-full mx-auto flex-grow flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="text-left">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="text-amber-400" size={16} /> 5 Executive Design Options for Manager
              </h2>
              <p className="text-xs text-slate-400">
                Click any card to flip front/back. Select a design to customize in detail.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {DESIGN_STYLES.map((style) => (
              <div
                key={style.id}
                className={`bg-slate-900/60 border rounded-2xl p-5 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 hover:border-amber-500/50 ${
                  selectedStyleId === style.id
                    ? "border-amber-500 ring-2 ring-amber-500/20 shadow-xl shadow-amber-500/5"
                    : "border-slate-800 hover:bg-slate-900/90"
                }`}
              >
                {/* Header & Badges */}
                <div className="flex items-center justify-between mb-3 text-left">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {style.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">{style.name}</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium bg-slate-800 px-2 py-1 rounded-lg">
                    {style.badge}
                  </span>
                </div>

                {/* Card Container Preview */}
                <div className="my-4 flex justify-center items-center bg-slate-950/80 rounded-xl p-4 border border-slate-800/80">
                  <RenderExecutiveCard
                    styleId={style.id}
                    data={data}
                    flipped={previewFlipped}
                    onFlip={() => setPreviewFlipped((f) => !f)}
                  />
                </div>

                {/* Description & Action */}
                <div className="text-left mt-2">
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                    {style.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedStyleId(style.id);
                        setViewMode("inspector");
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold border border-amber-500/30 transition-all"
                    >
                      <span>Customize & Export</span>
                      <ArrowRight size={13} />
                    </button>
                    <button
                      onClick={() => handleDownload(style.id)}
                      disabled={downloadingId !== null}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Download PNG (front & back)"
                    >
                      {downloadingId === style.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Download size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => setPreviewFlipped((f) => !f)}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Flip Preview Card"
                    >
                      <RotateCw size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* INSPECTOR VIEW: DETAILED EDITING & CARD SHOWROOM */}
      {viewMode === "inspector" && (
        <main className="no-print max-w-7xl w-full mx-auto flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Detailed Form Controls */}
          <section className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-left flex flex-col gap-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold text-white">Manager Information</h3>
              </div>
              <button
                onClick={() => setData(DEFAULT_VICTORY_DATA)}
                className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
              >
                <RotateCw size={10} /> Reset
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 px-3 py-2 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 px-3 py-2 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={data.company}
                  onChange={(e) => setData({ ...data, company: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 px-3 py-2 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 px-3 py-2 rounded-xl text-xs text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 px-3 py-2 rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Office / Hotel Address
                </label>
                <textarea
                  rows={2}
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 px-3 py-2 rounded-xl text-xs text-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  NFC / QR Link URL
                </label>
                <input
                  type="text"
                  value={data.qrLink}
                  onChange={(e) => setData({ ...data, qrLink: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 px-3 py-2 rounded-xl text-xs text-amber-400 font-mono outline-none"
                />
              </div>
            </div>
          </section>

          {/* Center Stage: Card Inspector Preview */}
          <section className="lg:col-span-5 flex flex-col items-center justify-center gap-6">
            <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center relative min-h-[320px]">
              <span className="absolute top-3 left-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                Live Interactive Stage · 3.5" × 2.0"
              </span>

              {/* Render Selected Card */}
              <div className="py-6">
                <RenderExecutiveCard
                  styleId={selectedStyleId}
                  data={data}
                  flipped={previewFlipped}
                  onFlip={() => setPreviewFlipped((f) => !f)}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewFlipped((f) => !f)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all"
                >
                  <RotateCw size={14} />
                  <span>Flip Card (Front / Back)</span>
                </button>
              </div>
            </div>

            <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-left">
              <h4 className="text-xs font-bold text-amber-400 mb-1">{currentStyle.name} Specs</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{currentStyle.description}</p>
            </div>
          </section>

          {/* Right Panel: Style Selector List */}
          <section className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-left flex flex-col gap-3 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              Switch Design Concept
            </h3>
            <div className="flex flex-col gap-2">
              {DESIGN_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyleId(s.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedStyleId === s.id
                      ? "bg-amber-500/10 border-amber-500 text-amber-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{s.name}</span>
                    {selectedStyleId === s.id && <Check size={12} className="text-amber-400" />}
                  </div>
                  <span className="text-[9.5px] text-slate-400 block mt-0.5">{s.tagline}</span>
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* PNG EXPORT STAGE — off-screen, never visible, never printed.
          Rendered (not display:none) so html-to-image can rasterise it. */}
      <div
        aria-hidden
        className="no-print fixed top-0 left-0 pointer-events-none opacity-0"
        style={{ transform: "translateX(-200vw)", zIndex: -1 }}
      >
        {DESIGN_STYLES.map((style) => (
          <div
            key={style.id}
            ref={(el) => {
              exportRefs.current[style.id] = el;
            }}
            className="flex flex-row items-center gap-6 p-6"
          >
            <RenderExecutiveCard styleId={style.id} data={data} flipped={false} />
            <RenderExecutiveCard styleId={style.id} data={data} flipped={true} />
          </div>
        ))}
      </div>

      {/* PRINT BLUEPRINT MODE (Visible only during printing or PDF export) */}
      <div className="print-only flex-col items-center justify-center gap-8 bg-white min-h-screen text-slate-900">
        <div className="text-center">
          <h2 className="text-lg font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
            Victory Hotels — Business Card Print Blueprint
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Calibrated for standard CR-80 card printing (3.5 in × 2.0 in)
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              Card Front
            </span>
            <div className="card-unit border border-slate-300 rounded-none overflow-hidden">
              <RenderExecutiveCard styleId={selectedStyleId} data={data} flipped={false} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              Card Back
            </span>
            <div className="card-unit border border-slate-300 rounded-none overflow-hidden">
              <RenderExecutiveCard styleId={selectedStyleId} data={data} flipped={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer (No Print) */}
      <footer className="no-print mt-8 border-t border-slate-800 pt-4 text-center text-[10px] text-slate-500">
        © 2026 Victory Hotels · Executive NFC Card Studio & Print Engine
      </footer>
    </div>
  );
}
