import { useState } from "react";
import { Link } from "react-router-dom";

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
const day = String(currentDate.getDate()).padStart(2, '0');
const fechaActual = `${year}-${month}-${day}`;


const Busqueda = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [startDate, setStartDate] = useState(fechaActual);
  const [endDate, setEndDate] = useState('');

 


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (searchQuery.trim() === "") return;

    try {
      const response = await fetch(
    
        `http://localhost:8080/Herramientas/buscar/${searchQuery}/${startDate}/${endDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(Array.isArray(data) ? data : [data]);
        setShowResults(true); // Show results when fetched
        console.log(data);
      } else {
        console.error("Failed to fetch search results");
        setSearchResults(null); // Reset search results on fetch failure
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  

  const handleInputBlur = (event) => {
    if (event.target.id !== 'default-search') {
      setShowResults(false); 
  };
  }
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    setShowResults(false);
  };

  const handleInputFocus = () => {
    if (searchQuery.trim() === "" ) {
      setShowResults(true); 
  };
}

  return (
    <div className="relative">
      <form
        className="w-4/5 md:w-1/2 mx-auto mb-6"
        onSubmit={handleFormSubmit}
      >
        {/* Campo de búsqueda */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
            className="relative z-40 w-full px-6 py-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:border-colorPrimario"
            placeholder="Qué estás buscando?"
            autoComplete="off"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus} // Show results when input is focused
            onBlur={handleInputBlur} 
            required
          />
        </div>

        {/* Campos de entrada de fecha */}
        <div className="my-4 grid grid-cols-3 gap-4">
          <input
            type="date"
            id="start-date"
            className="px-2 py-2 border border-gray-300 rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={fechaActual}
          />
          <input
            type="date"
            id="end-date"
            className="px-2 py-2 border border-gray-300 rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
          />
          <div className="flex justify-center ">
            <button
              type="submit"
              className="text-colorClaro bg-colorPrimario px-6 py-2  rounded-md hover:bg-colorPrimarioHover focus:ring-4 focus:outline-none"
              >
              Buscar
            </button>
          </div>
          
        </div>

        
        
      </form>

      {/* Mostrar resultados */}
      {showResults && (
        <div className="absolute top-full pt-2 pb-4 pl-4 w-full rounded-xl bg-[#e4e2d7]">
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
  );

};

export default Busqueda;
