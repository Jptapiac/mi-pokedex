import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css';

const tiposDisponibles = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

const PokemonFetcher = () => {
  const [todosPokemones, setTodosPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [cantidadMostrar, setCantidadMostrar] = useState(20);
  const [modoSorpresa, setModoSorpresa] = useState(false);
  const [listaSorpresa, setListaSorpresa] = useState([]);

  useEffect(() => {
    const fetchPokemones = async () => {
      try {
        setCargando(true);
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const data = await res.json();

        const detalles = await Promise.allSettled(
          data.results.map(async (p) => {
            const resP = await fetch(p.url);
            const dataP = await resP.json();
            return {
              id: dataP.id,
              nombre: dataP.name,
              imagen: dataP.sprites.other['official-artwork'].front_default,
              shiny: dataP.sprites.other['official-artwork'].front_shiny,
              tipos: dataP.types.map(t => t.type.name),
              mostrandoShiny: false
            };
          })
        );

        const pokemonesCargados = detalles
          .filter(p => p.status === "fulfilled")
          .map(p => p.value);

        setTodosPokemones(pokemonesCargados);
      } catch (e) {
        setError("Error al cargar los Pokémon");
      } finally {
        setCargando(false);
      }
    };

    fetchPokemones();
  }, []);

  const toggleShiny = (id) => {
    if (modoSorpresa) {
      const actualizados = listaSorpresa.map(p =>
        p.id === id ? { ...p, mostrandoShiny: !p.mostrandoShiny } : p
      );
      setListaSorpresa(actualizados);
    } else {
      const actualizados = todosPokemones.map(p =>
        p.id === id ? { ...p, mostrandoShiny: !p.mostrandoShiny } : p
      );
      setTodosPokemones(actualizados);
    }
  };

  const filtrar = (lista) => {
    return lista.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (tipoSeleccionado === "" || p.tipos.includes(tipoSeleccionado))
    );
  };

  const sorprenderme = () => {
    const aleatorios = [...todosPokemones].sort(() => 0.5 - Math.random()).slice(0, 20);
    setListaSorpresa(aleatorios);
    setModoSorpresa(true);
  };

  const reiniciarPokedex = () => {
    setModoSorpresa(false);
    setBusqueda("");
    setTipoSeleccionado("");
    setCantidadMostrar(20);
  };

  const pokemonesAMostrar = modoSorpresa
    ? filtrar(listaSorpresa)
    : filtrar(todosPokemones).slice(0, cantidadMostrar);

  if (cargando) return <div className="pokemon-container">Cargando Pokémon...</div>;
  if (error) return <div className="pokemon-container error">Error: {error}</div>;

  return (
    <div className="pokemon-container">
      <h1>¡Mi Pokédex!</h1>

      <div className="acciones">
        <button onClick={sorprenderme} className="sorprendeme-button">🔁 ¡Sorpréndeme!</button>
        <button onClick={reiniciarPokedex} className="reiniciar-button">🔄 Reiniciar Pokédex</button>

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
        {pokemonesAMostrar.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card">
            <img
              src={pokemon.mostrandoShiny ? pokemon.shiny : pokemon.imagen}
              alt={pokemon.nombre}
            />
            <p><strong>N.º {pokemon.id.toString().padStart(4, '0')}</strong></p>
            <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
            <p>
              {pokemon.tipos.map((tipo, i) => (
                <span key={i} className={`tipo-label tipo-${tipo}`}>
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </span>
              ))}
            </p>
            <button className="shiny-button" onClick={() => toggleShiny(pokemon.id)}>
              {pokemon.mostrandoShiny ? "Ver normal" : "Ver shiny"}
            </button>
          </div>
        ))}
      </div>

      {!modoSorpresa && pokemonesAMostrar.length < filtrar(todosPokemones).length && (
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
