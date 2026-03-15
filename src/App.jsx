import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const ACRONYMS = [
  // ── Basics ──
  { acronym: "PPL", full: "Private Pilot Certificate (called a 'licence' outside the US)", category: "Basics" },
  { acronym: "CPL", full: "Commercial Pilot Certificate", category: "Basics" },
  { acronym: "ATPL", full: "Airline Transport Pilot Certificate", category: "Basics" },
  { acronym: "SPL", full: "Sport Pilot Certificate", category: "Basics" },
  { acronym: "IR", full: "Instrument Rating", category: "Basics" },
  { acronym: "VFR", full: "Visual Flight Rules", category: "Basics" },
  { acronym: "IFR", full: "Instrument Flight Rules", category: "Basics" },
  { acronym: "ATC", full: "Air Traffic Control", category: "Basics" },
  { acronym: "FAA", full: "Federal Aviation Administration", category: "Basics" },
  { acronym: "ICAO", full: "International Civil Aviation Organisation", category: "Basics" },
  { acronym: "GA", full: "General Aviation", category: "Basics" },
  { acronym: "PIC", full: "Pilot In Command", category: "Basics" },
  { acronym: "CFI", full: "Certified Flight Instructor", category: "Basics" },
  { acronym: "CFII", full: "Certified Flight Instructor – Instrument", category: "Basics" },
  { acronym: "MEI", full: "Multi-Engine Instructor", category: "Basics" },
  { acronym: "DPE", full: "Designated Pilot Examiner", category: "Basics" },
  // ── Regulations ──
  { acronym: "FAR", full: "Federal Aviation Regulations (Title 14 of the CFR)", category: "Regulations" },
  { acronym: "CFR", full: "Code of Federal Regulations", category: "Regulations" },
  { acronym: "AIM", full: "Aeronautical Information Manual", category: "Regulations" },
  { acronym: "Part 61", full: "FAR governing pilot certification (flexible, freelance instruction)", category: "Regulations" },
  { acronym: "Part 91", full: "FAR governing general operating and flight rules", category: "Regulations" },
  { acronym: "Part 141", full: "FAR governing FAA-approved pilot schools (structured syllabus)", category: "Regulations" },
  { acronym: "NTSB", full: "National Transportation Safety Board", category: "Regulations" },
  // ── Preflight ──
  { acronym: "IMSAFE", full: "Illness · Medication · Stress · Alcohol · Fatigue · Emotion", category: "Preflight" },
  { acronym: "ARROW", full: "Airworthiness cert · Registration · Radio station licence · Operating handbook · Weight & balance", category: "Preflight" },
  { acronym: "PAVE", full: "Pilot · Aircraft · enVironment · External pressures (risk checklist)", category: "Preflight" },
  { acronym: "3P", full: "Perceive · Process · Perform (FAA decision-making model)", category: "Preflight" },
  { acronym: "WMAP", full: "Weather · NOTAM · Aircraft · Pilot", category: "Preflight" },
  // ── Weather ──
  { acronym: "VMC", full: "Visual Meteorological Conditions", category: "Weather" },
  { acronym: "IMC", full: "Instrument Meteorological Conditions", category: "Weather" },
  { acronym: "CAVOK", full: "Ceiling And Visibility OK", category: "Weather" },
  { acronym: "METAR", full: "Meteorological Aerodrome Report", category: "Weather" },
  { acronym: "TAF", full: "Terminal Aerodrome Forecast", category: "Weather" },
  { acronym: "SIGMET", full: "Significant Meteorological Information", category: "Weather" },
  { acronym: "AIRMET", full: "Airmen's Meteorological Information (Sierra/Tango/Zulu)", category: "Weather" },
  { acronym: "CB", full: "Cumulonimbus (thunderstorm cloud)", category: "Weather" },
  { acronym: "OVC", full: "Overcast (8/8 sky cover)", category: "Weather" },
  { acronym: "BKN", full: "Broken (5/8–7/8 sky cover)", category: "Weather" },
  { acronym: "FEW", full: "Few (1/8–2/8 sky cover)", category: "Weather" },
  { acronym: "SCT", full: "Scattered (3/8–4/8 sky cover)", category: "Weather" },
  { acronym: "AWC", full: "Aviation Weather Center (aviationweather.gov)", category: "Weather" },
  { acronym: "PIREPs", full: "Pilot Reports (weather observations filed by pilots)", category: "Weather" },
  // ── Altimetry ──
  { acronym: "QNH", full: "Altimeter set to sea-level pressure", category: "Altimetry" },
  { acronym: "QFE", full: "Altimeter set to field elevation pressure", category: "Altimetry" },
  { acronym: "QNE", full: "Standard pressure setting — 29.92 inHg", category: "Altimetry" },
  { acronym: "AMSL", full: "Above Mean Sea Level", category: "Altimetry" },
  { acronym: "AGL", full: "Above Ground Level", category: "Altimetry" },
  { acronym: "FL", full: "Flight Level (altitude in hundreds of ft at 29.92 inHg)", category: "Altimetry" },
  { acronym: "MSL", full: "Mean Sea Level", category: "Altimetry" },
  { acronym: "DA", full: "Density Altitude (pressure altitude corrected for temperature)", category: "Altimetry" },
  { acronym: "PA", full: "Pressure Altitude (altitude at standard pressure 29.92 inHg)", category: "Altimetry" },
  // ── Airspace ──
  { acronym: "Class A", full: "18,000 ft MSL to FL600 — IFR only, ATC clearance required", category: "Airspace" },
  { acronym: "Class B", full: "Around major airports (e.g. LAX, JFK) — ATC clearance required", category: "Airspace" },
  { acronym: "Class C", full: "Around medium airports — two-way radio contact required", category: "Airspace" },
  { acronym: "Class D", full: "Around smaller towered airports — two-way radio contact required", category: "Airspace" },
  { acronym: "Class E", full: "Controlled airspace not A/B/C/D — most en-route airspace", category: "Airspace" },
  { acronym: "Class G", full: "Uncontrolled airspace — no ATC clearance or contact required", category: "Airspace" },
  { acronym: "TFR", full: "Temporary Flight Restriction", category: "Airspace" },
  { acronym: "MOA", full: "Military Operations Area", category: "Airspace" },
  { acronym: "ADIZ", full: "Air Defense Identification Zone", category: "Airspace" },
  { acronym: "SUA", full: "Special Use Airspace", category: "Airspace" },
  { acronym: "ATZ", full: "Aerodrome Traffic Zone", category: "Airspace" },
  // ── ATC ──
  { acronym: "ATIS", full: "Automatic Terminal Information Service", category: "ATC" },
  { acronym: "CTAF", full: "Common Traffic Advisory Frequency (uncontrolled airports)", category: "ATC" },
  { acronym: "UNICOM", full: "Universal Communications — advisory at non-towered airports", category: "ATC" },
  { acronym: "TRACON", full: "Terminal Radar Approach Control", category: "ATC" },
  { acronym: "ARTCC", full: "Air Route Traffic Control Center (Center control)", category: "ATC" },
  { acronym: "ASOS", full: "Automated Surface Observing System", category: "ATC" },
  { acronym: "AWOS", full: "Automated Weather Observing System", category: "ATC" },
  { acronym: "SID", full: "Standard Instrument Departure", category: "ATC" },
  { acronym: "STAR", full: "Standard Terminal Arrival Route", category: "ATC" },
  // ── Navigation ──
  { acronym: "ETA", full: "Estimated Time of Arrival", category: "Navigation" },
  { acronym: "ETD", full: "Estimated Time of Departure", category: "Navigation" },
  { acronym: "ETE", full: "Estimated Time En Route", category: "Navigation" },
  { acronym: "HDG", full: "Heading", category: "Navigation" },
  { acronym: "TRK", full: "Track (actual path over ground)", category: "Navigation" },
  { acronym: "VAR", full: "Magnetic Variation", category: "Navigation" },
  { acronym: "DME", full: "Distance Measuring Equipment", category: "Navigation" },
  { acronym: "VOR", full: "VHF Omnidirectional Range", category: "Navigation" },
  { acronym: "NDB", full: "Non-Directional Beacon", category: "Navigation" },
  { acronym: "GPS", full: "Global Positioning System", category: "Navigation" },
  { acronym: "GNSS", full: "Global Navigation Satellite System", category: "Navigation" },
  { acronym: "WAAS", full: "Wide Area Augmentation System (GPS accuracy enhancement)", category: "Navigation" },
  { acronym: "FBO", full: "Fixed-Base Operator (airport fuel/service provider)", category: "Navigation" },
  // ── Performance ──
  { acronym: "TAS", full: "True Air Speed", category: "Performance" },
  { acronym: "IAS", full: "Indicated Air Speed", category: "Performance" },
  { acronym: "CAS", full: "Calibrated Air Speed", category: "Performance" },
  { acronym: "GS", full: "Ground Speed", category: "Performance" },
  { acronym: "MTOW", full: "Maximum Takeoff Weight", category: "Performance" },
  { acronym: "MLW", full: "Maximum Landing Weight", category: "Performance" },
  { acronym: "CG", full: "Center of Gravity", category: "Performance" },
  { acronym: "TORA", full: "Takeoff Run Available", category: "Performance" },
  { acronym: "TODA", full: "Takeoff Distance Available", category: "Performance" },
  { acronym: "LDA", full: "Landing Distance Available", category: "Performance" },
  { acronym: "ISA", full: "International Standard Atmosphere", category: "Performance" },
  { acronym: "Vx", full: "Best Angle of Climb Speed", category: "Performance" },
  { acronym: "Vy", full: "Best Rate of Climb Speed", category: "Performance" },
  { acronym: "Vso", full: "Stall Speed in Landing Configuration", category: "Performance" },
  // ── Documents ──
  { acronym: "POH", full: "Pilot's Operating Handbook", category: "Documents" },
  { acronym: "AFM", full: "FAA-Approved Flight Manual", category: "Documents" },
  { acronym: "AC", full: "Advisory Circular (FAA guidance documents)", category: "Documents" },
  { acronym: "NOTAMs", full: "Notices to Air Missions", category: "Documents" },
  // ── Radio ──
  { acronym: "VHF", full: "Very High Frequency (118–136 MHz aviation band)", category: "Radio" },
  { acronym: "RTF", full: "Radio Telephony", category: "Radio" },
  { acronym: "ELT", full: "Emergency Locator Transmitter", category: "Radio" },
  { acronym: "PLB", full: "Personal Locator Beacon", category: "Radio" },
  { acronym: "SELCAL", full: "Selective Calling System", category: "Radio" },
];

const LINGO = [
  { term: "Affirm", meaning: "Yes / Confirmed", usage: "ATC: 'Confirm squawk 1200?' Pilot: 'Affirm, N12345.'" },
  { term: "Negative", meaning: "No", usage: "'Negative, unable to maintain 3,000.'" },
  { term: "Roger", meaning: "Message received and understood (no action implied)", usage: "'Turn left heading 270.' – 'Roger, N12345.'" },
  { term: "Wilco", meaning: "Will comply — understood AND will do it", usage: "'Descend and maintain 3,000.' – 'Wilco, N12345.'" },
  { term: "Say Again", meaning: "Please repeat your last transmission", usage: "'N12345, say again your altitude.'" },
  { term: "Standby", meaning: "Wait — I will get back to you shortly", usage: "'Denver Center, N12345.' – 'N12345, standby.'" },
  { term: "Go Ahead", meaning: "Proceed with your message", usage: "'N12345, go ahead.'" },
  { term: "Readability", meaning: "Radio signal clarity scale 1 (unreadable) to 5 (perfect)", usage: "'How do you read?' – 'Loud and clear, 5 by 5.'" },
  { term: "Niner", meaning: "Radio pronunciation of 9 — avoids confusion with German 'nein'", usage: "'Descend to flight level two-niner-zero.'" },
  { term: "Final", meaning: "Last straight-in leg of the traffic pattern, aligned with runway", usage: "'Cessna N12345, turning final runway 28L.'" },
  { term: "Downwind", meaning: "Traffic pattern leg parallel to runway, opposite landing direction", usage: "'N12345, report downwind runway 18.'" },
  { term: "Crosswind", meaning: "Traffic pattern leg perpendicular to runway after departure", usage: "'N12345, crosswind runway 09, report downwind.'" },
  { term: "Touch and Go", meaning: "Land, reconfigure, and immediately take off without stopping", usage: "'Tower, N12345 requests touch and go, runway 28R.'" },
  { term: "Position and Hold", meaning: "Enter the runway and hold — do NOT depart yet", usage: "'N12345, taxi into position and hold, runway 18.'" },
  { term: "Hold Short", meaning: "Stop and do not cross the runway hold-short line", usage: "'N12345, hold short runway 28L, traffic on final.'" },
  { term: "Cleared for Takeoff", meaning: "FAA authorization to depart — only ATC can issue this", usage: "'N12345, winds 280 at 8, cleared for takeoff runway 28L.'" },
  { term: "Squawk", meaning: "Set your transponder to a specific 4-digit code", usage: "'N12345, squawk 4532.' – 'Squawking 4532, N12345.'" },
  { term: "Ident", meaning: "Press the IDENT button on your transponder so ATC can identify you", usage: "'N12345, squawk 4532 and ident.'" },
  { term: "Mayday", meaning: "International distress call — immediate danger to life or aircraft", usage: "'Mayday, Mayday, Mayday, N12345, engine failure, 5 miles north of KORD.'" },
  { term: "Pan-Pan", meaning: "Urgency call — serious situation but not immediate danger", usage: "'Pan-Pan, Pan-Pan, Pan-Pan, N12345, low fuel, requesting priority landing.'" },
  { term: "Radar Contact", meaning: "ATC has identified your aircraft on radar", usage: "'N12345, radar contact, 6 miles southeast of the field.'" },
  { term: "Traffic in Sight", meaning: "Pilot visually confirms they can see the conflicting aircraft ATC called out", usage: "'N12345, traffic 2 o'clock, 3 miles.' – 'Traffic in sight, N12345.'" },
  { term: "VFR Flight Following", meaning: "Voluntary radar advisory service for VFR pilots from ATC", usage: "'Denver Approach, N12345 requests VFR flight following to KCOS.'" },
  { term: "Frequency Change Approved", meaning: "ATC clears you to switch to another radio frequency", usage: "'N12345, frequency change approved, good day.'" },
  { term: "PIREP", meaning: "Pilot weather report radioed to ATC or FSS", usage: "'Denver Center, N12345 has a PIREP — moderate turbulence at 9,000.'" },
];

