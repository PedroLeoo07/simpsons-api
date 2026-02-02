"use client";

import { useState, useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import { Character } from "@/types";
import LoadingSkeleton from "./LoadingSkeleton";
import LazyImage from "./LazyImage";

interface CharacterListProps {
  addToFavorites: (character: Character) => void;
  isFavorite: (type: "characters", id: string) => boolean;
  removeFromFavorites: (id: string) => void;
}

interface ApiResponse {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: Character[];
}

export default function CharacterList({
  addToFavorites,
  isFavorite,
  removeFromFavorites,
}: CharacterListProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Debounce da busca para melhorar performance
  const debouncedSearch = useDebounce(search, 300);

  const url = `https://thesimpsonsapi.com/api/characters?limit=50`;

  const { data, loading, error } = useFetch<ApiResponse>(url);

  const filteredCharacters = useMemo(() => {
    if (!data?.results) return [];
    return debouncedSearch
      ? data.results.filter(
          (char) =>
            char.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            char.occupation
              .toLowerCase()
              .includes(debouncedSearch.toLowerCase()),
        )
      : data.results;
  }, [data?.results, debouncedSearch]);

  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCharacters = filteredCharacters.slice(
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
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😵</div>
        <div>Ops! Algo deu errado ao carregar os personagens.</div>
        <div style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.8 }}>
          {error}
        </div>
      </div>
    );

  if (!data || !data.results || data.results.length === 0)
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <div className="empty-state-text">Nenhum personagem encontrado</div>
        <div className="empty-state-subtext">Tente ajustar sua busca</div>
      </div>
    );

  return (
    <>
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Buscar por nome ou profissão..."
          className="search-input"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          aria-label="Buscar personagens"
        />
        <div
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            marginTop: "var(--spacing-xs)",
            textAlign: "center",
          }}
        >
          {filteredCharacters.length} personagen
          {filteredCharacters.length === 1 ? "" : "s"} encontrado
          {filteredCharacters.length === 1 ? "" : "s"}
        </div>
      </div>

      {filteredCharacters.length === 0 && search ? (
        <div className="empty-state">
          <div className="empty-state-icon">😢</div>
          <div className="empty-state-text">Nenhum personagem encontrado</div>
          <div className="empty-state-subtext">
            Tente buscar por "{search.slice(0, 20)}..."
          </div>
        </div>
      ) : (
        <>
          <div className="grid">
            {currentCharacters.map((character) => {
              const imageUrl = `https://thesimpsonsapi.com${character.portrait_path}`;
              const isFav = isFavorite("characters", character.id.toString());

              return (
                <div key={character.id} className="card">
                  <LazyImage
                    src={imageUrl}
                    alt={character.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <div className="card-content">
                    <h3 className="card-title">{character.name}</h3>
                    <div className="card-info">
                      <span>
                        {character.gender === "Male"
                          ? "👨"
                          : character.gender === "Female"
                            ? "👩"
                            : "👤"}
                      </span>
                      <span>{character.gender}</span>
                    </div>
                    {character.age && (
                      <div className="card-info">
                        <span>🎂</span>
                        <span>{character.age} anos</span>
                      </div>
                    )}
                    {character.occupation && (
                      <div className="card-info">
                        <span>💼</span>
                        <span>{character.occupation}</span>
                      </div>
                    )}
                    <div className="card-info">
                      <span>{character.status === "Alive" ? "💚" : "💀"}</span>
                      <span>
                        {character.status === "Alive" ? "Vivo" : "Falecido"}
                      </span>
                    </div>
                    <div className="card-actions">
                      <button
                        className={`btn btn-favorite ${isFav ? "active" : ""}`}
                        onClick={() => {
                          if (isFav) {
                            removeFromFavorites(character.id.toString());
                          } else {
                            addToFavorites({
                              ...character,
                              _id: character.id.toString(),
                            });
                          }
                        }}
                        aria-label={
                          isFav
                            ? `Remover ${character.name} dos favoritos`
                            : `Adicionar ${character.name} aos favoritos`
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
                    aria-current={currentPage === pageNum ? "page" : undefined}
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
