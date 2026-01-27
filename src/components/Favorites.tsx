"use client";

import { Character, Episode, Location } from "@/types";

interface FavoritesProps {
  favorites: {
    characters: Character[];
    episodes: Episode[];
    locations: Location[];
  };
  removeFromFavorites: (
    type: "characters" | "episodes" | "locations",
    id: string,
  ) => void;
}

export default function Favorites({
  favorites,
  removeFromFavorites,
}: FavoritesProps) {
  const totalFavorites =
    favorites.characters.length +
    favorites.episodes.length +
    favorites.locations.length;

  const hasAnyFavorites = totalFavorites > 0;

  if (!hasAnyFavorites) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">💛</div>
        <div className="empty-state-text">Você ainda não tem favoritos</div>
        <div className="empty-state-subtext">
          Explore os personagens, episódios e produtos para adicionar aos
          favoritos!
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          marginBottom: "var(--spacing-lg)",
          padding: "var(--spacing-md)",
          background: "var(--bg-secondary)",
          borderRadius: "var(--border-radius)",
          border: "1px solid var(--border-color)",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            color: "var(--primary-color)",
            marginBottom: "var(--spacing-xs)",
          }}
        >
          ⭐ Seus Favoritos
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {totalFavorites} ite{totalFavorites === 1 ? "m" : "ns"} salvos
        </p>
      </div>

      {favorites.characters.length > 0 && (
        <div className="favorites-section">
          <h2>👥 Personagens Favoritos ({favorites.characters.length})</h2>
          <div className="grid">
            {favorites.characters.map((character) => {
              const imageUrl = `https://thesimpsonsapi.com${character.portrait_path}`;

              return (
                <div key={character._id || character.id} className="card">
                  <img
                    src={imageUrl}
                    alt={character.name}
                    className="card-image"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <div className="card-content">
                    <h3 className="card-title">{character.name}</h3>
                    <div className="card-info">
                      <span>
                        {character.gender === "Male"
                          ? "👨"
                          : character.gender === "Female"
                            ? "👩"
                            : "👤"}
                      </span>
                      <span>{character.gender}</span>
                    </div>
                    {character.age && (
                      <div className="card-info">
                        <span>🎂</span>
                        <span>{character.age} anos</span>
                      </div>
                    )}
                    {character.occupation && (
                      <div className="card-info">
                        <span>💼</span>
                        <span>{character.occupation}</span>
                      </div>
                    )}
                    <div className="card-info">
                      <span>{character.status === "Alive" ? "💚" : "💀"}</span>
                      <span>
                        {character.status === "Alive" ? "Vivo" : "Falecido"}
                      </span>
                    </div>
                    <div className="card-actions">
                      <button
                        className="btn btn-favorite active"
                        onClick={() =>
                          removeFromFavorites(
                            "characters",
                            character._id || character.id.toString(),
                          )
                        }
                        aria-label={`Remover ${character.name} dos favoritos`}
                      >
                        <span>❤️</span>
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {favorites.episodes.length > 0 && (
        <div className="favorites-section">
          <h2>📺 Episódios Favoritos ({favorites.episodes.length})</h2>
          <div className="grid">
            {favorites.episodes.map((episode) => (
              <div key={episode._id || episode.id} className="card">
                <img
                  src={episode.thumbnailUrl}
                  alt={episode.name}
                  className="card-image"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${episode.name}`;
                  }}
                />
                <div className="card-content">
                  <h3 className="card-title">{episode.name}</h3>
                  <div className="card-info">
                    <span>📅</span>
                    <span>
                      Temporada {episode.season}, Episódio {episode.episode}
                    </span>
                  </div>
                  {episode.originalAirDate && (
                    <div className="card-info">
                      <span>📺</span>
                      <span>
                        {new Date(episode.originalAirDate).toLocaleDateString(
                          "pt-BR",
                        )}
                      </span>
                    </div>
                  )}
                  {episode.rating && (
                    <div className="card-info">
                      <span>⭐</span>
                      <span>Classificação: {episode.rating}</span>
                    </div>
                  )}
                  <div className="card-actions">
                    <button
                      className="btn btn-favorite active"
                      onClick={() =>
                        removeFromFavorites(
                          "episodes",
                          episode._id || episode.id.toString(),
                        )
                      }
                      aria-label={`Remover ${episode.name} dos favoritos`}
                    >
                      <span>❤️</span>
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {favorites.locations.length > 0 && (
        <div className="favorites-section">
          <h2>🏢 Produtos/Locações Favoritos ({favorites.locations.length})</h2>
          <div className="grid">
            {favorites.locations.map((location) => (
              <div key={location._id || location.id} className="card">
                <img
                  src={location.image}
                  alt={location.title}
                  className="card-image"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${location.title}`;
                  }}
                />
                <div className="card-content">
                  <h3 className="card-title">{location.title}</h3>
                  {location.description && (
                    <div className="card-info">
                      <span>📝</span>
                      <span>
                        {location.description.length > 80
                          ? `${location.description.slice(0, 80)}...`
                          : location.description}
                      </span>
                    </div>
                  )}
                  <div className="card-info">
                    <span>🏷️</span>
                    <span>Produto dos Simpsons</span>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn btn-favorite active"
                      onClick={() =>
                        removeFromFavorites(
                          "locations",
                          location._id || location.id.toString(),
                        )
                      }
                      aria-label={`Remover ${location.title} dos favoritos`}
                    >
                      <span>❤️</span>
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
