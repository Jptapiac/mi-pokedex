import React from "react";
import "./PokemonCard.css";

function PokemonCard({ pokemon, onClick }) {
  return (
    <div className="pokemon-card" onClick={() => onClick(pokemon)}>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="pokemon-image"
      />
      <h3>N.º {pokemon.id.toString().padStart(4, "0")}</h3>
      <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      <div className="types">
        {pokemon.types.map((typeObj) => (
          <span key={typeObj.type.name} className={`type ${typeObj.type.name}`}>
            {typeObj.type.name}
          </span>
        ))}
      </div>
      <button className="shiny-button">Ver shiny</button>
    </div>
  );
}

export default PokemonCard;
