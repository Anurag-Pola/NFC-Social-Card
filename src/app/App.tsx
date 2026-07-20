import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Link2,
  User,
  Briefcase,
  Building,
  Sparkles,
  RotateCw,
  Printer,
  Cpu,
  Layers,
  Palette,
  Check,
  Bookmark,
  Edit
} from "lucide-react";

// ── Custom Branded SVG Icons for Cards ─────────────────────────────────────

const NFCWave = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="2" fill="currentColor" />
    <path d="M7.5 7.5a4.95 4.95 0 0 1 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4.5 4.5a9.19 9.19 0 0 1 13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const InstagramSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
  </svg>
);

const LinkedInSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M7 10v7M7 7v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M11 17v-3.5c0-1.5 1-2.5 2.5-2.5S16 11 16 13v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M11 10v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ContactSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.2 12.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CustomSVG = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Get platform icon helper
const getPlatformIcon = (pId: string, size = 24) => {
  switch (pId) {
    case "instagram": return <InstagramSVG size={size} />;
    case "linkedin": return <LinkedInSVG size={size} />;
    case "contact": return <ContactSVG size={size} />;
    default: return <CustomSVG size={size} />;
  }
};

// ── Premium Micro-Components ────────────────────────────────────────────────

// Corner bracket marks for premium card faces
const CornerMarks = ({ color }: { color: string }) => {
  const len = 12;
  const t = 1.2;
  const off = 10;
  const style = { position: "absolute" as const, width: len, height: len };
  const line = { background: color, position: "absolute" as const };
  return (
    <>
      <div style={{ ...style, top: off, left: off }}>
        <div style={{ ...line, top: 0, left: 0, width: t, height: len }} />
        <div style={{ ...line, top: 0, left: 0, width: len, height: t }} />
      </div>
      <div style={{ ...style, top: off, right: off }}>
        <div style={{ ...line, top: 0, right: 0, width: t, height: len }} />
        <div style={{ ...line, top: 0, right: 0, width: len, height: t }} />
      </div>
      <div style={{ ...style, bottom: off, left: off }}>
        <div style={{ ...line, bottom: 0, left: 0, width: t, height: len }} />
        <div style={{ ...line, bottom: 0, left: 0, width: len, height: t }} />
      </div>
      <div style={{ ...style, bottom: off, right: off }}>
        <div style={{ ...line, bottom: 0, right: 0, width: t, height: len }} />
        <div style={{ ...line, bottom: 0, right: 0, width: len, height: t }} />
      </div>
    </>
  );
};

// ── Finished Styling Helpers ───────────────────────────────────────────────

const getBrushedMetalConfig = (finish: "gold" | "silver" | "black") => {
  let baseBg = "";
  let textGrad = "";
  let accentGrad = "";
  let borderColor = "";
  let labelColor = "";

  if (finish === "gold") {
    baseBg = "linear-gradient(135deg, #18150d 0%, #2f2510 50%, #18150d 100%)";
    textGrad = "linear-gradient(135deg, #FFE89C 0%, #D4AF37 50%, #F5D061 100%)";
    accentGrad = "linear-gradient(135deg, #f6e3a6 0%, #c59f27 50%, #f6e3a6 100%)";
    borderColor = "rgba(212, 175, 55, 0.4)";
    labelColor = "#bda054";
  } else if (finish === "silver") {
    baseBg = "linear-gradient(135deg, #141517 0%, #272a2e 50%, #141517 100%)";
    textGrad = "linear-gradient(135deg, #FFFFFF 0%, #a1a1aa 50%, #e4e4e7 100%)";
    accentGrad = "linear-gradient(135deg, #ffffff 0%, #71717a 50%, #ffffff 100%)";
    borderColor = "rgba(161, 161, 170, 0.4)";
    labelColor = "#9ea2a8";
  } else {
    // Obsidian Black
    baseBg = "linear-gradient(135deg, #090a0d 0%, #1a1b22 50%, #090a0d 100%)";
    textGrad = "linear-gradient(135deg, #a1a1aa 0%, #3f3f46 50%, #8b8d99 100%)";
    accentGrad = "linear-gradient(135deg, #52525b 0%, #18181b 50%, #52525b 100%)";
    borderColor = "rgba(255, 255, 255, 0.12)";
    labelColor = "#71717a";
  }

  return { baseBg, textGrad, accentGrad, borderColor, labelColor };
};

