
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/app');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
        <p className="text-gray-600">Connectez-vous à votre compte</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Adresse e-mail</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Pas encore de compte ?{' '}
        <Link to="/signup" className="text-vs-blue-primary hover:underline">
          S'inscrire
        </Link>
      </div>
    </motion.div>
  );
};

export default LoginPage;
