"use client";

import { useState, useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
import { Episode } from "@/types";
import LoadingSkeleton from "./LoadingSkeleton";

interface EpisodeListProps {
  addToFavorites: (episode: Episode) => void;
  isFavorite: (type: "episodes", id: string) => boolean;
  removeFromFavorites: (id: string) => void;
}

export default function EpisodeList({
  addToFavorites,
  isFavorite,
  removeFromFavorites,
}: EpisodeListProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  const { data, loading, error } = useFetch<Episode[]>(
    "https://api.sampleapis.com/simpsons/episodes",
  );

  const filteredEpisodes = useMemo(() => {
    if (!data) return [];
    return search
      ? data.filter(
          (ep) =>
            ep.name.toLowerCase().includes(search.toLowerCase()) ||
            `S${ep.season}E${ep.episode}`
              .toLowerCase()
              .includes(search.toLowerCase()),
        )
      : data;
  }, [data, search]);

  const totalPages = Math.ceil(filteredEpisodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEpisodes = filteredEpisodes.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <LoadingSkeleton count={12} />;

  if (error)
    return (
      <div className="error">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📺</div>
        <div>Ops! Não conseguimos carregar os episódios.</div>
        <div style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.8 }}>
          {error}
        </div>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <div className="empty-state-text">Nenhum episódio encontrado</div>
      </div>
    );

  return (
    <>
      <div className="search-box">
        <input
          type="text"
          placeholder="📺 Buscar por nome do episódio ou temporada..."
          className="search-input"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          aria-label="Buscar episódios"
        />
        <div
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            marginTop: "var(--spacing-xs)",
            textAlign: "center",
          }}
        >
          {filteredEpisodes.length} episódio
          {filteredEpisodes.length === 1 ? "" : "s"} encontrado
          {filteredEpisodes.length === 1 ? "" : "s"}
        </div>
      </div>

      {filteredEpisodes.length === 0 && search ? (
        <div className="empty-state">
          <div className="empty-state-icon">😢</div>
          <div className="empty-state-text">Nenhum episódio encontrado</div>
          <div className="empty-state-subtext">
            Tente buscar por "{search.slice(0, 20)}..."
          </div>
        </div>
      ) : (
        <>
          <div className="grid">
            {currentEpisodes.map((episode) => {
              const isFav = isFavorite("episodes", episode.id.toString());

              return (
                <div key={episode.id} className="card">
                  <img
                    src={episode.thumbnailUrl}
                    alt={episode.name}
                    className="card-image"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${episode.name}`;
                    }}
                  />
                  <div className="card-content">
                    <h3 className="card-title">{episode.name}</h3>
                    <div className="card-info">
                      <span>📅</span>
                      <span>
                        Temporada {episode.season}, Episódio {episode.episode}
                      </span>
                    </div>
                    {episode.originalAirDate && (
                      <div className="card-info">
                        <span>📺</span>
                        <span>
                          {new Date(episode.originalAirDate).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>
                    )}
                    {episode.rating && (
                      <div className="card-info">
                        <span>⭐</span>
                        <span>Classificação: {episode.rating}</span>
                      </div>
                    )}
                    <div className="card-actions">
                      <button
                        className={`btn btn-favorite ${isFav ? "active" : ""}`}
                        onClick={() => {
                          if (isFav) {
                            removeFromFavorites(episode.id.toString());
                          } else {
                            addToFavorites({
                              ...episode,
                              _id: episode.id.toString(),
                            });
                          }
                        }}
                        aria-label={
                          isFav
                            ? `Remover ${episode.name} dos favoritos`
                            : `Adicionar ${episode.name} aos favoritos`
                        }
                      >
                        <span>{isFav ? "❤️" : "🤍"}</span>
                        <span>{isFav ? "Remover" : "Favoritar"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                ← Anterior
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={currentPage === pageNum ? "active" : ""}
                    aria-label={`Página ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
              >
                Próxima →
              </button>

              <span>
                Página {currentPage} de {totalPages}
              </span>
            </div>
          )}
        </>
      )}
    </>
  );
}
