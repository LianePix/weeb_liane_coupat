import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../services/api";
import { apiPostAuth } from "../services/api";

export default function ArticlesList() {
  const [data, setData] = useState(null);     
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  // états UI du filtre + création d'article
  const [q, setQ] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", excerpt: "", content: "", is_published: true });
  const isLoggedIn = Boolean(localStorage.getItem("access_token"));


  // query pr l'API
  const query = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    if (q.trim()) p.set("q", q.trim());
    if (ordering) p.set("ordering", ordering);
    return p.toString();
  }, [page, q, ordering]);

  useEffect(() => {
    setError("");
    apiGet(`/api/posts/?${query}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [query]);

  const items = Array.isArray(data) ? data : data?.results ?? [];
  const visible = items.slice(0, 6); // max 6 affichés par page (pareil que ds le BE)
  const hasPrev = Boolean(data?.previous);
  const hasNext = Boolean(data?.next);

  function applyFilters(e) {
    e?.preventDefault?.();
    setPage(1);
  }

  function resetFilters() {
    setQ("");
    setOrdering("-created_at");
    setPage(1);
  }

  return (
    <div className="w-full px-6 max-w-[1000px] mx-auto py-10">
      <h1>Articles</h1>

      {isLoggedIn && (
        <div className="mt-4">
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2 rounded-2xl border border-white/20 hover:bg-white/10"
          >
            {showForm ? "Annuler" : "+ Créer un article"}
          </button>
          {showForm && (
            <form className="mt-4 space-y-3" onSubmit={async (e) => {
              e.preventDefault();
              try {
                await apiPostAuth("/api/posts/", newPost);
                setShowForm(false);
                setNewPost({ title: "", excerpt: "", content: "", is_published: true });
                setPage(1);
                apiGet(`/api/posts/?page=1&ordering=${ordering}`).then(setData);
              } catch (err) { setError(err.message); }
            }}>
              {[
                { key: "title", label: "Titre" },
                { key: "excerpt", label: "Résumé (optionnel)" },
              ].map(({ key, label }) => (
                <input key={key} placeholder={label} value={newPost[key]}
                  onChange={(e) => setNewPost({ ...newPost, [key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-2xl border border-white/20 bg-white/5"
                />
              ))}
              <textarea placeholder="Contenu" value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 rounded-2xl border border-white/20 bg-white/5 resize-y"
              />
              <button type="submit" className="px-4 py-2 rounded-2xl bg-secondary hover:bg-tertiary">
                Publier
              </button>
            </form>
          )}
        </div>
      )}


      {/* Barre de filtres */}
      <form onSubmit={applyFilters} className="mt-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm opacity-80 mb-1">Recherche</label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Titre, contenu, auteur…"
            className="w-full px-3 py-2 rounded-2xl border border-white/20 bg-white/5"
          />
        </div>

        <div className="min-w-[260px]">
          <label className="block text-sm opacity-80 mb-1">Tri</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setOrdering("-created_at"); setPage(1); }}
              aria-pressed={ordering === "-created_at"}
              className={`h-12 px-3 rounded-2xl border transition
                ${ordering === "-created_at"
                  ? "bg-white/15 border-white/30"
                  : "bg-white/5 border-white/20 hover:bg-white/10"}`}
              title="Plus récents d'abord"
            >
              → récents
            </button>

            <button
              type="button"
              onClick={() => { setOrdering("created_at"); setPage(1); }}
              aria-pressed={ordering === "created_at"}
              className={`h-12 px-3 rounded-2xl border transition
                ${ordering === "created_at"
                  ? "bg-white/15 border-white/30"
                  : "bg-white/5 border-white/20 hover:bg-white/10"}`}
              title="Plus anciens d'abord"
            >
              → anciens 
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="h-12 px-4 py-2 rounded-2xl border border-white/20 hover:bg-white/10"
          >
            Filtrer
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="h-12 px-4 py-2 rounded-2xl border border-white/20 hover:bg-white/10"
          >
            Réinitialiser
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-600/20 border border-red-400/40">
          Erreur : {error}
        </div>
      )}
      {!data && !error && <p className="mt-6 opacity-80">Chargement…</p>}

      {visible.length > 0 ? (
        <>
          <div className="mt-8 flex flex-wrap gap-6">
            {visible.map((p) => (
              <article
                key={p.id}
                className="p-6 rounded-2xl bg-white/5 shadow-md border border-white/10 text-left
                           w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <h3 className="text-2xl font-bold mb-2 line-clamp-2">{p.title}</h3>
                {p.excerpt && <p className="opacity-90 mb-3 line-clamp-3">{p.excerpt}</p>}
                <div className="text-sm opacity-70 mb-4">
                  <span>Auteur : {p.author || "Anonyme"}</span> •{" "}
                  <span>Publié le {new Date(p.created_at).toLocaleDateString()}</span>
                </div>
                <Link
                  to={`/articles/${p.slug}`}
                  className="inline-block px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition"
                >
                  Lire
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((n) => Math.max(1, n - 1))}
              disabled={!hasPrev}
              className="px-3 py-2 rounded-2xl border border-white/20 disabled:opacity-50"
            >
              ← Précédent
            </button>
            <span className="opacity-80">Page {page}</span>
            <button
              onClick={() => setPage((n) => n + 1)}
              disabled={!hasNext}
              className="px-3 py-2 rounded-2xl border border-white/20 disabled:opacity-50"
            >
              Suivant →
            </button>
          </div>
        </>
      ) : (
        data && !error && <p className="mt-6 opacity-80">Aucun article.</p>
      )}
    </div>
  );
}
