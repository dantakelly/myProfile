import express from "express";
import prisma from "./prisma.js";
import 'dotenv/config';
import bcrypt from "bcrypt";
import cors from "cors";
import generateRandomString from "./passwordGenerator.js";
import SendMailToUser from "./email.js";
import multer from 'multer';
import { put } from '@vercel/blob';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 8080;
app.use(cookieParser());
const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', "https://my-profile-client.vercel.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Headers'],
    credentials: true,
}));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the myProfile Server!" });
});

// Verification Code Section
app.post("/api/verification", async (req, res) => {
    const { email } = req.body;
    const verificationCode = generateRandomString(7);

    try {
        const createVerificationCode = await prisma.temporaryData.create({
            data: {
                email: email,
                verificationcode: verificationCode,
            }
        });

        await SendMailToUser(email, verificationCode);

        res.status(201).json({ message: "Verification code sent successfully" });
    } catch (error) {
        console.error("Backend Error from verification API", error);
        res.status(500).json({ error: "Internal server error", details: error });
    }
});

// Verify Code and Create User
app.post("/api/signup", async (req, res) => {
    const { email, password, verificationcode } = req.body;

    try {
        const findEmailToVerify = await prisma.temporaryData.findFirst({
            where: { 
                email: email,
                verificationcode: verificationcode,
             }
        });

        if (findEmailToVerify) {
            const hashedPassword = await bcrypt.hash(password, 15);
            const newUser = await prisma.user.create({
                data: {
                    email: email,
                    password: hashedPassword,
                }
            });

            const newProfile = await prisma.profile.create({
                data: {
                    userId: newUser.id,
                    profileImage: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", 
                    name: "Type Your Name Here", 
                    aboutMe: "Write a story about yourself, your journey, your achievements, etc...", 
                    instagramHandle: "#",
                    tiktokHandle: "#",
                }
            });
            console.log("Profile created successfully:", newProfile);

            // await prisma.temporaryData.delete({
            //     where: { id: findEmailToVerify.id }
            // });

            res.status(201).json({ message: "User created successfully!" });
        } else {
            res.status(400).json({ error: "Invalid verification code" });
        }
    } catch (error) {
        console.error("Backend Error from signup API", error);
        res.status(500).json({ error: "Internal server error", details: error });
    }
});

// Login API

app.post("/api/login", async (req, res) => { 
    const {email, password} = req.body; 

    try{ 
        const loginUser = await prisma.user.findUnique({
            where: { 
                email: email,
            }
        })
        if(loginUser && await bcrypt.compare(password, loginUser.password)) {

            // res.cookie('userId', loginUser.id, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production', 
            //     sameSite: 'lax',
            //     maxAge: 7 * 24 * 60 * 60 * 1000
            // });

            res.status(200).json({ message: "User is logged in successfully!", userId: loginUser.id})
             
        } else { 
            res.status(400).json({error: "Invalid email or password"})
        }
    } catch(error) {
        console.error("Backend error at login", error)
        res.status(500).json({message: "There is a backend error, responded with 500:", error})
    }
})
//

// logout api 
app.post("/api/logout", (req, res) => {
    res.clearCookie('userId', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ message: "Logged out successfully" });
});


// Profile Section Below 
// app.post("/api/profile", upload.single('file'), async (req, res) => { 
    
//     const {name, aboutMe, instagramHandle, tiktokHandle, userId} = req.body; 
//     const profileImage = req.file; 

//     let imageUrl = null
//     if (profileImage) {
//       const blob = await put(profileImage.originalname, profileImage.buffer, {
//         access: "public",
//         token: process.env.BLOB_READ_WRITE_TOKEN,
//       })
//       imageUrl = blob.url
//     }

//     try{ 
//         const creatProfile = await prisma.profile.create({ 
//             data: { 
//                 profileImage: imageUrl, 
//                 name: name, 
//                 aboutMe: aboutMe,
//                 instagramHandle: instagramHandle,
//                 tiktokHandle: tiktokHandle, 

//                 user: { 
//                     connect: { id: userId}
//                 }
//             }
//         })
//         res.status(200).json({message: "User info has been sent to the database successfully"})


//     } catch(error) {
//         res.status(500).json({message: "There is an error in the backend", error}); 
//         console.error("Error uploading to Vercel Blob:", error)
//     }
// })


// Get Profile 
app.get("/api/getprofile/:userId", async (req, res) => { 
    const { userId } = req.params; // Extract userId from the request parameters

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: userId },
        });

        if (profile) {
            res.status(200).json(profile);
        } else {
            res.status(404).json({ error: "Profile not found" });
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update Profile
app.put("/api/updateprofile/:userId", upload.single('file'), async (req, res) => {
    const { userId } = req.params;
    const { name, aboutMe, instagramHandle, tiktokHandle } = req.body;
    const profileImage = req.file ? req.file : null;

    let imageUrl = null
    if (profileImage) {
      const blob = await put(profileImage.originalname, profileImage.buffer, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      imageUrl = blob.url
    }

    try {
        const updatedProfile = await prisma.profile.update({
            where: { userId: userId },
            data: {
                name: name,
                aboutMe: aboutMe,
                instagramHandle: instagramHandle,
                tiktokHandle: tiktokHandle,
                profileImage: imageUrl, 
            },
        });
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error", error});
    }
});


app.listen(PORT, () => {
    console.log(`This server is running on port http://localhost:${PORT}`);
});