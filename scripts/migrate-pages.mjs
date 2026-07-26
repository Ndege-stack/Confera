import fs from "node:fs";
import path from "node:path";

const routesDir = "src/routes";
const pagesDir = "src/pages";

const renameMap: Record<string, string> = {
  "index.tsx": "HomePage.tsx",
  "schedule.tsx": "SchedulePage.tsx",
  "breakouts.tsx": "BreakoutsPage.tsx",
  "speakers.tsx": "SpeakersPage.tsx",
  "abstracts.tsx": "AbstractsPage.tsx",
  "gallery.tsx": "GalleryPage.tsx",
  "partners.tsx": "PartnersPage.tsx",
  "announcements.tsx": "AnnouncementsPage.tsx",
  "feedback.tsx": "FeedbackPage.tsx",
  "profile.tsx": "ProfilePage.tsx",
};

const componentRename: Record<string, string> = {
  Index: "HomePage",
  Schedule: "SchedulePage",
  Breakouts: "BreakoutsPage",
  Speakers: "SpeakersPage",
  Abstracts: "AbstractsPage",
  Gallery: "GalleryPage",
  Partners: "PartnersPage",
  Announcements: "AnnouncementsPage",
  FeedbackPage: "FeedbackPage",
  ProfilePage: "ProfilePage",
};

fs.mkdirSync(pagesDir, { recursive: true });

for (const [srcName, destName] of Object.entries(renameMap)) {
  let content = fs.readFileSync(path.join(routesDir, srcName), "utf8");

  content = content.replace(
    /import \{ createFileRoute(?:, Link)? \} from "@tanstack\/react-router";\n/,
    srcName === "index.tsx"
      ? 'import { Link } from "react-router-dom";\n'
      : "",
  );

  content = content.replace(
    /export const Route = createFileRoute\([^)]+\)\(\{[\s\S]*?\}\);\n\n/,
    "",
  );

  content = content.replace(
    /from "@\/lib\/api\/gallery\.functions"/g,
    'from "@/lib/api/client"',
  );
  content = content.replace(/getGalleryImages/g, "fetchGalleryImages");
  content = content.replace(
    /from "@\/lib\/api\/abstracts\.functions"/g,
    'from "@/lib/api/client"',
  );
  content = content.replace(/getAbstracts/g, "fetchAbstracts");
  content = content.replace(
    /from "@\/lib\/api\/feedback\.functions"/g,
    'from "@/lib/api/client"',
  );
  content = content.replace(/getFeedbackData/g, "fetchFeedback");

  for (const [oldName, newName] of Object.entries(componentRename)) {
    if (oldName === newName) continue;
    content = content.replace(new RegExp(`function ${oldName}\\(`, "g"), `export default function ${newName}(`);
  }

  if (!content.includes("export default function")) {
    const match = content.match(/function (\w+)\(/);
    if (match) {
      content = content.replace(
        new RegExp(`function ${match[1]}\\(`),
        `export default function ${destName.replace(".tsx", "")}(`,
      );
    }
  }

  fs.writeFileSync(path.join(pagesDir, destName), content);
  console.log("wrote", destName);
}
