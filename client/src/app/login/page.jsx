"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import loginPageCSS from "./loginPage.css"
import axios from "axios"
import { useRouter } from 'next/navigation'


export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const router = useRouter()

  async function handleUserLogin(event) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const response = await axios.post(
        "https://my-profile-server-one.vercel.app/api/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        },
      )

      console.log("User logged in successfully", response.data)
      setEmail("")
      setPassword("")
      setSuccess("User is now logged in!")

      const userId = response.data.userId

      // Add a slight delay before navigation
      setTimeout(() => {
        router.push(`/dashboard/${userId}`)
      }, 100)
    } catch (error) {
      console.error("There is an error", error)

      if (error.response && error.response.data) {
        setError(error.response.data.error || "An error occurred")
      } else {
        setError("An unknown error occurred")
      }
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>

      <div className="login-form-cont">
        <form onSubmit={handleUserLogin}>
          <input
            type="email"
            placeholder="Type your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Type your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit">Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </form>
      </div>
    </div>
  )
}

