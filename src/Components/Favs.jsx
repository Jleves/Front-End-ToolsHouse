import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "../utilities/icons";

const Favs = () => {
  const [token, setToken] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();
  const [user, setUser] = useState([]);

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
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    // Aquí tomamos el token que está almacenado en localStorage
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleToggleFavorite = async () => {
    try {
      if (token) {
        // Realiza la solicitud al servidor para agregar/quitar el elemento de favoritos
        const response = await fetch(
          `http://localhost:8080/User/${user.id}/favs/${id}`,
          {
            method: isFavorite ? "DELETE" : "POST", // Alternar entre DELETE y POST
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

        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      {token && (
        <div
          className={`flex justify-center items-center gap-2 absolute bottom-6 right-40 border text-black border-black px-2 rounded-2xl transition-all favs ${
            isFavorite ? "bg-red-500 text-white" : "bg-white"
          } p-2 rounded`}
        >
          <button onClick={handleToggleFavorite}>
            <FontAwesomeIcon icon={getIconByName("heart")} size="lg" />
          </button>
        </div>
      )}
    </>
  );
};

export default Favs;
