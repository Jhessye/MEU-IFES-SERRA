import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login';
import { Layout } from './components/layout';
import { OportunidadesPage } from './pages/oportunidades';
import { NoticiasPage } from './pages/noticias'; // 1. Importação adicionada

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/admin" element={<Layout />}>
          {/* Redireciona /admin direto para a tela de noticias */}
          <Route index element={<Navigate to="/admin/noticias" replace />} />
          
          {/* 2. Rota de Notícias registrada aqui */}
          <Route path="noticias" element={<NoticiasPage />} />
          <Route path="oportunidades" element={<OportunidadesPage />} />
          
          {/* Rota de fallback caso o usuário acesse uma subrota inexistente */}
          <Route path="*" element={<Navigate to="/admin/noticias" replace />} />
        </Route>

        {/* Redirecionamento global para rotas desconhecidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}