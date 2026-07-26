import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import SchedulePage from "@/pages/SchedulePage";
import SpeakersPage from "@/pages/SpeakersPage";
import GalleryPage from "@/pages/GalleryPage";
import PartnersPage from "@/pages/PartnersPage";
import AnnouncementsPage from "@/pages/AnnouncementsPage";
import FeedbackPage from "@/pages/FeedbackPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/speakers" element={<SpeakersPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/partners" element={<PartnersPage />} />
      <Route path="/announcements" element={<AnnouncementsPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
