import { createContext } from "react";

export const UserContext = createContext({
  user: { isLoggedIn: false, name: "", email: "" },
  login: async () => false,
  logout: async () => {},
});
