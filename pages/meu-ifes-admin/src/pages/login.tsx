import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { colors } from '../config/theme';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent) => {
  e.preventDefault();
    try {
        const response = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', response.data.access_token);
        navigate('/admin/dashboard');
    } catch {
        setError('Credenciais inválidas');
    }
};

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${colors.greenDark} 0%, ${colors.greenAccent} 100%)`
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border" style={{ borderColor: colors.border }}>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: colors.textDark }}>Meu Ifes Serra</h1>
          <p className="text-sm" style={{ color: colors.textGray }}>Painel Administrativo</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded text-sm text-white" style={{ backgroundColor: colors.red }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textDark }}>Usuário</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2"
              style={{ borderColor: colors.border }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textDark }}>Senha</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2"
              style={{ borderColor: colors.border }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-white font-medium rounded-md transition-colors"
            style={{ backgroundColor: colors.greenDark }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};