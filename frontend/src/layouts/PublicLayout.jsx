import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main
        className="container py-4"
        style={{ color: 'var(--text-primary)', flex: 1 }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}