const NATO_ALPHABET = [
  { letter: "A", word: "Alpha",   pronunciation: "AL-fah" },
  { letter: "B", word: "Bravo",   pronunciation: "BRAH-voh" },
  { letter: "C", word: "Charlie", pronunciation: "CHAR-lee" },
  { letter: "D", word: "Delta",   pronunciation: "DELL-tah" },
  { letter: "E", word: "Echo",    pronunciation: "ECK-oh" },
  { letter: "F", word: "Foxtrot", pronunciation: "FOKS-trot" },
  { letter: "G", word: "Golf",    pronunciation: "GOLF" },
  { letter: "H", word: "Hotel",   pronunciation: "hoh-TELL" },
  { letter: "I", word: "India",   pronunciation: "IN-dee-ah" },
  { letter: "J", word: "Juliet",  pronunciation: "JEW-lee-ett" },
  { letter: "K", word: "Kilo",    pronunciation: "KEY-loh" },
  { letter: "L", word: "Lima",    pronunciation: "LEE-mah" },
  { letter: "M", word: "Mike",    pronunciation: "MIKE" },
  { letter: "N", word: "November",pronunciation: "no-VEM-ber" },
  { letter: "O", word: "Oscar",   pronunciation: "OSS-car" },
  { letter: "P", word: "Papa",    pronunciation: "pah-PAH" },
  { letter: "Q", word: "Quebec",  pronunciation: "keh-BECK" },
  { letter: "R", word: "Romeo",   pronunciation: "ROW-me-oh" },
  { letter: "S", word: "Sierra",  pronunciation: "see-AIR-rah" },
  { letter: "T", word: "Tango",   pronunciation: "TANG-go" },
  { letter: "U", word: "Uniform", pronunciation: "YOU-nee-form" },
  { letter: "V", word: "Victor",  pronunciation: "VIK-tah" },
  { letter: "W", word: "Whiskey", pronunciation: "WISS-key" },
  { letter: "X", word: "X-ray",   pronunciation: "ECKS-ray" },
  { letter: "Y", word: "Yankee",  pronunciation: "YANG-kee" },
  { letter: "Z", word: "Zulu",    pronunciation: "ZOO-loo" },
];

const PLANE_TYPES = [
  { id: "c172",   label: "Cessna 172",      speed: 122, burn: 8.5,  wetRate: 160, state_avg: { CA: 185, TX: 155, FL: 160, NY: 190, WA: 170, CO: 165, AZ: 155, GA: 150, IL: 165, OH: 150 } },
  { id: "c152",   label: "Cessna 152",      speed: 107, burn: 6.1,  wetRate: 130, state_avg: { CA: 150, TX: 125, FL: 130, NY: 155, WA: 140, CO: 135, AZ: 125, GA: 120, IL: 135, OH: 120 } },
  { id: "pa28",   label: "Piper Cherokee",  speed: 125, burn: 8.0,  wetRate: 155, state_avg: { CA: 175, TX: 148, FL: 152, NY: 180, WA: 163, CO: 158, AZ: 148, GA: 143, IL: 158, OH: 143 } },
  { id: "da40",   label: "Diamond DA40",    speed: 135, burn: 8.4,  wetRate: 185, state_avg: { CA: 210, TX: 178, FL: 182, NY: 215, WA: 196, CO: 190, AZ: 178, GA: 172, IL: 190, OH: 172 } },
  { id: "c182",   label: "Cessna 182",      speed: 145, burn: 12.0, wetRate: 195, state_avg: { CA: 220, TX: 188, FL: 192, NY: 225, WA: 208, CO: 202, AZ: 188, GA: 182, IL: 202, OH: 182 } },
  { id: "sr20",   label: "Cirrus SR20",     speed: 155, burn: 10.5, wetRate: 220, state_avg: { CA: 250, TX: 212, FL: 218, NY: 255, WA: 235, CO: 228, AZ: 212, GA: 206, IL: 228, OH: 206 } },
  { id: "other",  label: "Other / Custom",  speed: 120, burn: 8.5,  wetRate: 175, state_avg: {} },
];

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const QUIZ_TOPICS = [
  { id: "meteorology",        label: "Meteorology",   color: "#4FC3F7" },
  { id: "navigation",         label: "Navigation",    color: "#81C784" },
  { id: "airlaw",             label: "Air Law",       color: "#FFB74D" },
  { id: "aircraft",           label: "Aircraft Tech", color: "#CE93D8" },
  { id: "flight_performance", label: "Performance",   color: "#F48FB1" },
  { id: "radio",              label: "Radio & Comms", color: "#80DEEA" },
];

const DIFFICULTIES = ["Cadet", "Solo", "PPL Ready"];
const NAV_ITEMS = [
  { id: "quiz",       label: "Quiz"     },
  { id: "acronyms",   label: "Acronyms" },
  { id: "nato",       label: "Phonetic" },
  { id: "lingo",      label: "Lingo"    },
  { id: "calculator", label: "PPL Cost" },
  { id: "tripcalc",   label: "Trip"     },
];

function NavIcon({ id, active }) {
  const color = active ? "#4FC3F7" : "#4a5568";
  const s = { width: 22, height: 22, display: "block" };
  if (id === "quiz") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <circle cx="12" cy="17" r=".5" fill={color}/>
    </svg>
  );
  if (id === "acronyms") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <path d="M8 12h8M8 8h5M8 16h6"/>
    </svg>
  );
  if (id === "nato") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M4 12h10M4 17h13"/>
      <circle cx="19" cy="17" r="2" fill={active ? "#4FC3F7" : "none"} stroke={color}/>
    </svg>
  );
  if (id === "lingo") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
      <path d="M19 10a7 7 0 0 1-14 0M12 19v3M8 22h8"/>
    </svg>
  );
  if (id === "calculator") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2"/>
      <path d="M8 7h8M8 12h2m4 0h2M8 17h2m4 0h2"/>
    </svg>
  );
  if (id === "tripcalc") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l4-8 4 5 4-3 4 6"/>
      <path d="M3 20h18"/>
      <circle cx="7" cy="4" r="1" fill={color}/>
    </svg>
  );
  return null;
}

function TopicIcon({ id, color }) {
  const s = { width: 28, height: 28, display: "block" };
  if (id === "meteorology") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19a4.5 4.5 0 0 0 0-9H17A5 5 0 0 0 7 14.5"/>
      <path d="M7 19a4 4 0 0 1 0-8"/>
      <path d="M12 3v2M4.22 6.22l1.42 1.42M20 12h2M18.36 7.64l1.42-1.42"/>
    </svg>
  );
  if (id === "navigation") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  );
  if (id === "airlaw") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="13" y2="17"/>
    </svg>
  );
  if (id === "aircraft") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4s-2 1-3.5 2.5L8 8 1.8 6.2c-.5-.2-.7.3-.4.7L4 10l2 1-2 3h3l1-1 1.5 1.5"/>
    </svg>
  );
  if (id === "flight_performance") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
  if (id === "radio") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10a7 7 0 0 1-14 0"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );
  return null;
}

