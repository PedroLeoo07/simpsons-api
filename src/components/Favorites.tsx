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
  'homer simpson': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/HomerSimpson.png',
  'marge simpson': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/MargeSimpson.png',
  'bart simpson': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/BartSimpson.png',
  'lisa simpson': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/LisaSimpson.png',
  'maggie simpson': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/MaggieSimpson.png',
  'ned flanders': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/NedFlanders.png',
  'moe szyslak': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/MoeSzyslak.png',
  'barney gumble': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/BarneyGumble.png',
  'krusty the clown': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/KrustyTheClown.png',
  'chief wiggum': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/ChiefWiggum.png',
  'apu nahasapeemapetilon': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/ApuNahasapeemapetilon.png',
  'comic book guy': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/ComicBookGuy.png',
  'milhouse van houten': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/MilhouseVanHouten.png',
  'nelson muntz': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/NelsonMuntz.png',
  'ralph wiggum': 'https://cdn.glitch.global/3c3ffadc-3406-4440-bb95-d40ec8fcde72/RalphWiggum.png',
};

function getCharacterImage(name: string): string {
  const normalized = name.toLowerCase().trim();
  return characterImages[normalized] || `https://joeschmoe.io/api/v1/random?name=${encodeURIComponent(name)}`;
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
