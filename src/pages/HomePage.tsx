
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-vs-blue-primary font-display font-bold text-xl">Voisin Solidaire</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-vs-blue-primary font-medium hover:text-vs-blue-dark">
              Connexion
            </Link>
            <Link to="/signup" className="btn-primary">
              Inscription
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <motion.section 
        className="bg-gray-50 py-12 md:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Le bénévolat accessible à tous
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Aidez près de chez vous, même pour seulement 15 minutes.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link to="/signup" className="btn-primary py-3 px-6 text-center">
              Je deviens bénévole
            </Link>
            <Link to="/signup" className="btn-secondary py-3 px-6 text-center">
              Je suis une association
            </Link>
          </motion.div>
        </div>
      </motion.section>
      
      {/* How It Works Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-center text-gray-900 mb-12">
            Comment ça marche ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-card text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-16 w-16 rounded-full bg-vs-blue-light flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-vs-blue-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Trouvez</h3>
              <p className="text-gray-600">
                Découvrez des missions de bénévolat à moins de 15 minutes de chez vous.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-card text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="h-16 w-16 rounded-full bg-vs-green-light flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-vs-green-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Participez</h3>
              <p className="text-gray-600">
                Inscrivez-vous en 2 clics et aidez pendant le temps que vous avez.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-card text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="h-16 w-16 rounded-full bg-vs-orange-light flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-vs-orange-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Impactez</h3>
              <p className="text-gray-600">
                Voyez l'impact concret de votre engagement sur votre communauté.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Mission Examples Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-center text-gray-900 mb-12">
            Exemples de missions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <motion.div 
              className="bg-white rounded-xl p-4 shadow-card border-l-4 border-vs-orange-accent"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">Distribution alimentaire</h3>
                <span className="badge-orange">15 min</span>
              </div>
              <p className="text-sm text-gray-600">
                Aider à distribuer des repas aux personnes sans-abri
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-4 shadow-card border-l-4 border-vs-green-secondary"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">Lecture aux seniors</h3>
                <span className="badge-green">30 min</span>
              </div>
              <p className="text-sm text-gray-600">
                Lire le journal à des personnes âgées
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-4 shadow-card border-l-4 border-vs-blue-primary"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">Aide aux courses</h3>
                <span className="badge-blue">45 min</span>
              </div>
              <p className="text-sm text-gray-600">
                Accompagner une personne âgée pour ses courses
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Impact Stats Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-card max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold font-display text-center text-gray-900 mb-8">
              Notre impact collectif
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-vs-blue-primary mb-2">5 000+</p>
                <p className="text-sm text-gray-600">Bénévoles</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-vs-green-secondary mb-2">12 000+</p>
                <p className="text-sm text-gray-600">Missions</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-vs-orange-accent mb-2">350+</p>
                <p className="text-sm text-gray-600">Associations</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-center text-gray-900 mb-12">
            Témoignages
          </h2>
          
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-card max-w-3xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <span className="text-gray-600 font-medium">SL</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sophie L.</h3>
                <p className="text-sm text-gray-500">Bénévole depuis 3 mois</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Avec mon emploi du temps chargé, je pensais ne jamais pouvoir faire du bénévolat. Voisin Solidaire m'a permis de m'engager à mon rythme, même pour 15 minutes. C'est incroyable de voir l'impact que ces petits moments peuvent avoir !"
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-vs-blue-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold font-display text-white mb-4"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Prêt à aider ?
          </motion.h2>
          <motion.p 
            className="text-lg text-white opacity-90 mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Rejoignez notre communauté de bénévoles et commencez à aider près de chez vous dès aujourd'hui.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link to="/signup" className="bg-white text-vs-blue-primary hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Je m'inscris
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Voisin Solidaire</h3>
              <p className="text-gray-600 text-sm">
                Le bénévolat accessible à tous
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">À propos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-gray-600 hover:text-vs-blue-primary">Notre mission</Link></li>
                <li><Link to="/team" className="text-gray-600 hover:text-vs-blue-primary">L'équipe</Link></li>
                <li><Link to="/partners" className="text-gray-600 hover:text-vs-blue-primary">Nos partenaires</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/faq" className="text-gray-600 hover:text-vs-blue-primary">FAQ</Link></li>
                <li><Link to="/guide" className="text-gray-600 hover:text-vs-blue-primary">Guide du bénévole</Link></li>
                <li><Link to="/blog" className="text-gray-600 hover:text-vs-blue-primary">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="text-gray-600 hover:text-vs-blue-primary">Nous contacter</Link></li>
                <li><Link to="/support" className="text-gray-600 hover:text-vs-blue-primary">Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Voisin Solidaire. Tous droits réservés.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-vs-blue-primary">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-vs-blue-primary">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-vs-blue-primary">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.413-3.328c.88-.88 2.031-1.297 3.328-1.297s2.448.417 3.328 1.297c.88.88 1.413 2.031 1.413 3.328s-.533 2.448-1.413 3.328c-.88.807-2.031 1.297-3.328 1.297zm7.578-9.934c-.416 0-.807-.171-1.094-.458-.287-.287-.458-.677-.458-1.094 0-.416.171-.807.458-1.094.287-.287.678-.458 1.094-.458.417 0 .808.171 1.095.458.287.287.458.678.458 1.094 0 .417-.171.807-.458 1.094-.287.287-.678.458-1.095.458zm-3.123 2.498c-.954 0-1.83.39-2.498 1.058-.668.668-1.058 1.544-1.058 2.498 0 .954.39 1.83 1.058 2.498.668.668 1.544 1.058 2.498 1.058.954 0 1.83-.39 2.498-1.058.668-.668 1.058-1.544 1.058-2.498 0-.954-.39-1.83-1.058-2.498-.668-.668-1.544-1.058-2.498-1.058z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-vs-blue-primary">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
