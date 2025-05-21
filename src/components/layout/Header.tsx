
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="py-4 bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="sr-only">MicroBénévole</span>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-bleu to-bleu-400 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-bleu to-bleu-400">
                  MicroBénévole
                </span>
              </div>
            </a>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="nav-link">
              Accueil
            </a>
            <a href="#" className="nav-link">
              Trouver une mission
            </a>
            <a href="#" className="nav-link">
              Proposer une mission
            </a>
            <a href="#" className="nav-link">
              À propos
            </a>
          </nav>

          {/* Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="rounded-full">
              Se connecter
            </Button>
            <Button className="bg-bleu hover:bg-bleu-700 text-white rounded-full">
              S'inscrire
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-3 animate-fade-in">
            <nav className="flex flex-col space-y-4 py-4">
              <a
                href="/"
                className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </a>
              <a
                href="#"
                className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Trouver une mission
              </a>
              <a
                href="#"
                className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Proposer une mission
              </a>
              <a
                href="#"
                className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                À propos
              </a>
              <div className="pt-2 space-y-3">
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  Se connecter
                </Button>
                <Button
                  className="w-full bg-bleu hover:bg-bleu-700 text-white rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  S'inscrire
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
