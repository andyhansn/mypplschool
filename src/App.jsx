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
    <div style={{
      position: "fixed",
      top: `${pos.top}%`,
      left: 0,
      width: 110,
      height: 110,
      zIndex: 2147483647,
      pointerEvents: "none",
      transform: `translateX(${x}px) scaleX(${pos.dir})`,
      transition: "top 0.8s ease",
    }}>
      <img
        src={src}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
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
      {showCat && <FlyingCat src="data:image/png;base64,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IezSS2yFWbjq9+VLiD6AeXh4ePyVBjBpXRdsoaUoGwn/dmZr4TqtEE2jywLWGOfLZi9eWO/nnO0D2F8Mfg7Mw8Pjux7WNmxB3CyYALRo6fXinPmYQGCcKO+ZJ5GN4oZ1Ac3jrxx+EMHDw8OD1nPMnv9FE93swrdFKrCsSMlL5b4ac0+hJEJKT5D/zwA/B+bh4fFdC6FcbGrdX1bldRcBqO19tX5lxjZOYysuoWb5CGucWNRFXmN+DszDw8PD468moHEfb877GXYuYpIvZnl4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHi8u/D/B/RTVGD2sgffAAAAAElFTkSuQmCC" />}

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
