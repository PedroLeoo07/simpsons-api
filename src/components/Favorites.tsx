'use client';

import { Character, Episode, Location } from '@/types';

interface FavoritesProps {
  favorites: {
    characters: Character[];
    episodes: Episode[];
    locations: Location[];
  };
  removeFromFavorites: (type: 'characters' | 'episodes' | 'locations', id: string) => void;
}

export default function Favorites({ favorites, removeFromFavorites }: FavoritesProps) {
  const hasAnyFavorites = 
    favorites.characters.length > 0 || 
    favorites.episodes.length > 0 || 
    favorites.locations.length > 0;

  if (!hasAnyFavorites) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">💛</div>
        <div className="empty-state-text">Você ainda não tem favoritos</div>
      </div>
    );
  }

  return (
    <div>
      {favorites.characters.length > 0 && (
        <div className="favorites-section">
          <h2>Personagens Favoritos</h2>
          <div className="grid">
            {favorites.characters.map((character) => (
              <div key={character._id} className="card">
                <img 
                  src={character.avatar || 'https://via.placeholder.com/250x300?text=No+Image'} 
                  alt={character.name}
                  className="card-image"
                />
                <div className="card-content">
                  <h3 className="card-title">{character.name}</h3>
                  <div className="card-actions">
                    <button 
                      className="btn btn-favorite active"
                      onClick={() => removeFromFavorites('characters', character._id)}
                    >
                      ❤️ Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {favorites.episodes.length > 0 && (
        <div className="favorites-section">
          <h2>Episódios Favoritos</h2>
          <div className="grid">
            {favorites.episodes.map((episode) => (
              <div key={episode._id} className="card">
                <img 
                  src={episode.image_url || 'https://via.placeholder.com/250x300?text=No+Image'} 
                  alt={episode.name}
                  className="card-image"
                />
                <div className="card-content">
                  <h3 className="card-title">{episode.name}</h3>
                  <p className="card-info">Temporada {episode.season}</p>
                  <div className="card-actions">
                    <button 
                      className="btn btn-favorite active"
                      onClick={() => removeFromFavorites('episodes', episode._id)}
                    >
                      ❤️ Remover
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
          <h2>Locações Favoritas</h2>
          <div className="grid">
            {favorites.locations.map((location) => (
              <div key={location._id} className="card">
                <img 
                  src={location.image || 'https://via.placeholder.com/250x300?text=No+Image'} 
                  alt={location.name}
                  className="card-image"
                />
                <div className="card-content">
                  <h3 className="card-title">{location.name}</h3>
                  <div className="card-actions">
                    <button 
                      className="btn btn-favorite active"
                      onClick={() => removeFromFavorites('locations', location._id)}
                    >
                      ❤️ Remover
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
