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

// Mapeamento de imagens reais dos personagens dos Simpsons
const characterImages: { [key: string]: string } = {
  'homer simpson': 'https://i.imgur.com/2WnLIKK.png',
  'marge simpson': 'https://i.imgur.com/eUQGWnh.png',
  'bart simpson': 'https://i.imgur.com/W8JNE0c.png',
  'lisa simpson': 'https://i.imgur.com/6JYhMQX.png',
  'maggie simpson': 'https://i.imgur.com/hKOGvMh.png',
  'ned flanders': 'https://i.imgur.com/G9ALf3N.png',
  'moe szyslak': 'https://i.imgur.com/ckBlwIa.png',
  'barney gumble': 'https://i.imgur.com/3mPpLcj.png',
  'krusty the clown': 'https://i.imgur.com/FJw7zhd.png',
  'chief wiggum': 'https://i.imgur.com/JzHgBFv.png',
  'apu nahasapeemapetilon': 'https://i.imgur.com/YCAx8bE.png',
  'comic book guy': 'https://i.imgur.com/1qH6b7L.png',
  'milhouse van houten': 'https://i.imgur.com/7qfaAqQ.png',
  'nelson muntz': 'https://i.imgur.com/w6qqOkH.png',
  'ralph wiggum': 'https://i.imgur.com/DnPnqzI.png',
  'abraham simpson': 'https://i.imgur.com/qQB7LHS.png',
  'montgomery burns': 'https://i.imgur.com/jhAYGMu.png',
  'waylon smithers': 'https://i.imgur.com/VEW98Fa.png',
  'principal skinner': 'https://i.imgur.com/x6RYnSY.png',
  'edna krabappel': 'https://i.imgur.com/vMdQRqe.png',
  'groundskeeper willie': 'https://i.imgur.com/8QGRkqT.png',
  'otto mann': 'https://i.imgur.com/7H4fXvk.png',
  'lenny leonard': 'https://i.imgur.com/XeJCkwh.png',
  'carl carlson': 'https://i.imgur.com/EBgvphZ.png',
  'patty bouvier': 'https://i.imgur.com/VwHYqc6.png',
  'selma bouvier': 'https://i.imgur.com/TkPXqDk.png',
};

function getCharacterImage(name: string): string {
  const normalized = name.toLowerCase().trim();
  return characterImages[normalized] || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffd700`;
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
            {favorites.characters.map((character) => {
              const avatarUrl = character.avatar || getCharacterImage(character.name);
              const fallbackUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(character.name)}&backgroundColor=ffd700`;
              
              return (
                <div key={character._id || character.id} className="card">
                  <img 
                    src={avatarUrl}
                    alt={character.name}
                    className="card-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackUrl;
                    }}
                  />
                  <div className="card-content">
                    <h3 className="card-title">{character.name}</h3>
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
