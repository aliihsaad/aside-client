import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthContext } from "./lib/useAuthContext";
import "./App.css";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LibraryPage from "./pages/LibraryPage";
import FeedPage from "./pages/FeedPage";
import PeoplePage from "./pages/PeoplePage";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import PostDetailPage from "./pages/PostDetailPage";
import ResourceFormPage from "./pages/ResourceFormPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import LineagePage from "./pages/LineagePage";
import FolderDetailPage from "./pages/FolderDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const { user } = useAuthContext();

  return (
    <div className={user ? "app-shell has-sidebar" : "app-shell"}>
      <Sidebar />

      <main className="app-main">
        <div className="app-shell-inner">
          <div className="app-shell-glyphs" aria-hidden="true" />

          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/library" replace />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/posts/:postId" element={<PostDetailPage />} />
              <Route path="/resources/new" element={<ResourceFormPage />} />
              <Route path="/resources/:resourceId" element={<ResourceDetailPage />} />
              <Route path="/resources/:resourceId/edit" element={<ResourceFormPage />} />
              <Route path="/resources/:resourceId/lineage" element={<LineagePage />} />
              <Route path="/folders/:folderId" element={<FolderDetailPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
