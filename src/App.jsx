import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthContext } from "./lib/useAuthContext"

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HealthPage from "./pages/HealthPage";
import NotFoundPage from "./pages/NotFoundPage";
import PeoplePage from "./pages/PeoplePage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";

function App() {
  const { user } = useAuthContext();

  return (
    <div className={user ? "app-shell has-sidebar" : "app-shell"}>
      <Sidebar />

      <main className="app-main">
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HealthPage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;