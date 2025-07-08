import React from "react";
import "./PokemonCard.css";

 function PokemonCard({ pokemon, onClick, traduccionTipos }) {
  return (
    <div className="pokemon-card" onClick={onClick}>
      <img
        src={pokemon.mostrandoShiny ? pokemon.imagenShiny : pokemon.imagen}
        alt={pokemon.nombre}
      />
      <p className="pokemon-id">N.º {pokemon.id.toString().padStart(4, "0")}</p>
      <h3>{pokemon.nombre}</h3>
      <div className="pokemon-tipos">
        {pokemon.tipos.map((tipo) => (
          <span key={tipo} className={`tipo ${tipo}`}>
            {traduccionTipos[tipo] || tipo}
          </span>
        ))}
      </div>
      <button
        className="btn-shiny"
        onClick={(e) => {
          e.stopPropagation(); // evita que se abra el modal al hacer clic en el botón
          pokemon.mostrandoShiny = !pokemon.mostrandoShiny;
        }}
      >
        Ver shiny
      </button>
    </div>
  );
}
export default PokemonCard;
