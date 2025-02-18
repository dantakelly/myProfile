"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import loginPageCSS from "./loginPage.css"
import axios from "axios"
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';

export default function Login() {

    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const router = useRouter();


    function handleUserLogin(event) { 
        event.preventDefault();

        axios.post('https://my-profile-server-one.vercel.app/api/login', { 
            email: email,
            password: password,
        })
        .then(function (response) { 
            console.log("user created sucessfully", response.data)
            setEmail("")
            setPassword("")
            setSuccess("User is now logged in!")

            // to get the user id 
            const userId = response.data.userId; 

            // Cookie setup 
            Cookies.set("authToken", userId, { expires: 7 })

            router.push(`/dashboard/${userId}`)
        })
        .catch(function (error) { 
            console.error("there is an error", error)

            if (error.response && error.response.data) {
                setError(error.response.data.error || "An error occurred");
            } else {
                setError("An unknown error occurred");
            }
            
        })
    }

    return(<>
        <div className="login-container">
            <h1>Login</h1>

            <div className="login-form-cont">
                <form onSubmit={handleUserLogin}>
                    <input type="email" 
                           placeholder="type your email"
                           value={email}
                           onChange={(event) => setEmail(event.target.value)}

                      ></input>
                    <input type="password" 
                           placeholder="type your password"
                           value={password}
                           onChange={(event) => setPassword(event.target.value)}
                    ></input>
                    <button type="submit">Login</button>
                    <p style={{color: 'red'}}>{error}</p>
                    <p style={{color: 'blue'}}>{success}</p>
                </form>
            </div>
        </div>
    </>)
}