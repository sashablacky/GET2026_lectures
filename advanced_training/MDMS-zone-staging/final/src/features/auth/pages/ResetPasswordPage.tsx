import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function ResetPasswordPage() {
  const [done, setDone] = useState(false);

  return done ? (
    <AuthLayout title="Password updated">
      <p className="auth-message">
        Your password has been changed. You can now log in with your new
        password.
      </p>
      <Link
        to="/login"
        className="auth-btn"
        style={{
          display: "block",
          textAlign: "center",
          textDecoration: "none",
        }}
      >
        Go to Login
      </Link>
    </AuthLayout>
  ) : (
    <AuthLayout
      title="Reset password"
      subtitle="Choose a new password for your account"
    >
      <ResetPasswordForm onDone={() => setDone(true)} />
    </AuthLayout>
  );
}
