export const CONFERENCE = {
  host: "Kabarak University",
  faculty: "Directorate of Research, Innovation and Outreach",
  edition: "Central Rift Innovation Week (CRIW) 2026",
  editionOrdinal: "5th Edition",
  shortName: "CRIW 2026",
  dates: "15th – 19th September 2026",
  startDate: "2026-09-15",
  endDate: "2026-09-19",
  theme: "Transforming Ideas into Impact: Innovating for a Better Tomorrow",
  tagline:
    "Connecting knowledge to markets, linking innovators to investors, and translating policy dialogue into concrete action.",
  isoCertification: "Kabarak University is ISO 9001:2015 certified.",
  about: [
    "The Central Rift Innovation Week (CRIW) 2026 is a flagship platform organized by Kabarak University through the Directorate of Research, Innovation and Outreach. Now in its 5th edition, CRIW has grown into the premier innovation convening in the Central Rift region as a catalyst for innovation-led growth, research commercialization, and multi-sectoral collaboration across Kenya and the broader Eastern Africa region.",
    'Anchored on the theme "Transforming Ideas into Impact: Innovating for a Better Tomorrow," the 2026 edition is a focused, three-day event designed for maximum impact. The condensed format ensures that every session, panel, and pitch contributes directly to the event’s core objectives: connecting knowledge to markets, linking innovators to investors, and translating policy dialogue into concrete action.',
    "CRIW 2026 is structured around three complementary thematic days, each with a distinct focus and audience, yet united by a shared commitment to Africa’s future of innovation. The event will convene over 1,500 participants — researchers, policymakers, investors, entrepreneurs, and development partners — for three days of high-impact engagement.",
    "The program is aligned with Kenya’s Vision 2030, the Digital Superhighway Agenda, Health Sector Transformation, and the MSME Scale-Up Strategy, as well as the African Union’s Agenda 2063 and STISA-2024.",
  ],
  driveScheduleUrl: "",
  schedulePdfUrl: "",
  driveGalleryUrl: "",
  feedbackFormUrl: "",
  feedbackFormTitle: "Central Rift Innovation Week Evaluation",
  // Link the form to Google Sheets (Responses → Link to Sheets), share the sheet, then paste its URL here.
  feedbackResponsesSheetUrl: "",
};

export type Speaker = {
  name: string;
  role: string;
  title: string;
  affiliation: string;
  session: string;
  bio: string;
  accent: "primary" | "gold" | "forest";
  photo?: string;
  email?: string;
  photoPosition?: "top" | "center";
};

export const SPEAKERS: Speaker[] = [];

export type PartnerCategory =
  | "Government & Regulatory"
  | "Technology & Private Sector"
  | "Development & Global Partners";

