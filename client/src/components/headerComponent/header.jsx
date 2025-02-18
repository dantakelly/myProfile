"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import headerStyleCss from "./headerStyle.css";
import axios from "axios";
import { useState } from "react";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter(); 
    const isDashboard = pathname.startsWith("/dashboard");

    const activeStyle = { 
        backgroundColor: 'var(--textColor)',
        color: "white"
    }

    const logoutFunction = () => {
        axios.post('http://localhost:8080/api/logout', {
            
        }, {
            withCredentials: true, 
        })
        .then(function (responce) { 
            console.log("Logging out", responce.data)
            router.push("/"); 
        })
        .catch(function (error) { 
            console.log("There is an error logging out", error); 
        })
    }

    return (
        <div id="Header">
            <div className="header-content">
                <ul>
                    {isDashboard ? (
                        <li>
                            <button 
                                onClick={logoutFunction}
                                className="logout-button">
                                Logout
                              </button> 
                        </li>
                    ) : (
                        <>
                            <li> <Link href="/login"><button style={pathname === "/login" ? activeStyle : {}}>Login</button></Link> </li>
                            <li> <Link href="/signup"><button style={pathname === "/signup" ? activeStyle : {}}>Create Your Profile</button></Link> </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}
