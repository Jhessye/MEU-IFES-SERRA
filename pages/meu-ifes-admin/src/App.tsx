import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login';
import { Layout } from './components/layout';
import { OportunidadesPage } from './pages/oportunidades';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Navigate to="/admin/oportunidades" replace />} />
          <Route path="oportunidades" element={<OportunidadesPage />} />
          {/* Adicione as rotas de Noticias, Editais e Admins aqui */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}