'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { Character, ApiResponse } from '@/types';

interface CharacterListProps {
  addToFavorites: (character: Character) => void;
  isFavorite: (type: 'characters', id: string) => boolean;
  removeFromFavorites: (id: string) => void;
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
          const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(character.name)}&backgroundColor=ffd700,ff6b00,00d4ff&radius=50`;
          
          return (
            <div key={character.id} className="card">
              <img 
                src={avatarUrl}
                alt={character.name}
                className="card-image"
                loading="lazy"
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
