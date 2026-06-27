import { useContext } from 'react';
import { SocketContext } from '../socket/SocketProvider';

/**
 * Custom Hook: useSocket
 * 
 * A clean, reusable hook to consume the global Socket.io instance anywhere in the app 
 * without needing to import Context and useContext manually in every file.
 * 
 * @returns {import('socket.io-client').Socket} The globally shared socket instance
 * @throws {Error} If the hook is used outside of a SocketProvider tree
 */
const useSocket = () => {
  const context = useContext(SocketContext);

  // Throw a highly descriptive error if a developer tries to use this hook
  // in a component that isn't wrapped by the <SocketProvider>
  if (context === undefined || context === null) {
    throw new Error(
      'useSocket must be used within a <SocketProvider>. ' +
      'Please ensure you have wrapped your application or component tree in <SocketProvider>.'
    );
  }

  return context;
};

export default useSocket;
