import { UserInfo } from "@documentation-portal/dist/types/user";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserInterface {
  userInfo: UserInfo | undefined;
}

const UserContext = createContext<UserInterface | null>(null);

type UserContextProviderProps = {
  children: React.ReactNode;
};

export function UserProvider({ children }: UserContextProviderProps) {
  const [userInfo, setUserInfo] = useState<
    UserInterface["userInfo"] | undefined
  >();

  async function getUserInfo() {
    try {
      const response = await fetch("/userInformation");
      if (!response.ok) {
        throw new Error("Cannot fetch user info");
      }
      const jsonData = await response.json();
      setUserInfo(jsonData);
    } catch (err) {
      setUserInfo(undefined);
    }
  }

  useEffect(() => {
    getUserInfo().catch(e => e);
  }, []);

  return (
    <UserContext.Provider value={{ userInfo }}>{children}</UserContext.Provider>
  );
}

export const useUser = () => {
  const contextValue = useContext(UserContext);

  if (!contextValue) {
    throw new Error("Please check that your page is wrapped in UserProvider");
  }

  return contextValue;
};
