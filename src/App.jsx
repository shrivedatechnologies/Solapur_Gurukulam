import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AppRoutes />
  );
}

export default App;