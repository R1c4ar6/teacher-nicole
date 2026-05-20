import { Component, PureComponent } from 'react';

export class ErrorBoundary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (typeof console !== 'undefined' && console.error) {
      console.error('React ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.toString() || 'Unknown error';
      const errorInfo = this.state.errorInfo?.componentStack || '';

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#fdfcfa',
          color: '#1a1614',
          padding: '2rem',
          boxSizing: 'border-box'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1.5rem',
              backgroundColor: '#c4a574',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#6b6560', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              We encountered an error loading this page. Please try refreshing the page.
            </p>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#c4a574',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                marginBottom: '1rem'
              }}
            >
              Refresh Page
            </button>

            <div style={{ marginTop: '2rem', textAlign: 'left' }}>
              <details style={{ width: '100%' }}>
                <summary style={{
                  cursor: 'pointer',
                  padding: '0.5rem',
                  backgroundColor: '#f5f1ed',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Technical Details
                </summary>
                <div style={{
                  marginTop: '0.5rem',
                  background: '#f5f1ed',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  maxHeight: '300px'
                }}>
                  <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Error:</p>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {errorMessage}
                  </pre>
                  {errorInfo && (
                    <>
                      <p style={{ fontWeight: '600', marginTop: '1rem', marginBottom: '0.5rem' }}>Stack Trace:</p>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {errorInfo}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;