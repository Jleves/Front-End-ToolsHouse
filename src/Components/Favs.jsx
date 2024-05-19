import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const Favs = () => {
  const [token, setToken] = useState(null);
  const { id } = useParams(); 
  const [user, setUser] = useState([]);
  const [isFavorite, setIsFavorite] = useState(() => {
    const favs = JSON.parse(localStorage.getItem("favs")) || [];
    return favs.includes(id); 
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const response = await fetch(`https://ec2-54-145-44-94.compute-1.amazonaws.com/User/profile`, {
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
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isFavorite", JSON.stringify(isFavorite));
  }, [isFavorite]);

  const handleToggleFavorite = async () => {
    try {
      if (token) {
        const url = `https://ec2-54.-145-44-94compute-1.amazonaws.com/User/${user.id}/favs/${id}`;
        const method = isFavorite ? "DELETE" : "POST";
  
        const response = await fetch(url, {
          method: method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error toggling favorite: ${response.status}`);
        }
  
        // Define the favs variable by retrieving the current favorites from localStorage
        let favs = JSON.parse(localStorage.getItem("favs")) || [];
  
        if (isFavorite) {
          // Remove the product ID from the array if it's currently a favorite
          favs = favs.filter(favId => favId !== id);
          toast.error("Producto eliminado de favoritos");
        } else {
          // Add the product ID to the array if it's not currently a favorite
          favs.push(id);
          toast("Producto agregado a favoritos!", {
            classNames: {
              actionButton: "!bg-colorPrimario",
            },
            action: {
              label: "Ver Favoritos",
              onClick: () => location.assign("/ListarFavoritos"),
            },
          });
        }
  
        // Update the favorites in localStorage with the modified array
        localStorage.setItem("favs", JSON.stringify(favs));
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <>
      {token && (
        <div
          className={`border text-black px-2 rounded-xl transition-all favs p-2`}
        >
          <button
            onClick={handleToggleFavorite}
            className="flex justify-center items-center gap-2"
          >
            {isFavorite ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-heart-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-heart"
                viewBox="0 0 16 16"
              >
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
            )}
            <span className="underline">Guardar</span>
          </button>
        </div>
      )}
    </>
  );
};

export default Favs;
