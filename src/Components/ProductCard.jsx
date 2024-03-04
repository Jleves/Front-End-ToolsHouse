import PropTypes from "prop-types";
import { Link } from "react-router-dom";
const ProductCard = ({ producto }) => {
  return (
    <div className="card h-full bg-white p-6 rounded-2xl">
      <div className="w-full row align-self-center" style={{ height: "150px" }}>
        <img
          src={producto.imagenes[1]}
          className="h-full w-full"
          alt={producto.nombre}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="flex flex-col gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h5 className="font-semibold text-xl">{producto.nombre}</h5>
            <span className="rounded-full px-4 bg-amber-400 text-sm">
              {producto.categoria}
            </span>
          </div>
          <p className="fs-6  card-text text-secondary">
            {producto.descripcion.substring(0, 100)}
            {producto.descripcion.length > 30 ? "..." : ""}
          </p>
        </div>
        <div className="flex justify-between items-center gap-2">
          <h2 className="font-bold text-2xl text-slate-900">
            ${producto.precio}
          </h2>
          <Link
            to={"/detail/" + producto.id}
            className="bg-amber-400 px-4 py-2 rounded-full hover:bg-amber-300 transition-all"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    categoria: PropTypes.string.isRequired,
    imagenes: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default ProductCard;
