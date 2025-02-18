"use client"

import { useState } from 'react';
import axios from 'axios';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import signupStyleCSS from "./signupStyle.css"

const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [renterPassword, setRenterPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const router = useRouter()
    // const pathname = usePathname()
    // const searchParams = useSearchParams() 

    function SignupAPI(event) {
        event.preventDefault();

        if (password !== renterPassword) {
            setError("The passwords do not match");
            return;
        }

        axios.post('https://my-profile-server-one.vercel.app/api/verification', {
            email: email,
        })
        .then(function (vertifyingUser) {
            console.log("Verification code sent:", vertifyingUser.data);
            setIsVerifying(true);
        })
        .catch(function (error) {
            console.error("Error sending verification code:", error);
            setError("An error occurred while sending the verification code");
        });
    }

    function VerifyCodeAPI(event) {
        event.preventDefault();

        axios.post('https://my-profile-server-one.vercel.app/api/signup', {
            email: email,
            password: password,
            verificationCode: verificationCode,
        })
        .then(function (response) {
            console.log("User created successfully:", response.data);
            setEmail("");
            setPassword("");
            setRenterPassword("");
            setVerificationCode("");
            setError("");
            setSuccess("User created successfully!");
            setIsVerifying(false);
            router.push('/login')
            
        })
        .catch(function (error) {
            console.error("Error verifying code:", error);
            console.log(error)
            setError("Invalid verification code", error);
        });
    }

    return (
        <div className="signup-container">
            <h1>Signup</h1>

            <div className="signup-form-cont">
                {!isVerifying ? (
                    <form onSubmit={SignupAPI}>
                        <input
                            type="email"
                            placeholder="Type your email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Type your password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Re-enter your password"
                            onChange={(e) => setRenterPassword(e.target.value)}
                            value={renterPassword}
                            required
                        />
                        <button type="submit">Signup</button>
                    </form>
                ) : (
                    <form onSubmit={VerifyCodeAPI}>
                        <h2>Input Verification Code</h2>
                        <p>A verification code was sent to your email. Copy and paste it below to verify your account</p>
                        <input
                            type="text"
                            placeholder="Verification Code"
                            onChange={(e) => setVerificationCode(e.target.value)}
                            value={verificationCode}
                            required
                        />
                        <button type="submit">Verify Code</button>
                    </form>
                )}
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}
                {success && (
                    <div className="success-message">
                        <p>{success}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignupPage;