import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import type { UserRoles } from "@/interfaces/user";

const useUserState = () => {
  const { data: userSession } = useSession();
  const [userRole, setUserRole] = useState<UserRoles>("user");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);

  useEffect(() => {
    if (userSession) {
      if (userSession?.user?.roles?.includes("admin")) {
        setUserRole("admin");
        setIsAdmin(true);
      } else {
        setUserRole("user");
        setIsUser(true);
      }
    }
  }, [userSession]);

  return {
    userRole,
    isAdmin,
    isUser,
    userSession,
  };
};

export default useUserState;
