import { createContext } from "react";
import { UserSchema } from "@org/schemas";

export const UserContext = createContext<UserSchema>(undefined);
