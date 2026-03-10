import { useState } from "react";
import { Link } from "react-router-dom";
import { apiPost } from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ email: "", first_name: "", last_name: "", password: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await apiPost("/api/users/create/", form);
      setSuccess(true);
    } catch (err) {
      try {
        const text = err.message.replace(/^POST .* failed: \d+ /, "");
        setError(JSON.parse(text));
      } catch {
        setError({ erreur: [err.message] });
      }
    }

  }

  if (success) return (
    <div className="flex flex-col items-center w-full mx-auto max-w-[880px] gap-8 py-16 px-4 text-center">
      <h1>Compte créé !</h1>
      <p className="text-[#C4C4C4]">Votre compte est en attente d'activation.</p>
      <Link to="/login" className="text-secondary hover:text-tertiary">Se connecter</Link>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full mx-auto max-w-[880px] gap-8 py-16 px-4 text-center">
      <h1>Créer un compte</h1>
      {error && (
        <div className="text-red-400 text-sm space-y-1">
            {Object.entries(error).map(([field, messages]) => (
            <p key={field}><strong>{field} :</strong> {messages.join(" ")}</p>
            ))}
        </div>
        )}
      <form className="space-y-10" onSubmit={handleSubmit}>
        {["email", "first_name", "last_name", "password"].map((field) => (
          <div key={field}>
            <input
              type={field === "password" ? "password" : "text"}
              placeholder={field.replace("_", " ")}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full text-center text-secondary placeholder-secondary px-4 py-2 bg-transparent border-b border-secondary focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:placeholder-transparent transition"
            />
          </div>
        ))}
        <button type="submit" className="bg-secondary hover:bg-tertiary font-medium px-10 py-4 rounded-[8px]">
          Créer un compte
        </button>
      </form>
      <div className="text-center mt-4 text-sm text-[#C4C4C4]">
        Déjà un compte ?{" "}
        <Link to="/login" className="py-2 border-b text-white hover:text-tertiary font-semibold">
          Se connecter
        </Link>
      </div>
    </div>
  );
}
