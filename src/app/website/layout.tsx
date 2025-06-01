import "@/css/website.css";
import Navbar from "@/components/website/Navbar";
// import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-100 text-gray-900">
        {/* Navbar di atas */}
        <Navbar />
        {/* <Footer /> */}
        {/* Konten dengan padding atas 80px (h-20) */}
        <main className="container mx-auto ">{children}</main>
      </body>
    </html>
  );
}
