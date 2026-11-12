import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const STORAGE_USER_KEY = "irama_user";
const STORAGE_TOKEN_KEY = "irama_token";
const STORAGE_SAVED_TRACKS_KEY = "irama_saved_tracks";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [savedTracks, setSavedTracks] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_TRACKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // 'login' | 'register'
  const [pendingSaveTrack, setPendingSaveTrack] = useState(null);

  // Sync token & user ke localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SAVED_TRACKS_KEY, JSON.stringify(savedTracks));
  }, [savedTracks]);

  // Sync saved tracks dari server jika login
  const fetchServerSavedTracks = useCallback(async (authToken) => {
    const activeToken = authToken || token;
    if (!activeToken) return;
    try {
      const res = await fetch("/api/saved-tracks", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tracks)) {
          setSavedTracks(data.tracks);
        }
      }
    } catch (err) {
      console.warn("Sinkronisasi koleksi server gagal, menggunakan cache lokal:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token && user) {
      fetchServerSavedTracks(token);
    }
  }, [token, user, fetchServerSavedTracks]);

  const openAuthModal = useCallback((mode = "login", trackToSaveAfter = null) => {
    setAuthModalMode(mode);
    setPendingSaveTrack(trackToSaveAfter);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setPendingSaveTrack(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Gagal masuk. Periksa email dan kata sandi.");
    }

    setUser(data.user);
    setToken(data.token);

    // Ambil koleksi tersimpan milik user ini
    await fetchServerSavedTracks(data.token);

    // Simpan lagu yang tadi tertunda jika ada
    if (pendingSaveTrack) {
      await saveTrackToServer(pendingSaveTrack, data.token);
    }

    closeAuthModal();
    return data.user;
  }, [pendingSaveTrack, closeAuthModal, fetchServerSavedTracks]);

  const register = useCallback(async (name, email, password) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      const firstError = data.errors ? Object.values(data.errors)[0]?.[0] : null;
      throw new Error(firstError || data.message || "Pendaftaran gagal.");
    }

    setUser(data.user);
    setToken(data.token);

    if (pendingSaveTrack) {
      await saveTrackToServer(pendingSaveTrack, data.token);
    }

    closeAuthModal();
    return data.user;
  }, [pendingSaveTrack, closeAuthModal]);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } catch {
        // Abaikan kesalahan koneksi saat logout
      }
    }
    setUser(null);
    setToken(null);
    setSavedTracks([]);
  }, [token]);

  const saveTrackToServer = async (track, activeToken) => {
    const authToken = activeToken || token;
    // Update local state terlebih dahulu (optimistic)
    setSavedTracks((prev) => {
      if (prev.some((t) => t.id === track.id)) return prev;
      return [track, ...prev];
    });

    if (authToken) {
      try {
        await fetch("/api/saved-tracks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            track_id: track.id,
            title: track.title,
            artist: track.artist,
            artwork: track.artwork || "",
            duration: track.duration || 0,
            album: track.album || "",
            source: track.source || "youtube",
            videoId: track.videoId || track.id,
          }),
        });
      } catch (err) {
        console.warn("Gagal menyimpan lagu ke cloud:", err);
      }
    }
  };

  const removeTrackFromServer = async (trackId) => {
    setSavedTracks((prev) => prev.filter((t) => t.id !== trackId));

    if (token) {
      try {
        await fetch(`/api/saved-tracks/${encodeURIComponent(trackId)}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } catch (err) {
        console.warn("Gagal menghapus lagu dari cloud:", err);
      }
    }
  };

  // Toggle save: jika belum login, buka modal login dan simpan target lagu
  const toggleSaveTrack = useCallback(
    (track) => {
      if (!user) {
        openAuthModal("login", track);
        return false;
      }

      const isSaved = savedTracks.some((t) => t.id === track.id);
      if (isSaved) {
        removeTrackFromServer(track.id);
      } else {
        saveTrackToServer(track, token);
      }
      return true;
    },
    [user, savedTracks, token, openAuthModal]
  );

  const isTrackSaved = useCallback(
    (trackId) => {
      return savedTracks.some((t) => t.id === trackId);
    },
    [savedTracks]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        savedTracks,
        isAuthModalOpen,
        authModalMode,
        pendingSaveTrack,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        toggleSaveTrack,
        isTrackSaved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
