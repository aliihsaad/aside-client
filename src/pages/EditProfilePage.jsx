import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { useAuthContext } from "../lib/useAuthContext";
import { uploadImage } from "../lib/uploadImage";
import ImageUploadField from "../components/ImageUploadField";
import "./EditProfilePage.css";

const EMPTY = {
  name: "",
  bio: "",
  avatarUrl: "",
  githubUsername: "",
  skills: [],
};

function EditProfilePage() {
  const { data: me, loading } = useFetch("/users/me");
  const [form, setForm] = useState(EMPTY);
  const [skillDraft, setSkillDraft] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [avatarChange, setAvatarChange] = useState({ file: null, remove: false });

  const { user, updateUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (me) setForm({ ...EMPTY, ...me });
  }, [me]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addSkill = () => {
    const value = skillDraft.trim();
    if (!value || form.skills.includes(value)) return;
    setForm((prev) => ({ ...prev, skills: [...prev.skills, value] }));
    setSkillDraft("");
  };

  const removeSkill = (skill) =>
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      let avatarUrl = avatarChange.remove ? "" : form.avatarUrl;
      if (avatarChange.file) avatarUrl = await uploadImage(avatarChange.file);

      const { data } = await api.put("/users/me", { ...form, avatarUrl });
      updateUser(data);
      navigate(`/profile/${user._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save that");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="muted container">Loading…</p>;

  return (
    <div className="container page-shell form-page edit-profile-page">
      <header className="page-hero">
        <p className="page-kicker">Profile</p>
        <h1 className="section-title">Edit profile</h1>
        <p className="muted">Fine-tune how the team sees your shelf and expertise.</p>
      </header>

      <form onSubmit={handleSubmit} className="card stack">
        <div>
          <label htmlFor="name">Display name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" rows={3} value={form.bio} onChange={handleChange} />
        </div>

        <ImageUploadField
          id="avatar-image"
          label="Profile image"
          currentUrl={form.avatarUrl}
          onChange={setAvatarChange}
          onError={setError}
          disabled={saving}
        />

        <div>
          <label htmlFor="githubUsername">GitHub username</label>
          <input
            id="githubUsername"
            name="githubUsername"
            value={form.githubUsername}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="skill">Skills</label>
          <div className="skill-input">
            <input
              id="skill"
              value={skillDraft}
              onChange={(e) => setSkillDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="React, then Enter"
            />
            <button type="button" onClick={addSkill}>Add</button>
          </div>

          {form.skills.length > 0 && (
            <div className="tag-row">
              {form.skills.map((s) => (
                <button
                  type="button"
                  className="tag tag-removable"
                  key={s}
                  onClick={() => removeSkill(s)}
                  aria-label={`Remove ${s}`}
                >
                  {s} ×
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? (avatarChange.file ? "Uploading…" : "Saving…") : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProfilePage;
