"use client";

import { useState, useEffect, useCallback } from "react";
import { Character, Episode, Location } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CharacterList from "@/components/CharacterList";
import EpisodeList from "@/components/EpisodeList";
import LocationList from "@/components/LocationList";
import Favorites from "@/components/Favorites";
import "./globals.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "characters" | "episodes" | "locations" | "favorites"
  >("characters");
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
  const [favorites, setFavorites] = useLocalStorage<{
    characters: Character[];
    episodes: Episode[];
    locations: Location[];
  }>("simpsons-favorites", { characters: [], episodes: [], locations: [] });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  const addToFavorites = (
    type: "characters" | "episodes" | "locations",
    item: Character | Episode | Location,
  ) => {
    setFavorites({
      ...favorites,
      [type]: [...favorites[type], item],
    });
  };

  const removeFromFavorites = (
    type: "characters" | "episodes" | "locations",
    id: string,
  ) => {
    setFavorites({
      ...favorites,
      [type]: favorites[type].filter((item: any) => item._id !== id),
    });
  };

  const isFavorite = (
    type: "characters" | "episodes" | "locations",
    id: string,
  ): boolean => {
    return favorites[type].some((item: any) => item._id === id);
  };

  const totalFavorites =
    favorites.characters.length +
    favorites.episodes.length +
    favorites.locations.length;

  return (
    <main className="container">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Alterar para tema ${theme === "light" ? "escuro" : "claro"}`}
        title={`Alterar para tema ${theme === "light" ? "escuro" : "claro"}`}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <header className="header">
        <div className="header-cloud cloud-1">☁️</div>
        <div className="header-cloud cloud-2">☁️</div>
        <div className="header-cloud cloud-3">☁️</div>
        <h1 className="title">🍩 The Simpsons API 🍩</h1>
        <p className="subtitle">
          Explore personagens, episódios e locações do universo dos Simpsons
        </p>
      </header>

      <nav className="tabs" role="tablist">
        <button
          className={`tab ${activeTab === "characters" ? "active" : ""}`}
          onClick={() => setActiveTab("characters")}
          role="tab"
          aria-selected={activeTab === "characters"}
        >
          👥 Personagens
        </button>
        <button
          className={`tab ${activeTab === "episodes" ? "active" : ""}`}
          onClick={() => setActiveTab("episodes")}
          role="tab"
          aria-selected={activeTab === "episodes"}
        >
          📺 Episódios
        </button>
        <button
          className={`tab ${activeTab === "locations" ? "active" : ""}`}
          onClick={() => setActiveTab("locations")}
          role="tab"
          aria-selected={activeTab === "locations"}
        >
          📍 Locações
        </button>
        <button
          className={`tab ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
          role="tab"
          aria-selected={activeTab === "favorites"}
        >
          ⭐ Favoritos
          {totalFavorites > 0 && (
            <span className="favorites-count">({totalFavorites})</span>
          )}
        </button>
      </nav>

      <div className="content" role="tabpanel">
        {activeTab === "characters" && (
          <CharacterList
            addToFavorites={(item) => addToFavorites("characters", item)}
            isFavorite={isFavorite}
            removeFromFavorites={(id) => removeFromFavorites("characters", id)}
          />
        )}
        {activeTab === "episodes" && (
          <EpisodeList
            addToFavorites={(item) => addToFavorites("episodes", item)}
            isFavorite={isFavorite}
            removeFromFavorites={(id) => removeFromFavorites("episodes", id)}
          />
        )}
        {activeTab === "locations" && (
          <LocationList
            addToFavorites={(item) => addToFavorites("locations", item)}
            isFavorite={isFavorite}
            removeFromFavorites={(id) => removeFromFavorites("locations", id)}
          />
        )}
        {activeTab === "favorites" && (
          <Favorites
            favorites={favorites}
            removeFromFavorites={removeFromFavorites}
          />
        )}
      </div>
    </main>
  );
}
