import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./components/Login";
import Registro from "./pages/Registro";
import AvisoPrivacidad from "./pages/AvisoPrivacidad";
import Dashboard from './components/Dashboard';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
