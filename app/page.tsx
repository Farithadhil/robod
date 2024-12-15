"use client";

import React from "react"; 
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);

  // Validation schema for login
  const loginSchema = Yup.object({
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  // Validation schema for signup
  const signupSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: isSignup ? signupSchema : loginSchema,
    onSubmit: async (values) => {
      if (isSignup) {
        try {
          const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });
        
          if (!response.ok) {
            // Handle non-2xx HTTP status codes
            const errorText = await response.text(); // Read as text in case it's HTML
            console.error("Signup error:", errorText);
            alert("An error occurred during signup. Please try again.");
            return;
          }
        
          const data = await response.json(); // Now parse JSON safely
          alert("Signup successful");
          setIsSignup(false);
        } catch (error) {
          console.error("Signup fetch error:", error);
          alert("An unexpected error occurred");
        }
      } else {
        try {
          const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });

          if (res?.error) {
            alert(res.error);
          } else {
            alert("Login successful!");
            // Redirect user if needed (optional)
            window.location.href = "/dashboard";
          }
        } catch (err) {
          console.error("Error during login:", err);
          alert("An unexpected error occurred. Please try again.");
        }
      }
    },
  });

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {isSignup && (
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border p-2 w-full"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>
        )}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border p-2 w-full"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border p-2 w-full"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>
      <button
        onClick={() => setIsSignup(!isSignup)}
        className="mt-4 text-blue-500 w-full"
      >
        {isSignup ? "Already have an account? Login" : "Create an account"}
      </button>
    </div>
  );
}
