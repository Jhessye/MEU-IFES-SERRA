import React from 'react';
import { colors } from '../config/theme';

const navigate = (path: string) => {
  window.location.href = path;
};

export const Layout: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r flex flex-col" style={{ backgroundColor: colors.white, borderColor: colors.border }}>
        <div 
          className="p-5 text-white font-bold text-lg"
          style={{ background: `linear-gradient(90deg, ${colors.greenDark}, ${colors.greenAccent})` }}
        >
          Meu Ifes Serra
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/admin/noticias" className="block p-2.5 rounded hover:bg-gray-100 font-medium" style={{ color: colors.textDark }}>
            📰 Notícias
          </a>
          <a href="/admin/editais" className="block p-2.5 rounded hover:bg-gray-100 font-medium" style={{ color: colors.textDark }}>
            📜 Editais
          </a>
          <a href="/admin/oportunidades" className="block p-2.5 rounded hover:bg-gray-100 font-medium" style={{ color: colors.textDark }}>
            💼 Oportunidades
          </a>
          <a href="/admin/usuarios-admin" className="block p-2.5 rounded hover:bg-gray-100 font-medium" style={{ color: colors.textDark }}>
            👤 Administradores
          </a>
        </nav>
        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 text-left rounded text-sm font-medium hover:bg-red-50"
            style={{ color: colors.red }}
          >
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
      </main>
    </div>
  );
};