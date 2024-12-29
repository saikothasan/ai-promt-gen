import { Suspense, lazy } from 'react';
import { useThemeStore } from './store/useStore';
import { ThemeToggle } from './components/ThemeToggle';
import { PromptInput } from './components/PromptInput';
import { Toast } from './components/Toast';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useToast } from './utils/hooks/useToast';

const ParticlesBackground = lazy(() => import('./components/ParticlesBackground'));
const PromptList = lazy(() => import('./components/PromptList'));

function App() {
  const { isDark } = useThemeStore();
  const { toast, showToast } = useToast();

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Suspense fallback={null}>
          <ParticlesBackground />
        </Suspense>
        
        <ThemeToggle />
        
        <main className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-teal-500 to-blue-500 font-bold">
            <span className="text-4xl md:text-5xl lg:text-6xl" style={{ 
              fontSize: 'clamp(2rem, 5vw, 4rem)'
            }}>
              ChatGPT Prompt Generator
            </span>
          </h1>
          
          <PromptInput onToast={showToast} />
          
          <Suspense fallback={<LoadingSpinner />}>
            <PromptList onToast={showToast} />
          </Suspense>
        </main>

        {toast && <Toast {...toast} />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
