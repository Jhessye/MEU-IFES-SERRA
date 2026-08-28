import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { type Noticia } from '../types';
import { colors } from '../config/theme';

export const NoticiasPage: React.FC = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState<Noticia>({
    titulo: '',
    link: '',
    autor: '',
    data: new Date().toISOString().substring(0, 10),
    texto: '',
    imagem: ''
  });

  const carregarNoticias = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token de autenticação não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      const res = await api.get('/noticia/');
      
      setNoticias(Array.isArray(res.data?.items) ? res.data.items : []);
    } catch (err: unknown) {
      console.error('Erro ao carregar notícias:', err);

      const status =
        typeof err === 'object' && err !== null && 'response' in err &&
        typeof err.response === 'object' && err.response !== null &&
        'status' in err.response
          ? (err.response as { status: number }).status
          : undefined;

      if (status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else if (status === 404) {
        setError('Endpoint de notícias não encontrado. Verifique a URL da API.');
      } else {
        setError('Erro ao carregar notícias. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Efeito isolado sem chamadas de setState síncronas diretamente na raiz do Effect
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          if (active) {
            setError('Token de autenticação não encontrado. Faça login novamente.');
            setLoading(false);
          }
          return;
        }

        const res = await api.get('/noticia/');
        
        if (active) {
          setNoticias(Array.isArray(res.data?.items) ? res.data.items : []);
          setError('');
        }
      } catch (err: unknown) {
        if (!active) return;

        const status =
          typeof err === 'object' && err !== null && 'response' in err &&
          typeof err.response === 'object' && err.response !== null &&
          'status' in err.response
            ? (err.response as { status: number }).status
            : undefined;

        if (status === 401) {
          setError('Sessão expirada. Faça login novamente.');
        } else if (status === 404) {
          setError('Endpoint de notícias não encontrado. Verifique a URL da API.');
        } else {
          setError('Erro ao carregar notícias. Tente novamente.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const handleOpenModal = (item?: Noticia) => {
    if (item) {
      setSelected(item);
      setForm({
        ...item,
        data: item.data ? item.data.substring(0, 10) : new Date().toISOString().substring(0, 10)
      });
    } else {
      setSelected(null);
      setForm({
        titulo: '',
        link: '',
        autor: '',
        data: new Date().toISOString().substring(0, 10),
        texto: '',
        imagem: ''
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selected?.id) {
        await api.put(`/noticia/${selected.id}`, form);
      } else {
        await api.post('/noticia/', form);
      }
      setModalOpen(false);
      carregarNoticias();
    } catch (err) {
      console.error('Erro ao salvar notícia:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir esta notícia?')) {
      try {
        await api.delete(`/noticia/${id}`);
        carregarNoticias();
      } catch (err) {
        console.error('Erro ao excluir notícia:', err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.textDark }}>Gerenciar Notícias</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 text-white font-medium rounded-md shadow-sm hover:opacity-90"
          style={{ backgroundColor: colors.greenDark }}
        >
          + Nova Notícia
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div 
            className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" 
            style={{ borderColor: colors.greenDark, borderTopColor: 'transparent' }} 
          />
          <p className="mt-2 text-sm" style={{ color: colors.textGray }}>Carregando notícias...</p>
        </div>
      )}

      {error && (
        <div 
          className="mb-4 p-3 rounded text-sm text-white font-medium text-center" 
          style={{ backgroundColor: colors.red }}
        >
          {error}
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden border" style={{ borderColor: colors.border }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50" style={{ borderColor: colors.border }}>
                <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>Título</th>
                <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>Autor</th>
                <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>Data</th>
                <th className="p-4 text-sm font-semibold text-right" style={{ color: colors.textDark }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {noticias.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-sm" style={{ color: colors.textGray }}>
                    Nenhuma notícia cadastrada.
                  </td>
                </tr>
              ) : (
                noticias.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50" style={{ borderColor: colors.border }}>
                    <td className="p-4 text-sm" style={{ color: colors.textDark }}>{item.titulo}</td>
                    <td className="p-4 text-sm" style={{ color: colors.textGray }}>{item.autor}</td>
                    <td className="p-4 text-sm" style={{ color: colors.textGray }}>
                      {item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="p-4 text-sm text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="px-3 py-1 border rounded text-xs font-medium hover:bg-gray-100"
                        style={{ borderColor: colors.border, color: colors.textDark }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id!)}
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
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold" style={{ color: colors.textDark }}>
              {selected ? 'Editar Notícia' : 'Criar Notícia'}
            </h2>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Título</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded text-sm"
                  style={{ borderColor: colors.border }}
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Autor</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded text-sm"
                    style={{ borderColor: colors.border }}
                    value={form.autor}
                    onChange={(e) => setForm({ ...form, autor: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Data</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border rounded text-sm"
                    style={{ borderColor: colors.border }}
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Link de Destino</label>
                <input
                  type="url"
                  required
                  className="w-full px-3 py-2 border rounded text-sm"
                  style={{ borderColor: colors.border }}
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>URL da Imagem (opcional)</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border rounded text-sm"
                  style={{ borderColor: colors.border }}
                  value={form.imagem || ''}
                  onChange={(e) => setForm({ ...form, imagem: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Texto/Conteúdo</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded text-sm"
                  style={{ borderColor: colors.border }}
                  value={form.texto}
                  onChange={(e) => setForm({ ...form, texto: e.target.value })}
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