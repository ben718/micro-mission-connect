
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'association'>('user');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simuler l'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/app');
    } catch (error) {
      console.error('Signup failed:', error);
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inscription</h1>
        <p className="text-gray-600">Créez votre compte</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Type de compte</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="user"
                checked={role === 'user'}
                onChange={(e) => setRole(e.target.value as 'user')}
                className="mr-2"
              />
              Bénévole
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="association"
                checked={role === 'association'}
                onChange={(e) => setRole(e.target.value as 'association')}
                className="mr-2"
              />
              Association
            </label>
          </div>
        </div>

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

        <div>
          <label className="form-label">Confirmer le mot de passe</label>
          <input
            type="password"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Inscription...' : 'S\'inscrire'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-vs-blue-primary hover:underline">
          Se connecter
        </Link>
      </div>
    </motion.div>
  );
};

export default SignupPage;
