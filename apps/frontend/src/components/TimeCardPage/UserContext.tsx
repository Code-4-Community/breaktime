import { createContext } from "react";
import { UserSchema } from "src/shared-schemas";

export const UserContext = createContext<UserSchema>(undefined);
