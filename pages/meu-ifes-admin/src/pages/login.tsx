import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { colors } from '../config/theme';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      
      if (response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        navigate('/admin/noticias');
      } else {
        setError('Resposta inválida do servidor.');
      }
    } catch (err: unknown) {
      // Exibe a mensagem de erro que vem da API ou uma mensagem amigável de erro de conexão
      const error = err as {
        response?: {
          data?: { message?: string };
          status?: number;
        };
      };

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401 || error.response?.status === 400) {
        setError('Usuário ou senha incorretos.');
      } else {
        setError('Não foi possível conectar ao servidor backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
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
          <div className="mb-4 p-3 rounded text-sm text-white font-medium text-center" style={{ backgroundColor: colors.red }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textDark }}>Usuário</label>
            <input
              type="text"
              required
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 disabled:bg-gray-100"
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
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 disabled:bg-gray-100"
              style={{ borderColor: colors.border }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-white font-medium rounded-md transition-colors flex justify-center items-center hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: colors.greenDark }}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Entrando...</span>
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};