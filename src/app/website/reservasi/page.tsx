// import Header from "@/components/Header";
import HeroSection from "@/components/website/reservasi/HeroSection";
import ReservasiSection from "@/components/website/reservasi/ReservasiSection";
import Footer from "@/components/website/reservasi/Footer";
// import Navbar from "@/components/user/reservasi/Navbar";
import ProgramSection from "@/components/website/reservasi/ProgramSection";
import ReservasionCTA from "@/components/website/reservasi/ReservasionCTA";

export default function Home() {
  return (
    <div>
      {/* <Header /> */}
      <HeroSection />
      <ReservasiSection/>
      <ProgramSection/>
      <ReservasionCTA/>
      <Footer />
      {/* <Navbar /> */}
    </div>
  );
}
