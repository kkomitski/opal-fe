// @ts-nocheck
import React, { useRef, useState } from "react";
import { useAuth } from "@/auth/auth-context";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/auth/firebase-config";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const { signup } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const { push } = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      // await signup(emailRef.current.value, passwordRef.current.value);
      signup(emailRef.current.value, passwordRef.current.value).then((credentials) => {
        setDoc(doc(db, "users", credentials.user.email), {
          uid: credentials.user.uid,
          email: credentials.user.email,
          createdAt: serverTimestamp(),
          "company-name": "Company Name",
          invoiceIDsCounter: 0,
          "bussines-number": "",
          postcode: "",
          street: "",
          country: "",
        });
      });

      push("/dashboard");
    } catch (e) {
      console.log(e.message);
      setError("Failed to create account");
    }

    setLoading(false);
  }

  return (
    <article className="flex justify-center items-center h-[100vh] w-[100vw]">
      <fieldset className="field">
        <form className="form" onSubmit={(e) => handleSubmit(e)}>
          <legend className="auth-title">Sign Up</legend>
          <br />
          <div className="error">{error}</div>
          {/* {JSON.stringify(currentUser)} */}
          <br />
          <label htmlFor="email">email</label> <br />
          <input type="text" className="text-background" id="email" ref={emailRef} /> <br />
          <label htmlFor="password">password</label> <br />
          <input type="password" className="text-background" id="password" ref={passwordRef} /> <br />
          <label htmlFor="email">confirm password</label> <br />
          <input type="password" className="text-background" id="password-confirm" ref={passwordConfirmRef} /> <br />
          <button className="btn" disabled={loading}>
            Sign Up
          </button>
          <br />
          <div className="w-100 text-center mt-2">
            Already have an account? <Link href="../login">Log In</Link>
          </div>
        </form>
      </fieldset>
      {/* <img className="paper-plane" src={plane} alt="paper plane" /> */}
    </article>
  );
}
