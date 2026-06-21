import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";
import { fetchFavouriteIds } from "./store/favouriteSlice";

import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
}

export default App;
