import PropTypes from "prop-types";
import Rating from "./Rating";


const Reseñas = ({ reseñasProp }) => {
 
  const formatDate = (fecha) => {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <h2 className="mb-2 font-semibold text-lg">Reseñas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {reseñasProp.length > 0 ? (
          reseñasProp.map((reseña) => {
          
              return (
                <div
                  key={reseña.id}
                  className="bg-white rounded-lg p-4 shadow-md"
                >
                  <h3 className="text-lg font-semibold">{reseña.reserva_id?.usuarioId
                  ?.nombre} {reseña.reserva_id?.usuarioId
                    ?.apellido}</h3>
                  <Rating rating={reseña.raiting}/>
                  <p className="mt-2">{reseña.comentario}</p>
                  <p className="mt-4 text-sm">{formatDate(reseña.fecha)}</p>
                </div>
              );
            
          })
        ) : (
          <div>No hay reseñas</div>
        )}
      </div>
    </>
  );
};

Reseñas.propTypes = {
  reseñasProp: PropTypes.array.isRequired,
};

export default Reseñas;
