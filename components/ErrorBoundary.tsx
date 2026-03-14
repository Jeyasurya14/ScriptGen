"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { Button } from "./ui/Button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-red/10 flex items-center justify-center text-red mb-6 border border-red/20 shadow-[0_0_30px_-5px_rgba(255,92,122,0.3)]">
            <AlertOctagon size={32} />
          </div>
          <h1 className="font-head font-bold text-3xl text-white mb-3">Something went wrong</h1>
          <p className="text-white/60 max-w-md mb-8">
            An unexpected error occurred in the application. We've logged the issue and are looking into it.
          </p>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/'}
            >
              Go Home
            </Button>
            <Button 
              variant="primary" 
              onClick={() => this.setState({ hasError: false })}
            >
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
