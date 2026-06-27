import React from 'react';
import AppRouter from './routes/AppRouter.jsx';

/**
 * The Root App Component
 * 
 * Notice how clean this is. Its only responsibility is to mount the 
 * application router. All layout and routing logic is delegated to the router.
 */
const App = () => {
  return <AppRouter />;
};

export default App;
