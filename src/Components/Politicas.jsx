import PropTypes from "prop-types";

const Politicas = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white p-8 rounded-lg w-4/5 max-w-xl overflow-y-h max-h-90 mt-14">
        <h2 className="text-2xl font-bold mb-4 underline decoration-solid">
          Políticas de Reserva
        </h2>
        <ul className="mb-4 flex flex-col gap-2">
          <li>
            <strong>1. Reservas:</strong> Las reservas solo se pueden hacer en
            línea, requieren un registro en nuestra plataforma y deben
            realizarse con al menos 24 horas de anticipación.
          </li>
          <li>
            <strong>2. Disponibilidad:</strong> La disponibilidad de las
            herramientas está sujeta a cambios y puede variar según la demanda y
            la disponibilidad del inventario.
          </li>
          <li>
            <strong>3. Depósito de Seguridad:</strong> Se requiere un depósito
            de seguridad reembolsable. El monto se reembolsará al devolver la
            herramienta en buenas condiciones.
          </li>
          <li>
            <strong>4.Uso Responsable:</strong> Cualquier daño causado por un
            uso inadecuado o negligente será responsabilidad del cliente y
            podría resultar en cargos adicionales.
          </li>
        </ul>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className=" bg-colorPrimario w-full mt-4 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

Politicas.propTypes = {
  onClose: PropTypes.number.isRequired,
};

export default Politicas;
