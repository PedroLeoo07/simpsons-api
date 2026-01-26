'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { Location } from '@/types';

interface LocationListProps {
  addToFavorites: (location: Location) => void;
  isFavorite: (type: 'locations', id: string) => boolean;
  removeFromFavorites: (id: string) => void;
}

export default function LocationList({ addToFavorites, isFavorite, removeFromFavorites }: LocationListProps) {
  const [search, setSearch] = useState('');
  
  const { data, loading, error } = useFetch<any[]>('https://api.sampleapis.com/simpsons/products');

  if (loading) return <div className="loading">Carregando locações...</div>;
  if (error) return <div className="error">Erro ao carregar: {error}</div>;
  if (!data || data.length === 0) return <div className="empty-state"><div className="empty-state-icon">🔍</div><div className="empty-state-text">Nenhuma locação encontrada</div></div>;

  const filteredLocations = search 
    ? data.filter(loc => loc.title?.toLowerCase().includes(search.toLowerCase()))
    : data;

  return (
    <>
      <div className="search-box">
        <input 
          type="text"
          placeholder="Buscar produto/locação..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid">
        {filteredLocations.map((location) => (
          <div key={location.id} className="card">
            <img 
              src={location.image || 'https://via.placeholder.com/250x300?text=No+Image'} 
              alt={location.title}
              className="card-image"
            />
            <div className="card-content">
              <h3 className="card-title">{location.title}</h3>
              <p className="card-info">{location.description?.substring(0, 80)}...</p>
              <div className="card-actions">
                <button 
                  className={`btn btn-favorite ${isFavorite('locations', location.id.toString()) ? 'active' : ''}`}
                  onClick={() => {
                    if (isFavorite('locations', location.id.toString())) {
                      removeFromFavorites(location.id.toString());
                    } else {
                      addToFavorites({
                        _id: location.id.toString(),
                        name: location.title,
                        normalized_name: location.title.toLowerCase().replace(/\s+/g, '-'),
                        image: location.image || ''
                      });
                    }
                  }}
                >
                  {isFavorite('locations', location.id.toString()) ? '❤️ Remover' : '🤍 Favoritar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
