import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { colors } from '../config/theme';

interface UsuarioCompleto {
  id: string;
  recebeNotificacaoNoticia: boolean;
  recebeNotificacaoEdital: boolean;
  recebeNotificacaoOportunidade: boolean;
  editais_salvos: { id: string; titulo: string }[];
  oportunidades_salvas: { id: string; titulo: string }[];
}

export const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioCompleto[]>([]);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const res = await api.get('/usuario/');
        if (active) {
          setUsuarios(res.data);
        }
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.textDark }}>
            Usuários do Aplicativo
          </h1>
          <p className="text-xs" style={{ color: colors.textGray }}>
            Visualização de preferências de notificação e itens salvos pelos usuários.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border" style={{ borderColor: colors.border }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50" style={{ borderColor: colors.border }}>
              <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>ID do Usuário</th>
              <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>Notificações Ativas</th>
              <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>Editais Salvos</th>
              <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>Oportunidades Salvas</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-sm" style={{ color: colors.textGray }}>
                  Nenhum usuário registrado no sistema.
                </td>
              </tr>
            ) : (
              usuarios.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50" style={{ borderColor: colors.border }}>
                  <td className="p-4 text-xs font-mono" style={{ color: colors.textDark }}>
                    {user.id}
                  </td>
                  <td className="p-4 text-xs space-y-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-white mr-1 ${user.recebeNotificacaoNoticia ? 'bg-green-600' : 'bg-gray-300'}`}>
                      Notícias
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded text-white mr-1 ${user.recebeNotificacaoEdital ? 'bg-green-600' : 'bg-gray-300'}`}>
                      Editais
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded text-white ${user.recebeNotificacaoOportunidade ? 'bg-green-600' : 'bg-gray-300'}`}>
                      Oportunidades
                    </span>
                  </td>
                  <td className="p-4 text-xs" style={{ color: colors.textGray }}>
                    {user.editais_salvos?.length || 0} edital(is)
                  </td>
                  <td className="p-4 text-xs" style={{ color: colors.textGray }}>
                    {user.oportunidades_salvas?.length || 0} oportunidade(s)
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};