// ── Static Card Component (NFC Touchpoint: 90-deg rotated platform icon and text on the right) ──

interface CardProps {
  name: string;
  title: string;
  company: string;
  handle: string;
  sub: string;
  qrLink: string;
  tagline: string;
  variant: "standard" | "premium" | "glass";
  accentColor: string;
  metalFinish: "gold" | "silver" | "black";
  glassBlobStyle: string;
  platform: string;
  flipped: boolean;
  setFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

function ShowroomCard({
  name, title, company, handle, sub, qrLink, tagline,
  variant, accentColor, metalFinish, glassBlobStyle, platform,
  flipped, setFlipped
}: CardProps) {
  const metal = getBrushedMetalConfig(metalFinish);

  // Static backdrop colors for Glass Finish
  const getGlassBackdrop = () => {
    let color1 = "#ff007f";
    let color2 = "#8200ff";
    if (glassBlobStyle === "sunset") {
      color1 = "#ff7b00";
      color2 = "#ff0055";
    } else if (glassBlobStyle === "nebula") {
      color1 = "#00c3ff";
      color2 = "#7000ff";
    }
    return (
      <>
        <div className="absolute w-[200px] h-[200px] rounded-full filter blur-[32px] opacity-60 top-[-50px] left-[-30px]" style={{ background: color1 }} />
        <div className="absolute w-[180px] h-[180px] rounded-full filter blur-[36px] opacity-50 bottom-[-40px] right-[-20px]" style={{ background: color2 }} />
      </>
    );
  };

  return (
    <div className="w-full h-full relative cursor-pointer select-none" onClick={() => setFlipped(prev => !prev)}>
      {/* Glass Blobs behind Glass Finish */}
      {variant === "glass" && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
          {getGlassBackdrop()}
        </div>
      )}

      {/* Static Shadow Cast */}
      <div
        className="absolute inset-0 rounded-2xl z-0 pointer-events-none"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          filter: "blur(14px)",
          transform: "translate3d(0, 8px, -10px) scale(0.96)",
        }}
      />

      {/* Card Content - Conditionally render to avoid stacking/double text */}
      <div className="w-full h-full relative z-10">

        {/* 1. STANDARD CARD */}
        {variant === "standard" && !flipped && (
          <div
            className="w-full h-full rounded-2xl overflow-hidden flex justify-between items-center p-5 border border-white/5 relative"
            style={{
              background: `linear-gradient(135deg, #0d0f14 0%, ${accentColor}12 60%, #06070a 100%)`,
              boxShadow: `inset 0 0 0 1.5px ${accentColor}25, 0 10px 25px rgba(0,0,0,0.45)`,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.05] rounded-2xl"
              style={{
                backgroundImage: `radial-gradient(circle, ${accentColor} 1px, transparent 1px)`,
                backgroundSize: "16px 16px",
              }}
            />
            {/* Left Column - Info */}
            <div className="flex flex-col justify-between h-full flex-grow z-10 text-left">
              <div>
                <p className="text-[7.5px] font-medium tracking-[0.25em] uppercase mb-1 text-left" style={{ color: `${accentColor}cc` }}>
                  {tagline || "Digital NFC Card"}
                </p>
                <h2 className="text-lg font-bold tracking-tight text-white/95 leading-tight text-left">{name || "Your Name"}</h2>
                <p className="text-[10px] font-light text-white/50 text-left">{title || "Your Title"} · {company || "Company"}</p>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.2em] uppercase text-white/30 mb-0.5 text-left">Platform Handler</p>
                <p className="text-xs font-semibold text-left truncate max-w-[170px]" style={{ color: accentColor }}>{handle || "@yourhandle"}</p>
                <p className="text-[9px] text-white/45 font-light text-left truncate max-w-[170px]">{sub || "Tap card to connect"}</p>
              </div>
            </div>

            {/* Right Column - Concentric Wave NFC Touchpoint with Sideways Text and Sideways Icon */}
            <div className="flex flex-row items-center justify-center flex-shrink-0 select-none z-10 mr-[-6px]">
              <div className="relative flex items-center justify-center w-[72px] h-[72px] rounded-full border" style={{ borderColor: `${accentColor}11`, background: `${accentColor}03` }}>
                <div className="absolute flex items-center justify-center w-[54px] h-[54px] rounded-full border" style={{ borderColor: `${accentColor}22`, background: `${accentColor}06` }}>
                  <div className="absolute flex items-center justify-center w-9 h-9 rounded-full border bg-white/[0.04]" style={{ color: accentColor, borderColor: `${accentColor}44` }}>
                    <div className="-rotate-90 flex items-center justify-center">
                      {getPlatformIcon(platform, 15)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-4 h-[72px] flex items-center justify-center">
                <span className="text-[5.5px] tracking-[0.3em] uppercase font-bold text-white/30 -rotate-90 origin-center whitespace-nowrap select-none">
                  Tap Here
                </span>
              </div>
            </div>
          </div>
        )}

        {variant === "standard" && flipped && (
          <div
            className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-between px-6 border border-white/5 relative"
            style={{
              background: `linear-gradient(135deg, #050608 0%, ${accentColor}1f 50%, #0d0f14 100%)`,
              boxShadow: `inset 0 0 0 1.5px ${accentColor}25, 0 10px 25px rgba(0,0,0,0.45)`,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.05] rounded-2xl"
              style={{
                backgroundImage: `radial-gradient(circle, ${accentColor} 1px, transparent 1px)`,
                backgroundSize: "16px 16px",
              }}
            />
            <div className="flex flex-col justify-between h-full py-5 text-left z-10">
              <div style={{ color: accentColor }}><NFCWave size={22} /></div>
              <div>
                <p className="text-[7.5px] font-medium tracking-[0.25em] uppercase text-white/30 text-left">Quick Link</p>
                <p className="text-sm font-bold text-white/90 truncate max-w-[150px] text-left">{name || "Your Name"}</p>
                <p className="text-[9px] text-white/50 mt-0.5 font-light truncate max-w-[150px] text-left">{handle || "@yourhandle"}</p>
              </div>
              <div className="flex items-center gap-1.5 text-white/40 text-left">
                <span className="text-[7px] tracking-wider uppercase text-left font-semibold">NFC Enabled</span>
              </div>
            </div>
            <div className="z-10 flex flex-col items-center">
              <div className="rounded-xl p-2 bg-white flex-shrink-0" style={{
                border: `1.5px solid ${accentColor}`,
                boxShadow: `0 8px 24px ${accentColor}25`,
              }}>
                <QRCodeSVG value={qrLink || "https://google.com"} size={76} bgColor="transparent" fgColor="#0d0f14" level="M" />
              </div>
            </div>
          </div>
        )}

        {/* 2. PREMIUM METAL CARD */}
        {variant === "premium" && !flipped && (
          <div
            className="w-full h-full rounded-2xl overflow-hidden relative"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  rgba(255, 255, 255, 0.007) 0px,
                  rgba(255, 255, 255, 0.007) 1px,
                  transparent 1px,
                  transparent 3.5px
                ),
                ${metal.baseBg}
              `,
              boxShadow: `0 0 0 1px ${metal.borderColor}, inset 0 0 15px rgba(0,0,0,0.8), 0 15px 35px rgba(0,0,0,0.5)`,
            }}
          >
            <CornerMarks color={`${metal.labelColor}44`} />
            <div className="w-full h-full flex justify-between items-center p-5 z-10 select-none relative">
              {/* Left Column - Info */}
              <div className="flex flex-col justify-between h-full flex-grow text-left">
                <div>
                  <p className="text-[7.5px] font-semibold tracking-[0.35em] uppercase mb-1 text-left" style={{ color: metal.labelColor }}>
                    {tagline || "Metal Premium Series"}
                  </p>
                  <h2 className="text-lg font-bold tracking-tight bg-clip-text text-transparent leading-tight text-left" style={{ backgroundImage: metal.textGrad }}>
                    {name || "Your Name"}
                  </h2>
                  <p className="text-[10px] font-medium tracking-wide text-white/40 text-left">{title || "Your Title"} · {company || "Company"}</p>
                </div>
                <div>
                  <p className="text-[8px] tracking-[0.2em] uppercase text-white/20 mb-0.5 text-left">Custom ID</p>
                  <p className="text-xs font-bold tracking-wide text-left truncate max-w-[170px]" style={{ color: metal.labelColor }}>{handle || "@yourhandle"}</p>
                  <p className="text-[9px] text-white/30 font-medium text-left truncate max-w-[170px]">{sub || "Tap to connect"}</p>
                </div>
              </div>

              {/* Right Column - Premium Concentric Waves with rotated elements */}
              <div className="flex flex-row items-center justify-center flex-shrink-0 select-none z-10 mr-[-6px]">
                <div className="relative flex items-center justify-center w-[72px] h-[72px] rounded-full border border-white/[0.02] bg-white/[0.003]">
                  <div className="absolute flex items-center justify-center w-[54px] h-[54px] rounded-full border border-white/[0.05] bg-white/[0.007]">
                    <div className="absolute flex items-center justify-center w-9 h-9 rounded-full border bg-white/[0.02]" style={{ color: metal.labelColor, borderColor: `${metal.labelColor}44` }}>
                      <div className="-rotate-90 flex items-center justify-center">
                        {getPlatformIcon(platform, 15)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-4 h-[72px] flex items-center justify-center">
                  <span className="text-[5.5px] tracking-[0.3em] uppercase font-bold text-white/20 -rotate-90 origin-center whitespace-nowrap select-none">
                    Tap Here
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {variant === "premium" && flipped && (
          <div
            className="w-full h-full rounded-2xl overflow-hidden relative"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  rgba(255, 255, 255, 0.007) 0px,
                  rgba(255, 255, 255, 0.007) 1px,
                  transparent 1px,
                  transparent 3.5px
                ),
                ${metal.baseBg}
              `,
              boxShadow: `0 0 0 1px ${metal.borderColor}, inset 0 0 15px rgba(0,0,0,0.8), 0 15px 35px rgba(0,0,0,0.5)`,
            }}
          >
            <CornerMarks color={`${metal.labelColor}44`} />
            <div className="w-full h-full flex items-center justify-between px-7 relative">
              <div className="flex flex-col justify-between h-full py-5 text-left z-10">
                <div style={{ color: metal.labelColor }}><NFCWave size={24} /></div>
                <div>
                  <p className="text-[7.5px] font-semibold tracking-[0.35em] uppercase text-left" style={{ color: metal.labelColor }}>Member ID</p>
                  <h3 className="text-sm font-bold tracking-wide bg-clip-text text-transparent truncate max-w-[150px] text-left" style={{ backgroundImage: metal.textGrad }}>
                    {name || "Your Name"}
                  </h3>
                  <p className="text-[9px] text-white/35 font-medium truncate max-w-[150px] text-left">{handle || "@yourhandle"}</p>
                </div>
                <div className="flex items-center gap-1.5 text-white/20 text-left">
                  <span className="text-[7px] tracking-widest uppercase text-left font-semibold">Metallic engraving</span>
                </div>
              </div>
              <div className="z-10 flex flex-col items-center">
                <div className="p-[1.5px] rounded-[14px] flex-shrink-0" style={{
                  background: metal.accentGrad,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.4)"
                }}>
                  <div className="rounded-[12.5px] p-2 bg-[#090a0d]">
                    <QRCodeSVG value={qrLink || "https://google.com"} size={76} bgColor="transparent" fgColor={metal.labelColor} level="M" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. GLASSMORPHISM CARD */}
        {variant === "glass" && !flipped && (
          <div
            className="w-full h-full rounded-2xl overflow-hidden flex justify-between items-center p-5 relative"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(24px) saturate(140%)",
              WebkitBackdropFilter: "blur(24px) saturate(140%)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2), 0 10px 25px rgba(0,0,0,0.3)",
            }}
          >
            {/* Left Column - Info */}
            <div className="flex flex-col justify-between h-full flex-grow z-10 text-left">
              <div>
                <p className="text-[7.5px] font-medium tracking-[0.28em] uppercase mb-1 text-left" style={{ color: `${accentColor}ee` }}>
                  {tagline || "Frosted Glass Concept"}
                </p>
                <h2 className="text-lg font-bold tracking-tight text-white/90 leading-tight text-left">{name || "Your Name"}</h2>
                <p className="text-[10px] font-light text-white/45 text-left">{title || "Your Title"} · {company || "Company"}</p>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.2em] uppercase text-white/25 mb-0.5 text-left">Interface</p>
                <p className="text-xs font-semibold text-white/95 text-left truncate max-w-[170px]">{handle || "@yourhandle"}</p>
                <p className="text-[9px] text-white/35 font-light text-left truncate max-w-[170px]">{sub || "Tap to connect"}</p>
              </div>
            </div>

            {/* Right Column - Glass Concentric Waves with rotated elements */}
            <div className="flex flex-row items-center justify-center flex-shrink-0 select-none z-10 mr-[-6px]">
              <div className="relative flex items-center justify-center w-[72px] h-[72px] rounded-full border" style={{ borderColor: "rgba(255,255,255,0.03)", background: "rgba(255,255,255,0.01)" }}>
                <div className="absolute flex items-center justify-center w-[54px] h-[54px] rounded-full border" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                  <div className="absolute flex items-center justify-center w-9 h-9 rounded-full border" style={{ color: accentColor, borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.04)" }}>
                    <div className="-rotate-90 flex items-center justify-center">
                      {getPlatformIcon(platform, 15)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-4 h-[72px] flex items-center justify-center">
                <span className="text-[5.5px] tracking-[0.3em] uppercase font-bold text-white/25 -rotate-90 origin-center whitespace-nowrap select-none">
                  Tap Here
                </span>
              </div>
            </div>
          </div>
        )}

        {variant === "glass" && flipped && (
          <div
            className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-between px-6 relative"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              backdropFilter: "blur(24px) saturate(140%)",
              WebkitBackdropFilter: "blur(24px) saturate(140%)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2), 0 10px 25px rgba(0,0,0,0.3)",
            }}
          >
            <div className="flex flex-col justify-between h-full py-5 text-left z-10">
              <div style={{ color: accentColor }}><NFCWave size={22} /></div>
              <div>
                <p className="text-[7.5px] font-medium tracking-[0.28em] uppercase text-left" style={{ color: `${accentColor}cc` }}>Digital Portal</p>
                <p className="text-sm font-bold text-white/90 truncate max-w-[150px] text-left">{name || "Your Name"}</p>
                <p className="text-[9px] text-white/45 font-light truncate max-w-[150px] text-left">{handle || "@yourhandle"}</p>
              </div>
              <div className="flex items-center gap-1.5 text-white/30 text-left">
                <span className="text-[7px] tracking-wider uppercase text-left font-semibold" style={{ color: `${accentColor}bb` }}>Induction loop back</span>
              </div>
            </div>
            <div className="z-10 flex flex-col items-center">
              <div className="rounded-xl p-2 border relative overflow-hidden flex-shrink-0" style={{
                background: "rgba(255, 255, 255, 0.88)",
                borderColor: "rgba(255, 255, 255, 0.25)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
              }}>
                <QRCodeSVG value={qrLink || "https://google.com"} size={76} bgColor="transparent" fgColor="#111" level="M" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── App Container ──────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "instagram", name: "Instagram", color: "#e1306c", icon: Instagram },
  { id: "linkedin", name: "LinkedIn", color: "#0ea5e9", icon: Linkedin },
  { id: "contact", name: "Contact/VCARD", color: "#7c6ef5", icon: Mail },
  { id: "custom", name: "Custom URL", color: "#10b981", icon: Link2 },
];

