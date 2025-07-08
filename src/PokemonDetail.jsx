// src/components/PokemonDetail.jsx
import React from "react";
import "./PokemonDetail.css";

const traduccionTipos = {
  normal: "Normal",
  fire: "Fuego",
  water: "Agua",
  electric: "Eléctrico",
  grass: "Planta",
  ice: "Hielo",
  fighting: "Lucha",
  poison: "Veneno",
  ground: "Tierra",
  flying: "Volador",
  psychic: "Psíquico",
  bug: "Bicho",
  rock: "Roca",
  ghost: "Fantasma",
  dark: "Siniestro",
  dragon: "Dragón",
  steel: "Acero",
  fairy: "Hada"
};

// Mapeo de debilidades para cada tipo
const debilidadesPorTipo = {
  normal: ["Lucha"],
  fire: ["Agua", "Roca", "Tierra"],
  water: ["Eléctrico", "Planta"],
  electric: ["Tierra"],
  grass: ["Fuego", "Hielo", "Veneno", "Volador", "Bicho"],
  ice: ["Fuego", "Lucha", "Roca", "Acero"],
  fighting: ["Volador", "Psíquico", "Hada"],
  poison: ["Tierra", "Psíquico"],
  ground: ["Agua", "Planta", "Hielo"],
  flying: ["Eléctrico", "Hielo", "Roca"],
  psychic: ["Bicho", "Fantasma", "Siniestro"],
  bug: ["Fuego", "Volador", "Roca"],
  rock: ["Agua", "Planta", "Lucha", "Tierra", "Acero"],
  ghost: ["Fantasma", "Siniestro"],
  dark: ["Lucha", "Bicho", "Hada"],
  dragon: ["Hielo", "Dragón", "Hada"],
  steel: ["Fuego", "Lucha", "Tierra"],
  fairy: ["Veneno", "Acero"]
};

function PokemonDetail({ pokemon, onClose }) {
  if (!pokemon) return null;

  const nombre = pokemon.name;
  const imagen = pokemon.sprites?.other?.["official-artwork"]?.front_default;
  const imagenShiny = pokemon.sprites?.other?.["official-artwork"]?.front_shiny;
  const tipos = pokemon.types.map((t) => traduccionTipos[t.type.name] || t.type.name);
  const altura = pokemon.height / 10;
  const peso = pokemon.weight / 10;
  const habilidades = pokemon.abilities.map((a) => a.ability.name).join(", ");
  const generos = pokemon.gender_rate === -1 ? "Desconocido" : "♂, ♀";

  const debilidades = Array.from(new Set(
    pokemon.types.flatMap((t) => debilidadesPorTipo[t.type.name] || [])
  ));

  return (
    <div className="pokemon-detail">
      <h2>{nombre}</h2>
      <div className="detail-images">
        <img src={imagen} alt={nombre} />
        <img src={imagenShiny} alt={`${nombre} shiny`} />
      </div>

      <div className="detail-info">
        <p><strong>ID:</strong> {pokemon.id}</p>
        <p><strong>Tipos:</strong> {tipos.join(", ")}</p>
        <p><strong>Altura:</strong> {altura} m</p>
        <p><strong>Peso:</strong> {peso} kg</p>
        <p><strong>Habilidades:</strong> {habilidades}</p>
        <p><strong>Géneros:</strong> {generos}</p>
      </div>

      <div className="detail-weaknesses">
        <p><strong>Debilidades:</strong></p>
        <div className="types">
          {debilidades.map((tipo, i) => (
            <span key={i} className={`type ${tipo.toLowerCase()}`}>
              {tipo}
            </span>
          ))}
        </div>
      </div>

      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}

export default PokemonDetail;
