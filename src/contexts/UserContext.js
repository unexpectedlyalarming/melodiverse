import { createContext } from "react";
import UserContextType from "@/interfaces/UserContextType";

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;