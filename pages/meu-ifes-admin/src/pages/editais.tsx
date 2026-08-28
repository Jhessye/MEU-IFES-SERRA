import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { type Edital } from '../types';
import { colors } from '../config/theme';

export const EditaisPage: React.FC = () => {
  const [editais, setEditais] = useState<Edital[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Edital | null>(null);

  const [form, setForm] = useState<Edital>({
    titulo: '',
    link: '',
    pdf: '',
    formulario: '',
    texto: ''
  });

  const carregarEditais = useCallback(async () => {
    try {
      const res = await api.get('/edital/');
      setEditais(Array.isArray(res.data?.items) ? res.data.items : []);
    } catch (err) {
      console.error('Erro ao carregar editais', err);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const res = await api.get('/edital/');
        if (active) {
          setEditais(Array.isArray(res.data?.items) ? res.data.items : []);
        }
      } catch (err) {
        console.error('Erro ao carregar editais', err);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const handleOpenModal = (item?: Edital) => {
    if (item) {
      setSelected(item);
      setForm(item);
    } else {
      setSelected(null);
      setForm({ titulo: '', link: '', pdf: '', formulario: '', texto: '' });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      if (selected?.id) {
        await api.put(`/edital/${selected.id}`, form);
      } else {
        await api.post('/edital/', form);
      }
      setModalOpen(false);
      carregarEditais();
    } catch (err) {
      console.error('Erro ao salvar edital:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este edital?')) {
      try {
        await api.delete(`/edital/${id}`);
        carregarEditais();
      } catch (err) {
        console.error('Erro ao deletar edital:', err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.textDark }}>Gerenciar Editais</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 text-white font-medium rounded-md shadow-sm hover:opacity-90"
          style={{ backgroundColor: colors.greenDark }}
        >
          + Novo Edital
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border" style={{ borderColor: colors.border }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50" style={{ borderColor: colors.border }}>
              <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>Título</th>
              <th className="p-4 text-sm font-semibold" style={{ color: colors.textDark }}>PDF</th>
              <th className="p-4 text-sm font-semibold text-right" style={{ color: colors.textDark }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {editais.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-sm" style={{ color: colors.textGray }}>
                  Nenhum edital cadastrado.
                </td>
              </tr>
            ) : (
              editais.map((edital) => (
                <tr key={edital.id} className="border-b hover:bg-gray-50" style={{ borderColor: colors.border }}>
                  <td className="p-4 text-sm" style={{ color: colors.textDark }}>{edital.titulo}</td>
                  <td className="p-4 text-sm" style={{ color: colors.textGray }}>
                    {edital.pdf ? (
                      <a href={edital.pdf} target="_blank" rel="noreferrer" className="underline hover:text-green-700">
                        Ver PDF
                      </a>
                    ) : 'N/A'}
                  </td>
                  <td className="p-4 text-sm text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(edital)}
                      className="px-3 py-1 border rounded text-xs font-medium hover:bg-gray-100"
                      style={{ borderColor: colors.border, color: colors.textDark }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(edital.id!)}
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
          <div className="bg-white rounded-lg max-w-xl w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold" style={{ color: colors.textDark }}>
              {selected ? 'Editar Edital' : 'Criar Edital'}
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

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Link de Origem</label>
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
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>URL do PDF (opcional)</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border rounded text-sm"
                  style={{ borderColor: colors.border }}
                  value={form.pdf || ''}
                  onChange={(e) => setForm({ ...form, pdf: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Link do Formulário (opcional)</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border rounded text-sm"
                  style={{ borderColor: colors.border }}
                  value={form.formulario || ''}
                  onChange={(e) => setForm({ ...form, formulario: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textDark }}>Descrição/Texto</label>
                <textarea
                  required
                  rows={3}
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