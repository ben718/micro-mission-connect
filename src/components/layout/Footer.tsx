
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-bleu to-bleu-400 flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-bleu to-bleu-400">
                MicroBénévole
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Plateforme mettant en relation associations et bénévoles pour des micro-missions. Parce que même 15 minutes peuvent faire la différence !
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-bleu transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-bleu transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-bleu transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-bleu transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-600 hover:text-bleu transition-colors">Accueil</Link></li>
              <li><Link to="/missions" className="text-gray-600 hover:text-bleu transition-colors">Trouver une mission</Link></li>
              <li><Link to="/missions/create" className="text-gray-600 hover:text-bleu transition-colors">Proposer une mission</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-bleu transition-colors">À propos</Link></li>
              <li><Link to="/dashboard" className="text-gray-600 hover:text-bleu transition-colors">Tableau de bord</Link></li>
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Informations</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-gray-600 hover:text-bleu transition-colors">Contact</Link></li>
              <li><Link to="/associations" className="text-gray-600 hover:text-bleu transition-colors">Associations</Link></li>
              <li><Link to="/notifications" className="text-gray-600 hover:text-bleu transition-colors">Notifications</Link></li>
              <li><a href="#faq" className="text-gray-600 hover:text-bleu transition-colors">FAQ</a></li>
              <li><a href="#help" className="text-gray-600 hover:text-bleu transition-colors">Comment ça marche</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Légal</h3>
            <ul className="space-y-3">
              <li><a href="#terms" className="text-gray-600 hover:text-bleu transition-colors">Conditions d'utilisation</a></li>
              <li><a href="#privacy" className="text-gray-600 hover:text-bleu transition-colors">Politique de confidentialité</a></li>
              <li><a href="#legal" className="text-gray-600 hover:text-bleu transition-colors">Mentions légales</a></li>
              <li><a href="#cookies" className="text-gray-600 hover:text-bleu transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} MicroBénévole. Tous droits réservés.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8">
              <li className="text-xs text-gray-500">Fait avec ❤️ en France</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
