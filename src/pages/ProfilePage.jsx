import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useFetch } from "../lib/useFetch";
import { useAuthContext } from "../lib/useAuthContext";
import FolderCard from "../components/FolderCard";
import FolderForm from "../components/FolderForm";
import Modal from "../components/Modal";
import api from "../lib/api";
import "./ProfilePage.css";

function ProfilePage() {
  const { userId } = useParams();
  const { user: me } = useAuthContext();
  const { data: user, error, loading } = useFetch(`/users/${userId}`);
  const { data: folders, setData: setFolders } = useFetch(`/folders/user/${userId}`);

  const [showForm, setShowForm] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [deletingFolderId, setDeletingFolderId] = useState(null);
  const [folderError, setFolderError] = useState(null);

  const isMe = me?._id === userId;

  const handleSaved = (folder) => {
    setFolders((prev) => {
      const exists = prev.some((f) => f._id === folder._id);
      return exists ? prev.map((f) => (f._id === folder._id ? folder : f)) : [...prev, folder];
    });
    setShowForm(false);
    setEditingFolder(null);
  };

  const handleDeleteFolder = async (folder) => {
    const confirmed = window.confirm(
      `Delete "${folder.name}"? The folder must be empty and this cannot be undone.`,
    );

    if (!confirmed) return;

    setFolderError(null);
    setDeletingFolderId(folder._id);

    try {
      await api.delete(`/folders/${folder._id}`);
      setFolders((prev) => prev.filter((item) => item._id !== folder._id));
    } catch (err) {
      setFolderError(err.response?.data?.message || "Couldn't delete that folder");
    } finally {
      setDeletingFolderId(null);
    }
  };

  if (loading) return <p className="muted container">Loading…</p>;
  if (error) return <p className="form-error container">{error}</p>;
  if (!user) return null;

  return (
    <div className="container page-shell">
      <header className="page-hero profile-hero">
        <p className="page-kicker">Personal workspace</p>
        <div className="profile-head">
          <img
            className="avatar avatar-xl"
            src={user.avatarUrl || "https://placehold.co/128x128/1a1d2e/9aa0b8?text=?"}
            alt=""
          />

          <div className="profile-id">
            <h1>{user.name}</h1>
            <p className="muted">@{user.username}</p>
            {user.bio && <p className="profile-bio">{user.bio}</p>}

            {user.skills?.length > 0 && (
              <div className="tag-row">
                {user.skills.map((s) => (
                  <span className="tag" key={s}>{s}</span>
                ))}
              </div>
            )}
          </div>

          {isMe && (
            <Link to="/profile/edit" className="btn-primary nav-cta">
              Edit profile
            </Link>
          )}
        </div>
      </header>

      <section className="shelf">
        <div className="page-head">
          <h2>Shelf</h2>
          {isMe && (
            <button
              type="button"
              onClick={() => {
                setEditingFolder(null);
                setFolderError(null);
                setShowForm(true);
              }}
            >
              New folder
            </button>
          )}
        </div>

        {folderError && <p className="form-error">{folderError}</p>}

        {folders?.length === 0 && (
          <p className="muted">
            {isMe ? "No folders yet. Create one to start putting things on your shelf." : "Nothing here yet."}
          </p>
        )}

        <div className="folder-grid">
          {folders?.map((folder) => (
            <FolderCard
              folder={folder}
              key={folder._id}
              canManage={isMe}
              deleting={deletingFolderId === folder._id}
              onEdit={() => {
                setShowForm(false);
                setFolderError(null);
                setEditingFolder(folder);
              }}
              onDelete={() => handleDeleteFolder(folder)}
            />
          ))}
        </div>
      </section>

      {(showForm || editingFolder) && (
        <Modal
          title={editingFolder ? "Edit folder" : "New folder"}
          onClose={() => { setShowForm(false); setEditingFolder(null); }}
        >
          <FolderForm
            folder={editingFolder}
            onDone={handleSaved}
            onCancel={() => { setShowForm(false); setEditingFolder(null); }}
          />
        </Modal>
      )}
    </div>
  );
}

export default ProfilePage;
