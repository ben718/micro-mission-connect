import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-vs-blue-primary font-display font-bold text-xl">Voisin Solidaire</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/how-it-works" className="text-gray-700 hover:text-vs-blue-primary font-medium">
              Comment ça marche
            </Link>
            <Link to="/testimonials" className="text-gray-700 hover:text-vs-blue-primary font-medium">
              Témoignages
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-vs-blue-primary font-medium">
              FAQ
            </Link>
          </nav>
          
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
        className="bg-gradient-to-br from-vs-blue-light to-white py-12 md:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Le bénévolat accessible à tous
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-700 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Aidez en <span className="font-semibold text-vs-orange-accent">15 minutes</span> près de chez vous. 
                Trouvez des missions de micro-bénévolat qui correspondent à votre emploi du temps.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Link to="/signup" className="btn-primary py-3 px-6 text-center">
                  Commencer maintenant
                </Link>
                <Link to="/how-it-works" className="btn-secondary py-3 px-6 text-center">
                  Comment ça marche
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-card p-4 md:ml-8">
                <img 
                  src="/images/hero-illustration.svg" 
                  alt="Voisin Solidaire - Micro-bénévolat" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-center text-gray-900 mb-12">
            Pourquoi choisir Voisin Solidaire ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="card p-6 flex flex-col items-center text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-vs-orange-light p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-vs-orange-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">15 minutes minimum</h3>
              <p className="text-gray-600">
                Des missions ultra-courtes qui s'adaptent à votre emploi du temps chargé.
              </p>
            </motion.div>
            
            <motion.div 
              className="card p-6 flex flex-col items-center text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="bg-vs-blue-light p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-vs-blue-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{'<'} 15 minutes de trajet</h3>
              <p className="text-gray-600">
                Des missions de proximité géolocalisées pour agir près de chez vous.
              </p>
            </motion.div>
            
            <motion.div 
              className="card p-6 flex flex-col items-center text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="bg-vs-green-light p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-vs-green-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Impact immédiat</h3>
              <p className="text-gray-600">
                Des actions concrètes avec des résultats visibles et mesurables.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-center text-gray-900 mb-12">
            Comment ça marche ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-vs-blue-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inscrivez-vous</h3>
              <p className="text-gray-600">
                Créez votre compte en quelques secondes et définissez vos préférences.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="bg-vs-blue-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trouvez une mission</h3>
              <p className="text-gray-600">
                Explorez les missions disponibles près de chez vous et filtrez selon vos critères.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="bg-vs-blue-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Participez</h3>
              <p className="text-gray-600">
                Inscrivez-vous à la mission en un clic et recevez toutes les informations nécessaires.
              </p>
            </motion.div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/signup" className="btn-primary py-3 px-6">
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-center text-gray-900 mb-12">
            Ce que disent nos bénévoles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="card p-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-medium">ML</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Marie L.</h3>
                  <p className="text-sm text-gray-500">Bénévole depuis 3 mois</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Avec mon emploi du temps chargé, je pensais ne jamais pouvoir faire du bénévolat. Voisin Solidaire m'a permis de m'engager à mon rythme, même pour 15 minutes !"
              </p>
            </motion.div>
            
            <motion.div 
              className="card p-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-medium">TD</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Thomas D.</h3>
                  <p className="text-sm text-gray-500">Bénévole depuis 6 mois</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "J'ai aidé une personne âgée à porter ses courses en rentrant du travail. Ça m'a pris 15 minutes et ça a fait une vraie différence pour elle. C'est ça, l'impact immédiat !"
              </p>
            </motion.div>
            
            <motion.div 
              className="card p-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-medium">SB</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sophie B.</h3>
                  <p className="text-sm text-gray-500">Bénévole depuis 2 mois</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "La géolocalisation est géniale ! Je ne fais que des missions à moins de 10 minutes de chez moi. C'est pratique et ça me permet d'aider ma communauté locale."
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-vs-blue-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold font-display text-white mb-6"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Prêt à aider près de chez vous ?
          </motion.h2>
          <motion.p 
            className="text-lg text-white opacity-90 mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Rejoignez notre communauté de bénévoles et commencez à faire la différence, même avec seulement 15 minutes de votre temps.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link to="/signup" className="bg-white text-vs-blue-primary hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              S'inscrire gratuitement
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-display font-bold text-xl mb-4">Voisin Solidaire</h3>
              <p className="text-gray-400 mb-4">
                Le bénévolat accessible à tous, même pour seulement 15 minutes.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">À propos</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">Notre mission</Link></li>
                <li><Link to="/team" className="text-gray-400 hover:text-white">Notre équipe</Link></li>
                <li><Link to="/partners" className="text-gray-400 hover:text-white">Nos partenaires</Link></li>
                <li><Link to="/press" className="text-gray-400 hover:text-white">Presse</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Ressources</h4>
              <ul className="space-y-2">
                <li><Link to="/how-it-works" className="text-gray-400 hover:text-white">Comment ça marche</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link to="/testimonials" className="text-gray-400 hover:text-white">Témoignages</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Légal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Conditions d'utilisation</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Politique de confidentialité</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white">Politique de cookies</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Voisin Solidaire. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
