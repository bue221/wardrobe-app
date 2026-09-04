import { LandingPage } from './landing/LandingPage';
import { AppShell } from './app/AppShell';
import { usePath } from './shared/hooks/usePath';

export default function App() {
  const { path, navigate } = usePath();
  const inApp = path === '/app' || path.startsWith('/app/');

  if (inApp) {
    return <AppShell onHome={() => navigate('/')} />;
  }

  return <LandingPage onEnter={() => navigate('/app')} />;
}
