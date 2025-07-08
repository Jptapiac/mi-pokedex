// PokemonDetail.jsx
import React from "react";
import "./PokemonDetail.css";

const weaknessesByType = {
  normal: ["Fighting"],
  fire: ["Water", "Rock", "Ground"],
  water: ["Electric", "Grass"],
  electric: ["Ground"],
  grass: ["Fire", "Ice", "Poison", "Flying", "Bug"],
  ice: ["Fire", "Fighting", "Rock", "Steel"],
  fighting: ["Flying", "Psychic", "Fairy"],
  poison: ["Ground", "Psychic"],
  ground: ["Water", "Grass", "Ice"],
  flying: ["Electric", "Ice", "Rock"],
  psychic: ["Bug", "Ghost", "Dark"],
  bug: ["Fire", "Flying", "Rock"],
  rock: ["Water", "Grass", "Fighting", "Ground", "Steel"],
  ghost: ["Ghost", "Dark"],
  dark: ["Fighting", "Bug", "Fairy"],
  dragon: ["Ice", "Dragon", "Fairy"],
  steel: ["Fire", "Fighting", "Ground"],
  fairy: ["Poison", "Steel"]
};

const PokemonDetail = ({ pokemon, onClose }) => {
  const tipos = pokemon.types.map((t) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));

  const debilidades = Array.from(
    new Set(
      pokemon.types.flatMap((t) => weaknessesByType[t.type.name] || [])
    )
  );

  return (
    <div className="detalle">
      <button className="cerrar" onClick={onClose}>✖</button>
      <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      <div className="imagenes">
        <img src={pokemon.imagen} alt={pokemon.name} />
        <img src={pokemon.shiny} alt={pokemon.name + " shiny"} />
      </div>
      <p><strong>ID:</strong> {pokemon.id}</p>
      <p><strong>Types:</strong> {tipos.join(", ")}</p>
      <p><strong>Height:</strong> {pokemon.altura} m</p>
      <p><strong>Weight:</strong> {pokemon.peso} kg</p>
      <p><strong>Abilities:</strong> {pokemon.habilidades.join(", ")}</p>
      <p><strong>Weaknesses:</strong> {debilidades.join(", ")}</p>
    </div>
  );
};

export default PokemonDetail;
