import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ProfilePreview from '@/components/ProfilePreview';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <ProfilePreview />
      <CTASection />
      <Footer />
    </div>
  );
}