import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { type Admin } from '../types';
import { colors } from '../config/theme';

export const AdminsPage: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    username: '',
    senha: ''
  });

  const carregarAdmins = useCallback(async () => {
    try {
      const res = await api.get('/admin/');
      setAdmins(res.data);
    } catch (err) {
      console.error('Erro ao carregar administradores:', err);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const res = await api.get('/admin/');
        if (active) {
          setAdmins(res.data);
        }
      } catch (err) {
        console.error('Erro ao carregar administradores:', err);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const handleOpenModal = () => {
    setForm({ username: '', senha: '' });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await api.post('/admin/', form);
      setModalOpen(false);
      carregarAdmins();
    } catch (err: unknown) {
      const response = err && typeof err === 'object' && 'response' in err
        ? err.response
        : undefined;
      setErrorMsg(
        response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'error' in response.data
          ? String(response.data.error)
          : 'Erro ao criar administrador.'
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este administrador?')) {
      try {
        await api.delete(`/admin/${id}`);
        carregarAdmins();
      } catch (err: unknown) {
        const response = err && typeof err === 'object' && 'response' in err
          ? err.response
          : undefined;
        const error = response && typeof response === 'object' && 'data' in response
          && response.data && typeof response.data === 'object' && 'error' in response.data
          ? response.data.error
          : undefined;
        alert(error ? String(error) : 'Erro ao deletar administrador.');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.textDark }}>
          Gerenciar Administradores
        </h1>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 text-white font-medium rounded-md shadow-sm hover:opacity-90"
          style={{ backgroundColor: colors.greenDark }}
        >
          + Novo Admin
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border" style={{ borderColor: colors.border }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50" style={{ borderColor: colors.border }}>
              <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>ID</th>
              <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>Usuário (Username)</th>
              <th className="p-4 text-sm font-semibold text-right" style={{ color: colors.textDark }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-sm" style={{ color: colors.textGray }}>
                  Nenhum administrador cadastrado.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="border-b hover:bg-gray-50" style={{ borderColor: colors.border }}>
                  <td className="p-4 text-xs font-mono" style={{ color: colors.textGray }}>{admin.id}</td>
                  <td className="p-4 text-sm font-medium" style={{ color: colors.textDark }}>{admin.username}</td>
                  <td className="p-4 text-sm text-right">
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="px-3 py-1 border rounded text-xs font-medium hover:bg-red-50"
                      style={{ borderColor: colors.red, color: colors.red }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold" style={{ color: colors.textDark }}>
              Cadastrar Novo Administrador
            </h2>

            {errorMsg && (
              <div className="p-3 text-xs text-white rounded" style={{ backgroundColor: colors.red }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Nome de Usuário</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded text-sm"
                  style={{ borderColor: colors.border }}
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Senha</label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border rounded text-sm"
                  style={{ borderColor: colors.border }}
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50"
                  style={{ borderColor: colors.border, color: colors.textDark }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white text-sm font-medium rounded hover:opacity-90"
                  style={{ backgroundColor: colors.greenDark }}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};