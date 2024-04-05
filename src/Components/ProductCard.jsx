import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const ProductCard = ({ producto }) => {
  return (
    <Link to={"/detail/" + producto.id}>
      <div className="card h-full border-2 border-transparent bg-white hover:border-slate-200 transition-all p-6 rounded-2xl">
        <div
          className="w-full row align-self-center"
          style={{ height: "150px" }}
        >
          <img
            src={producto.imagenes[0]}
            className="h-full w-full"
            alt={producto.nombre}
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="flex flex-col gap-2 justify-between">
          <div>
            <div className="flex items-center gap-2 my-2">
              <div className="flex items-center gap-2">
                <h5 className="font-semibold text-xl">{producto.nombre}</h5>
                {producto.raiting ? <Rating rating={producto.raiting} /> : ""}
              </div>
            </div>
            <div className="my-2">
              <span className=" rounded-full px-4 bg-black text-colorClaro text-md">
                {producto.categoria.titulo}
              </span>
            </div>

            <p className="fs-6 card-text text-secondary">
              {producto.descripcion.substring(0, 100)}
              {producto.descripcion.length > 30 ? "..." : ""}
            </p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <h2 className="font-bold text-2xl text-slate-900">
              ${producto.precio}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    categoria: PropTypes.shape({
      titulo: PropTypes.string.isRequired,
    }).isRequired,
    imagenes: PropTypes.arrayOf(PropTypes.string).isRequired,
    raiting: PropTypes.number.isRequired,
  }),
};

export default ProductCard;
