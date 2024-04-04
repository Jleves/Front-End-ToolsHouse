import { useEffect, useState } from "react";

const ListarFavorito = () => {
  const [user, setUser] = useState([]);
  const [token, setToken] = useState(null);
  const [productos, setProductos] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

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
          const response = await fetch(`http://localhost:8080/User/profile`, {
            method: "GET",
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
    const fetchFavoritos = async () => {
      try {
        if (user.id) {
          const response = await fetch(
            `http://localhost:8080/User/${user.id}/favs`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              `Error loading favorite products: ${response.status}`
            );
          }

          const responseData = await response.json();
          setProductos(responseData);
        }
      } catch (error) {
        console.error("Error loading favorite products:", error);
      }
    };

    if (Object.keys(user).length > 0) {
      fetchFavoritos();
    }
  }, [user]);

  const handleToggleFavorite = async (id) => {
    try {
      if (token) {
        // Realiza la solicitud al servidor para agregar/quitar el elemento de favoritos
        const response = await fetch(
          `http://localhost:8080/User/${user.id}/favs/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching user data: ${response.status}`);
        }

        const responseData = await response;
        console.log("respuesta de favoritos", responseData);

        setProductos((prevProductos) =>
          prevProductos.filter((producto) => producto.id !== id)
        );

        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="text-gray-600 body-font bg-[#fffdf3] h-screen">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -m-2">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Favoritos
            </h1>
          </div>
          {productos.length === 0 ? (
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              No favorite products found.
            </p>
          ) : (
            productos.map((producto) => (
              <div key={producto.id} className="p-2 lg:w-1/3 md:w-1/2 w-full ">
                <div className="h-full flex items-center  bg-[#fff] p-4 rounded-lg shadow-md">
                  <img
                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                    src={producto.imagenes[0].url}
                    alt={producto.nombre}
                  />
                  <div className="flex-grow">
                    <p className="rounded-full px-4 bg-colorSecundario text-colorClaro text-sm max-w-min">
                      {producto.categoria.titulo}
                    </p>
                    <h2 className="text-gray-900 title-font font-medium">
                      {producto.nombre}
                    </h2>
                    <p className="text-gray-500 ">$ {producto.precio}</p>
                    <button
                      onClick={() => handleToggleFavorite(producto.id)}
                      className="flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash3-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ListarFavorito;
