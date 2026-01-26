'use client';

import { useState } from 'react';
import { Character, Episode, Location } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import CharacterList from '@/components/CharacterList';
import EpisodeList from '@/components/EpisodeList';
import LocationList from '@/components/LocationList';
import Favorites from '@/components/Favorites';
import './globals.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'characters' | 'episodes' | 'locations' | 'favorites'>('characters');
  const [favorites, setFavorites] = useLocalStorage<{
    characters: Character[];
    episodes: Episode[];
    locations: Location[];
  }>('simpsons-favorites', { characters: [], episodes: [], locations: [] });

  const addToFavorites = (type: 'characters' | 'episodes' | 'locations', item: Character | Episode | Location) => {
    setFavorites({
      ...favorites,
      [type]: [...favorites[type], item]
    });
  };

  const removeFromFavorites = (type: 'characters' | 'episodes' | 'locations', id: string) => {
    setFavorites({
      ...favorites,
      [type]: favorites[type].filter((item: any) => item._id !== id)
    });
  };

  const isFavorite = (type: 'characters' | 'episodes' | 'locations', id: string): boolean => {
    return favorites[type].some((item: any) => item._id === id);
  };

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">The Simpsons API</h1>
        <p className="subtitle">Explore personagens, episódios e locações</p>
      </header>

      <nav className="tabs">
        <button 
          className={`tab ${activeTab === 'characters' ? 'active' : ''}`}
          onClick={() => setActiveTab('characters')}
        >
          Personagens
        </button>
        <button 
          className={`tab ${activeTab === 'episodes' ? 'active' : ''}`}
          onClick={() => setActiveTab('episodes')}
        >
          Episódios
        </button>
        <button 
          className={`tab ${activeTab === 'locations' ? 'active' : ''}`}
          onClick={() => setActiveTab('locations')}
        >
          Locações
        </button>
        <button 
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favoritos ({favorites.characters.length + favorites.episodes.length + favorites.locations.length})
        </button>
      </nav>

      <div className="content">
        {activeTab === 'characters' && (
          <CharacterList 
            addToFavorites={(item) => addToFavorites('characters', item)}
            isFavorite={isFavorite}
            removeFromFavorites={(id) => removeFromFavorites('characters', id)}
          />
        )}
        {activeTab === 'episodes' && (
          <EpisodeList 
            addToFavorites={(item) => addToFavorites('episodes', item)}
            isFavorite={isFavorite}
            removeFromFavorites={(id) => removeFromFavorites('episodes', id)}
          />
        )}
        {activeTab === 'locations' && (
          <LocationList 
            addToFavorites={(item) => addToFavorites('locations', item)}
            isFavorite={isFavorite}
            removeFromFavorites={(id) => removeFromFavorites('locations', id)}
          />
        )}
        {activeTab === 'favorites' && (
          <Favorites 
            favorites={favorites}
            removeFromFavorites={removeFromFavorites}
          />
        )}
      </div>
    </main>
  );
}
