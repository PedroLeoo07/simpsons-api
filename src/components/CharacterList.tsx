'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { Character, ApiResponse } from '@/types';

interface CharacterListProps {
  addToFavorites: (character: Character) => void;
  isFavorite: (type: 'characters', id: string) => boolean;
  removeFromFavorites: (id: string) => void;
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

export default function CharacterList({ addToFavorites, isFavorite, removeFromFavorites }: CharacterListProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const url = search 
    ? `https://api.sampleapis.com/simpsons/characters?name=${search}`
    : `https://api.sampleapis.com/simpsons/characters`;
  
  const { data, loading, error } = useFetch<Character[]>(url);

  if (loading) return <div className="loading">Carregando personagens...</div>;
  if (error) return <div className="error">Erro ao carregar: {error}</div>;
  if (!data || data.length === 0) return <div className="empty-state"><div className="empty-state-icon">🔍</div><div className="empty-state-text">Nenhum personagem encontrado</div></div>;

  return (
    <>
      <div className="search-box">
        <input 
          type="text"
          placeholder="Buscar personagem..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid">
        {data.map((character) => {
          const avatarUrl = getCharacterImage(character.name);
          const fallbackUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(character.name)}&backgroundColor=ffd700`;
          
          return (
            <div key={character.id} className="card">
              <img 
                src={avatarUrl}
                alt={character.name}
                className="card-image"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = fallbackUrl;
                }}
              />
              <div className="card-content">
                <h3 className="card-title">{character.name}</h3>
                {character.gender && (
                  <p className="card-info">
                    {character.gender === 'Male' ? '👨' : character.gender === 'Female' ? '👩' : '👤'} {character.gender || 'N/A'}
                  </p>
                )}
                <div className="card-actions">
                  <button 
                    className={`btn btn-favorite ${isFavorite('characters', character.id.toString()) ? 'active' : ''}`}
                    onClick={() => {
                      if (isFavorite('characters', character.id.toString())) {
                        removeFromFavorites(character.id.toString());
                      } else {
                        addToFavorites({
                          id: character.id,
                          _id: character.id.toString(),
                          name: character.name,
                          normalized_name: character.normalized_name || '',
                          avatar: avatarUrl
                        });
                      }
                    }}
                  >
                    {isFavorite('characters', character.id.toString()) ? '❤️ Remover' : '🤍 Favoritar'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
