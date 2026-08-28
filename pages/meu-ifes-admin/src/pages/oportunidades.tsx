import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { type Oportunidade } from '../types';
import { colors } from '../config/theme';

export const OportunidadesPage: React.FC = () => {
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Oportunidade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState<Oportunidade>({
    titulo: '',
    link_vaga: '',
    cargaHoraria: '',
    requisitos: '',
    observacoes: '',
    dataFinalInscricao: ''
  });

  const carregarOportunidades = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/oportunidade/');
      if (Array.isArray(res.data)) {
        setOportunidades(res.data);
      } else {
        setOportunidades([]);
      }
    } catch (err) {
      console.error('Erro ao carregar oportunidades:', err);
      setError('Falha ao carregar oportunidades.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/oportunidade/');
        if (active) {
          if (Array.isArray(res.data)) {
            setOportunidades(res.data);
          } else {
            setOportunidades([]);
          }
        }
      } catch (err) {
        if (active) {
          console.error('Erro ao carregar oportunidades:', err);
          setError('Falha ao carregar oportunidades.');
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

  const handleOpenModal = (item?: Oportunidade) => {
    if (item) {
      setSelected(item);
      setForm(item);
    } else {
      setSelected(null);
      setForm({
        titulo: '',
        link_vaga: '',
        cargaHoraria: '',
        requisitos: '',
        observacoes: '',
        dataFinalInscricao: ''
      });
    }
    setModalOpen(true);
  };

  // Ajustado de React.SubmitEvent para React.FormEvent
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selected?.id) {
        await api.put(`/oportunidade/${selected.id}`, form);
      } else {
        await api.post('/oportunidade/', form);
      }
      setModalOpen(false);
      carregarOportunidades();
    } catch (err) {
      console.error('Erro ao salvar oportunidade:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta oportunidade?')) {
      try {
        await api.delete(`/oportunidade/${id}`);
        carregarOportunidades();
      } catch (err) {
        console.error('Erro ao deletar oportunidade:', err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.textDark }}>
          Gerenciar Oportunidades
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 text-white font-medium rounded-md shadow-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: colors.greenDark }}
        >
          + Nova Oportunidade
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div 
            className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" 
            style={{ borderColor: colors.greenDark, borderTopColor: 'transparent' }} 
          />
          <p className="mt-2 text-sm" style={{ color: colors.textGray }}>Carregando dados...</p>
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
                <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>Carga Horária</th>
                <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>Data Limite</th>
                <th className="p-4 text-sm font-semibold text-right" style={{ color: colors.textDark }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(oportunidades) && oportunidades.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-sm" style={{ color: colors.textGray }}>
                    Nenhuma oportunidade cadastrada.
                  </td>
                </tr>
              ) : (
                Array.isArray(oportunidades) && oportunidades.map((op) => (
                  <tr key={op.id} className="border-b hover:bg-gray-50" style={{ borderColor: colors.border }}>
                    <td className="p-4 text-sm" style={{ color: colors.textDark }}>{op.titulo}</td>
                    <td className="p-4 text-sm" style={{ color: colors.textGray }}>{op.cargaHoraria || 'N/A'}</td>
                    <td className="p-4 text-sm" style={{ color: colors.textGray }}>{op.dataFinalInscricao}</td>
                    <td className="p-4 text-sm text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(op)}
                        className="px-3 py-1 border rounded text-xs font-medium hover:bg-gray-100"
                        style={{ borderColor: colors.border, color: colors.textDark }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(op.id!)}
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold" style={{ color: colors.textDark }}>
              {selected ? 'Editar Oportunidade' : 'Criar Oportunidade'}
            </h2>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Título</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1"
                  style={{ borderColor: colors.border }}
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Link da Vaga</label>
                <input
                  type="url"
                  required
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1"
                  style={{ borderColor: colors.border }}
                  value={form.link_vaga}
                  onChange={(e) => setForm({ ...form, link_vaga: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Carga Horária</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1"
                    style={{ borderColor: colors.border }}
                    value={form.cargaHoraria || ''}
                    onChange={(e) => setForm({ ...form, cargaHoraria: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Data Final de Inscrição</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1"
                    style={{ borderColor: colors.border }}
                    value={form.dataFinalInscricao}
                    onChange={(e) => setForm({ ...form, dataFinalInscricao: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Requisitos</label>
                <textarea
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1"
                  rows={2}
                  style={{ borderColor: colors.border }}
                  value={form.requisitos || ''}
                  onChange={(e) => setForm({ ...form, requisitos: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Observações</label>
                <textarea
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1"
                  rows={2}
                  style={{ borderColor: colors.border }}
                  value={form.observacoes || ''}
                  onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
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