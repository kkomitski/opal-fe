import { useAuth } from "@/auth/auth-context";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PrivateRoute({ children }: any) {
  console.log("private");
  const router = useRouter();

  const { checkUser } = useAuth();

  useEffect(() => {
    if (window) {
      const currentUser = checkUser(window);

      if (!currentUser && router.asPath !== "/signup") {
        router.push("/login");
      }
    }
  }, []);

  return children;
}
