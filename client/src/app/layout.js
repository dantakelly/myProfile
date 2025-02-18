import globalCSS from "./globals.css"
import Header from "@/components/headerComponent/header";

export const metadata = {
  title: "myProfile",
  description: "Create your own profile page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Header />
        {children}
      </body>
    </html>
  );
}
