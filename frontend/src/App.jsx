import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import AvisoPrivacidad from "./pages/AvisoPrivacidad";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/registro"
          element={<Registro />}
        />

        <Route
          path="/aviso-privacidad"
          element={<AvisoPrivacidad />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
