import React from 'react';

/**
 * Keeps a crash inside a wrapped subtree from taking down the whole app.
 * Currently wraps the canvas-based TalkingPortrait: if canvas rendering or
 * asset decoding ever throws, the rest of the portfolio still renders.
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

type ErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    console.error('TalkingPortrait crashed:', error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="app-error-fallback" role="alert">
          <h2>The interactive portrait hit a snag</h2>
          <p>The rest of the portfolio is still available — refresh to bring the portrait back.</p>
          <button onClick={() => window.location.reload()}>Refresh page</button>
        </div>
      );
    }
    return this.props.children;
  }
}
