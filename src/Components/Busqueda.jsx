import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");
const fechaActual = `${year}-${month}-${day}`;

const Busqueda = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [startDate, setStartDate] = useState(fechaActual);
  const [endDate, setEndDate] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (searchQuery.trim() === "") return;

    let url;
    if (endDate === "") {
      // Si el usuario no selecciona fecha final, hacer busqueda normal
      url = `http://localhost:8080/Herramientas/buscar/nombre/${searchQuery}`;
    } else {
      // Si el usuario selecciona fecha final, buscar por fecha tambien
      url = `http://localhost:8080/Herramientas/buscar/${searchQuery}/${startDate}/${endDate}`;
    }

    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        const dataFinal = Array.isArray(data) ? data : [data];
        const dataFinalConUrls = dataFinal.map((producto) => {
          return {
            ...producto,
          };
        });

        setSearchResults(dataFinalConUrls);
        setShowResults(true);
      } else {
        toast.error(`No se encontraron herramientas disponibles`);
        setSearchResults(null);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleInputBlur = (event) => {
    if (event.target.id !== "default-search") {
      setShowResults(false);
    }
  };
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    setShowResults(false);
  };

  return (
    <div>
      <form
        className="w-4/5 md:w-1/2 flex items-center mx-auto mb-6 relative"
        onSubmit={handleFormSubmit}
      >
        {/* Campo de búsqueda */}
        <div className="relative w-1/2">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-50">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="relative z-40 w-full px-6 py-[.8em] pl-10 text-sm text-gray-900 border border-r-0 border-gray-300 rounded-l-full bg-gray-50"
            placeholder="Qué estás buscando?"
            autoComplete="off"
            value={searchQuery}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            required
          />
        </div>

        {/* Campos de entrada de fecha */}
        <div className="my-4 grid grid-cols-3 w-1/2 z-40">
          <input
            type="date"
            id="start-date"
            className="px-2 z-50 py-2 border border-gray-300 bg-gray-50 border-r-0"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={fechaActual}
          />
          <input
            type="date"
            id="end-date"
            className="px-2 z-50 py-2 border border-gray-300 bg-gray-50 rounded-r-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            placeholder="01/01/2000"
          />
          <div className="flex justify-center w-full md:w-auto">
            <button
              type="submit"
              className="z-50 text-colorClaro bg-colorPrimario hover:bg-colorPrimarioHover focus:ring-4 focus:outline-none font-medium rounded-full text-sm px-6 py-1.5 transition-all"
            >
              Buscar
            </button>
          </div>
          {showResults && ( // Render search results only when showResults state is true
            <div className="absolute left-0 top-[8px] pt-12 pb-4 pl-4 w-full rounded-xl bg-[#e4e2d7]">
              {searchResults ? (
                <ul>
                  {searchResults.map((item) => (
                    <Link key={item.id} to={"/detail/" + item.id}>
                      <li className="w-[4em] flex items-center gap-2">
                        <img src={item.imagenes[0].url} alt={item.nombre} />
                        <p> {item.nombre}</p>
                      </li>
                    </Link>
                  ))}
                </ul>
              ) : (
                <p>No se encontraron resultados.</p>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Busqueda;
