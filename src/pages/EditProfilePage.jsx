 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { useAuthContext } from "../lib/useAuthContext";

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

  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      await api.put("/users/me", form);
      navigate(`/profile/${user._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save that");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="muted container">Loading…</p>;

  return (
    <div className="container form-page">
      <h1>Edit profile</h1>

      <form onSubmit={handleSubmit} className="card stack">
        <div>
          <label htmlFor="name">Display name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" rows={3} value={form.bio} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="avatarUrl">Avatar URL</label>
          <input id="avatarUrl" name="avatarUrl" value={form.avatarUrl} onChange={handleChange} />
        </div>

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
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProfilePage;