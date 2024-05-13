import { AuthProvider, useAuth } from "@/auth/auth-context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PrivateRoute from "@/auth/private-route";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PrivateRoute>
        <Component {...pageProps} />
      </PrivateRoute>
    </AuthProvider>
  );
}