/* ─────────────────────────────────────────────
   ANIMATED PLANE BACKGROUND
───────────────────────────────────────────── */
function CloudLayer() {
  const clouds = Array.from({ length: 6 }, (_, i) => ({
    id: i, top: 8 + i * 15, delay: i * 3.2, duration: 22 + i * 4, opacity: 0.03 + i * 0.008,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {clouds.map(c => (
        <div key={c.id} style={{
          position: "absolute", top: `${c.top}%`, left: "-200px",
          animation: `cloudDrift ${c.duration}s ${c.delay}s linear infinite`,
          opacity: c.opacity,
        }}>
          <svg width="180" height="60" viewBox="0 0 180 60">
            <ellipse cx="90" cy="40" rx="85" ry="18" fill="#7ec8e3" />
            <ellipse cx="60" cy="32" rx="40" ry="22" fill="#7ec8e3" />
            <ellipse cx="110" cy="28" rx="50" ry="26" fill="#7ec8e3" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCORE BURST ANIMATION
───────────────────────────────────────────── */
function ScoreBurst({ show, correct }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
      zIndex: 1000, pointerEvents: "none",
      animation: "burstPop 0.7s ease forwards",
      textAlign: "center",
    }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
        {correct
          ? <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#66BB6A" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
          : <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF5350" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        }
      </div>
      <div style={{
        fontSize: 16, fontWeight: 800, color: correct ? "#66BB6A" : "#EF5350",
        fontFamily: "'DM Mono', monospace",
        animation: "burstPop 0.7s ease forwards",
      }}>{correct ? "+10 PTS" : "MISS"}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FLIP CARD (Acronyms)
───────────────────────────────────────────── */
function FlipCard({ item, index }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(f => !f)}
      style={{
        perspective: 800, cursor: "pointer", height: 130,
        animation: `cardEntrance 0.4s ${index * 0.06}s both ease`,
      }}
    >
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.55s cubic-bezier(0.23,1,0.32,1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* Front */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          background: "linear-gradient(135deg, #0d1929 0%, #111e30 100%)",
          border: "1.5px solid #1e2d45", borderRadius: 14,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}>
          <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 3, color: "#4FC3F7", fontFamily: "'Courier New', monospace" }}>
            {item.acronym}
          </div>
          <div style={{
            fontSize: 10, padding: "3px 10px", borderRadius: 20,
            background: "rgba(79,195,247,0.1)", border: "1px solid rgba(79,195,247,0.2)", color: "#4FC3F7",
            letterSpacing: 1, textTransform: "uppercase",
          }}>{item.category}</div>
          <div style={{ fontSize: 11, color: "#374151" }}>tap to reveal ↓</div>
        </div>
        {/* Back */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "linear-gradient(135deg, #0a1f0a 0%, #0d2a1a 100%)",
          border: "1.5px solid #2d4a2d", borderRadius: 14,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "12px 16px", gap: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#4FC3F7", fontFamily: "'Courier New', monospace", letterSpacing: 1 }}>{item.acronym}</div>
          <div style={{ fontSize: 12, color: "#A5D6A7", textAlign: "center", lineHeight: 1.6 }}>{item.full}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LINGO CARD
───────────────────────────────────────────── */
function LingoCard({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        background: open ? "rgba(255,183,77,0.07)" : "#0d1420",
        border: `1.5px solid ${open ? "#FFB74D55" : "#1e2d45"}`,
        borderRadius: 12, padding: "14px 18px", cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
        animation: `cardEntrance 0.4s ${index * 0.04}s both ease`,
        transform: open ? "scale(1.01)" : "scale(1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: 800, color: "#FFB74D", fontSize: 15, fontFamily: "'Courier New', monospace", letterSpacing: 1 }}>{item.term}</span>
          <span style={{ color: "#546e7a", fontSize: 13, marginLeft: 12 }}>{item.meaning}</span>
        </div>
        <div style={{ color: "#374151", transition: "transform 0.3s", transform: open ? "rotate(90deg)" : "rotate(0deg)", fontSize: 18 }}>›</div>
      </div>
      {open && (
        <div style={{
          marginTop: 12, padding: "10px 14px", background: "rgba(255,183,77,0.06)",
          borderRadius: 8, borderLeft: "3px solid #FFB74D55",
          fontSize: 12, color: "#c8d6e5", lineHeight: 1.6, fontStyle: "italic",
          animation: "slideDown 0.25s ease",
        }}>
          <span style={{ color: "#FFB74D88", fontStyle: "normal", fontWeight: 700 }}>Example: </span>{item.usage}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FLYING CAT
───────────────────────────────────────────── */
function FlyingCat({ src }) {
  const [x, setX] = useState(-160);
  const [pos, setPos] = useState({ top: 18, dir: 1 });
  const animRef = useRef(null);
  const stateRef = useRef({ x: -160, dir: 1, top: 18 });

  useEffect(() => {
    const W = window.innerWidth;
    const SPEED = 220; // px per second
    let last = null;

    function randomTop() {
      return 10 + Math.random() * 55; // 10%–65% of viewport height
    }

    stateRef.current = { x: -160, dir: 1, top: randomTop() };
    setPos({ top: stateRef.current.top, dir: 1 });

    function tick(ts) {
      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;

      const s = stateRef.current;
      s.x += s.dir * SPEED * dt;

      if (s.dir === 1 && s.x > W + 20) {
        s.dir = -1;
        s.x = W + 20;
        s.top = randomTop();
        setPos({ top: s.top, dir: -1 });
      }
      if (s.dir === -1 && s.x < -160) {
        s.dir = 1;
        s.x = -160;
        s.top = randomTop();
        setPos({ top: s.top, dir: 1 });
      }

      setX(s.x);
      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <img
      src={src}
      alt=""
      style={{
        position: "fixed",
        top: `${pos.top}%`,
        left: 0,
        width: 110,
        height: "auto",
        zIndex: 2147483647,
        pointerEvents: "none",
        transform: `translateX(${x}px) scaleX(${pos.dir})`,
        mixBlendMode: "screen",
        filter: "brightness(1.05) contrast(1.05)",
        transition: "top 0.8s ease",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function AeroQuiz() {
  const [activeTab, setActiveTab] = useState("quiz");
  const [quizScreen, setQuizScreen] = useState("menu");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [difficulty, setDifficulty] = useState(0);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [history, setHistory] = useState([]);
  const [showBurst, setShowBurst] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const [acronymSearch, setAcronymSearch] = useState("");
  const [acronymFilter, setAcronymFilter] = useState("All");
  const [acronymMode, setAcronymMode] = useState("browse"); // browse | quiz
  const [acroQ, setAcroQ] = useState(null);
  const [acroOptions, setAcroOptions] = useState([]);
  const [acroSelected, setAcroSelected] = useState(null);
  const [acroScore, setAcroScore] = useState(0);
  const [acroStreak, setAcroStreak] = useState(0);
  const [acroTotal, setAcroTotal] = useState(0);
  const [lingoSearch, setLingoSearch] = useState("");
  const [lingoHighlightIdx, setLingoHighlightIdx] = useState(0);

  // PPL calculator plane + state
  const [pplPlaneId, setPplPlaneId] = useState("c172");
  const [pplState, setPplState] = useState("MO");

  // Trip calculator plane + state
  const [tripPlaneId, setTripPlaneId] = useState("c172");
  const [tripState, setTripState] = useState("MO");
  const [quizSeed, setQuizSeed] = useState(0);

  const [natoInput, setNatoInput] = useState("");
  const [natoMode, setNatoMode] = useState("browse");
  const [natoQ, setNatoQ] = useState(null);
  const [natoOptions, setNatoOptions] = useState([]);
  const [natoSelected, setNatoSelected] = useState(null);
  const [natoScore, setNatoScore] = useState(0);
  const [natoStreak, setNatoStreak] = useState(0);
  const [natoTotal, setNatoTotal] = useState(0);
  const correctRef = useRef(null);
  const TOTAL_Q = 10;

  // Cost calc state
  const [aircraft, setAircraft] = useState({ wetRate: 175, dryRate: 140 });
  const [instructorRate, setInstructorRate] = useState(65);
  const [hours, setHours] = useState(60);
  const [examFees, setExamFees] = useState(175);
  const [medFee, setMedFee] = useState(150);
  const [groundSchool, setGroundSchool] = useState(400);
  const [soloHours, setSoloHours] = useState(10);

  // Trip calc state
  const [tripDistance, setTripDistance] = useState(250);
  const [tripSpeed, setTripSpeed] = useState(120);
  const [tripFuelBurn, setTripFuelBurn] = useState(8.5);
  const [tripFuelPrice, setTripFuelPrice] = useState(6.50);
  const [tripRentalRate, setTripRentalRate] = useState(175);
  const [tripPassengers, setTripPassengers] = useState(1);
  const [tripWindComponent, setTripWindComponent] = useState(0);
  const [tripAltFuel, setTripAltFuel] = useState(45);



  const pplPlane = PLANE_TYPES.find(p => p.id === pplPlaneId) || PLANE_TYPES[0];
  const tripPlane = PLANE_TYPES.find(p => p.id === tripPlaneId) || PLANE_TYPES[0];

  const pplStateRate = pplPlane.state_avg[pplState] || pplPlane.wetRate;
  const tripStateRate = tripPlane.state_avg[tripState] || tripPlane.wetRate;

  const dualHours = hours - soloHours;
  const totalAircraft = (dualHours * pplStateRate) + (soloHours * pplStateRate * 0.85);
  const totalInstructor = dualHours * instructorRate;
  const grandTotal = totalAircraft + totalInstructor + examFees + medFee + groundSchool;

  // Trip calc derived
  const effectiveSpeed = tripSpeed + tripWindComponent;
  const tripTimeHrs = effectiveSpeed > 0 ? tripDistance / effectiveSpeed : 0;
  const tripTimeMins = Math.round(tripTimeHrs * 60);
  const tripTimeDisplay = `${Math.floor(tripTimeMins / 60)}h ${tripTimeMins % 60}m`;
  const fuelRequired = tripFuelBurn * tripTimeHrs;
  const reserveFuel = tripFuelBurn * (tripAltFuel / 60);
  const totalFuel = fuelRequired + reserveFuel;
  const fuelCost = totalFuel * tripFuelPrice;
  const rentalCost = tripTimeHrs * tripRentalRate;
  const tripTotalCost = fuelCost + rentalCost;
  const costPerPax = tripPassengers > 0 ? tripTotalCost / tripPassengers : tripTotalCost;

  async function fetchQuestion(topicId, diff, seed) {
    setLoading(true);
    setSelected(null);
    setIsCorrect(null);
    setExplanation("");
    setQuestion(null);
    setOptions([]);
    const topic = QUIZ_TOPICS.find(t => t.id === topicId);
    const prompt = `Generate a unique multiple-choice question for a US PPL (Private Pilot Certificate) student studying ${topic.label}.
Session seed: ${seed}-Q${questionNum} (use this to ensure a fresh, different question each call — never repeat).
Use FAA regulations, US airspace rules, and FAA Airman Knowledge Test standards throughout.
Difficulty: ${DIFFICULTIES[diff]} (${diff === 0 ? "basic intro level" : diff === 1 ? "intermediate student pilot level" : "exam-ready, FAA written test standard"}).
Use US-specific terminology: e.g. 'Private Pilot Certificate' not 'licence', FAR/AIM references, US weather services, US airspace classes (Class A/B/C/D/E/G), statute/nautical miles, Fahrenheit where relevant.
Return ONLY valid JSON, no markdown:
{"question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"answer":"A","explanation":"1-2 sentence explanation referencing FAA rules where applicable"}`;
    try {
      const res = await fetch("/.netlify/functions/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      correctRef.current = parsed.answer;
      setQuestion(parsed.question);
      setOptions(parsed.options);
      setExplanation(parsed.explanation);
    } catch {
      setQuestion("Connection issue — please try again.");
      setOptions(["A. Retry", "B. Retry", "C. Retry", "D. Retry"]);
    }
    setLoading(false);
  }

  function startQuiz(topicId) {
    const newSeed = Date.now();
    setQuizSeed(newSeed);
    setSelectedTopic(topicId);
    setScore(0); setStreak(0); setMaxStreak(0); setQuestionNum(1); setHistory([]);
    setQuizScreen("quiz");
    fetchQuestion(topicId, difficulty, newSeed);
  }

  // Rotate lingo highlights every time the lingo tab is visited
  useEffect(() => {
    if (activeTab === "lingo") {
      setLingoHighlightIdx(Math.floor(Math.random() * (LINGO.length - 1)));
    }
  }, [activeTab]);

  function handleAnswer(opt) {
    if (selected !== null || loading) return;
    setSelected(opt);
    const correct = opt[0] === correctRef.current;
    setIsCorrect(correct);
    const ns = correct ? streak + 1 : 0;
    const bonus = correct ? 10 + ns * 2 : 0;
    setStreak(ns);
    setScore(s => s + bonus);
    if (ns > maxStreak) setMaxStreak(ns);
    setHistory(h => [...h, correct]);
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 700);
  }

  function nextQuestion() {
    if (questionNum >= TOTAL_Q) { setQuizScreen("result"); return; }
    setQuestionNum(q => q + 1);
    fetchQuestion(selectedTopic, difficulty, quizSeed);
  }

  const topic = QUIZ_TOPICS.find(t => t.id === selectedTopic);
  const acronymCategories = ["All", ...new Set(ACRONYMS.map(a => a.category))];
  const filteredAcronyms = ACRONYMS.filter(a =>
    (acronymFilter === "All" || a.category === acronymFilter) &&
    (a.acronym.toLowerCase().includes(acronymSearch.toLowerCase()) || a.full.toLowerCase().includes(acronymSearch.toLowerCase()))
  );
  const filteredLingo = LINGO.filter(l =>
    l.term.toLowerCase().includes(lingoSearch.toLowerCase()) ||
    l.meaning.toLowerCase().includes(lingoSearch.toLowerCase())
  );

  const pct = (score / (TOTAL_Q * 14)) * 100;

  // Fake NATO-style words by first letter for wrong answer generation
  const FAKE_NATO_WORDS = {
    A: ["Anchor","Anvil","Apex","Arrow"], B: ["Banner","Barrel","Beacon","Blaze"],
    C: ["Candle","Cargo","Cedar","Cipher"], D: ["Dagger","Dancer","Depot","Drift"],
    E: ["Eagle","Ember","Envoy","Essex"], F: ["Fable","Falcon","Fiber","Flare"],
    G: ["Gavel","Gem","Glider","Gravel"], H: ["Harbor","Harness","Haven","Hydra"],
    I: ["Icon","Ignite","Image","Ivory"], J: ["Jackal","Jasper","Journey","Jungle"],
    K: ["Karma","Kelvin","Kernel","Knight"], L: ["Lancer","Laser","Ledger","Lotus"],
    M: ["Magnet","Marble","Matrix","Mirage"], N: ["Neon","Nexus","Noble","Nomad"],
    O: ["Oasis","Oboe","Omega","Onyx"], P: ["Pagoda","Panther","Patrol","Pivot"],
    Q: ["Quasar","Quartz","Quest","Quorum"], R: ["Radar","Raptor","Raven","Relay"],
    S: ["Saber","Sector","Signal","Solar"], T: ["Talon","Tenor","Titan","Token"],
    U: ["Ultra","Umbra","Uplink","Urban"], V: ["Valor","Vector","Vertex","Viper"],
    W: ["Walrus","Warden","Wedge","Willow"], X: ["Xenon","Xeric","Xeron","Xylum"],
    Y: ["Yonder","York","Yukon","Yuma"], Z: ["Zeal","Zenith","Zero","Zodiac"],
  };

  function startNatoQuiz() {
    const idx = Math.floor(Math.random() * NATO_ALPHABET.length);
    const correct = NATO_ALPHABET[idx];
    const fakes = (FAKE_NATO_WORDS[correct.letter] || ["Fake1","Fake2","Fake3","Fake4"])
      .filter(w => w.toLowerCase() !== correct.word.toLowerCase())
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => ({ letter: `_${correct.letter}`, word: w, pronunciation: w.toUpperCase() }));
    const opts = [...fakes, correct].sort(() => Math.random() - 0.5);
    setNatoQ(correct);
    setNatoOptions(opts);
    setNatoSelected(null);
  }

  function handleNatoAnswer(opt) {
    if (natoSelected) return;
    setNatoSelected(opt);
    setNatoTotal(t => t + 1);
    const isCorrect = opt.letter === natoQ.letter;
    if (isCorrect) {
      setNatoScore(s => s + 1);
      setNatoStreak(s => s + 1);
    } else {
      setNatoStreak(0);
    }
  }

  const natoConverted = natoInput.toUpperCase().split("").map(ch => {
    const match = NATO_ALPHABET.find(n => n.letter === ch);
    return match ? match.word : (ch === " " ? "·" : ch);
  }).join(" ");

  function startAcroQuiz() {
    const idx = Math.floor(Math.random() * ACRONYMS.length);
    const correct = ACRONYMS[idx];
    const wrong = ACRONYMS.filter((_, i) => i !== idx).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [...wrong, correct].sort(() => Math.random() - 0.5);
    setAcroQ(correct);
    setAcroOptions(opts);
    setAcroSelected(null);
  }

  function handleAcroAnswer(opt) {
    if (acroSelected) return;
    setAcroSelected(opt);
    setAcroTotal(t => t + 1);
    if (opt.acronym === acroQ.acronym) {
      setAcroScore(s => s + 1);
      setAcroStreak(s => s + 1);
    } else {
      setAcroStreak(0);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", width: "100%", background: "#060d1a",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      color: "#e8eaf6", position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=DM+Mono:wght@400;500&display=swap');

        @keyframes cloudDrift { from{transform:translateX(-200px)} to{transform:translateX(110vw)} }
        @keyframes cardEntrance { from{opacity:0;transform:translateY(20px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideDown { from{opacity:0;max-height:0} to{opacity:1;max-height:200px} }
        @keyframes burstPop { 0%{opacity:0;transform:translateX(-50%) scale(0.5)} 40%{opacity:1;transform:translateX(-50%) scale(1.3)} 80%{opacity:1;transform:translateX(-50%) scale(1)} 100%{opacity:0;transform:translateX(-50%) scale(1.1)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes shimmerBar { 0%{background-position:-300px 0} 100%{background-position:300px 0} }
        @keyframes planeFly { 0%,100%{transform:none} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        @keyframes navGlow { 0%,100%{box-shadow:0 0 0 rgba(79,195,247,0)} 50%{box-shadow:0 0 12px rgba(79,195,247,0.3)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
        @keyframes counterUp { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        @keyframes horizonScan { 0%{transform:scaleX(0);opacity:0} 100%{transform:scaleX(1);opacity:1} }

        .grid-bg {
          background-image: linear-gradient(rgba(79,195,247,0.04) 1px, transparent 1px), linear-gradient(90deg,rgba(79,195,247,0.04) 1px,transparent 1px);
          background-size: 40px 40px;
        }
        .tab-btn {
          display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 10px;
          border:none; background:transparent; color:#546e7a; cursor:pointer; border-radius:12px;
          transition:all 0.25s; font-size:10px; letter-spacing:0.3px; text-transform:uppercase; font-weight:700;
          font-family:'DM Sans',sans-serif;
        }
        .tab-btn.active { color:#4FC3F7; background:rgba(79,195,247,0.1); }
        .tab-btn:hover:not(.active) { color:#7fb8d4; background:rgba(79,195,247,0.05); }
        .option-btn {
          background:#0d1929; border:1.5px solid #1e2d45; border-radius:10px;
          color:#c8d6e5; padding:14px 18px; text-align:left; cursor:pointer;
          transition:all 0.2s cubic-bezier(0.23,1,0.32,1);
          font-size:14px; width:100%; font-family:'DM Sans',sans-serif;
        }
        .option-btn:hover:not(:disabled) { border-color:#4FC3F7; background:#0a1825; color:#fff; transform:translateX(5px) scale(1.01); box-shadow: 4px 0 0 #4FC3F7; }
        .option-btn:disabled { cursor:default; }
        .option-correct { border-color:#66BB6A!important; background:rgba(102,187,106,0.1)!important; color:#A5D6A7!important; box-shadow:0 0 12px rgba(102,187,106,0.2)!important; }
        .option-wrong { border-color:#EF5350!important; background:rgba(239,83,80,0.08)!important; color:#EF9A9A!important; animation:wiggle 0.3s ease; }
        .topic-card {
          background:#0d1420; border:1.5px solid #1e2d45; border-radius:14px;
          padding:18px 12px; cursor:pointer; transition:all 0.25s cubic-bezier(0.23,1,0.32,1);
          text-align:center;
        }
        .topic-card:hover { transform:translateY(-4px) scale(1.03); }
        .topic-card.sel { transform:scale(1.04); }
        .diff-btn { padding:8px 18px; border-radius:20px; border:1.5px solid #1e2d45; background:transparent; color:#7f8fa6; cursor:pointer; font-size:13px; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
        .diff-btn:hover:not(.active) { border-color:#4FC3F7; color:#4FC3F7; background:rgba(79,195,247,0.1); transform:translateY(-1px); }
        .diff-btn.active { border-color:#4FC3F7; color:#4FC3F7; background:rgba(79,195,247,0.1); }
        .filter-pill { padding:5px 14px; border-radius:20px; border:1.5px solid #1e2d45; background:transparent; color:#546e7a; cursor:pointer; font-size:12px; transition:all 0.2s; white-space:nowrap; font-family:'DM Sans',sans-serif; }
        .filter-pill:hover:not(.active) { border-color:#4FC3F7; color:#4FC3F7; background:rgba(79,195,247,0.1); }
        .filter-pill.active { border-color:#4FC3F7; color:#4FC3F7; background:rgba(79,195,247,0.1); }
        .takeoff-btn { transition:all 0.25s cubic-bezier(0.23,1,0.32,1); }
        .takeoff-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 40px rgba(79,195,247,0.5) !important; filter:brightness(1.1); }
        .input-field {
          background:#0d1929; border:1.5px solid #1e2d45; border-radius:10px;
          color:#e8eaf6; padding:10px 14px; font-size:14px; outline:none; width:100%;
          transition:border-color 0.2s; font-family:'DM Sans',sans-serif; box-sizing:border-box;
          -webkit-appearance:none; appearance:none;
        }
        .input-field:focus { border-color:#4FC3F7; background:#0a1825; }
        input[type=number] {
          background:#0d1929 !important; color:inherit !important;
          -webkit-appearance:none; appearance:textfield;
        }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance:none; margin:0;
        }
        input[type=range] {
          -webkit-appearance:none; appearance:none;
          background:transparent; outline:none; cursor:pointer;
        }
        input[type=range]::-webkit-slider-runnable-track {
          height:4px; border-radius:2px; background:#1e2d45;
        }
        input[type=range]::-moz-range-track {
          height:4px; border-radius:2px; background:#1e2d45;
        }
        select {
          background:#0d1929 !important; color:inherit !important;
          -webkit-appearance:none; appearance:none;
        }
        .search-input {
          background:#0d1929; border:1.5px solid #1e2d45; border-radius:30px;
          color:#e8eaf6; padding:10px 18px; font-size:14px; outline:none; width:100%;
          transition:all 0.2s; font-family:'DM Sans',sans-serif; box-sizing:border-box;
        }
        .search-input:focus { border-color:#4FC3F7; background:#0a1825; }
        .filter-pill { padding:5px 14px; border-radius:20px; border:1.5px solid #1e2d45; background:transparent; color:#546e7a; cursor:pointer; font-size:12px; transition:all 0.2s; white-space:nowrap; font-family:'DM Sans',sans-serif; }
        .filter-pill:hover:not(.active) { border-color:#4FC3F7; color:#4FC3F7; background:rgba(79,195,247,0.1); }
        .filter-pill.active { border-color:#4FC3F7; color:#4FC3F7; background:rgba(79,195,247,0.1); }
        .calc-slider { -webkit-appearance:none !important; appearance:none !important; width:100%; height:4px; border-radius:2px; background:#1e2d45 !important; outline:none; cursor:pointer; }
        .calc-slider::-webkit-slider-runnable-track { height:4px; border-radius:2px; background:#1e2d45; }
        .calc-slider::-webkit-slider-thumb { -webkit-appearance:none !important; appearance:none !important; width:20px; height:20px; border-radius:50%; background:#4FC3F7 !important; cursor:pointer; box-shadow:0 0 10px rgba(79,195,247,0.5); margin-top:-8px; }
        .calc-slider::-moz-range-track { height:4px; border-radius:2px; background:#1e2d45; }
        .calc-slider::-moz-range-thumb { width:20px; height:20px; border-radius:50%; background:#4FC3F7 !important; cursor:pointer; border:none; box-shadow:0 0 10px rgba(79,195,247,0.5); }
        .chevron-select-wrap { position:relative; display:block; }
        .chevron-select-wrap select { padding-right:32px !important; }
        .chevron-select-wrap::after { content:""; position:absolute; right:10px; top:50%; transform:translateY(-50%); width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid currentColor; pointer-events:none; }
        .glow-text { text-shadow: 0 0 20px rgba(79,195,247,0.4); }
        .streak-fire { animation: wiggle 0.4s ease; }
        .flying-cat-btn { display: none !important; }
        @media (min-width: 768px) { .flying-cat-btn { display: block !important; } }
      `}</style>

      {/* Animated background */}
      <div className="grid-bg" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <CloudLayer />
      </div>
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,195,247,0.06) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -150, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(102,187,106,0.04) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Score Burst */}
      <ScoreBurst show={showBurst} correct={isCorrect} />

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        width: "100%", boxSizing: "border-box",
        background: "rgba(6,13,26,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid #1e2d45",
        padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <a onClick={() => { setActiveTab("quiz"); setQuizScreen("menu"); }} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", cursor: "pointer" }}>
          <div style={{ fontSize: 22 }}>✈️</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5, color: "#fff" }}>My PPL School</div>
            <div style={{ fontSize: 10, color: "#4FC3F7", letterSpacing: 2, textTransform: "uppercase" }}>USA Study Hub</div>
          </div>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {activeTab === "quiz" && quizScreen === "quiz" && (
            <>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#546e7a", letterSpacing: 1 }}>SCORE</div>
                  <div style={{ fontWeight: 900, fontSize: 20, color: "#4FC3F7", fontFamily: "'DM Mono', monospace", animation: "counterUp 0.3s ease" }}>{score}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#546e7a", letterSpacing: 1 }}>STREAK</div>
                  <div className={streak > 0 ? "streak-fire" : ""} style={{ fontWeight: 900, fontSize: 20, color: streak > 0 ? "#FFB74D" : "#374151", fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 4 }}>
                    {streak > 0 && <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFB74D" stroke="#FFB74D" strokeWidth="1"><path d="M12 2c0 0-3 5-3 9a3 3 0 0 0 6 0c0-4-3-9-3-9z"/><path d="M8 14c0 0-2 1.5-2 3a4 4 0 0 0 8 0c0-1.5-2-3-2-3"/></svg>}
                    {streak > 0 ? streak : "—"}
                  </div>
                </div>
              </div>
              <button onClick={() => setShowExitModal(true)} style={{
                padding: "7px 14px", borderRadius: 8, border: "1.5px solid #EF535055",
                background: "rgba(239,83,80,0.08)", color: "#EF9A9A", cursor: "pointer",
                fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,83,80,0.18)"; e.currentTarget.style.borderColor = "#EF5350"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,83,80,0.08)"; e.currentTarget.style.borderColor = "#EF535055"; e.currentTarget.style.color = "#EF9A9A"; }}
              >Exit Quiz</button>
            </>
          )}
          {/* Secret Flying Cat button — desktop only */}
          <button onClick={() => setShowCat(c => !c)} style={{
            display: "none",
            padding: "6px 12px", borderRadius: 8,
            border: `1.5px solid ${showCat ? "#FFB74D" : "#1e2d45"}`,
            background: showCat ? "rgba(255,183,77,0.15)" : "transparent",
            color: showCat ? "#FFB74D" : "#374151",
            cursor: "pointer", fontSize: 11, fontWeight: 700,
            fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s",
            boxShadow: showCat ? "0 0 12px rgba(255,183,77,0.3)" : "none",
          }}
            className="flying-cat-btn"
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#FFB74D"; e.currentTarget.style.color = "#FFB74D"; e.currentTarget.style.background = "rgba(255,183,77,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = showCat ? "#FFB74D" : "#1e2d45"; e.currentTarget.style.color = showCat ? "#FFB74D" : "#374151"; e.currentTarget.style.background = showCat ? "rgba(255,183,77,0.15)" : "transparent"; }}
          >CLEARED FOR CAT</button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ position: "relative", zIndex: 1, width: "100%", boxSizing: "border-box", padding: "24px 24px 100px", maxWidth: "100%" }}>

        {/* ══ QUIZ TAB ══ */}
        {activeTab === "quiz" && (
          <>
            {/* MENU */}
            {quizScreen === "menu" && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ textAlign: "center", marginBottom: 36 }}>
                  <div style={{
                    display: "inline-block", padding: "6px 18px", borderRadius: 30,
                    background: "rgba(79,195,247,0.08)", border: "1px solid rgba(79,195,247,0.2)",
                    color: "#4FC3F7", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16,
                  }}>Cleared For Training</div>
                  <h1 className="glow-text" style={{
                    fontSize: 42, fontWeight: 900, margin: 0, letterSpacing: -1.5,
                    background: "linear-gradient(135deg, #fff 30%, #4FC3F7 80%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>My PPL School</h1>
                  <p style={{ color: "#546e7a", marginTop: 8, fontSize: 13, lineHeight: 1.6, maxWidth: 480, margin: "8px auto 0" }}>Each quiz includes ten curriculum-aligned practice questions, modeled after official FAA test constructs and Knowledge Test Standards.</p>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 11, color: "#546e7a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Difficulty Altitude</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    {DIFFICULTIES.map((d, i) => (
                      <button key={d} className={`diff-btn ${difficulty === i ? "active" : ""}`} onClick={() => setDifficulty(i)}>{d}</button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
                  {QUIZ_TOPICS.map((t, idx) => {
                    const isSelected = selectedTopic === t.id;
                    return (
                      <div key={t.id}
                        className={`topic-card ${isSelected ? "sel" : ""}`}
                        onClick={() => setSelectedTopic(t.id)}
                        onMouseEnter={e => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = t.color;
                            e.currentTarget.style.boxShadow = `0 8px 24px ${t.color}33`;
                            e.currentTarget.style.background = `rgba(${parseInt(t.color.slice(1,3),16)},${parseInt(t.color.slice(3,5),16)},${parseInt(t.color.slice(5,7),16)},0.07)`;
                            e.currentTarget.querySelector(".topic-label").style.color = t.color;
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = "#1e2d45";
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.background = "#0d1420";
                            e.currentTarget.querySelector(".topic-label").style.color = "#c8d6e5";
                          }
                        }}
                        style={{
                          borderColor: isSelected ? t.color : "#1e2d45",
                          boxShadow: isSelected ? `0 0 20px ${t.color}33` : "none",
                          animation: `cardEntrance 0.4s ${idx * 0.07}s both ease`,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                          <TopicIcon id={t.id} color={isSelected ? t.color : "#4a5568"} />
                        </div>
                        <div className="topic-label" style={{ fontSize: 12, fontWeight: 700, color: isSelected ? t.color : "#c8d6e5" }}>{t.label}</div>
                      </div>
                    );
                  })}
                </div>

                <button onClick={() => selectedTopic && startQuiz(selectedTopic)} disabled={!selectedTopic}
                  className="takeoff-btn"
                  style={{
                  width: "100%", padding: "18px", borderRadius: 14,
                  background: selectedTopic ? "linear-gradient(135deg, #0277bd, #4FC3F7)" : "#0d1420",
                  border: "none", color: selectedTopic ? "#fff" : "#2a3a4a",
                  fontSize: 16, fontWeight: 800, cursor: selectedTopic ? "pointer" : "not-allowed",
                  letterSpacing: 1.5, transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
                  boxShadow: selectedTopic ? "0 6px 30px rgba(79,195,247,0.35)" : "none",
                  transform: selectedTopic ? "translateY(0)" : "translateY(0)",
                }}>
                  CLEARED FOR TAKEOFF
                </button>
              </div>
            )}

            {/* QUIZ SCREEN */}
            {quizScreen === "quiz" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                {/* Progress */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, color: "#546e7a" }}>
                    <span>Q{questionNum} / {TOTAL_Q}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, color: topic?.color }}>
                      <TopicIcon id={topic?.id} color={topic?.color} />
                      <span style={{ fontSize: 11 }}>{topic?.label}</span>
                    </span>
                  </div>
                  <div style={{ height: 4, background: "#1e2d45", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${(questionNum / TOTAL_Q) * 100}%`,
                      background: `linear-gradient(90deg, ${topic?.color}88, ${topic?.color})`,
                      borderRadius: 2, transition: "width 0.5s cubic-bezier(0.23,1,0.32,1)",
                      animation: "horizonScan 0.5s ease",
                    }} />
                  </div>
                  {/* History dots */}
                  <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
                    {Array.from({ length: TOTAL_Q }).map((_, i) => (
                      <div key={i} style={{
                        flex: 1, height: 4, borderRadius: 2,
                        background: i < history.length ? (history[i] ? "#66BB6A" : "#EF5350") : i === questionNum - 1 ? topic?.color : "#1e2d45",
                        transition: "background 0.3s", boxShadow: i === questionNum - 1 ? `0 0 6px ${topic?.color}` : "none",
                      }} />
                    ))}
                  </div>
                </div>

                {/* Question card */}
                <div style={{
                  background: "linear-gradient(135deg, #0d1929 0%, #0a1520 100%)",
                  border: `1.5px solid ${selected !== null ? (isCorrect ? "#66BB6A44" : "#EF535044") : "#1e2d45"}`,
                  borderRadius: 16, padding: "24px 22px", marginBottom: 16, minHeight: 110,
                  transition: "border-color 0.4s", boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                }}>
                  {loading ? (
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{ fontSize: 24, animation: "spin 1s linear infinite" }}>⚙️</div>
                      <div>
                        <div style={{ color: "#4FC3F7", fontWeight: 600, marginBottom: 4 }}>Generating question...</div>
                        <div style={{
                          width: 200, height: 8, borderRadius: 4,
                          background: "linear-gradient(90deg, #1e2d45 25%, #2a3d55 50%, #1e2d45 75%)",
                          backgroundSize: "300px 100%",
                          animation: "shimmerBar 1.5s linear infinite",
                        }} />
                      </div>
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, fontWeight: 500 }}>{question}</p>
                  )}
                </div>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {options.map((opt, i) => {
                    let cls = "option-btn";
                    if (selected !== null) {
                      if (opt[0] === correctRef.current) cls += " option-correct";
                      else if (opt === selected) cls += " option-wrong";
                    }
                    return (
                      <button key={i} className={cls} disabled={!!selected || loading} onClick={() => handleAnswer(opt)}
                        style={{ animationDelay: `${i * 0.06}s`, animation: loading ? "none" : `cardEntrance 0.3s ${0.1 + i * 0.05}s both` }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {selected && explanation && (
                  <div style={{
                    background: isCorrect ? "rgba(102,187,106,0.07)" : "rgba(239,83,80,0.07)",
                    border: `1px solid ${isCorrect ? "#66BB6A33" : "#EF535033"}`,
                    borderRadius: 12, padding: "14px 18px", marginBottom: 16,
                    animation: "cardEntrance 0.3s ease",
                  }}>
                    <div style={{ fontWeight: 800, color: isCorrect ? "#66BB6A" : "#EF5350", marginBottom: 4 }}>
                      {isCorrect ? "Correct!" : "Incorrect"} {streak >= 3 && isCorrect && `${streak}-streak bonus!`}
                    </div>
                    <div style={{ fontSize: 13, color: "#b0bec5", lineHeight: 1.6 }}>{explanation}</div>
                  </div>
                )}

                {selected && (
                  <button onClick={nextQuestion} style={{
                    width: "100%", padding: "15px", borderRadius: 12,
                    background: "linear-gradient(135deg, #0277bd, #4FC3F7)",
                    border: "none", color: "#fff", fontSize: 15, fontWeight: 800,
                    cursor: "pointer", letterSpacing: 1, animation: "cardEntrance 0.3s ease",
                    boxShadow: "0 4px 20px rgba(79,195,247,0.3)",
                  }}>
                    {questionNum >= TOTAL_Q ? "View Debrief →" : "Next Question →"}
                  </button>
                )}
              </div>
            )}

            {/* RESULT */}
            {quizScreen === "result" && (
              <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, animation: "wiggle 0.5s 0.3s ease" }}>
                  {score >= 100
                    ? <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FFB74D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
                    : score >= 60
                    ? <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4FC3F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                    : <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#546e7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  }
                </div>
                <h2 style={{
                  fontSize: 36, fontWeight: 900, margin: "0 0 4px",
                  background: "linear-gradient(135deg, #fff, #4FC3F7)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>Mission Debrief</h2>
                <p style={{ color: "#546e7a", marginBottom: 28 }}>{topic?.label} · {DIFFICULTIES[difficulty]}</p>

                {/* Score ring */}
                <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 28px" }}>
                  <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#1e2d45" strokeWidth="8" />
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#4FC3F7" strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 52}`}
                      strokeDashoffset={`${2 * Math.PI * 52 * (1 - Math.min(1, score / 140))}`}
                      strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontWeight: 900, fontSize: 28, color: "#4FC3F7", fontFamily: "'DM Mono', monospace" }}>{score}</div>
                    <div style={{ fontSize: 10, color: "#546e7a", letterSpacing: 1 }}>PTS</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
                  {[
                    { label: "Correct",     val: `${history.filter(Boolean).length}/${TOTAL_Q}`, color: "#66BB6A" },
                    { label: "Accuracy",    val: `${Math.round(history.filter(Boolean).length / TOTAL_Q * 100)}%`, color: "#4FC3F7" },
                    { label: "Best Streak", val: maxStreak, color: "#FFB74D" },
                  ].map((s, i) => (
                    <div key={s.label} style={{
                      background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 12, padding: "16px 10px",
                      animation: `cardEntrance 0.4s ${0.2 + i * 0.1}s both ease`,
                    }}>
                      <div style={{ fontSize: 10, color: "#546e7a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.val}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 28 }}>
                  {history.map((h, i) => (
                    <div key={i} style={{
                      width: 30, height: 30, borderRadius: 8, fontSize: 14,
                      background: h ? "rgba(102,187,106,0.12)" : "rgba(239,83,80,0.1)",
                      border: `1px solid ${h ? "#66BB6A44" : "#EF535044"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      animation: `cardEntrance 0.3s ${i * 0.05}s both ease`,
                    }}>{h ? "✓" : "✗"}</div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => startQuiz(selectedTopic)} style={{
                    flex: 1, padding: "14px", borderRadius: 12, border: "1.5px solid #1e2d45",
                    background: "transparent", color: "#c8d6e5", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    transition: "all 0.2s",
                  }}>↺ Fly Again</button>
                  <button onClick={() => setQuizScreen("menu")} style={{
                    flex: 1, padding: "14px", borderRadius: 12,
                    background: "linear-gradient(135deg, #0277bd, #4FC3F7)",
                    border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}>Change Subject →</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ══ ACRONYMS TAB ══ */}
        {activeTab === "acronyms" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontWeight: 900, fontSize: 28, margin: "0 0 4px", color: "#fff" }}>Acronym Flashcards</h2>
              <p style={{ color: "#546e7a", margin: "0 0 16px", fontSize: 14 }}>Tap a card to reveal the full meaning, or test yourself in Quiz mode</p>

              {/* Mode toggle */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {["browse", "quiz"].map(m => (
                  <button key={m} className={`filter-pill ${acronymMode === m ? "active" : ""}`}
                    onClick={() => { setAcronymMode(m); if (m === "quiz") { setAcroScore(0); setAcroStreak(0); setAcroTotal(0); startAcroQuiz(); } }}
                    style={{ textTransform: "capitalize", flex: 1, textAlign: "center", padding: "8px 14px" }}>
                    {m === "browse" ? "Browse" : "Quiz"}
                  </button>
                ))}
              </div>
            </div>

            {/* BROWSE MODE */}
            {acronymMode === "browse" && (
              <>
                <input className="search-input" placeholder="Search acronyms..." value={acronymSearch} onChange={e => setAcronymSearch(e.target.value)} style={{ marginBottom: 16 }} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                  {acronymCategories.map(cat => (
                    <button key={cat} className={`filter-pill ${acronymFilter === cat ? "active" : ""}`} onClick={() => setAcronymFilter(cat)}>{cat}</button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {filteredAcronyms.map((item, i) => <FlipCard key={item.acronym} item={item} index={i} />)}
                </div>
                {filteredAcronyms.length === 0 && (
                  <div style={{ textAlign: "center", color: "#374151", padding: "40px 0", fontSize: 14 }}>No acronyms found</div>
                )}
              </>
            )}

            {/* QUIZ MODE */}
            {acronymMode === "quiz" && acroQ && (
              <div>
                {/* Score strip */}
                <div style={{ display: "flex", gap: 16, marginBottom: 20, background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 12, padding: "12px 18px" }}>
                  {[
                    { label: "Score", val: `${acroScore}/${acroTotal}`, color: "#4FC3F7" },
                    { label: "Streak", val: acroStreak > 0 ? acroStreak : "—", color: "#FFB74D" },
                    { label: "Accuracy", val: acroTotal > 0 ? `${Math.round(acroScore / acroTotal * 100)}%` : "—", color: "#81C784" },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: 10, color: "#546e7a", letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
                      <div style={{ fontWeight: 900, fontSize: 18, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.val}</div>
                    </div>
                  ))}
                </div>

                {/* Question card */}
                <div style={{
                  background: "linear-gradient(135deg, #0d1929, #0a1520)",
                  border: "1.5px solid #1e2d45", borderRadius: 16, padding: "28px 24px",
                  textAlign: "center", marginBottom: 16,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                }}>
                  <div style={{ fontSize: 11, color: "#546e7a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>What does this acronym stand for?</div>
                  <div style={{
                    fontSize: 52, fontWeight: 900, color: "#4FC3F7",
                    fontFamily: "'DM Mono', monospace", letterSpacing: 3,
                    textShadow: "0 0 30px rgba(79,195,247,0.4)",
                    animation: "counterUp 0.3s ease",
                  }}>{acroQ.acronym}</div>
                  <div style={{ marginTop: 8, fontSize: 11, padding: "4px 12px", borderRadius: 20, display: "inline-block", background: "rgba(79,195,247,0.1)", color: "#4FC3F7", border: "1px solid rgba(79,195,247,0.2)", letterSpacing: 1 }}>{acroQ.category}</div>
                </div>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {acroOptions.map((opt, i) => {
                    let bg = "#0d1929", border = "#1e2d45", color = "#c8d6e5";
                    if (acroSelected) {
                      if (opt.acronym === acroQ.acronym) { bg = "rgba(102,187,106,0.1)"; border = "#66BB6A"; color = "#A5D6A7"; }
                      else if (acroSelected.acronym === opt.acronym) { bg = "rgba(239,83,80,0.08)"; border = "#EF5350"; color = "#EF9A9A"; }
                    }
                    return (
                      <button key={opt.acronym} onClick={() => handleAcroAnswer(opt)} disabled={!!acroSelected}
                        style={{
                          background: bg, border: `1.5px solid ${border}`, borderRadius: 12,
                          color, padding: "14px 18px", cursor: acroSelected ? "default" : "pointer",
                          transition: "all 0.2s", fontSize: 13, fontWeight: 600, textAlign: "left",
                          fontFamily: "'DM Sans',sans-serif",
                          animation: `cardEntrance 0.3s ${i * 0.07}s both ease`,
                        }}
                        onMouseEnter={e => { if (!acroSelected) { e.currentTarget.style.borderColor = "#4FC3F7"; e.currentTarget.style.background = "#0a1825"; } }}
                        onMouseLeave={e => { if (!acroSelected) { e.currentTarget.style.borderColor = "#1e2d45"; e.currentTarget.style.background = "#0d1929"; } }}
                      >
                        {opt.full}
                      </button>
                    );
                  })}
                </div>

                {acroSelected && (
                  <div style={{ animation: "cardEntrance 0.3s ease" }}>
                    <div style={{
                      background: acroSelected.acronym === acroQ.acronym ? "rgba(102,187,106,0.07)" : "rgba(239,83,80,0.07)",
                      border: `1px solid ${acroSelected.acronym === acroQ.acronym ? "#66BB6A33" : "#EF535033"}`,
                      borderRadius: 12, padding: "12px 16px", marginBottom: 12, fontSize: 13,
                      color: acroSelected.acronym === acroQ.acronym ? "#A5D6A7" : "#EF9A9A",
                    }}>
                      {acroSelected.acronym === acroQ.acronym
                        ? `Correct! ${acroQ.acronym} = ${acroQ.full}`
                        : `Incorrect. ${acroQ.acronym} stands for: ${acroQ.full}`}
                    </div>
                    <button onClick={startAcroQuiz} style={{
                      width: "100%", padding: "14px", borderRadius: 12,
                      background: "linear-gradient(135deg, #0277bd, #4FC3F7)",
                      border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
                    }}>Next Acronym →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ NATO PHONETIC TAB ══ */}
        {activeTab === "nato" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <NavIcon id="nato" active={true} />
                <h2 style={{ fontWeight: 900, fontSize: 28, margin: 0, color: "#fff" }}>NATO Phonetic Alphabet</h2>
              </div>
              <p style={{ color: "#546e7a", margin: "0 0 20px", fontSize: 14 }}>Used by every US pilot on the radio — FAA standard</p>

              {/* Mode toggle */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {["browse", "converter", "quiz"].map(m => (
                  <button key={m} className={`filter-pill ${natoMode === m ? "active" : ""}`}
                    onClick={() => { setNatoMode(m); if (m === "quiz") { setNatoScore(0); setNatoStreak(0); setNatoTotal(0); startNatoQuiz(); } }}
                    style={{ textTransform: "capitalize", flex: 1, textAlign: "center" }}>
                    {m === "browse" ? "Browse" : m === "converter" ? "Converter" : "Quiz"}
                  </button>
                ))}
              </div>
            </div>

            {/* BROWSE MODE */}
            {natoMode === "browse" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {NATO_ALPHABET.map((n, i) => (
                  <div key={n.letter} style={{
                    background: "linear-gradient(135deg, #0d1929, #0a1520)",
                    border: "1.5px solid #1e2d45", borderRadius: 12, padding: "14px 12px",
                    textAlign: "center", animation: `cardEntrance 0.3s ${i * 0.03}s both ease`,
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#4FC3F7"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2d45"}
                  >
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#4FC3F7", fontFamily: "'DM Mono', monospace", marginBottom: 2 }}>{n.letter}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e8eaf6", marginBottom: 3 }}>{n.word}</div>
                    <div style={{ fontSize: 10, color: "#546e7a", letterSpacing: 0.5 }}>{n.pronunciation}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CONVERTER MODE */}
            {natoMode === "converter" && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: "#546e7a", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Type anything — see it in phonetic</label>
                  <input
                    className="search-input"
                    placeholder="e.g. N12345 or KORD..."
                    value={natoInput}
                    onChange={e => setNatoInput(e.target.value)}
                    style={{ fontSize: 18, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}
                  />
                </div>
                {natoInput && (
                  <div style={{
                    background: "linear-gradient(135deg, #0a1e2f, #0d2040)",
                    border: "1.5px solid #1e3a5f", borderRadius: 14, padding: "20px",
                    animation: "cardEntrance 0.3s ease",
                  }}>
                    <div style={{ fontSize: 11, color: "#546e7a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Phonetic Readout</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {natoInput.toUpperCase().split("").map((ch, i) => {
                        const match = NATO_ALPHABET.find(n => n.letter === ch);
                        return (
                          <div key={i} style={{
                            background: match ? "rgba(79,195,247,0.1)" : "rgba(255,255,255,0.04)",
                            border: `1.5px solid ${match ? "rgba(79,195,247,0.3)" : "#1e2d45"}`,
                            borderRadius: 8, padding: "8px 12px", textAlign: "center",
                            animation: `cardEntrance 0.2s ${i * 0.04}s both ease`,
                          }}>
                            <div style={{ fontSize: 11, color: "#546e7a", fontFamily: "'DM Mono', monospace" }}>{ch}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: match ? "#4FC3F7" : "#374151" }}>
                              {match ? match.word : (ch === " " ? "·" : ch)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(79,195,247,0.05)", borderRadius: 8, borderLeft: "3px solid #4FC3F755" }}>
                      <div style={{ fontSize: 11, color: "#546e7a", marginBottom: 4, letterSpacing: 1 }}>AS SPOKEN ON RADIO</div>
                      <div style={{ fontSize: 13, color: "#81d4fa", lineHeight: 1.7, fontStyle: "italic" }}>{natoConverted}</div>
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 16, background: "rgba(79,195,247,0.04)", border: "1px solid rgba(79,195,247,0.12)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontWeight: 700, color: "#4FC3F7", marginBottom: 8, fontSize: 13 }}>💡 Radio Tips</div>
                  <ul style={{ margin: 0, padding: "0 0 0 16px", color: "#7f8fa6", fontSize: 12, lineHeight: 2 }}>
                    <li>Always read your N-number phonetically: N12345 = "November One Two Three Four Five"</li>
                    <li>Airport identifiers: KORD = "Kilo Oscar Romeo Delta"</li>
                    <li>Say digits individually: 270° = "Two Seven Zero"</li>
                    <li>Use "Niner" for 9 to avoid confusion with German "nein" (no)</li>
                  </ul>
                </div>
              </div>
            )}

            {/* QUIZ MODE */}
            {natoMode === "quiz" && natoQ && (
              <div>
                {/* Score strip */}
                <div style={{ display: "flex", gap: 16, marginBottom: 20, background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 12, padding: "12px 18px" }}>
                  {[
                    { label: "Score", val: `${natoScore}/${natoTotal}`, color: "#4FC3F7" },
                    { label: "Streak", val: natoStreak > 0 ? natoStreak : "—", color: "#FFB74D" },
                    { label: "Accuracy", val: natoTotal > 0 ? `${Math.round(natoScore/natoTotal*100)}%` : "—", color: "#81C784" },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: 10, color: "#546e7a", letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
                      <div style={{ fontWeight: 900, fontSize: 18, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.val}</div>
                    </div>
                  ))}
                </div>

                {/* Question */}
                <div style={{
                  background: "linear-gradient(135deg, #0d1929, #0a1520)",
                  border: "1.5px solid #1e2d45", borderRadius: 16, padding: "32px 24px",
                  textAlign: "center", marginBottom: 16,
                }}>
                  <div style={{ fontSize: 11, color: "#546e7a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>What is the NATO word for...</div>
                  <div style={{
                    fontSize: 80, fontWeight: 900, color: "#4FC3F7",
                    fontFamily: "'DM Mono', monospace", lineHeight: 1,
                    textShadow: "0 0 40px rgba(79,195,247,0.4)",
                    animation: "counterUp 0.3s ease",
                  }}>{natoQ.letter}</div>
                </div>

                {/* Options */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {natoOptions.map((opt, i) => {
                    let bg = "#0d1929", border = "#1e2d45", color = "#c8d6e5";
                    if (natoSelected) {
                      if (opt.letter === natoQ.letter) { bg = "rgba(102,187,106,0.1)"; border = "#66BB6A"; color = "#A5D6A7"; }
                      else if (natoSelected.letter === opt.letter) { bg = "rgba(239,83,80,0.08)"; border = "#EF5350"; color = "#EF9A9A"; }
                    }
                    return (
                      <button key={opt.letter} onClick={() => handleNatoAnswer(opt)} disabled={!!natoSelected}
                        style={{
                          background: bg, border: `1.5px solid ${border}`, borderRadius: 12,
                          color, padding: "16px 12px", cursor: natoSelected ? "default" : "pointer",
                          transition: "all 0.2s", fontSize: 15, fontWeight: 700, textAlign: "center",
                          animation: `cardEntrance 0.3s ${i * 0.07}s both ease`,
                        }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, marginBottom: 2 }}>{opt.word}</div>
                        <div style={{ fontSize: 11, opacity: 0.6 }}>{opt.pronunciation}</div>
                      </button>
                    );
                  })}
                </div>

                {natoSelected && (
                  <div style={{ animation: "cardEntrance 0.3s ease" }}>
                    <div style={{
                      background: natoSelected.letter === natoQ.letter ? "rgba(102,187,106,0.07)" : "rgba(239,83,80,0.07)",
                      border: `1px solid ${natoSelected.letter === natoQ.letter ? "#66BB6A33" : "#EF535033"}`,
                      borderRadius: 12, padding: "12px 16px", marginBottom: 12, fontSize: 13,
                      color: natoSelected.letter === natoQ.letter ? "#A5D6A7" : "#EF9A9A",
                    }}>
                      {natoSelected.letter === natoQ.letter
                        ? `✓ Correct! ${natoQ.letter} = ${natoQ.word} (${natoQ.pronunciation})`
                        : `✗ Incorrect. ${natoQ.letter} = ${natoQ.word} — pronounced "${natoQ.pronunciation}"`}
                    </div>
                    <button onClick={startNatoQuiz} style={{
                      width: "100%", padding: "14px", borderRadius: 12,
                      background: "linear-gradient(135deg, #0277bd, #4FC3F7)",
                      border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
                    }}>Next Letter →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ LINGO TAB ══ */}
        {activeTab === "lingo" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <NavIcon id="lingo" active={true} />
                <h2 style={{ fontWeight: 900, fontSize: 28, margin: 0, color: "#fff" }}>Pilot Lingo</h2>
              </div>
              <p style={{ color: "#546e7a", margin: "0 0 20px", fontSize: 14 }}>The language of the skies — tap any term for example usage</p>
              <input className="search-input" placeholder="Search terms..." value={lingoSearch} onChange={e => setLingoSearch(e.target.value)} />
            </div>

            {/* Rotating highlight cards — 2 random terms shown fresh each visit */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[LINGO[lingoHighlightIdx], LINGO[(lingoHighlightIdx + 1) % LINGO.length]].map((item, ci) => (
                <div key={item.term} style={{
                  background: ci === 0 ? "rgba(79,195,247,0.07)" : "rgba(129,199,132,0.07)",
                  border: `1.5px solid ${ci === 0 ? "#4FC3F733" : "#81C78433"}`,
                  borderRadius: 14, padding: "16px", animation: "cardEntrance 0.4s ease",
                }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <NavIcon id="lingo" active={ci === 0} />
                  </div>
                  <div style={{ fontWeight: 900, color: ci === 0 ? "#4FC3F7" : "#81C784", letterSpacing: 1, fontFamily: "'DM Mono', monospace", marginBottom: 4, fontSize: 13, textAlign: "center" }}>{item.term}</div>
                  <div style={{ fontSize: 11, color: "#7f8fa6", textAlign: "center", lineHeight: 1.4 }}>{item.meaning}</div>
                </div>
              ))}
            </div>

            {/* Always-visible Mayday / Pan-Pan cards with SVG */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { term: "MAYDAY",  color: "#EF5350", bg: "rgba(239,83,80,0.08)",   desc: "Immediate distress" },
                { term: "PAN-PAN", color: "#FFB74D", bg: "rgba(255,183,77,0.08)",  desc: "Urgent situation"   },
              ].map(c => (
                <div key={c.term} style={{
                  background: c.bg, border: `1.5px solid ${c.color}33`, borderRadius: 14,
                  padding: "16px", textAlign: "center", animation: "cardEntrance 0.4s ease",
                }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r=".5" fill={c.color}/>
                    </svg>
                  </div>
                  <div style={{ fontWeight: 900, color: c.color, letterSpacing: 2, fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{c.term}</div>
                  <div style={{ fontSize: 12, color: "#7f8fa6" }}>{c.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredLingo.map((item, i) => <LingoCard key={item.term} item={item} index={i} />)}
            </div>
            {filteredLingo.length === 0 && (
              <div style={{ textAlign: "center", color: "#374151", padding: "40px 0", fontSize: 14 }}>No terms found</div>
            )}
          </div>
        )}

        {/* ══ PPL COST CALCULATOR TAB ══ */}
        {activeTab === "calculator" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <NavIcon id="calculator" active={true} />
                <h2 style={{ fontWeight: 900, fontSize: 28, margin: 0, color: "#fff" }}>PPL Cost Calculator</h2>
              </div>
              <p style={{ color: "#546e7a", margin: 0, fontSize: 14 }}>Estimate your full US Private Pilot Certificate training cost</p>
            </div>

            {/* Plane type + state selectors */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{ background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 12, padding: "14px" }}>
                <div style={{ fontSize: 11, color: "#546e7a", marginBottom: 8, letterSpacing: 0.5 }}>Aircraft Type</div>
                <div className="chevron-select-wrap" style={{ color: "#4FC3F7" }}>
                <select value={pplPlaneId} onChange={e => setPplPlaneId(e.target.value)}
                  style={{ width: "100%", background: "#0d1929", border: "1.5px solid #4FC3F733", borderRadius: 8, color: "#4FC3F7", padding: "8px 10px", fontSize: 13, fontFamily: "'DM Mono',monospace", fontWeight: 700, outline: "none" }}>
                  {PLANE_TYPES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
                </div>
              </div>
              <div style={{ background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 12, padding: "14px" }}>
                <div style={{ fontSize: 11, color: "#546e7a", marginBottom: 8, letterSpacing: 0.5 }}>Your State</div>
                <div className="chevron-select-wrap" style={{ color: "#81C784" }}>
                <select value={pplState} onChange={e => setPplState(e.target.value)}
                  style={{ width: "100%", background: "#0d1929", border: "1.5px solid #81C78433", borderRadius: 8, color: "#81C784", padding: "8px 10px", fontSize: 13, fontFamily: "'DM Mono',monospace", fontWeight: 700, outline: "none" }}>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                </div>
              </div>
            </div>
            {/* State rate info */}
            <div style={{ background: "rgba(79,195,247,0.04)", border: "1px solid #1e2d45", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#546e7a", display: "flex", justifyContent: "space-between" }}>
              <span>{pplPlane.label} in {pplState}</span>
              <span style={{ color: "#4FC3F7", fontFamily: "'DM Mono',monospace" }}>~${pplStateRate}/hr wet rental</span>
            </div>

            {/* Grand total hero */}
            <div style={{
              background: "linear-gradient(135deg, #0a1e2f 0%, #0d2040 100%)",
              border: "1.5px solid #1e3a5f", borderRadius: 18, padding: "24px",
              marginBottom: 24, textAlign: "center",
              boxShadow: "0 0 40px rgba(79,195,247,0.08)",
            }}>
              <div style={{ fontSize: 11, color: "#546e7a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Estimated Total Cost</div>
              <div className="glow-text" style={{
                fontSize: 52, fontWeight: 900, color: "#4FC3F7",
                fontFamily: "'DM Mono', monospace", letterSpacing: -1,
              }}>
                ${Math.round(grandTotal).toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: "#374151", marginTop: 6 }}>Based on {hours} hrs total training</div>

              {/* Breakdown bar */}
              <div style={{ marginTop: 16, height: 8, borderRadius: 4, overflow: "hidden", display: "flex", gap: 2 }}>
                {[
                  { val: totalAircraft, color: "#4FC3F7" },
                  { val: totalInstructor, color: "#81C784" },
                  { val: examFees, color: "#FFB74D" },
                  { val: medFee, color: "#CE93D8" },
                  { val: groundSchool, color: "#F48FB1" },
                ].map((b, i) => (
                  <div key={i} style={{
                    flex: b.val, background: b.color, opacity: 0.85, borderRadius: 2,
                    transition: "flex 0.5s cubic-bezier(0.23,1,0.32,1)",
                    minWidth: b.val > 0 ? 4 : 0,
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 10, justifyContent: "center" }}>
                {[
                  { label: "Aircraft", val: totalAircraft, color: "#4FC3F7" },
                  { label: "Instructor", val: totalInstructor, color: "#81C784" },
                  { label: "Exams", val: examFees, color: "#FFB74D" },
                  { label: "Medical", val: medFee, color: "#CE93D8" },
                  { label: "Ground", val: groundSchool, color: "#F48FB1" },
                ].map(b => (
                  <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: b.color }} />
                    <span style={{ color: "#546e7a" }}>{b.label}:</span>
                    <span style={{ color: b.color, fontFamily: "'DM Mono', monospace" }}>${Math.round(b.val).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Hours slider */}
              <div style={{ background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 14, padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, color: "#c8d6e5" }}>Total Flight Hours</span>
                  <span style={{ color: "#4FC3F7", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{hours} hrs</span>
                </div>
                <input type="range" className="calc-slider" min={35} max={80} value={hours}
                  onChange={e => { setHours(+e.target.value); if (+e.target.value < soloHours + 5) setSoloHours(+e.target.value - 5); }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#374151", marginTop: 4 }}>
                  <span>35 hrs (min)</span><span>80 hrs</span>
                </div>
              </div>

              <div style={{ background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 14, padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, color: "#c8d6e5" }}>Solo Hours</span>
                  <span style={{ color: "#81C784", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{soloHours} hrs</span>
                </div>
                <input type="range" className="calc-slider" min={5} max={Math.min(25, hours - 10)} value={soloHours}
                  onChange={e => setSoloHours(+e.target.value)}
                  style={{ accentColor: "#81C784" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#374151", marginTop: 4 }}>
                  <span>5 hrs</span><span>Dual: {dualHours} hrs</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Wet Rental Rate ($/hr)", val: pplStateRate, setter: null, color: "#4FC3F7", readOnly: true },
                  { label: "Instructor Rate ($/hr)", val: instructorRate, setter: setInstructorRate, color: "#81C784" },
                  { label: "FAA Written Test ($)", val: examFees, setter: setExamFees, color: "#FFB74D" },
                  { label: "3rd Class Medical ($)", val: medFee, setter: setMedFee, color: "#CE93D8" },
                  { label: "Ground School ($)", val: groundSchool, setter: setGroundSchool, color: "#F48FB1" },
                ].map(f => (
                  <div key={f.label} style={{ background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 12, padding: "14px" }}>
                    <div style={{ fontSize: 11, color: "#546e7a", marginBottom: 8, letterSpacing: 0.5 }}>{f.label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: "#374151", fontSize: 14 }}>$</span>
                      <input className="input-field" type="number" value={f.val}
                        readOnly={f.readOnly}
                        onChange={e => f.setter && f.setter(+e.target.value)}
                        style={{ border: `1.5px solid ${f.color}33`, color: f.readOnly ? "#546e7a" : f.color, fontFamily: "'DM Mono', monospace", fontWeight: 700, cursor: f.readOnly ? "default" : "text" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div style={{ background: "rgba(79,195,247,0.04)", border: "1px solid rgba(79,195,247,0.12)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontWeight: 700, color: "#4FC3F7", marginBottom: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Cost Tips
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 16px", color: "#7f8fa6", fontSize: 12, lineHeight: 2 }}>
                  <li>FAA minimum is 40 hours — but the national average is 60–70 hrs</li>
                  <li>Flying at a Part 141 school can be faster and sometimes cheaper than Part 61</li>
                  <li>Block-booking hours at your FBO often saves 5–10% on rental rates</li>
                  <li>A Sport Pilot Certificate requires fewer hours if you only want to fly Light Sport Aircraft</li>
                  <li>The FAA written test fee (~$175) is paid to an approved testing center (PSI/CATS)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {/* ══ TRIP CALCULATOR TAB ══ */}
        {activeTab === "tripcalc" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <NavIcon id="tripcalc" active={true} />
                <h2 style={{ fontWeight: 900, fontSize: 28, margin: 0, color: "#fff" }}>Trip Calculator</h2>
              </div>
              <p style={{ color: "#546e7a", margin: 0, fontSize: 14 }}>Plan a VFR cross-country — time, fuel, and cost</p>
            </div>

            {/* Plane type + state selectors */}
            <div style={{ background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 12, padding: "14px", marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#546e7a", marginBottom: 8, letterSpacing: 0.5 }}>Aircraft Type</div>
                  <div className="chevron-select-wrap" style={{ color: "#4FC3F7" }}>
                  <select value={tripPlaneId}
                    onChange={e => { const p = PLANE_TYPES.find(x => x.id === e.target.value); setTripPlaneId(e.target.value); setTripSpeed(p.speed); setTripFuelBurn(p.burn); setTripRentalRate(p.state_avg[tripState] || p.wetRate); }}
                    style={{ width: "100%", background: "#0d1929", border: "1.5px solid #4FC3F733", borderRadius: 8, color: "#4FC3F7", padding: "8px 10px", fontSize: 13, fontFamily: "'DM Mono',monospace", fontWeight: 700, outline: "none" }}>
                    {PLANE_TYPES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#546e7a", marginBottom: 8, letterSpacing: 0.5 }}>Your State</div>
                  <div className="chevron-select-wrap" style={{ color: "#81C784" }}>
                  <select value={tripState}
                    onChange={e => { setTripState(e.target.value); setTripRentalRate(tripPlane.state_avg[e.target.value] || tripPlane.wetRate); }}
                    style={{ width: "100%", background: "#0d1929", border: "1.5px solid #81C78433", borderRadius: 8, color: "#81C784", padding: "8px 10px", fontSize: 13, fontFamily: "'DM Mono',monospace", fontWeight: 700, outline: "none" }}>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  </div>
                </div>
              </div>
              {tripPlaneId !== "other" && (
                <div style={{ fontSize: 11, color: "#374151", display: "flex", gap: 16, borderTop: "1px solid #1e2d45", paddingTop: 10 }}>
                  <span>Cruise: <span style={{ color: "#4FC3F7" }}>{tripPlane.speed} kts</span></span>
                  <span>Burn: <span style={{ color: "#FFB74D" }}>{tripPlane.burn} gal/hr</span></span>
                  <span>Rate in {tripState}: <span style={{ color: "#81C784" }}>${tripStateRate}/hr</span></span>
                </div>
              )}
            </div>

            {/* Summary hero cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Flight Time",   val: effectiveSpeed > 0 ? tripTimeDisplay : "—",       color: "#4FC3F7",
                  svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4FC3F7" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                { label: "Total Cost",    val: `$${Math.round(tripTotalCost).toLocaleString()}`,  color: "#81C784",
                  svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#81C784" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
                { label: "Fuel Required", val: `${totalFuel.toFixed(1)} gal`,                    color: "#FFB74D",
                  svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFB74D" strokeWidth="1.8" strokeLinecap="round"><path d="M3 22V8l7-6 7 6v14"/><path d="M10 22v-5h4v5"/><path d="M14 10.5V9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6.5"/></svg> },
                { label: "Cost / Person", val: `$${Math.round(costPerPax).toLocaleString()}`,    color: "#CE93D8",
                  svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CE93D8" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
              ].map((s, i) => (
                <div key={s.label} style={{
                  background: "linear-gradient(135deg, #0d1929, #0a1520)",
                  border: `1.5px solid ${s.color}22`, borderRadius: 14, padding: "16px",
                  animation: `cardEntrance 0.3s ${i * 0.07}s both ease`,
                  boxShadow: `0 4px 20px ${s.color}0a`,
                }}>
                  <div style={{ marginBottom: 4 }}>{s.svg}</div>
                  <div style={{ fontSize: 11, color: "#546e7a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontWeight: 900, fontSize: 22, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Cost breakdown bar */}
            <div style={{ background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#546e7a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Cost Breakdown</div>
              <div style={{ height: 8, borderRadius: 4, overflow: "hidden", display: "flex", gap: 2, marginBottom: 10 }}>
                {[{ val: rentalCost, color: "#4FC3F7" }, { val: fuelCost, color: "#FFB74D" }].map((b, i) => (
                  <div key={i} style={{ flex: b.val, background: b.color, opacity: 0.85, borderRadius: 2, transition: "flex 0.5s cubic-bezier(0.23,1,0.32,1)", minWidth: b.val > 0 ? 4 : 0 }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                {[{ label: "Aircraft Rental", val: rentalCost, color: "#4FC3F7" }, { label: "Fuel", val: fuelCost, color: "#FFB74D" }].map(b => (
                  <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: b.color }} />
                    <span style={{ color: "#546e7a" }}>{b.label}:</span>
                    <span style={{ color: b.color, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>${Math.round(b.val).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Distance slider */}
              <div style={{ background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: "#c8d6e5", fontSize: 14 }}>Trip Distance</span>
                  <span style={{ color: "#4FC3F7", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{tripDistance} nm</span>
                </div>
                <input type="range" className="calc-slider" min={10} max={800} value={tripDistance} onChange={e => setTripDistance(+e.target.value)} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#374151", marginTop: 4 }}>
                  <span>10 nm</span><span>800 nm</span>
                </div>
              </div>

              {/* Wind component */}
              <div style={{ background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: "#c8d6e5", fontSize: 14 }}>Wind Component</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, color: tripWindComponent > 0 ? "#81C784" : tripWindComponent < 0 ? "#EF5350" : "#546e7a", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>
                    {tripWindComponent > 0 ? `+${tripWindComponent}` : tripWindComponent} kts
                    {tripWindComponent !== 0 && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tripWindComponent > 0 ? "#81C784" : "#EF5350"} strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="19" x2="12" y2="5"/>
                        <polyline points={tripWindComponent > 0 ? "5 12 12 5 19 12" : "5 12 12 19 19 12"}/>
                      </svg>
                    )}
                    <span style={{ fontSize: 11, color: "#546e7a" }}>{tripWindComponent > 0 ? "tailwind" : tripWindComponent < 0 ? "headwind" : "calm"}</span>
                  </span>
                </div>
                <input type="range" className="calc-slider" min={-40} max={40} value={tripWindComponent} onChange={e => setTripWindComponent(+e.target.value)} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#374151", marginTop: 4 }}>
                  <span>40 kts headwind</span><span>40 kts tailwind</span>
                </div>
              </div>

              {/* Grid inputs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Cruise Speed (kts)",       val: tripSpeed,       setter: setTripSpeed,       color: "#4FC3F7" },
                  { label: "Fuel Burn (gal/hr)",        val: tripFuelBurn,    setter: setTripFuelBurn,    color: "#FFB74D", step: 0.5 },
                  { label: "AvGas Price ($/gal)",       val: tripFuelPrice,   setter: setTripFuelPrice,   color: "#FFB74D", step: 0.10 },
                  { label: "Rental Rate ($/hr)",        val: tripRentalRate,  setter: setTripRentalRate,  color: "#4FC3F7" },
                  { label: "Passengers (incl. pilot)",  val: tripPassengers,  setter: setTripPassengers,  color: "#CE93D8", min: 1, max: 4 },
                  { label: "Reserve Fuel (mins)",       val: tripAltFuel,     setter: setTripAltFuel,     color: "#81C784", min: 30, max: 60 },
                ].map(f => (
                  <div key={f.label} style={{ background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 12, padding: "14px" }}>
                    <div style={{ fontSize: 11, color: "#546e7a", marginBottom: 8, letterSpacing: 0.3, lineHeight: 1.3 }}>{f.label}</div>
                    <input type="number" className="input-field" value={f.val} min={f.min} max={f.max} step={f.step || 1}
                      onChange={e => f.setter(+e.target.value)}
                      style={{ border: `1.5px solid ${f.color}33`, color: f.color, fontFamily: "'DM Mono', monospace", fontWeight: 700 }} />
                  </div>
                ))}
              </div>

              {/* Flight summary */}
              <div style={{ background: "rgba(79,195,247,0.04)", border: "1px solid rgba(79,195,247,0.12)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontWeight: 700, color: "#4FC3F7", marginBottom: 10, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>
                  Flight Summary
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", fontSize: 12 }}>
                  {[
                    { label: "Block Speed",  val: `${Math.max(0, effectiveSpeed)} kts` },
                    { label: "Flight Fuel",  val: `${fuelRequired.toFixed(1)} gal` },
                    { label: "Reserve Fuel", val: `${reserveFuel.toFixed(1)} gal (${tripAltFuel} min)` },
                    { label: "Total Fuel",   val: `${totalFuel.toFixed(1)} gal` },
                    { label: "Rental Cost",  val: `$${Math.round(rentalCost).toLocaleString()}` },
                    { label: "Fuel Cost",    val: `$${Math.round(fuelCost).toLocaleString()}` },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #1e2d4533", paddingBottom: 4 }}>
                      <span style={{ color: "#546e7a" }}>{r.label}</span>
                      <span style={{ color: "#c8d6e5", fontFamily: "'DM Mono', monospace" }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "rgba(129,199,132,0.04)", border: "1px solid rgba(129,199,132,0.12)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontWeight: 700, color: "#81C784", marginBottom: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#81C784" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Trip Tips
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 16px", color: "#7f8fa6", fontSize: 12, lineHeight: 2 }}>
                  <li>FAA requires 30-min VFR fuel reserve during the day, 45-min at night</li>
                  <li>File a VFR flight plan with FSS (1-800-WX-BRIEF) for cross-countries</li>
                  <li>Always check TFRs and NOTAMs before departure at 1800wxbrief.com</li>
                  <li>Add ~10% to fuel estimate for taxi, runup, and climb performance</li>
                  <li>True airspeed increases ~2% per 1,000 ft above sea level</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── EXIT QUIZ MODAL ── */}
      {showExitModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{
            background: "#0d1929", border: "1.5px solid #1e2d45", borderRadius: 18,
            padding: "32px 28px", maxWidth: 380, width: "100%", textAlign: "center",
            animation: "modalIn 0.25s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#FFB74D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r=".5" fill="#FFB74D"/>
              </svg>
            </div>
            <h3 style={{ fontWeight: 900, fontSize: 20, color: "#fff", margin: "0 0 10px" }}>Exit Quiz?</h3>
            <p style={{ color: "#7f8fa6", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
              Your progress will <strong style={{ color: "#EF9A9A" }}>not be saved</strong>. You'll lose your current score and streak if you leave now.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowExitModal(false)} style={{
                flex: 1, padding: "12px", borderRadius: 10,
                border: "1.5px solid #1e2d45", background: "transparent",
                color: "#c8d6e5", fontWeight: 700, cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#4FC3F7"; e.currentTarget.style.color = "#4FC3F7"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2d45"; e.currentTarget.style.color = "#c8d6e5"; }}
              >Keep Flying</button>
              <button onClick={() => { setShowExitModal(false); setQuizScreen("menu"); setScore(0); setStreak(0); setHistory([]); setQuestionNum(0); }} style={{
                flex: 1, padding: "12px", borderRadius: 10,
                border: "none", background: "rgba(239,83,80,0.15)",
                color: "#EF9A9A", fontWeight: 700, cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,83,80,0.3)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,83,80,0.15)"; e.currentTarget.style.color = "#EF9A9A"; }}
              >Exit Quiz</button>
            </div>
          </div>
        </div>
      )}

      {/* ── FLYING CAT (desktop secret) ── */}
      {showCat && <FlyingCat src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAJBAbADASIAAhEBAxEB/8QAHQABAAIDAQEBAQAAAAAAAAAAAAYHBAUIAwIBCf/EAEgQAAEDAwIDBgQCBwUGBgIDAAEAAgMEBREGIRIxQQcTUWFxgRQikaEysQgVI0JSwdFicoKS8BYkM0Ph8URTorLC0hclRXOT/8QAGwEBAAIDAQEAAAAAAAAAAAAAAAMEAQIFBgf/xAAyEQACAgIBBAEEAQMDAwUAAAAAAQIDBBEhBRIxQVEGEyJhMhSBkUJScRUzoSNisdHw/9oADAMBAAIRAxEAPwDjJERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREBJ9OaSnvumLhc6J5dU0cg/Y4/G3GTjzUYOxwVe3YDBRxaMqqrif8XJW8JYR8pj4Rv7HGfX1XxrTs1sVxZU1lpmNLcHEu7vjBic474xjIJ36+yo/1sIWuE/7F9YE50qyBRiLIuNHU2+tlo6yJ0U0TuFzXdFjq8UPAREQBERAEREAREQBEG5wFc/Yn2b1VVWw3auonzTtAkp6fAw3wc/Ow6c8fVRXXRpj3SJqKJ3T7Ykd0B2fxVdCb/qqR9DaIwXBhy18jRuT5DAOOpVeP4eN3BnhztnwXQ3bndDR6SuFHcYuKsqZWwt43niY4EOc4eJw0DfbBPtzuo8a53R72b5VKpn2IIiKyVgiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIDoL9G21G8WVtLI90V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vc8mtJxgeGBsB5BRNEVWUnJ7ZZjFRWkERFgyEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAWdR3e5UZHw9ZK3HQnI+6wUWU9eDDW/JPrB2s6wtIDWXKZ7G4AaX5aP8JyFOrP+kVdIS1twtsFQBsXBvCfsQPsqHRSK+a9kUqK5ejqS3dv2lKvArrO+J3Uh7T/AO4D81uKbta7PavmKmLbq0fyduuQ0UiypkbxI/LOy4te9nkwGLs6M+Bjf/QrJZqzQbx8uoGA+Ba8f/FcWAkdU4neJ+q2WW/g1eJ/7jtOTVehI2lxv8R9GuJ/9qxJtdaAi3/W/H6Rv/8AquN+J38R+qEk9U/qv0Fifs62re1fQVGflknkPi1gx/6nBRu69vFigc5tDbXSEciX/wBB/Nc2ItXlTfhGyxIe2y47v27XipDm0lMynB5cLQPucleWir1ddXXYS3eZ8lLE8TOD3l+Gt9eYJwPZVEAScDmunewrTFLB2e1VRVxNc+4PETDndrWbkg9MucR7LELJzfLMzqhBcI1dwqjUTvlcd3HO/h0/ktJe62O3UMk8hGeE8OeXupVqHTtVbRLVNc2WlYC5z84LQOpB/MKkde391wqzSw/LCzbHUreUlGJrCPcyPXSrkrq2SokcXFx2z4LFRFULYREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREBk2rh/WdLxgFvetyD6rrvRlZQUmgrY5s8cVLDTZe9zgGhxJLsn1JHsuPASCCDghZ/wCurn8KKX4yTuRvwZ2+ikrn2kdkO7RavbB2li4MfaLSXCnz8z847zzI8B0Hv5Cm3OLnFziSScknqj3Oe4uc4ucdySdyvxayk5Pk2jFRXAREWpsEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREB//9k=" />}

      {/* ── BOTTOM NAV ── */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(6,13,26,0.95)", backdropFilter: "blur(20px)",
        borderTop: "1px solid #1a2640",
        display: "flex", justifyContent: "space-around", padding: "10px 0 max(10px, env(safe-area-inset-bottom))",
      }}>
        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button key={item.id}
              className={`tab-btn ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
              style={{ position: "relative" }}
            >
              <span style={{
                display: "block",
                transition: "transform 0.2s cubic-bezier(0.23,1,0.32,1)",
                transform: isActive ? "translateY(-2px)" : "translateY(0)",
              }}>
                <NavIcon id={item.id} active={isActive} />
              </span>
              {item.label}
              {isActive && (
                <span style={{
                  position: "absolute", bottom: -10, left: "50%",
                  transform: "translateX(-50%)",
                  width: 4, height: 4, borderRadius: "50%",
                  background: "#4FC3F7",
                  boxShadow: "0 0 6px #4FC3F7",
                }} />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
