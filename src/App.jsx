import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import AppLayout from "./pages/AppLayout";
import Form from "./components/Form";
import CityList from "./components/CityList";
import City from "./components/City";
import { CityProvider } from "./contexts/CitiesContext";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    path: "/app",

    children: [
      {
        index: true,
        element: <Navigate replace to={"cities"} />,
      },
      {
        element: <CityList />,
        path: "cities",
      },
      {
        element: <City />,
        path: "cities/:id",
      },

      {
        element: <Form />,
        path: "form",
      },
    ],
  },
]);

function App() {
  return (
    <CityProvider>
      <RouterProvider router={router} />;
    </CityProvider>
  );
}

export default App;
