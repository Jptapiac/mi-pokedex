// PokemonFetcher.jsx
import React, { useEffect, useState } from "react";
import "./PokemonFetcher.css";
import PokemonDetail from "./PokemonDetail";
import "./PokemonDetail.css";
import pokedexLogo from "./assets/pokedex.png"; // Logo oficial

const PokemonFetcher = () => {
  const [pokemones, setPokemones] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("");
  const [pokemonDetalle, setPokemonDetalle] = useState(null);
  const [cantidad, setCantidad] = useState(10);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const data = await res.json();

        const resultados = await Promise.all(
          data.results.map(async (p) => {
            const resPoke = await fetch(p.url);
            const dataPoke = await resPoke.json();
            return {
              id: dataPoke.id,
              name: dataPoke.name,
              imagen: dataPoke.sprites.other["official-artwork"].front_default,
              shiny: dataPoke.sprites.other["official-artwork"].front_shiny,
              tipos: dataPoke.types.map((t) => t.type.name),
              altura: dataPoke.height,
              peso: dataPoke.weight,
              habilidades: dataPoke.abilities.map((h) => h.ability.name),
              sprites: dataPoke.sprites,
              mostrandoShiny: false,
            };
          })
        );

        setPokemones(resultados);
        setFiltrados(resultados);
      } catch (error) {
        console.error("Error al cargar Pokémon", error);
      }
      setCargando(false);
    };

    fetchData();
  }, []);

  const filtrar = () => {
    const resultado = pokemones.filter(
      (p) =>
        p.name.toLowerCase().includes(busqueda.toLowerCase()) &&
        (tipo === "" || p.tipos.includes(tipo))
    );
    setFiltrados(resultado);
    setCantidad(10);
  };

  useEffect(() => {
    filtrar();
  }, [busqueda, tipo]);

  const pokemonesAMostrar = filtrados.slice(0, cantidad);

  const toggleShiny = (id) => {
    setFiltrados((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, mostrandoShiny: !p.mostrandoShiny } : p
      )
    );
  };

  const sorprenderme = () => {
    const aleatorios = [...pokemones]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);

    setBusqueda("");
    setTipo("");
    setPokemonDetalle(null);
    setFiltrados(aleatorios);
    setCantidad(10);
  };

  const reiniciar = () => {
    setBusqueda("");
    setTipo("");
    setCantidad(10);
    setPokemonDetalle(null);
    setFiltrados(pokemones);
  };

  const abrirModal = (poke) => {
    setPokemonDetalle(poke);
  };

  if (cargando) {
    return (
      <div className="pokemon-container">
        <h2>Cargando Pokémon...</h2>
      </div>
    );
  }

  return (
    <div className="pokemon-container">
      {/* ✨ Título brillante */}
      <h1 className="titulo-brillante">¡Explora el mundo Pokémon!</h1>

      {/* Imagen del logo de Pokédex */}
      <img
        src={pokedexLogo}
        alt="Logo Pokédex"
        style={{ maxWidth: "240px", marginBottom: "20px" }}
      />

      {!pokemonDetalle && (
        <>
          <div className="acciones">
            <button className="boton-moderno" onClick={sorprenderme}>
              🔁 ¡Sorpréndeme!
            </button>
            <button className="boton-moderno volver" onClick={reiniciar}>
              🔙 Volver a la Pokédex
            </button>

            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="">Todos los tipos</option>
              {[
                "normal", "fire", "water", "grass", "electric", "ice",
                "fighting", "poison", "ground", "flying", "psychic",
                "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
              ].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <h2>Pokédex</h2>
          <div className="pokemon-list">
            {pokemonesAMostrar.map((p) => (
              <div
                key={p.id}
                className="pokemon-card"
                onClick={() => abrirModal(p)}
              >
                <img
                  src={p.mostrandoShiny ? p.shiny : p.imagen}
                  alt={p.name}
                />
                <p>
                  <strong>N.º {p.id.toString().padStart(4, "0")}</strong>
                </p>
                <h3>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h3>
                <p>
                  {p.tipos.map((t, i) => (
                    <span key={i} className={`tipo-label tipo-${t}`}>
                      {t}
                    </span>
                  ))}
                </p>
                <button
                  className="shiny-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShiny(p.id);
                  }}
                >
                  {p.mostrandoShiny ? "Ver normal" : "Ver shiny"}
                </button>
              </div>
            ))}
          </div>

          {pokemonesAMostrar.length < filtrados.length && (
            <div className="cargar-mas">
              <button onClick={() => setCantidad(cantidad + 10)}>
                Cargar más Pokémon
              </button>
            </div>
          )}
        </>
      )}

      {pokemonDetalle && (
        <PokemonDetail
          pokemon={pokemonDetalle}
          onClose={() => setPokemonDetalle(null)}
        />
      )}
    </div>
  );
};

export default PokemonFetcher;
