import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "../utilities/icons";

const Favs = () => {
  const [token, setToken] = useState(null);
  const [isLike, setIsLiked] = useState(false);

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
          const response = await fetch(`http://localhost:8080/user/{id}/favs/{herramientaId}`, {
            method: "POST",
          headers: {
              Authorization: `Bearer ${token}`,
            },
          
           
          });

          if (!response.ok) {
            throw new Error(`Error fetching user data: ${response.status}`);
          }

          const responseData = await response.json();
          console.log('respuesta de favoritos'+ responseData  );
        }
      } catch (error) {
        
      }
    };

    fetchData();
  }, [token]);

  


  return (
    <>
      {token && (
        <div
          className={`flex justify-center items-center gap-2 absolute bottom-6 right-40 border text-black border-black  px-2 rounded-2xl    transition-all favs ${
            isLike ? "bg-red-500" : "bg-white"
          }  p-2 rounded`}
        >
          <button onClick={() => setIsLiked(!isLike)}>
            <FontAwesomeIcon icon={getIconByName("heart")} size="xl" />
          </button>
        </div>
      )}
    </>
  );
};

export default Favs;