export const PARTNERS: {
  name: string;
  url: string;
  logo: string;
  blurb: string;
  category: PartnerCategory;
}[] = [
  // Government & Regulatory
  {
    name: "ICT Authority",
    url: "https://icta.go.ke",
    logo: "https://logo.clearbit.com/icta.go.ke",
    blurb:
      "Kenya's ICT Authority — driving digital transformation and technology infrastructure nationally.",
    category: "Government & Regulatory",
  },
  {
    name: "Ministry of Information, Communications and the Digital Economy",
    url: "https://ict.go.ke",
    logo: "https://logo.clearbit.com/ict.go.ke",
    blurb: "Government ministry steering Kenya's Digital Superhighway agenda.",
    category: "Government & Regulatory",
  },
  {
    name: "National Research Fund (NRF) Kenya",
    url: "https://researchfund.go.ke",
    logo: "https://logo.clearbit.com/researchfund.go.ke",
    blurb: "State agency funding research, science, technology and innovation in Kenya.",
    category: "Government & Regulatory",
  },
  {
    name: "KIPPRA",
    url: "https://kippra.or.ke",
    logo: "https://logo.clearbit.com/kippra.or.ke",
    blurb:
      "Kenya Institute for Public Policy Research and Analysis — the nation's premier public policy think tank.",
    category: "Government & Regulatory",
  },
  {
    name: "Kenya Copyright Board (KECOBO)",
    url: "https://copyright.go.ke",
    logo: "https://logo.clearbit.com/copyright.go.ke",
    blurb: "National regulator safeguarding copyright and creative innovation.",
    category: "Government & Regulatory",
  },
  {
    name: "KIPI",
    url: "https://kipi.go.ke",
    logo: "https://logo.clearbit.com/kipi.go.ke",
    blurb:
      "Kenya Industrial Property Institute — custodian of patents, trademarks and industrial property rights.",
    category: "Government & Regulatory",
  },
  {
    name: "KeNIA",
    url: "https://kenia.go.ke",
    logo: "https://logo.clearbit.com/kenia.go.ke",
    blurb: "Kenya National Innovation Agency — coordinating the national innovation ecosystem.",
    category: "Government & Regulatory",
  },
  {
    name: "Konza Technopolis",
    url: "https://konza.go.ke",
    logo: "https://logo.clearbit.com/konza.go.ke",
    blurb: "Kenya's flagship smart city and technology innovation hub.",
    category: "Government & Regulatory",
  },
  {
    name: "Kenya Film Commission",
    url: "https://kenyafilmcommission.com",
    logo: "https://logo.clearbit.com/kenyafilmcommission.com",
    blurb: "State agency promoting Kenya as a premier filming and creative-industry destination.",
    category: "Government & Regulatory",
  },

  // Technology & Private Sector
  {
    name: "Safaricom",
    url: "https://www.safaricom.co.ke",
    logo: "https://logo.clearbit.com/safaricom.co.ke",
    blurb: "Kenya's leading telecommunications and technology innovator.",
    category: "Technology & Private Sector",
  },
  {
    name: "Microsoft",
    url: "https://www.microsoft.com",
    logo: "https://logo.clearbit.com/microsoft.com",
    blurb: "Global technology partner advancing digital skills and AI innovation.",
    category: "Technology & Private Sector",
  },
  {
    name: "Google",
    url: "https://www.google.com",
    logo: "https://logo.clearbit.com/google.com",
    blurb: "Global technology partner supporting Africa's digital innovation ecosystem.",
    category: "Technology & Private Sector",
  },
  {
    name: "Africa's Talking",
    url: "https://africastalking.com",
    logo: "https://logo.clearbit.com/africastalking.com",
    blurb: "Pan-African technology company powering mobile and communication APIs.",
    category: "Technology & Private Sector",
  },
  {
    name: "Equity Bank",
    url: "https://equitygroupholdings.com",
    logo: "https://logo.clearbit.com/equitygroupholdings.com",
    blurb: "Leading pan-African financial services group supporting MSME growth.",
    category: "Technology & Private Sector",
  },
  {
    name: "Ecobank",
    url: "https://ecobank.com",
    logo: "https://logo.clearbit.com/ecobank.com",
    blurb: "The Pan African Bank — driving financial inclusion across the continent.",
    category: "Technology & Private Sector",
  },
  {
    name: "NCBA",
    url: "https://ncbagroup.com",
    logo: "https://logo.clearbit.com/ncbagroup.com",
    blurb: "Regional banking group supporting enterprise and innovation financing.",
    category: "Technology & Private Sector",
  },
  {
    name: "Credit Bank",
    url: "https://creditbank.co.ke",
    logo: "https://logo.clearbit.com/creditbank.co.ke",
    blurb: "Kenyan commercial bank supporting SME and innovation financing.",
    category: "Technology & Private Sector",
  },
  {
    name: "KEPSA",
    url: "https://kepsa.or.ke",
    logo: "https://logo.clearbit.com/kepsa.or.ke",
    blurb:
      "Kenya Private Sector Alliance — the apex body representing private sector voice in policy dialogue.",
    category: "Technology & Private Sector",
  },

  // Development & Global Partners
  {
    name: "African Development Bank",
    url: "https://www.afdb.org",
    logo: "https://logo.clearbit.com/afdb.org",
    blurb: "Continental development finance institution investing in Africa's growth.",
    category: "Development & Global Partners",
  },
  {
    name: "UNDP",
    url: "https://www.undp.org",
    logo: "https://logo.clearbit.com/undp.org",
    blurb: "United Nations Development Programme — advancing sustainable development.",
    category: "Development & Global Partners",
  },
  {
    name: "UNESCO",
    url: "https://www.unesco.org",
    logo: "https://logo.clearbit.com/unesco.org",
    blurb: "United Nations agency supporting science, education and innovation.",
    category: "Development & Global Partners",
  },
  {
    name: "Amref Health Africa",
    url: "https://amref.org",
    logo: "https://logo.clearbit.com/amref.org",
    blurb: "Africa's largest health development organization.",
    category: "Development & Global Partners",
  },
  {
    name: "World Health Organization",
    url: "https://www.who.int",
    logo: "https://logo.clearbit.com/who.int",
    blurb: "UN specialized agency for international public health.",
    category: "Development & Global Partners",
  },
  {
    name: "Africa CDC",
    url: "https://africacdc.org",
    logo: "https://logo.clearbit.com/africacdc.org",
    blurb:
      "Africa Centres for Disease Control and Prevention — continental public health leadership.",
    category: "Development & Global Partners",
  },
  {
    name: "Johnson & Johnson",
    url: "https://www.jnj.com",
    logo: "https://logo.clearbit.com/jnj.com",
    blurb: "Global healthcare and innovation company.",
    category: "Development & Global Partners",
  },
  {
    name: "AFD",
    url: "https://www.afd.fr",
    logo: "https://logo.clearbit.com/afd.fr",
    blurb: "Agence Française de Développement — financing sustainable development projects.",
    category: "Development & Global Partners",
  },
];

export type ScheduleDay = {
  day: string;
  /** ISO date (yyyy-mm-dd) for this day, used to compute live Upcoming/Ongoing/Past status. */
  date: string;
  items: { time: string; title: string; room: string }[];
};

export const SCHEDULE: ScheduleDay[] = [];

export const ANNOUNCEMENTS: {
  id: number;
  when: string;
  level: "urgent" | "info" | "success";
  title: string;
  body: string;
}[] = [
  {
    id: 1,
    when: "Save the date",
    level: "info",
    title: "Central Rift Innovation Week (CRIW) 2026 — 15th–19th September 2026",
    body: 'Kabarak University hosts the 5th edition of CRIW, themed "Transforming Ideas into Impact: Innovating for a Better Tomorrow." Full program and speakers will be published here as they are confirmed.',
  },
];

export const GALLERY: string[] = [];
