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
