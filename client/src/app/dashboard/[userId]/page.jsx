"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import headlineStyle from "@/components/headlineHome/headlineStyle.css"
import dashboardStyle from "../dashboardStyle.css"

export default function Dashboard() {
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [name, setName] = useState("")
  const [aboutMe, setAboutMe] = useState("")
  const [instagramHandle, setInstagramHandle] = useState("")
  const [tiktokHandle, setTiktokHandle] = useState("")
  const [loading, setLoading] = useState(true)

  const nameRef = useRef(null)
  const aboutMeRef = useRef(null)

  const router = useRouter()
  const params = useParams()
  const userId = params.userId

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://my-profile-server-one.vercel.app/api/getprofile/${userId}`)
        const profileData = response.data

        setImagePreview(profileData.profileImage)
        setName(profileData.name)
        setAboutMe(profileData.aboutMe)
        setInstagramHandle(profileData.instagramHandle)
        setTiktokHandle(profileData.tiktokHandle)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  useEffect(() => {
    if (nameRef.current) nameRef.current.textContent = name
    if (aboutMeRef.current) aboutMeRef.current.textContent = aboutMe
  }, [name, aboutMe])

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      setImagePreview(URL.createObjectURL(file))

      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await axios.put(`https://my-profile-server-one.vercel.app/api/updateprofile/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        if (response.data.profileImage) {
          setImagePreview(response.data.profileImage)
        }
        console.log("Image updated successfully", response.data)
      } catch (error) {
        console.error("Error updating image:", error)
      }
    }
  }

  const updateProfile = async (field, value) => {
    try {
      const formData = new FormData()
      formData.append(field, value)

      const response = await axios.put(`https://my-profile-server-one.vercel.app/api/updateprofile/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log(`${field} updated successfully`, response.data)
    } catch (error) {
      console.error(`Error updating ${field}:`, error)
    }
  }

  const handleNameChange = () => {
    const newName = nameRef.current.textContent
    setName(newName)
    updateProfile("name", newName)
  }

  const handleAboutMeChange = () => {
    const newAboutMe = aboutMeRef.current.textContent
    setAboutMe(newAboutMe)
    updateProfile("aboutMe", newAboutMe)
  }

  const handleSocialChange = (field, value) => {
    if (field === "instagramHandle") {
      setInstagramHandle(value)
    } else if (field === "tiktokHandle") {
      setTiktokHandle(value)
    }
    updateProfile(field, value)
  }

  // This is to share public profile 
  const publicProfileUrl = `${window.location.origin}/profile/${userId}`


  return (
    <div id="headline-master-cont">
      <div id="headlinePage">
        <div className="headline-img">
          <label>
            <Image
              src={
                imagePreview || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="Profile Image"
              width={999}
              height={999}
              style={{ cursor: "pointer" }}
              onError={(e) =>
                (e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
              }
            />
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
          </label>
        </div>
        <div className="the-text-socials-headline">
          <div className="headline-title-and-text">
            <h1
              ref={nameRef}
              contentEditable={true}
              onBlur={handleNameChange}
              style={{ cursor: "pointer", color: "pink" }}
              suppressContentEditableWarning={true}
            >
              {loading ? "loading content" : name}
            </h1>
            <p
              ref={aboutMeRef}
              contentEditable={true}
              onBlur={handleAboutMeChange}
              style={{ cursor: "pointer" }}
              suppressContentEditableWarning={true}
            >
              {loading ? "loading content" : aboutMe}
            </p>
          </div>
          <div className="hr-line-headline"></div>
          <div className="socials-headline">
            <input className="input-handle"
              type="text"
              value={instagramHandle}
              onChange={(e) => handleSocialChange("instagramHandle", e.target.value)}
              placeholder="Instagram handle"
              style={{padding: "10px 10px", borderRadius: "6px", marginTop: "20px", border: "pink 2px solid", outline: "none"}}
            />
            <input className="input-handle"
              type="text"
              value={tiktokHandle}
              onChange={(e) => handleSocialChange("tiktokHandle", e.target.value)}
              placeholder="TikTok handle"
              style={{padding: "10px 10px", borderRadius: "6px", marginTop: "20px", border: "pink 2px solid", outline: "none"}}
            />

            <button
              onClick={() => {
                navigator.clipboard.writeText(publicProfileUrl)
                alert("Link copied!")
              }}
              >
                Share Your Profile
             </button>
          </div>
        </div>
      </div>

      {/* <div className="share-your-profile">
            <p>Share your profile:</p>
            <input type="text" value={publicProfileUrl} readOnly style={{ padding: "5px" }} />
            <button
              onClick={() => {
                navigator.clipboard.writeText(publicProfileUrl)
                alert("Link copied!")
              }}
            >
              Copy Link
          </button>
        </div> */}
    </div>
  )
}

