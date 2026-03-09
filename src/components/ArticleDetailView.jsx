import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiGet, apiGetAuth, apiPatchAuth, apiDeleteAuth } from "../services/api";

export default function ArticleDetailView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    apiGet(`/api/posts/${slug}/`)
      .then((p) => { setPost(p); setEditForm({ title: p.title, excerpt: p.excerpt, content: p.content }); })
      .catch((e) => setError(e.message));
  }, [slug]);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      apiGetAuth("/api/users/me/").then(setCurrentUser).catch(() => {});
    }
  }, []);

  const authorName = currentUser
    ? `${currentUser.first_name} ${currentUser.last_name}`.trim() || currentUser.email
    : null;
  const isAuthor = post && authorName && post.author === authorName;

  async function handleSave() {
    try {
      const updated = await apiPatchAuth(`/api/posts/${slug}/`, editForm);
      setPost(updated);
      setEditing(false);
    } catch (e) { setError(e.message); }
  }

  async function handleDelete() {
    if (!confirm("Supprimer cet article ?")) return;
    try {
      await apiDeleteAuth(`/api/posts/${slug}/`);
      navigate("/articles");
    } catch (e) { setError(e.message); }
  }

  return (
    <div className="w-full px-6 max-w-[800px] mx-auto py-10 text-left">
      <Link to="/articles" className="opacity-80 hover:opacity-100">&larr; Retour</Link>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-600/20 border border-red-400/40">Erreur : {error}</div>
      )}
      {!post && !error && <p className="mt-6 opacity-80">Chargement…</p>}

      {post && (
        <article className="mt-6">
          {editing ? (
            <div className="space-y-4">
              <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 rounded border border-white/20 bg-white/5 text-2xl font-bold" />
              <input value={editForm.excerpt} onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                placeholder="Résumé (optionnel)"
                className="w-full px-3 py-2 rounded border border-white/20 bg-white/5" />
              <textarea value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                rows={10} className="w-full px-3 py-2 rounded border border-white/20 bg-white/5 resize-y" />
              <div className="flex gap-3">
                <button onClick={handleSave} className="px-4 py-2 rounded bg-secondary hover:bg-tertiary">Enregistrer</button>
                <button onClick={() => setEditing(false)} className="px-4 py-2 rounded border border-white/20 hover:bg-white/10">Annuler</button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="mb-4">{post.title}</h1>
              <div className="text-sm opacity-70 mb-4">
                <span>Auteur : {post.author || "Anonyme"}</span> •{" "}
                <span>Publié le {new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              {isAuthor && (
                <div className="flex gap-3 mb-8">
                  <button onClick={() => setEditing(true)} className="px-4 py-2 rounded border border-white/20 hover:bg-white/10 text-sm">Modifier</button>
                  <button onClick={handleDelete} className="px-4 py-2 rounded border border-red-400/40 text-red-400 hover:bg-red-600/20 text-sm">Supprimer</button>
                </div>
              )}
              <p className="opacity-90 whitespace-pre-wrap">{post.content}</p>
            </>
          )}
        </article>
      )}
    </div>
  );
}
