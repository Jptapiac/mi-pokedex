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
  fairy: ["Poison", "Steel"],
};

const PokemonDetail = ({ pokemon, onClose }) => {
  if (!pokemon) return null;

  const tipos = pokemon.tipos
    ? pokemon.tipos.map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    : [];

  const debilidades = pokemon.tipos
    ? Array.from(
        new Set(pokemon.tipos.flatMap((t) => weaknessesByType[t] || []))
      )
    : [];

  const habilidades = pokemon.habilidades?.length
    ? pokemon.habilidades.join(", ")
    : "No disponibles";

  return (
    <div className="detalle">
      <button className="cerrar" onClick={onClose}>🔙 Volver a la Pokédex</button>
      <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      <div className="imagenes">
        <img src={pokemon.imagen} alt={pokemon.name} />
        <img src={pokemon.shiny} alt={pokemon.name + " shiny"} />
      </div>
      <p><strong>ID:</strong> {pokemon.id}</p>
      <p><strong>Tipos:</strong> {tipos.join(", ")}</p>
      <p><strong>Altura:</strong> {pokemon.altura / 10} m</p>
      <p><strong>Peso:</strong> {pokemon.peso / 10} kg</p>
      <p><strong>Habilidades:</strong> {habilidades}</p>
      <p><strong>Debilidades:</strong> {debilidades.join(", ") || "No disponibles"}</p>
    </div>
  );
};

export default PokemonDetail;
