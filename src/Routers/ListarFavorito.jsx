import { useEffect, useState } from "react";
import ProductCard from "../Components/Products";

const ListarFavorito = () => {

  const [user, setUser] = useState([]);
  const [token, setToken] = useState(null);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Aquí tomamos el token que está almacenado en localStorage
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const response = await fetch(`http://localhost:8080/user/profile`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error fetching user data: ${response.status}`);
          }

          const responseData = await response.json();
          setUser(responseData);
          console.log(responseData);

        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.id) { // Verifica que user.id tenga un valor asignado
          const response = await fetch(`http://localhost:8080/user/${user.id}/favs`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Error loading data: ${response.status}`);
          }

          const responseData = await response.json();
          console.log(responseData);

          const productosApiFake = Array.isArray(responseData)
            ? responseData.map((producto) => ({
              id: producto.id,
              nombre: producto.nombre,
              descripcion: producto.descripcion,
              precio: producto.precio,
              categoria: producto.categoria,
              imagenes: producto.imagenes.map((imagen) => imagen.url),

            })) : [];

          setProductos(productosApiFake);

        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, [token]);




  return (
    <div>
      <div className="grid auto-cols-min col-span-1 grid-cols-2 gap-4">
        {productos
          .map((producto) => (
            <div key={producto.id} className="tarjetaProducto transition-all">
              <ProductCard producto={producto} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListarFavorito;
