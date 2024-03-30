import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

const Products = ({ selectedCategory }) => {
  const [productos, setProductos] = useState([]);
  const [start, setStart] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/Herramientas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw Error("Error loading data");

        const responseData = await response.json();

        const resenas = await fetchResenas();
        const productosApiFake = Array.isArray(responseData)
          ? responseData.map((producto) => ({
              id: producto.id,
              nombre: producto.nombre,
              descripcion: producto.descripcion,
              precio: producto.precio,
              categoria: producto.categoria,
              imagenes: producto.imagenes.map((imagen) => imagen.url),
              rating: getToolRating(producto.id, resenas)
            }))
          : [];

        const ordenRandom = getRandomOrder(productosApiFake);
  
        setProductos(ordenRandom);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
    
  }, []);


  const fetchResenas = async () => {
    try {
      const response = await fetch("http://localhost:8080/Reseñas");
      if (!response.ok) {
        throw new Error("Error al obtener las reseñas");
      }
      const data = await response.json();

      return data;

    } catch (error) {
      console.error("Error al obtener las reseñas:", error);
    }
  };

  const getToolRating = (idHerramienta, resenas) => {


    const resenasPorHerramienta = resenas.filter(resena => resena.herramienta_idReseña?.id === Number(idHerramienta))
    const count = resenasPorHerramienta.length
    let sumaRating = 0

    if(count === 0) {
      return sumaRating;
    }

    resenasPorHerramienta.map(resena => {
      sumaRating += resena?.raiting || 0;
    })

    if(sumaRating === 0) {
      return 0;
    }
    const rating = sumaRating / count;
    

    return rating
  }

  const getRandomOrder = (array) => {
    return array.reduce((result, currentValue) => {
      const insertIndex = Math.round(Math.random() * result.length);
      return [].concat([
        ...result.slice(0, insertIndex),
        currentValue,
        ...result.slice(insertIndex),
      ]);
    }, []);
  };

  useEffect(() => {
    setStart((currentPage - 1) * pageSize);
  }, [currentPage]);

  const handleNextClick = () => {
    setCurrentPage((currentPage) =>
      Math.min(currentPage + 1, Math.ceil(productos.length / pageSize))
    );
  };

  const handlePrevClick = () => {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {productos
          .filter((producto) => !selectedCategory || producto.categoria.titulo === selectedCategory)
          .map((producto) => (
            <div key={producto.id} className="tarjetaProducto transition-all">
              <ProductCard producto={producto} />
            </div>
          ))}
      </div>
      <div className="flex justify-center items-center mt-5 space-x-4">
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className={`bg-colorSecundario text-white px-4 py-2 rounded-md ${
            currentPage === 1 ? "opacity-60" : ""
          }`}
        >
          <span aria-hidden="true">&laquo;</span>
        </button>
  
        <button className="bg-colorSecundario text-white px-4 py-2 rounded-md">
          <u>{currentPage}</u>
        </button>
  
        <button
          onClick={handleNextClick}
          disabled={currentPage === Math.ceil(productos.length / pageSize)}
          className={`bg-colorSecundario text-white px-4 py-2 rounded-md ${
            currentPage === Math.ceil(productos.length / pageSize)
              ? "opacity-60"
              : ""
          }`}
        >
          <span aria-hidden="true">&raquo;</span>
        </button>
      </div>
    </div>
  );
};

export default Products;
