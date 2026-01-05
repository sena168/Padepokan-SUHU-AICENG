import { useState } from 'react';
import { LoginModal } from '@/components/LoginModal';
import { CircuitButton } from '@/components/CircuitButton';
import { ScrollContainer } from '@/components/ScrollContainer';
import suhuImage from '@/assets/suhuaiceng.jpg';

const Index = () => {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background circuit-trace relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 px-8">
          <h1 className="text-2xl md:text-3xl font-serif text-foreground text-center">
            Padepokan SUHU AICENG
          </h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="max-w-4xl w-full text-center">
            {/* Master Image */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/30 rounded-full blur-2xl scale-110" />
                <img
                  src={suhuImage}
                  alt="SUHU AICENG"
                  className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-secondary/50 shadow-2xl"
                />
              </div>
            </div>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Menenun Sutra Digital: Menguasai Aliran AI dengan Langkah Nyata
            </p>

            {/* Digital Scroll */}
            <ScrollContainer className="max-w-2xl mx-auto">
              <div className="text-center py-4">
                <h2 className="text-xl md:text-2xl font-serif mb-4">
                  Selamat Datang, Calon Murid
                </h2>
                <p className="leading-relaxed mb-6">
                  Di Padepokan ini, kita tidak berbicara tentang mimpi. 
                  Kita membangun dengan langkah nyata. Setiap jurus yang 
                  diajarkan adalah hasil dari latihan dan pengalaman.
                </p>
                <p className="text-sm text-deep-purple/70">
                  Masuki Padepokan untuk memulai perjalananmu.
                </p>
              </div>
            </ScrollContainer>

            {/* CTA */}
            <div className="mt-10">
              <CircuitButton
                onClick={() => setLoginOpen(true)}
                className="text-lg px-10 py-4"
              >
                Masuk Padepokan
              </CircuitButton>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-8 text-center">
          <p className="text-muted-foreground text-sm">
            Padepokan SUHU AICENG - Menenun Sutra Digital
          </p>
        </footer>
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
};

export default Index;
