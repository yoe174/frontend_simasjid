// import Header from "@/components/Header";
import HeroSection from "@/components/website/beranda/HeroSection";
import FeatureSection from "@/components/website/beranda/FeatureSection";
import EventsSection from "@/components/website/beranda/EventsSection";
import MapSection from "@/components/website/beranda/MapSection";
import JadwalAdzan from "@/components/website/beranda/JadwalAdzan";
import Footer from "@/components/website/beranda/Footer";


export default function Home() {
  return (
    <div>
      {/* <Header /> */}
      <HeroSection />
      <FeatureSection />
      <EventsSection />
      <MapSection />
      <JadwalAdzan />
      <Footer />
      
    </div>
  );
}
