// import Header from "@/components/Header";
import HeroSection from "@/components/website/tentangkami/HeroSection";
import DonationSection from "@/components/website/tentangkami/DonationSection";
import Footer from "@/components/website/tentangkami/Footer";
// import Navbar from "@/components/tentangkami/Navbar";
import JadwalAdzan from "@/components/website/tentangkami/JadwalAdzan";
import QRInfaqSection from "@/components/website/tentangkami/QRInfaqSection";
import EventSection from "@/components/website/tentangkami/EventSection";

export default function Home() {
  return (
    <div>
      {/* <Header /> */}
      <HeroSection />
      <DonationSection/>
      <QRInfaqSection/>
      <EventSection />
      <JadwalAdzan/>
      <Footer />
      {/* <Navbar /> */}
    </div>
  );
}
