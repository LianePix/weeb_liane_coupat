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
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError({ erreur: ["Le prénom et le nom sont obligatoires."] });
      return;
    }
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

  const fieldLabels = {
  email: "Email",
  first_name: "Prénom",
  last_name: "Nom",
  password: "Mot de passe",
  non_field_errors: "Erreur",
  };

  const errorTranslations = {
    "This password is too short. It must contain at least 8 characters.": "Ce mot de passe est trop court. Il doit contenir au moins 8 caractères.",
    "This password is too common.": "Ce mot de passe est trop courant.",
    "This password is entirely numeric.": "Ce mot de passe ne peut pas être entièrement numérique.",
    "user with this email already exists.": "Un utilisateur avec cet email existe déjà.",
    "Enter a valid email address.": "Entrez une adresse email valide.",
    "This field may not be blank.": "Ce champ ne peut pas être vide.",
    "This field is required.": "Ce champ est obligatoire.",

  };

  function translateMessage(msg) {
    return errorTranslations[msg] ?? msg;
  }

  return (
    <div className="flex flex-col items-center w-full mx-auto max-w-[880px] gap-8 py-16 px-4 text-center">
      <h1>Créer un compte</h1>
      {error && (
        <div className="text-red-400 text-sm space-y-1">
            {Object.entries(error).map(([field, messages]) => (
            <p key={field}>
              <strong>{fieldLabels[field] ?? field} :</strong>{" "}
              {messages.map(translateMessage).join(" ")}
            </p>
            ))}
        </div>
        )}
      <form className="space-y-10" onSubmit={handleSubmit}>
        {["email", "first_name", "last_name", "password"].map((field) => (
          <div key={field}>
            <input
              type={field === "password" ? "password" : "text"}
              placeholder={fieldLabels[field]}
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
