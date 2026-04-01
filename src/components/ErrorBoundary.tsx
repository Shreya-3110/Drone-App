import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.label ? `: ${this.props.label}` : ''}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] bg-black/60 border border-red-500/30 rounded-xl p-6 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center mb-4">
            <span className="text-red-500 text-lg font-bold">!</span>
          </div>
          <p className="font-orbitron text-red-400 text-xs tracking-widest uppercase mb-2">
            {this.props.label ? `${this.props.label} Error` : 'Module Error'}
          </p>
          <p className="font-inter text-white/40 text-xs text-center max-w-xs">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-1.5 border border-white/20 text-white/60 font-orbitron text-[10px] tracking-widest rounded hover:bg-white/10 transition-colors"
            aria-label="Retry loading this module"
          >
            RETRY
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
