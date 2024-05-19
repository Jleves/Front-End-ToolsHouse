import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

const ListarUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    fetch("https://ec2-54-145-44-94.compute-1.amazonaws.com/User/list", {
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
      await fetch(
        `https://ec2-54-145-44-94.compute-1.amazonaws.com/User/updateRole/${userId}/usuarioRole`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ usuarioRole: newRole }),
        }
      );
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
    <div className="relative overflow-x-hidden shadow-md w-full rounded-lg">
      <table className=" table w-full my-4 ml-8 text-left text-black">
        <thead className=" text-black ">
          <tr>
            <th scope="col" className="py-3 text-left tracking-wider">
              Nombre
            </th>
            <th scope="col" className="py-3 text-left tracking-wider">
              Apellidos
            </th>
            <th scope="col" className="py-3 text-left tracking-wider">
              Email
            </th>
            <th scope="col" className="py-3 text-left tracking-wider">
              Rol
            </th>
            <th scope="col" className="relative py-3">
              <span>Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="">
          {users.length > 0 &&
            users.map((user) => {
              if (user.id !== 1) {
                return (
                  <tr key={user.id}>
                    <td className="py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className=" font-medium text-gray-900">
                            {user.nombre}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <div className=" text-gray-900">{user.apellido}</div>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <div className=" text-gray-900">{user.username}</div>
                    </td>
                    <td className="py-4 whitespace-normal">
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
                    </td>
                    <td>
                      <button
                        type="submit"
                        onClick={() => updateRole(user.id, selectedRole)}
                        className="bg-colorPrimario text-white hover:bg-colorPrimarioHover font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
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
