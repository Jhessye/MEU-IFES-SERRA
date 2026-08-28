import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login';
import { Layout } from './components/layout';
import { OportunidadesPage } from './pages/oportunidades';
import { NoticiasPage } from './pages/noticias';
import { EditaisPage } from './pages/editais';
import { UsuariosPage } from './pages/usuarios';
import { AdminsPage } from './pages/admins';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<Layout />}>
          <Route index element={<Navigate to="/admin/noticias" replace />} />

          <Route path="noticias" element={<NoticiasPage />} />
          <Route path="editais" element={<EditaisPage />} />
          <Route path="oportunidades" element={<OportunidadesPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="admins" element={<AdminsPage />} />

          <Route path="*" element={<Navigate to="/admin/noticias" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}