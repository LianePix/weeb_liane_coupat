import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost } from "../services/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const data = await apiPost("/api/token/", { email, password });
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      navigate("/articles");
    } catch {
      setError("Email ou mot de passe incorrect.");
    }
  }

  return (
    <div className="flex flex-col items-center w-full mx-auto max-w-[880px] gap-8 py-16 px-4 text-center">
      <h1>Se connecter</h1>
      {error && <p className="text-red-400">{error}</p>}
      <form className="space-y-10" onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-center text-secondary placeholder-secondary px-4 py-2 bg-transparent border-b border-secondary focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:placeholder-transparent focus:border-secondary transition"/>
        </div>
        <div>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-center text-secondary placeholder-secondary px-4 py-2 bg-transparent border-b border-secondary focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:placeholder-transparent focus:border-secondary transition"/>
        </div>
        <div className="text-center">
          <button type="submit" className="bg-secondary hover:bg-tertiary font-medium px-10 py-4 rounded-[8px]">
            Se connecter
          </button>
        </div>
      </form>
      <div className="text-center mt-6">
        <Link to="/forgot-password" className="text-sm hover:text-tertiary">Mot de passe oublié ?</Link>
      </div>
      <div className="text-center mt-4 text-sm mx-28 sm:mx-0 md:mx-0 text-[#C4C4C4]">
        Vous n'avez pas de compte ? Vous pouvez en{" "}
        <Link to="/signup" className="py-2 border-b text-white hover:text-tertiary hover:border-tertiary font-semibold">
          créer un
        </Link>
      </div>
    </div>
  );
}
