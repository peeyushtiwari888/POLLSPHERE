import React from 'react';
import LoginForm from '../components/auth/LoginForm';

/**
 * Login Page Container
 * 
 * This page serves purely as an assembly container for the authentication flow.
 * Following the separation of concerns, it contains zero business logic, 
 * routing, or state management. All of that is elegantly handled within 
 * the LoginForm and its custom hooks.
 */
const Login = () => {
  return (
    <main>
      <LoginForm />
    </main>
  );
};

export default Login;
