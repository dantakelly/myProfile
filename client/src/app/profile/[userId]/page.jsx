"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import headlineStyle from "@/components/headlineHome/headlineStyle.css"

export default function PublicProfile() {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  const params = useParams()
  const userId = params.userId

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://my-profile-server-one.vercel.app/api/getprofile/${userId}`)
        setProfileData(response.data)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  if (loading) return <p>Loading profile...</p>
  if (!profileData) return <p>Profile not found</p>

  return (
      <div id="headline-master-cont">
        <div id="headlinePage">
          <div className="headline-img">
            <Image
              src={profileData.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              alt="Profile Image"
              width={150}
              height={150}
              style={{ borderRadius: "50%" }}
            />          
          </div>
          <div className="the-text-socials-headline">
            <div className="headline-title-and-text">
              <h1 style={{color: "pink"}}>{profileData.name}</h1>
              <p>{profileData.aboutMe}</p>
            </div>
            <div className="hr-line-headline"></div>
            <div className="socials-headline">
              {profileData.instagramHandle && (
                <p>
                  Instagram: 
                  <span 
                    onClick={() => {
                      navigator.clipboard.writeText(profileData.instagramHandle)
                      alert("Instagram handle copied!")
                    }} 
                    style={{ cursor: "pointer", color: "pink", textDecoration: "underline" }}
                  >
                    @{profileData.instagramHandle}
                  </span>
                </p>
              )}

              {profileData.tiktokHandle && (
                <p>
                  TikTok: 
                  <span 
                    onClick={() => {
                      navigator.clipboard.writeText(profileData.tiktokHandle)
                      alert("TikTok handle copied!")
                    }} 
                    style={{ cursor: "pointer", color: "pink", textDecoration: "underline" }}
                  >
                    @{profileData.tiktokHandle}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  