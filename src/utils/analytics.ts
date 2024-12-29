type EventData = Record<string, any>;

interface ErrorDetails {
  message: string;
  stack?: string;
  context?: string;
}

const formatError = (error: Error, context?: string): ErrorDetails => ({
  message: error.message,
  stack: error.stack,
  context,
});

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const logEvent = (eventName: string, data?: EventData) => {
  if (process.env.NODE_ENV === 'production') {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, {
          ...data,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.warn('Google Analytics not initialized.');
      }
    } catch (error) {
      console.error('Analytics Error:', error);
    }
  }
};

export const logError = (error: Error, context?: string) => {
  if (process.env.NODE_ENV === 'production') {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: true,
          stack: error.stack,
          context,
        });
      } else {
        console.warn('Google Analytics not initialized.');
      }
    } catch (err) {
      console.error('Error Logging Failed:', err);
    }
  }
};
