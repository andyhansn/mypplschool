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
  { acronym: "TFR", full: "Temporary Flight Restriction notice", category: "Documents" },
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
  const [acronymSearch, setAcronymSearch] = useState("");
  const [acronymFilter, setAcronymFilter] = useState("All");
  const [lingoSearch, setLingoSearch] = useState("");
  const [lingoHighlightIdx, setLingoHighlightIdx] = useState(0);

  // PPL calculator plane + state
  const [pplPlaneId, setPplPlaneId] = useState("c172");
  const [pplState, setPplState] = useState("TX");

  // Trip calculator plane + state
  const [tripPlaneId, setTripPlaneId] = useState("c172");
  const [tripState, setTripState] = useState("TX");
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

  // Auto-detect user's state from timezone first, then IP geolocation
  useEffect(() => {
    // Try timezone-based detection first (works without network)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tzToState = {
        "America/New_York": "NY", "America/Chicago": "TX", "America/Denver": "CO",
        "America/Los_Angeles": "CA", "America/Phoenix": "AZ", "America/Anchorage": "AK",
        "Pacific/Honolulu": "HI", "America/Detroit": "MI", "America/Indiana/Indianapolis": "IN",
        "America/Kentucky/Louisville": "KY", "America/Boise": "ID", "America/Juneau": "AK",
      };
      const tzState = tzToState[tz];
      if (tzState) { setPplState(tzState); setTripState(tzState); return; }
    } catch {}
    // Fallback to IP geolocation
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        const region = data.region_code;
        if (region && US_STATES.includes(region)) { setPplState(region); setTripState(region); }
      })
      .catch(() => {});
  }, []);

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

  function startNatoQuiz() {
    const idx = Math.floor(Math.random() * NATO_ALPHABET.length);
    const correct = NATO_ALPHABET[idx];
    const wrong = NATO_ALPHABET.filter((_, i) => i !== idx).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [...wrong, correct].sort(() => Math.random() - 0.5);
    setNatoQ(correct);
    setNatoOptions(opts);
    setNatoSelected(null);
  }

  function handleNatoAnswer(opt) {
    if (natoSelected) return;
    setNatoSelected(opt);
    setNatoTotal(t => t + 1);
    if (opt.letter === natoQ.letter) {
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

  return (
    <div style={{
      minHeight: "100vh", background: "#060d1a",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      color: "#e8eaf6", position: "relative", overflow: "hidden",
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
        @keyframes planeFly { 0%{transform:translateX(-60px) translateY(0)} 50%{transform:translateX(0px) translateY(-3px)} 100%{transform:translateX(-60px) translateY(0)} }
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
          background:#0d1929; border:1.5px solid #1e2d45; border-radius:10px;
          color:#e8eaf6; padding:10px 14px; font-size:14px; outline:none; width:100%;
          transition:border-color 0.2s; font-family:'DM Sans',sans-serif; box-sizing:border-box;
        }
        .input-field:focus { border-color:#4FC3F7; }
        .search-input {
          background:#0d1929; border:1.5px solid #1e2d45; border-radius:30px;
          color:#e8eaf6; padding:10px 18px; font-size:14px; outline:none; width:100%;
          transition:all 0.2s; font-family:'DM Sans',sans-serif; box-sizing:border-box;
        }
        .search-input:focus { border-color:#4FC3F7; background:#0a1825; }
        .filter-pill {
          padding:5px 14px; border-radius:20px; border:1.5px solid #1e2d45;
          background:transparent; color:#546e7a; cursor:pointer; font-size:12px;
          transition:all 0.2s; white-space:nowrap; font-family:'DM Sans',sans-serif;
        }
        .filter-pill.active { border-color:#4FC3F7; color:#4FC3F7; background:rgba(79,195,247,0.1); }
        .calc-slider { -webkit-appearance:none; width:100%; height:4px; border-radius:2px; background:#1e2d45; outline:none; }
        .calc-slider::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#4FC3F7; cursor:pointer; box-shadow:0 0 8px rgba(79,195,247,0.4); }
        .glow-text { text-shadow: 0 0 20px rgba(79,195,247,0.4); }
        .streak-fire { animation: wiggle 0.4s ease; }
      `}</style>

      {/* Animated background */}
      <div className="grid-bg" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />
      <CloudLayer />
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,195,247,0.06) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -150, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(102,187,106,0.04) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Score Burst */}
      <ScoreBurst show={showBurst} correct={isCorrect} />

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(6,13,26,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid #1e2d45",
        padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 22, animation: "planeFly 4s ease-in-out infinite" }}>✈️</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5, color: "#fff" }}>My PPL School</div>
            <div style={{ fontSize: 10, color: "#4FC3F7", letterSpacing: 2, textTransform: "uppercase" }}>USA Study Hub</div>
          </div>
        </div>
        {activeTab === "quiz" && quizScreen === "quiz" && (
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
        )}
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "24px 16px 100px" }}>

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
                  <p style={{ color: "#546e7a", marginTop: 8, fontSize: 14 }}>10 AI-generated FAA questions per session</p>
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
              <p style={{ color: "#546e7a", margin: "0 0 20px", fontSize: 14 }}>Tap a card to reveal the full meaning</p>
              <input className="search-input" placeholder="Search acronyms..." value={acronymSearch} onChange={e => setAcronymSearch(e.target.value)} />
            </div>

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
                <select value={pplPlaneId} onChange={e => setPplPlaneId(e.target.value)}
                  style={{ width: "100%", background: "#0d1929", border: "1.5px solid #4FC3F733", borderRadius: 8, color: "#4FC3F7", padding: "8px 10px", fontSize: 13, fontFamily: "'DM Mono',monospace", fontWeight: 700, outline: "none" }}>
                  {PLANE_TYPES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
              <div style={{ background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 12, padding: "14px" }}>
                <div style={{ fontSize: 11, color: "#546e7a", marginBottom: 8, letterSpacing: 0.5 }}>Your State</div>
                <select value={pplState} onChange={e => setPplState(e.target.value)}
                  style={{ width: "100%", background: "#0d1929", border: "1.5px solid #81C78433", borderRadius: 8, color: "#81C784", padding: "8px 10px", fontSize: 13, fontFamily: "'DM Mono',monospace", fontWeight: 700, outline: "none" }}>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
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
                  <select value={tripPlaneId}
                    onChange={e => { const p = PLANE_TYPES.find(x => x.id === e.target.value); setTripPlaneId(e.target.value); setTripSpeed(p.speed); setTripFuelBurn(p.burn); setTripRentalRate(p.state_avg[tripState] || p.wetRate); }}
                    style={{ width: "100%", background: "#0d1929", border: "1.5px solid #4FC3F733", borderRadius: 8, color: "#4FC3F7", padding: "8px 10px", fontSize: 13, fontFamily: "'DM Mono',monospace", fontWeight: 700, outline: "none" }}>
                    {PLANE_TYPES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#546e7a", marginBottom: 8, letterSpacing: 0.5 }}>Your State</div>
                  <select value={tripState}
                    onChange={e => { setTripState(e.target.value); setTripRentalRate(tripPlane.state_avg[e.target.value] || tripPlane.wetRate); }}
                    style={{ width: "100%", background: "#0d1929", border: "1.5px solid #81C78433", borderRadius: 8, color: "#81C784", padding: "8px 10px", fontSize: 13, fontFamily: "'DM Mono',monospace", fontWeight: 700, outline: "none" }}>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
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
