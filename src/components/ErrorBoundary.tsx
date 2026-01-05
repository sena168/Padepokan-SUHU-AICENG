import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='min-h-screen bg-background flex items-center justify-center p-4'>
          <div className='text-center max-w-md'>
            <div className='text-6xl mb-4'>⚠️</div>
            <h1 className='text-2xl font-serif text-foreground mb-4'>
              Terjadi Kesalahan
            </h1>
            <p className='text-muted-foreground mb-6'>
              Maaf, terjadi masalah teknis. Silakan refresh halaman atau coba
              lagi nanti.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors'
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
