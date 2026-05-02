import React, { useState, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, ShieldCheck, RefreshCw, ChevronLeft } from "lucide-react";
import "../components/AuthPage.css";

const Auth = () => {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState("signIn");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("email", email);
      // Explicitly set the provider ID as defined in convex/ResendOTP.ts
      await signIn("resend-otp", formData);
      setStep({ email });
    } catch (err) {
      setError("Failed to send code. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("email", step.email);
      formData.append("code", code);
      await signIn("resend-otp", formData);
    } catch (err) {
      setError("Invalid code. Please check and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card glass-panel"
      >
        <div className="auth-header">
          <div className="auth-logo">
            <ShieldCheck size={32} className="logo-icon" />
          </div>
          <h1>Skill2Earn X</h1>
          <p>The Future of Talent Matching</p>
        </div>

        <AnimatePresence mode="wait">
          {step === "signIn" ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="auth-step"
            >
              <div className="step-title">
                <h2>Welcome Back</h2>
                <p>Enter your email to receive a verification code</p>
              </div>

              <form onSubmit={handleSendCode} className="auth-form">
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input"
                  />
                </div>

                {error && <div className="auth-error">{error}</div>}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="auth-button primary"
                >
                  {isLoading ? (
                    <RefreshCw className="spin" size={20} />
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="code-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="auth-step"
            >
              <button 
                onClick={() => setStep("signIn")}
                className="back-button"
              >
                <ChevronLeft size={16} />
                Back to email
              </button>

              <div className="step-title">
                <h2>Verify Email</h2>
                <p>We've sent a 6-digit code to <strong>{typeof step === 'object' ? step.email : ''}</strong></p>
              </div>

              <form onSubmit={handleVerifyCode} className="auth-form">
                <div className="input-wrapper">
                  <ShieldCheck className="input-icon" size={20} />
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    maxLength={6}
                    className="auth-input code-input"
                  />
                </div>

                {error && <div className="auth-error">{error}</div>}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="auth-button primary"
                >
                  {isLoading ? (
                    <RefreshCw className="spin" size={20} />
                  ) : (
                    "Continue to Dashboard"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="auth-footer">
          <p>By continuing, you agree to our Terms of Service</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
