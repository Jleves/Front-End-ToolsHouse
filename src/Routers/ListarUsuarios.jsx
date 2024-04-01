import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

const ListarUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    fetch("http://localhost:8080/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.log("Error: ", error));
  }, []);

  const handleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const updateRole = async (userId, newRole) => {
    try {
      console.log("userId:", userId);
      console.log("newRole:", newRole);
      await fetch(`http://localhost:8080/user/${userId}/usuarioRole`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuarioRole: newRole }),
      });
      console.log("Update successful!");
      const updatedUsers = users.map((user) => {
        if (user.id === userId) {
          return { ...user, newRole: selectedRole };
        } else {
          return user;
        }
      });
      console.log("updatedUsers:", updatedUsers);
      setUsers(updatedUsers);
      alert(
        `El usuario con ID ${userId} ha sido actualizado con el rol ${newRole}.`
      );
    } catch (error) {
      console.error(error);
      alert(
        `No se puede cambiar el rol del usuario con ID ${userId}. Por favor, revisa los registros del servidor.`
      );
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Usuarios
        </h3>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nombre
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Apellidos
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Rol
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length > 0 &&
            users.map((user) => {
              if (user.id !== 1) {
                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.nombre}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.apellido}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal">
                      <form className="inline-block mr-2">
                        <label htmlFor="roles" className="mr-2">
                          Rol:
                        </label>
                        <select
                          name="roles"
                          value={selectedRole}
                          onChange={handleChange}
                        >
                          <option value="" disabled hidden>
                            {user.usuarioRole}
                          </option>
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </form>
                      <button
                        type="submit"
                        onClick={() => updateRole(user.id, selectedRole)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Update Role
                      </button>
                    </td>
                  </tr>
                );
              }
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ListarUsuarios;