const FINISHES = [
  { id: "standard", name: "Standard Matte", desc: "Velvety anti-glare finish" },
  { id: "premium", name: "Premium Metal", desc: "Luxury brushed solid weight" },
  { id: "glass", name: "Glassmorphism", desc: "Translucent epoxy circuit concept" },
] as const;

export default function App() {
  const [name, setName] = useState("Jane Doe");
  const [title, setTitle] = useState("Senior Product Designer");
  const [company, setCompany] = useState("AeroLabs");
  const [handle, setHandle] = useState("@jane_design");
  const [sub, setSub] = useState("Tap to access my portfolio");
  const [qrLink, setQrLink] = useState("https://instagram.com/jane_design");
  const [platform, setPlatform] = useState("instagram");
  const [variant, setVariant] = useState<"standard" | "premium" | "glass">("standard");
  const [accentColor, setAccentColor] = useState("#e1306c");
  const [tagline, setTagline] = useState("Creative & Lifestyle");

  // Variant sub-settings
  const [metalFinish, setMetalFinish] = useState<"gold" | "silver" | "black">("gold");
  const [glassBlobStyle, setGlassBlobStyle] = useState<"aurora" | "sunset" | "nebula">("aurora");

  // Flip Preview State
  const [flipped, setFlipped] = useState(false);

  // Apply templates
  const applyTemplate = (pId: string) => {
    setPlatform(pId);
    setFlipped(false);
    if (pId === "instagram") {
      setTagline("Creative & Lifestyle");
      setHandle("@jane_design");
      setSub("Follow for daily snapshots");
      setQrLink("https://instagram.com/jane_design");
      setAccentColor("#e1306c");
    } else if (pId === "linkedin") {
      setTagline("Professional Network");
      setHandle("Jane Doe");
      setSub("Connect on LinkedIn");
      setQrLink("https://linkedin.com/in/jane-doe");
      setAccentColor("#0ea5e9");
    } else if (pId === "contact") {
      setTagline("Get in Touch");
      setHandle("hello@aerolabs.design");
      setSub("+1 (555) 489-3921");
      setQrLink("mailto:hello@aerolabs.design");
      setAccentColor("#7c6ef5");
    } else {
      setTagline("My Personal Portal");
      setHandle("aerolabs.design/jane");
      setSub("Scan to view my ecosystem");
      setQrLink("https://aerolabs.design/jane");
      setAccentColor("#10b981");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between py-8 px-6 md:px-12 text-[#f0f0f5]"
      style={{
        background: "radial-gradient(ellipse 95% 75% at 50% 15%, #0d0c1c 0%, #050508 100%)",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      {/* Dynamic Printing CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .print-only {
          display: none !important;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
            height: 100vh !important;
            width: 100vw !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-card-wrapper {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 40px !important;
          }
          .print-title {
            display: block !important;
            color: #111 !important;
            font-size: 14px !important;
            margin-bottom: 10px !important;
            text-align: center !important;
          }
          .card-unit {
            width: 3.5in !important;
            height: 2.0in !important;
            position: relative !important;
            box-shadow: none !important;
            transform: none !important;
            border: 1px solid #ddd !important;
            border-radius: 0.25in !important;
            page-break-inside: avoid !important;
          }
        }
      `}} />

      {/* Header (No print) */}
      <header className="no-print flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6c5ce7] to-[#7c6ef5] flex items-center justify-center shadow-lg shadow-[#7c6ef5]/20">
            <Cpu size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white/95">NFC Social Studio</h1>
            <p className="text-[9px] text-white/35 font-medium uppercase tracking-[0.15em]">Standard Business Dimensions · 3.5 × 2.0 in</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-white/50 font-medium">v1.2.0</span>
        </div>
      </header>

      {/* Main Studio Grid (No print) */}
      <main className="no-print flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto max-w-7xl w-full mx-auto">

        {/* Left Panel: Customize Details */}
        <section className="lg:col-span-4 flex flex-col gap-6 bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Edit size={16} className="text-[#7c6ef5]" />
            <h3 className="text-sm font-bold tracking-tight">1. Identity & Brand</h3>
          </div>

          {/* Brand select grid */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Select Brand Base</label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map((p) => {
                const Icon = p.icon;
                const isSelected = platform === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => applyTemplate(p.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 text-left ${isSelected
                        ? "bg-white/5 border-white/20 text-white shadow-md shadow-black/10"
                        : "bg-transparent border-white/5 text-white/50 hover:bg-white/[0.01] hover:text-white/80"
                      }`}
                  >
                    <div className="p-1 rounded-md" style={{ backgroundColor: isSelected ? `${p.color}22` : "rgba(255,255,255,0.03)", color: isSelected ? p.color : "inherit" }}>
                      <Icon size={14} />
                    </div>
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form details */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1">
                <User size={10} /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-[#7c6ef5]/50 px-3 py-2 rounded-xl text-xs text-white/90 placeholder-white/30 outline-none transition-all"
                placeholder="Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1">
                  <Briefcase size={10} /> Job Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-[#7c6ef5]/50 px-3 py-2 rounded-xl text-xs text-white/90 outline-none transition-all"
                  placeholder="Title"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1">
                  <Building size={10} /> Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-[#7c6ef5]/50 px-3 py-2 rounded-xl text-xs text-white/90 outline-none transition-all"
                  placeholder="Company"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1">
                <Bookmark size={10} /> Tagline (Upper Accent)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-[#7c6ef5]/50 px-3 py-2 rounded-xl text-xs text-white/90 outline-none transition-all"
                placeholder="Upper tagline"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Platform Handle / Detail</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-[#7c6ef5]/50 px-3 py-2 rounded-xl text-xs text-white/90 outline-none transition-all"
                placeholder="Handle"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Instruction Subtext</label>
              <input
                type="text"
                value={sub}
                onChange={(e) => setSub(e.target.value)}
                className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-[#7c6ef5]/50 px-3 py-2 rounded-xl text-xs text-white/90 outline-none transition-all"
                placeholder="Subtext"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1">
                <Link2 size={10} /> QR Code Destination Link
              </label>
              <input
                type="text"
                value={qrLink}
                onChange={(e) => setQrLink(e.target.value)}
                className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-[#7c6ef5]/50 px-3 py-2 rounded-xl text-xs text-white/90 outline-none transition-all text-[#7c6ef5] font-medium"
                placeholder="QR Link URL"
              />
            </div>
          </div>
        </section>

        {/* Center Panel: Showroom Card Viewport */}
        <section className="lg:col-span-5 flex flex-col items-center justify-center gap-8 self-center">

          {/* Card Stage with Glow backdrop */}
          <div className="relative w-full flex items-center justify-center py-10 rounded-2xl bg-black/15 border border-white/[0.02] shadow-inner overflow-hidden min-h-[300px]">
            {/* Ambient center background light */}
            <div className="absolute w-[240px] h-[240px] rounded-full filter blur-[50px] opacity-15 pointer-events-none" style={{ backgroundColor: accentColor }} />

            <div className="w-[340px] h-[194px] relative">
              <ShowroomCard
                name={name}
                title={title}
                company={company}
                handle={handle}
                sub={sub}
                qrLink={qrLink}
                tagline={tagline}
                variant={variant}
                accentColor={accentColor}
                metalFinish={metalFinish}
                glassBlobStyle={glassBlobStyle}
                platform={platform}
                flipped={flipped}
                setFlipped={setFlipped}
              />
            </div>
          </div>

          {/* Quick Actions Tray */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFlipped(f => !f)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 text-xs text-white/80 transition-all font-semibold"
            >
              <RotateCw size={13} className="text-white/50" />
              Flip Preview
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-tr from-[#6c5ce7] to-[#7c6ef5] hover:opacity-95 text-xs text-white font-semibold shadow-lg shadow-[#7c6ef5]/15"
            >
              <Printer size={13} />
              Print Preview Layout
            </button>
          </div>
        </section>

        {/* Right Panel: Customize Finish & Visuals */}
        <section className="lg:col-span-3 flex flex-col gap-6 bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Palette size={16} className="text-[#7c6ef5]" />
            <h3 className="text-sm font-bold tracking-tight">2. Card Finishes</h3>
          </div>

          {/* Finish selector tab pills */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Select Finish</label>
            <div className="flex flex-col gap-2">
              {FINISHES.map((f) => {
                const isSelected = variant === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setVariant(f.id);
                      setFlipped(false);
                    }}
                    className={`flex flex-col gap-0.5 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${isSelected
                        ? "bg-white/5 border-white/20 text-white shadow-md shadow-black/10"
                        : "bg-transparent border-white/5 text-white/40 hover:bg-white/[0.01] hover:text-white/60"
                      }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold">{f.name}</span>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />}
                    </div>
                    <span className="text-[9px] font-light text-white/30 truncate">{f.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customizer Suboptions based on finish */}
          {variant === "premium" && (
            <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#bda054]" /> Metal Alloy Finish
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["gold", "silver", "black"] as const).map((finish) => (
                  <button
                    key={finish}
                    onClick={() => setMetalFinish(finish)}
                    className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${metalFinish === finish
                        ? "bg-white/5 border-white/25 text-white"
                        : "bg-transparent border-white/5 text-white/40 hover:text-white/60"
                      }`}
                  >
                    {finish === "gold" && "24K Gold"}
                    {finish === "silver" && "Platinum"}
                    {finish === "black" && "Obsidian"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {variant === "glass" && (
            <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Layers size={11} className="text-[#00c3ff]" /> Aurora Backlight
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["aurora", "sunset", "nebula"] as const).map((glow) => (
                  <button
                    key={glow}
                    onClick={() => setGlassBlobStyle(glow)}
                    className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${glassBlobStyle === glow
                        ? "bg-white/5 border-white/25 text-white"
                        : "bg-transparent border-white/5 text-white/40 hover:text-white/60"
                      }`}
                  >
                    {glow === "aurora" && "Aurora Pink"}
                    {glow === "sunset" && "Sunset Flare"}
                    {glow === "nebula" && "Deep Nebula"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Accent Color overrides for Standard/Glass */}
          {variant !== "premium" && (
            <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Brand Accent Tone</label>
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full border border-white/10 overflow-hidden cursor-pointer bg-white/5 flex items-center justify-center">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-5 h-5 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: accentColor }} />
                </div>
                <div className="flex gap-1.5">
                  {["#e1306c", "#0ea5e9", "#7c6ef5", "#10b981", "#ff7b00"].map((hex) => (
                    <button
                      key={hex}
                      onClick={() => setAccentColor(hex)}
                      className="w-5 h-5 rounded-full border border-black/25 flex items-center justify-center transition-all hover:scale-110"
                      style={{ backgroundColor: hex }}
                    >
                      {accentColor.toLowerCase() === hex.toLowerCase() && <Check size={10} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Specifications */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2 text-[10px] text-white/35 font-medium leading-relaxed">
            <p className="flex justify-between"><span>Dimensions:</span> <span className="text-white/60">3.5 × 2.0 inches (CR80 ratio)</span></p>
            <p className="flex justify-between"><span>Resolution:</span> <span className="text-white/60">300 DPI Vector scale ready</span></p>
            <p className="flex justify-between"><span>RFID Chip Type:</span> <span className="text-white/60">NTAG213 / NTAG215 (NFC compatible)</span></p>
          </div>
        </section>

      </main>

      {/* Print Blueprint Page (Screen hidden, visible on print only) */}
      <div className="print-only flex-col items-center justify-center gap-12 bg-white min-h-screen text-black">
        <div>
          <h2 className="text-center font-bold text-lg mb-1" style={{ color: "#111" }}>Social Card Print Blueprint</h2>
          <p className="text-center text-xs text-gray-400 mb-6">Scale is exactly calibrated to 3.5 in × 2.0 in card templates.</p>
        </div>

        <div className="print-card-wrapper flex flex-row items-center justify-center gap-12">
          {/* Card Front Unit */}
          <div className="flex flex-col items-center gap-2">
            <span className="print-title font-semibold text-xs text-gray-500 uppercase tracking-widest">Card Front Face</span>
            <div className="card-unit overflow-hidden relative">
              <ShowroomCard
                name={name}
                title={title}
                company={company}
                handle={handle}
                sub={sub}
                qrLink={qrLink}
                tagline={tagline}
                variant={variant}
                accentColor={accentColor}
                metalFinish={metalFinish}
                glassBlobStyle={glassBlobStyle}
                platform={platform}
                flipped={false}
                setFlipped={() => { }}
              />
            </div>
          </div>

          {/* Card Back Unit */}
          <div className="flex flex-col items-center gap-2">
            <span className="print-title font-semibold text-xs text-gray-500 uppercase tracking-widest">Card Back Face</span>
            <div className="card-unit overflow-hidden relative">
              <ShowroomCard
                name={name}
                title={title}
                company={company}
                handle={handle}
                sub={sub}
                qrLink={qrLink}
                tagline={tagline}
                variant={variant}
                accentColor={accentColor}
                metalFinish={metalFinish}
                glassBlobStyle={glassBlobStyle}
                platform={platform}
                flipped={true}
                setFlipped={() => { }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer (No print) */}
      <footer className="no-print mt-12 text-center border-t border-white/5 pt-6 text-[10px] text-white/20 select-none">
        <p>© 2026 NFC Social Studio · All vectors and styles dynamically compiled in browser</p>
      </footer>
    </div>
  );
}
