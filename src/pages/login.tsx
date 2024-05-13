// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";

// Hooks
// import { useAuth } from "@/auth/auth-context";
// import { Link, useNavigate } from 'react-router-dom';

// Styles
// import "../../css/auth.css";
// import plane from "../../assets/maxresdefault.png";
import Link from "next/link";
import { useAuth } from "@/auth/auth-context";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { login } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stayLogged, setStayLogged] = useState(false);

  // const navigate = useNavigate();
  const router = useRouter();

  const mounted = useRef(true);

  const handleStayLogged = () => {
    stayLogged ? setStayLogged(false) : setStayLogged(true);
  };

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      // Try to login with email and password, if stayLogged is true pass on the value to the persistance checker
      // inside AuthContext.js
      await login(emailRef.current.value, passwordRef.current.value, stayLogged);
      // navigate("/");
      router.push("/dashboard");
    } catch (e) {
      // If failed perform useEffect cleanup
      if (mounted.current) {
        console.log(e.message);
        setError("Failed to sign-in");
      }
    }

    // useEffect cleanup
    if (mounted.current) {
      setLoading(false);
    }
  }

  return (
    <article className="flex items-center justify-center w-[100vw] h-[100vh]">
      <fieldset className="border border-solid border-primary px-8 py-6 rounded-xl bg-secondary">
        <form className="form" onSubmit={handleSubmit}>
          <legend className="text-center text-3xl">Login</legend>
          <br />
          <div className="error">{error}</div>
          <br />
          <label htmlFor="email">email</label> <br />
          <input
            className="px-4 flex h-10 w-full rounded-md sm:w-[300px] md:w-[200px] cursor-pointer lg:w-[300px]"
            type="text"
            id="email"
            ref={emailRef}
          />{" "}
          <br />
          <label htmlFor="password">password</label> <br />
          <input
            type="password"
            className="px-4 flex h-10 w-full rounded-md sm:w-[300px] md:w-[200px] cursor-pointer lg:w-[300px]"
            id="password"
            ref={passwordRef}
          />{" "}
          <br />
          <Button type="submit" className="w-full mb-2" disabled={loading}>
            Login
          </Button>
          <br />
          <span>
            <input checked={stayLogged} onChange={handleStayLogged} type="radio" /> Stay logged in?
          </span>
          <br />
          <div>
            <Link href="/forgot-password">Forgot Password?</Link>
          </div>
          <br />
          <div className="">
            Need an account?{" "}
            <Link className="text-primary" href="/sign-up">
              Sign Up
            </Link>
          </div>
        </form>
      </fieldset>
      {/* <img className="paper-plane" src={plane} alt="paper plane" /> */}
    </article>
  );
}
