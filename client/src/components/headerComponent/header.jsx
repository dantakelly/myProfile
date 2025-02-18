"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import headerStyleCss from "./headerStyle.css";
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useParams } from "next/navigation";

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const isDashboard = pathname.startsWith("/dashboard")
  const [showDashboardButton, setShowDashboardButton] = useState(false)

  useEffect(() => {
    const authToken = Cookies.get("authToken")
    setShowDashboardButton(authToken && pathname === "/" && pathname.startsWith("/profile/"))
  }, [pathname])

  const activeStyle = {
    backgroundColor: "var(--textColor)",
    color: "white",
  }

  const handleLogout = () => {
    Cookies.remove("authToken")
    router.push("/")
  }

  return (
    <div id="Header">
      <div className="header-content">
        <ul>
          {isDashboard ? (
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          ) : showDashboardButton ? (
            <li>
              <Link href={`/dashboard/${Cookies.get("authToken")}`}>
                <button>Dashboard</button>
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link href="/login">
                  <button style={pathname === "/login" ? activeStyle : {}}>Login</button>
                </Link>
              </li>
              <li>
                <Link href="/signup">
                  <button style={pathname === "/signup" ? activeStyle : {}}>Create Your Profile</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}
