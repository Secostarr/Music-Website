import React, { useState } from "react";
import { X, Lock, Mail, User, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    pendingSaveTrack,
    setAuthModalMode,
    closeAuthModal,
    login,
    register,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authModalMode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan. Coba beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode) => {
    setError(null);
    setAuthModalMode(mode);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#221a15] via-[#15120f] to-[#0b0a09] border border-white/[0.1] p-6 sm:p-8 shadow-2xl shadow-black/80 text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-3 -m-1 text-stone-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f]"
          aria-label="Tutup jendela login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-stone-300">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 id="auth-modal-title" className="text-xl font-bold tracking-tight text-white">
              {authModalMode === "login" ? "Masuk ke Akun" : "Daftar Akun Baru"}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {pendingSaveTrack
                ? `Masuk untuk menyimpan lagu "${pendingSaveTrack.title}"`
                : "Akses playlist favorit dan simpan lagu tanpa batas"}
            </p>
          </div>
        </div>

        {/* Pending Save Notice */}
        {pendingSaveTrack && (
          <div className="my-4 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-stone-400 shrink-0" />
            <p className="text-xs text-[#f5b8b8]">
              Lagu <strong className="text-white">{pendingSaveTrack.title}</strong> akan otomatis tersimpan setelah kamu masuk.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="my-3 p-3 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 mt-5">
          {authModalMode === "register" && (
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5" htmlFor="auth-name">
                Nama Lengkap
              </label>
              <div className="relative flex items-center bg-[#080706] border border-white/[0.08] focus-within:border-[#d9141f]/50 rounded-2xl px-3.5 py-2.5 transition-all">
                <User className="w-4 h-4 text-stone-400 mr-2.5 shrink-0" />
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Bintang Nusantara"
                  className="w-full bg-transparent text-sm text-stone-100 placeholder-stone-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5" htmlFor="auth-email">
              Alamat Email
            </label>
            <div className="relative flex items-center bg-[#080706] border border-white/[0.08] focus-within:border-[#d9141f]/50 rounded-2xl px-3.5 py-2.5 transition-all">
              <Mail className="w-4 h-4 text-stone-400 mr-2.5 shrink-0" />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-transparent text-sm text-stone-100 placeholder-stone-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5" htmlFor="auth-password">
              Kata Sandi
            </label>
            <div className="relative flex items-center bg-[#080706] border border-white/[0.08] focus-within:border-[#d9141f]/50 rounded-2xl px-3.5 py-2.5 transition-all">
              <Lock className="w-4 h-4 text-stone-400 mr-2.5 shrink-0" />
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full bg-transparent text-sm text-stone-100 placeholder-stone-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-[#d9141f] to-[#a01015] hover:from-[#ef2430] hover:to-[#c0121a] text-white font-semibold text-sm transition-all shadow-xl shadow-[#59060b]/70 border border-[#ef2430]/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>{authModalMode === "login" ? "Masuk" : "Daftar Sekarang"}</span>
            )}
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] text-center text-xs text-stone-400">
          {authModalMode === "login" ? (
            <p>
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="text-[#ef2430] hover:text-[#f44551] font-semibold underline underline-offset-4 cursor-pointer focus:outline-none"
              >
                Daftar sekarang
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-[#ef2430] hover:text-[#f44551] font-semibold underline underline-offset-4 cursor-pointer focus:outline-none"
              >
                Masuk di sini
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
