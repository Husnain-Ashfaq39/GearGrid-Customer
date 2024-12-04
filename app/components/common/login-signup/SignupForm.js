"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios'; // Add axios for making API requests

const SignupForm = () => {
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must be 15 characters or less")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        console.log("Form Data", values);
        // Register the user using the new API
        const response = await axios.post(`${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/api/auth/register`, {
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
        console.log(response.data);
        // Handle successful registration
        alert(response.data.message); // Show success message

      } catch (error) {
        console.error("Registration error:", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Error data:", error.response.data);
          console.error("Error status:", error.response.status);
          console.error("Error headers:", error.response.headers);
          setErrors({ submit: error.response.data.message || "Registration failed" });
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
          setErrors({ submit: "No response from server. Please try again." });
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
          setErrors({ submit: "An unexpected error occurred. Please try again." });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row">
        {/* Username Field */}
        <div className="col-lg-6">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={`form-control ${
                formik.touched.username && formik.errors.username
                  ? "is-invalid"
                  : ""
              }`}
              placeholder="Username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="invalid-feedback">{formik.errors.username}</div>
            ) : null}
          </div>
        </div>

        {/* Email Field */}
        <div className="col-lg-12">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control ${
                formik.touched.email && formik.errors.email
                  ? "is-invalid"
                  : ""
              }`}
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="invalid-feedback">{formik.errors.email}</div>
            ) : null}
          </div>
        </div>

        {/* Password Field */}
        <div className="col-lg-6">
          <div className="form-group mb20">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-control ${
                formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
              }`}
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="invalid-feedback">{formik.errors.password}</div>
            ) : null}
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="col-lg-6">
          <div className="form-group mb20">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`form-control ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "is-invalid"
                  : ""
              }`}
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="invalid-feedback">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Display submission errors */}
      {formik.errors.submit && (
        <div className="error-message">{formik.errors.submit}</div>
      )}

      <button
        type="submit"
        className="btn btn-signup btn-thm mb0"
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignupForm;
