import { createContext } from 'react';

/** Значення: { user, isAuthenticated, login, logout }. Наповнює AuthProvider. */
export const AuthContext = createContext(null);
