"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import { Location } from "@/types";
import LoadingSkeleton from "./LoadingSkeleton";
import LazyImage from "./LazyImage";

interface LocationListProps {
  addToFavorites: (location: Location) => void;
  isFavorite: (type: "locations", id: string) => boolean;
  removeFromFavorites: (id: string) => void;
}

function LocationList({
  addToFavorites,
  isFavorite,
  removeFromFavorites,
}: LocationListProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const debouncedSearch = useDebounce(search, 300);

  const { data, loading, error } = useFetch<any[]>(
    "https://api.sampleapis.com/simpsons/products",
  );

  const filteredLocations = useMemo(() => {
    if (!data) return [];
    return debouncedSearch
      ? data.filter(
          (loc) =>
            loc.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            loc.description
              ?.toLowerCase()
              .includes(debouncedSearch.toLowerCase()),
        )
      : data;
  }, [data, debouncedSearch]);

  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLocations = filteredLocations.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) return <LoadingSkeleton count={12} />;

  if (error)
    return (
      <div className="error">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏢</div>
        <div>Ops! Não conseguimos carregar os produtos/locações.</div>
        <div style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.8 }}>
          {error}
        </div>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <div className="empty-state-text">Nenhuma locação encontrada</div>
      </div>
    );

  return (
    <>
      <div className="search-box">
        <input
          type="text"
          placeholder="🏢 Buscar produto ou locação dos Simpsons..."
          className="search-input"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          aria-label="Buscar produtos e locações"
        />
        <div
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            marginTop: "var(--spacing-xs)",
            textAlign: "center",
          }}
        >
          {filteredLocations.length} ite
          {filteredLocations.length === 1 ? "m" : "ns"} encontrado
          {filteredLocations.length === 1 ? "" : "s"}
        </div>
      </div>

      {filteredLocations.length === 0 && search ? (
        <div className="empty-state">
          <div className="empty-state-icon">😢</div>
          <div className="empty-state-text">Nenhum item encontrado</div>
          <div className="empty-state-subtext">
            Tente buscar por "{search.slice(0, 20)}..."
          </div>
        </div>
      ) : (
        <>
          <div className="grid">
            {currentLocations.map((location) => {
              const isFav = isFavorite("locations", location.id.toString());

              return (
                <div key={location.id} className="card">
                  <LazyImage
                    src={location.image}
                    alt={location.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${location.title}`;
                    }}
                  />
                  <div className="card-content">
                    <h3 className="card-title">{location.title}</h3>
                    {location.description && (
                      <div className="card-info">
                        <span>📝</span>
                        <span>
                          {location.description.length > 100
                            ? `${location.description.slice(0, 100)}...`
                            : location.description}
                        </span>
                      </div>
                    )}
                    <div className="card-info">
                      <span>🏷️</span>
                      <span>Produto dos Simpsons</span>
                    </div>
                    <div className="card-actions">
                      <button
                        className={`btn btn-favorite ${isFav ? "active" : ""}`}
                        onClick={() => {
                          if (isFav) {
                            removeFromFavorites(location.id.toString());
                          } else {
                            addToFavorites({
                              ...location,
                              _id: location.id.toString(),
                            });
                          }
                        }}
                        aria-label={
                          isFav
                            ? `Remover ${location.title} dos favoritos`
                            : `Adicionar ${location.title} aos favoritos`
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

export default memo(LocationList);
