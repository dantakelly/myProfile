import Image from "next/image";
import Link from "next/link";
import headlineStyle from "./headlineStyle.css"

export default function Headline() { 

    return(<>
        <div id="headline-msster-cont">
            <div id="headlinePage">
                <div className="headline-img">
                    <Image src="https://c.pxhere.com/photos/44/99/young_woman_portrait_beautiful_happy_face_smile-1323792.jpg!d" width={999} height={999} alt="woman"></Image>
                </div>
                <div className="the-text-socials-headline">
                <div className="headline-title-and-text">
                    <h1>Hello, My name is <span style={{color: 'pink'}}>myProfile</span></h1>
                    <p>myProfile is a versatile app designed to help you share your story with the world in a seamless and engaging way. Whether you want to showcase your personal journey, highlight your skills and achievements, or simply connect with like-minded individuals, myProfile provides an intuitive platform to express yourself. With customizable profiles, interactive features, and easy sharing options, the app makes it effortless to present a well-rounded digital identity. Whether you're an artist, entrepreneur, or just someone looking to share their passions, myProfile offers a space where you can truly be yourself. <Link style={{color: 'pink'}} href="/login"><span style={{fontWeight: '900'}} className="span-for-headline-p">create your own profile</span></Link></p>
                </div>
                <div className="hr-line-headline"></div>
                <div className="socials-headline">
                    <Link href="#"> <h3>Instagram</h3> </Link>
                    <Link href="#"> <h3>Tiktok</h3> </Link>
                </div>
               </div>
            </div>
        </div>
    </>)
}