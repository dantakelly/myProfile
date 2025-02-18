"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [debugInfo, setDebugInfo] = useState("")
  const router = useRouter()

  async function handleUserLogin(event) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setDebugInfo("Starting login process...")

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

      setDebugInfo((prev) => `${prev}\nLogin successful. User ID: ${response.data.userId}`)
      setSuccess("User is now logged in!")

      // Store the user ID in localStorage
      localStorage.setItem("userId", response.data.userId)

      // Delay navigation slightly to ensure localStorage is set
      setTimeout(() => {
        setDebugInfo((prev) => `${prev}\nAttempting navigation to dashboard...`)
        router.push(`/dashboard/${response.data.userId}`)
      }, 100)
    } catch (error) {
      console.error("Login error:", error)
      setError(error.response?.data?.error || "An unknown error occurred")
      setDebugInfo((prev) => `${prev}\nLogin failed: ${error.message}`)
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <div className="login-form-cont">
        <form onSubmit={handleUserLogin}>
          <input type="email" placeholder="Type your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <p style={{ color: "blue" }}>{debugInfo}</p>
        </form>
      </div>
    </div>
  )
}

