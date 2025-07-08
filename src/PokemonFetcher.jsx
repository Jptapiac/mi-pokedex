import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css';

const tiposDisponibles = [
  "fire", "water", "grass", "electric", "psychic", "ice", "rock", "ground",
  "poison", "bug", "normal", "flying", "fighting", "dragon", "ghost", "dark",
  "steel", "fairy"
];

const PokemonFetcher = () => {
  const [todosPokemones, setTodosPokemones] = useState([]);
  const [pokemonesMostrados, setPokemonesMostrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [cantidadMostrar, setCantidadMostrar] = useState(20);
  const [modoSorpresa, setModoSorpresa] = useState(false); // ⚠️ nuevo estado

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setCargando(true);
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const data = await res.json();

        const todos = await Promise.allSettled(
          data.results.map(async (p) => {
            try {
              const resPoke = await fetch(p.url);
              if (!resPoke.ok) throw new Error("Falló fetch");
              const dataPoke = await resPoke.json();
              return {
                id: dataPoke.id,
                nombre: dataPoke.name,
                imagen: dataPoke.sprites.other['official-artwork'].front_default,
                shiny: dataPoke.sprites.other['official-artwork'].front_shiny,
                tipos: dataPoke.types.map(t => t.type.name),
                mostrandoShiny: false
              };
            } catch {
              return null;
            }
          })
        );

        const filtrados = todos
          .filter(r => r.status === "fulfilled" && r.value !== null)
          .map(r => r.value)
          .sort((a, b) => a.id - b.id);

        setTodosPokemones(filtrados);
        setPokemonesMostrados(filtrados);
      } catch (err) {
        setError("Error al cargar los Pokémon");
      } finally {
        setCargando(false);
      }
    };

    fetchTodos();
  }, []);

  const toggleShiny = (index) => {
    const actualizados = [...pokemonesFiltrados()];
    const pokeIndex = todosPokemones.findIndex(p => p.id === actualizados[index].id);
    const nuevos = [...todosPokemones];
    nuevos[pokeIndex].mostrandoShiny = !nuevos[pokeIndex].mostrandoShiny;
    setTodosPokemones(nuevos);
  };

  const sorprenderme = () => {
    const mezclados = [...todosPokemones]
      .sort(() => Math.random() - 0.5)
      .slice(0, 20);
    setModoSorpresa(true);
    setCantidadMostrar(20);
    setBusqueda("");
    setTipoSeleccionado("");
    setPokemonesMostrados(mezclados);
  };

  const reiniciarPokedex = () => {
    setModoSorpresa(false);
    setCantidadMostrar(20);
    setBusqueda("");
    setTipoSeleccionado("");
    setPokemonesMostrados(todosPokemones);
  };

  const filtrar = () => {
    return pokemonesMostrados.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (tipoSeleccionado === "" || p.tipos.includes(tipoSeleccionado))
    );
  };

  const pokemonesFiltrados = () => filtrar().slice(0, cantidadMostrar);

  if (cargando) return <div className="pokemon-container">Cargando Pokémon...</div>;
  if (error) return <div className="pokemon-container error">Error: {error}</div>;

  return (
    <div className='pokemon-container'>
      <h1>¡Mi Pokédex!</h1>

      <div className="acciones">
        <button onClick={sorprenderme} className="sorprendeme-button">
          🔁 ¡Sorpréndeme!
        </button>

        {modoSorpresa && (
          <button onClick={reiniciarPokedex} className="reiniciar-button">
            🔄 Reiniciar Pokédex
          </button>
        )}

        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select onChange={(e) => setTipoSeleccionado(e.target.value)} value={tipoSeleccionado}>
          <option value="">Todos los tipos</option>
          {tiposDisponibles.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <h2>Pokédex</h2>

      <div className="pokemon-list">
        {pokemonesFiltrados().map((pokemon, index) => (
          <div key={pokemon.id} className="pokemon-card">
            <img
              src={pokemon.mostrandoShiny ? pokemon.shiny : pokemon.imagen}
              alt={pokemon.nombre}
            />
            <p><strong>N.º {pokemon.id.toString().padStart(4, '0')}</strong></p>
            <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
            <p>
              {pokemon.tipos.map((tipo, i) => (
                <span key={i} className={`tipo-label tipo-${tipo}`}>{tipo}</span>
              ))}
            </p>
            <button
              className="shiny-button"
              onClick={() => toggleShiny(index)}
            >
              {pokemon.mostrandoShiny ? "Ver normal" : "Ver shiny"}
            </button>
          </div>
        ))}
      </div>

      {!modoSorpresa && pokemonesFiltrados().length < filtrar().length && (
        <div className="cargar-mas">
          <button onClick={() => setCantidadMostrar(cantidadMostrar + 20)}>
            Cargar más Pokémon
          </button>
        </div>
      )}
    </div>
  );
};

export default PokemonFetcher;
