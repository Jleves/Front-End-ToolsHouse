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

  return (
    <>
      {token && (
        <div
          className={`flex justify-center items-center gap-2 absolute bottom-6 right-40 border text-black border-black  px-2 rounded-2xl    transition-all favs ${
            isLike ? "bg-red-500" : "bg-white"
          }  p-2 rounded`}
        >
          <button onClick={() => setIsLiked(!isLike)}>
            <FontAwesomeIcon icon={getIconByName("heart")} size="lg" />
          </button>
        </div>
      )}
    </>
  );
};

export default Favs;
