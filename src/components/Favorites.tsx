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
        <div className="empty-state-subtext">Explore os personagens, episódios e produtos para adicionar aos favoritos!</div>
      </div>
    );
  }

  return (
    <div>
      {favorites.characters.length > 0 && (
        <div className="favorites-section">
          <h2 className="section-title">⭐ Personagens Favoritos</h2>
          <div className="grid">
            {favorites.characters.map((character) => {
              const imageUrl = `https://thesimpsonsapi.com${character.portrait_path}`;
              
              return (
                <div key={character._id || character.id} className="card">
                  <img 
                    src={imageUrl}
                    alt={character.name}
                    className="card-image"
                  />
                  <div className="card-content">
                    <h3 className="card-title">{character.name}</h3>
                    <p className="card-info">
                      {character.gender === 'Male' ? '👨' : character.gender === 'Female' ? '👩' : '👤'} {character.gender}
                    </p>
                    {character.occupation && (
                      <p className="card-info">💼 {character.occupation}</p>
                    )}
                    <div className="card-actions">
                      <button 
                        className="btn btn-favorite active"
                        onClick={() => removeFromFavorites('characters', (character._id || character.id).toString())}
                      >
                        ❤️ Remover
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
          <h2>Episódios Favoritos</h2>
          <div className="grid">
            {favorites.episodes.map((episode) => (
              <div key={episode._id || episode.id} className="card">
                <img 
                  src={episode.thumbnailUrl} 
                  alt={episode.name}
                  className="card-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${episode.name}`;
                  }}
                />
                <div className="card-content">
                  <h3 className="card-title">{episode.name}</h3>
                  <p className="card-info">Temporada {episode.season} - Ep. {episode.episode}</p>
                  <p className="card-info">{episode.rating} ⭐</p>
                  <div className="card-actions">
                    <button 
                      className="btn btn-favorite active"
                      onClick={() => removeFromFavorites('episodes', (episode._id || episode.id).toString())}
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
          <h2>Produtos/Locações Favoritos</h2>
          <div className="grid">
            {favorites.locations.map((location) => (
              <div key={location._id || location.id} className="card">
                <img 
                  src={location.image} 
                  alt={location.title}
                  className="card-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${location.title}`;
                  }}
                />
                <div className="card-content">
                  <h3 className="card-title">{location.title}</h3>
                  <p className="card-info">{location.description?.substring(0, 80)}...</p>
                  <div className="card-actions">
                    <button 
                      className="btn btn-favorite active"
                      onClick={() => removeFromFavorites('locations', (location._id || location.id).toString())}
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
