'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { Character } from '@/types';

interface CharacterListProps {
  addToFavorites: (character: Character) => void;
  isFavorite: (type: 'characters', id: string) => boolean;
  removeFromFavorites: (id: string) => void;
}

interface ApiResponse {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: Character[];
}

export default function CharacterList({ addToFavorites, isFavorite, removeFromFavorites }: CharacterListProps) {
  const [search, setSearch] = useState('');
  
  const url = `https://thesimpsonsapi.com/api/characters?limit=50`;
  
  const { data, loading, error } = useFetch<ApiResponse>(url);

  if (loading) return <div className="loading">⏳ Carregando personagens...</div>;
  if (error) return <div className="error">❌ Erro ao carregar: {error}</div>;
  if (!data || !data.results || data.results.length === 0) return <div className="empty-state"><div className="empty-state-icon">🔍</div><div className="empty-state-text">Nenhum personagem encontrado</div></div>;

  const filteredCharacters = search 
    ? data.results.filter(char => char.name.toLowerCase().includes(search.toLowerCase()))
    : data.results;

  return (
    <>
      <div className="search-box">
        <input 
          type="text"
          placeholder="🔍 Buscar personagem..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid">
        {filteredCharacters.map((character) => {
          const imageUrl = `https://thesimpsonsapi.com${character.portrait_path}`;
          
          return (
            <div key={character.id} className="card">
              <img 
                src={imageUrl}
                alt={character.name}
                className="card-image"
                loading="lazy"
              />
              <div className="card-content">
                <h3 className="card-title">{character.name}</h3>
                <p className="card-info">
                  {character.gender === 'Male' ? '👨' : character.gender === 'Female' ? '👩' : '👤'} {character.gender}
                </p>
                {character.age && (
                  <p className="card-info">🎂 {character.age} anos</p>
                )}
                {character.occupation && (
                  <p className="card-info">💼 {character.occupation}</p>
                )}
                <p className="card-info">
                  {character.status === 'Alive' ? '💚 Vivo' : '💀 Falecido'}
                </p>
                <div className="card-actions">
                  <button 
                    className={`btn btn-favorite ${isFavorite('characters', character.id.toString()) ? 'active' : ''}`}
                    onClick={() => {
                      if (isFavorite('characters', character.id.toString())) {
                        removeFromFavorites(character.id.toString());
                      } else {
                        addToFavorites({
                          ...character,
                          _id: character.id.toString()
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
