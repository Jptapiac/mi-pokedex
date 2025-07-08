import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css';

const tiposDisponibles = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

const PokemonFetcher = () => {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [cantidadMostrar, setCantidadMostrar] = useState(20);
  const [modalPokemon, setModalPokemon] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setCargando(true);
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const data = await res.json();

        const detalles = await Promise.allSettled(
          data.results.map(async (p) => {
            const resPoke = await fetch(p.url);
            const dataPoke = await resPoke.json();
            return {
              id: dataPoke.id,
              nombre: dataPoke.name,
              imagen: dataPoke.sprites.other['official-artwork'].front_default,
              shiny: dataPoke.sprites.other['official-artwork'].front_shiny,
              tipos: dataPoke.types.map(t => t.type.name),
              altura: dataPoke.height / 10,
              peso: dataPoke.weight / 10,
              habilidades: dataPoke.abilities.map(h => h.ability.name),
              generos: dataPoke.name === 'nidoran-f' ? ['♀'] : dataPoke.name === 'nidoran-m' ? ['♂'] : ['♂', '♀'],
              mostrandoShiny: false
            };
          })
        );

        const final = detalles.filter(d => d.status === "fulfilled").map(d => d.value);
        setPokemones(final);
      } catch {
        setError("Error al cargar los Pokémon");
      } finally {
        setCargando(false);
      }
    };

    fetchTodos();
  }, []);

  const toggleShiny = (index) => {
    const actualizados = [...pokemones];
    actualizados[index].mostrandoShiny = !actualizados[index].mostrandoShiny;
    setPokemones(actualizados);
  };

  const sorprenderme = () => {
    const mezclados = [...pokemones].sort(() => Math.random() - 0.5);
    setBusqueda("");
    setTipoSeleccionado("");
    setCantidadMostrar(20);
    setPokemones(mezclados);
  };

  const reiniciar = () => {
    setBusqueda("");
    setTipoSeleccionado("");
    setCantidadMostrar(20);
    setPokemones([...pokemones].sort((a, b) => a.id - b.id));
  };

  const filtrar = () => {
    return pokemones.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (tipoSeleccionado === "" || p.tipos.includes(tipoSeleccionado))
    );
  };

  const pokemonesFiltrados = filtrar().slice(0, cantidadMostrar);

  if (cargando) return <div className="pokemon-container">Cargando Pokémon...</div>;
  if (error) return <div className="pokemon-container error">Error: {error}</div>;

  return (
    <div className="pokemon-container">
      <h1>¡Mi Pokédex!</h1>
      <div className="acciones">
        <button onClick={sorprenderme} className="sorprendeme-button">🔁 ¡Sorpréndeme!</button>
        <button onClick={reiniciar} className="reiniciar-button">🔄 Reiniciar Pokédex</button>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={tipoSeleccionado} onChange={(e) => setTipoSeleccionado(e.target.value)}>
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
        {pokemonesFiltrados.map((pokemon, index) => (
          <div key={pokemon.id} className="pokemon-card" onClick={() => setModalPokemon(pokemon)}>
            <img src={pokemon.mostrandoShiny ? pokemon.shiny : pokemon.imagen} alt={pokemon.nombre} />
            <p><strong>N.º {pokemon.id.toString().padStart(4, '0')}</strong></p>
            <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
            <p>
              {pokemon.tipos.map((tipo, i) => (
                <span key={i} className={`tipo-label tipo-${tipo}`}>{tipo}</span>
              ))}
            </p>
            <button
              className="shiny-button"
              onClick={(e) => {
                e.stopPropagation();
                toggleShiny(index);
              }}
            >
              {pokemon.mostrandoShiny ? "Ver normal" : "Ver shiny"}
            </button>
          </div>
        ))}
      </div>

      {pokemonesFiltrados.length < filtrar().length && (
        <div className="cargar-mas">
          <button onClick={() => setCantidadMostrar(cantidadMostrar + 20)}>Cargar más Pokémon</button>
        </div>
      )}

      {modalPokemon && (
        <div className="modal" onClick={() => setModalPokemon(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalPokemon.nombre}</h2>
            <img src={modalPokemon.imagen} alt="normal" />
            <img src={modalPokemon.shiny} alt="shiny" style={{ maxWidth: '100px' }} />
            <p><strong>ID:</strong> {modalPokemon.id}</p>
            <p><strong>Tipos:</strong> {modalPokemon.tipos.join(', ')}</p>
            <p><strong>Altura:</strong> {modalPokemon.altura} m</p>
            <p><strong>Peso:</strong> {modalPokemon.peso} kg</p>
            <p><strong>Habilidades:</strong> {modalPokemon.habilidades.join(', ')}</p>
            <p><strong>Géneros:</strong> {modalPokemon.generos.join(', ')}</p>
            <button onClick={() => setModalPokemon(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonFetcher;
