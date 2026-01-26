'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { Episode } from '@/types';

interface EpisodeListProps {
  addToFavorites: (episode: Episode) => void;
  isFavorite: (type: 'episodes', id: string) => boolean;
  removeFromFavorites: (id: string) => void;
}

export default function EpisodeList({ addToFavorites, isFavorite, removeFromFavorites }: EpisodeListProps) {
  const [search, setSearch] = useState('');
  
  const { data, loading, error } = useFetch<Episode[]>('https://api.sampleapis.com/simpsons/episodes');

  if (loading) return <div className="loading">Carregando episódios...</div>;
  if (error) return <div className="error">Erro ao carregar: {error}</div>;
  if (!data || data.length === 0) return <div className="empty-state"><div className="empty-state-icon">🔍</div><div className="empty-state-text">Nenhum episódio encontrado</div></div>;

  const filteredEpisodes = search 
    ? data.filter(ep => ep.name.toLowerCase().includes(search.toLowerCase()))
    : data;

  return (
    <>
      <div className="search-box">
        <input 
          type="text"
          placeholder="Buscar episódio..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid">
        {filteredEpisodes.slice(0, 50).map((episode) => (
          <div key={episode.id} className="card">
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
              <p className="card-info">Temporada {episode.season} - Episódio {episode.episode}</p>
              <p className="card-info">{episode.rating} ⭐</p>
              <div className="card-actions">
                <button 
                  className={`btn btn-favorite ${isFavorite('episodes', episode.id.toString()) ? 'active' : ''}`}
                  onClick={() => {
                    if (isFavorite('episodes', episode.id.toString())) {
                      removeFromFavorites(episode.id.toString());
                    } else {
                      addToFavorites({
                        id: episode.id,
                        name: episode.name,
                        season: episode.season,
                        episode: episode.episode,
                        rating: episode.rating,
                        originalAirDate: episode.originalAirDate,
                        thumbnailUrl: episode.thumbnailUrl,
                        _id: episode.id.toString()
                      });
                    }
                  }}
                >
                  {isFavorite('episodes', episode.id.toString()) ? '❤️ Remover' : '🤍 Favoritar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
