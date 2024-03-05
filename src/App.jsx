// import 'bootstrap/dist/css/bootstrap.min.css';
import "animate.css/animate.min.css";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
<<<<<<< Updated upstream
import Home from "./Routers/Home";
import Detail from "./Routers/Detail";
import Admin from "./Routers/Admin";
import ListarProductos from "./Routers/ListarProductos";
import AgregarProductos from "./Routers/AgregarProductos";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ListarUsuarios from "./Routers/ListarUsuarios";
import Resgistro from "./Routers/Registro";
import ListarCategorias from "./Routers/ListarCategorias";
import AgregarCategoria from "./Routers/AgregarCategoria";
=======
import Home from './Routers/Home';
import Detail from './Routers/Detail';
import Admin from './Routers/Admin';
import ListarProductos from './Routers/ListarProductos';
import AgregarProductos from './Routers/AgregarProductos';
import Header from './Components/Header';
import Footer from './Components/Footer';
import ListarUsuarios from './Routers/ListarUsuarios';
import Resgistro from './Routers/Registro';
import ListarCategorias from './Routers/ListarCategorias';
import AgregarCategoria from './Routers/AgregarCategoria';
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Routers/Login';

>>>>>>> Stashed changes

function App() {
  return (
    <div
      className="pt-16 flex flex-col min-h-screen"
      style={{ backgroundColor: "FFF9E1" }}
    >
      <Header />
      <Routes>
<<<<<<< Updated upstream
        <Route path="/" element={<Home />}></Route>
        <Route path="/registro" element={<Resgistro />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate replace to="productos/listar" />} />
          <Route path="productos/listar" element={<ListarProductos />} />
          <Route path="productos/agregar" element={<AgregarProductos />} />
          <Route path="productos/agregar/:id" element={<AgregarProductos />} />
          <Route path="usuarios/listar" element={<ListarUsuarios />} />
          <Route path="categorias/listar" element={<ListarCategorias />} />
          <Route path="categorias/agregar" element={<AgregarCategoria />} />
          <Route path="categorias/agregar/:id" element={<AgregarCategoria />} />
        </Route>
        <Route path="*" element={<h1>Page not found - Error 404</h1>} />
=======
          <Route path='/' element={<Home/>}></Route>
          <Route path='/registro' element={<Resgistro/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/detail/:id' element={<Detail/>}/>
          <Route path='/admin' element={<Admin/>}>
            <Route index element={<Navigate replace to="listar-productos" />} />
            <Route path='listar-productos' element={<ListarProductos/>}/>
            <Route path='agregar-producto' element={<AgregarProductos/>}/>
            <Route path='agregar-producto/:id' element={<AgregarProductos/>}/>
            <Route path='listar-usuarios' element={<ListarUsuarios/>}/>
            <Route path='listar-categorias' element={<ListarCategorias/>}/>
            <Route path='agregar-categoria' element={<AgregarCategoria/>}/>
            <Route path='agregar-categoria/:id' element={<AgregarCategoria/>}/>
          </Route>
          <Route path='*' element={<h1>Page not found - Error 404</h1>}/>
>>>>>>> Stashed changes
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
