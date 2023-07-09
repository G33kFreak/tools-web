import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppRoutes } from "./routes/AppRoutes";
import { Main } from "./pages/Main";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoutes.MAIN} element={<Main />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
