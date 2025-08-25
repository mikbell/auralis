import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
	errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
		this.setState({
			error,
			errorInfo
		});
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: undefined, errorInfo: undefined });
	};

	render() {
		if (this.state.hasError) {
			// Custom fallback UI
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex items-center justify-center min-h-[400px] p-6 animate-fade-in">
					<Alert className="max-w-lg border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/20">
						<AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
						<AlertTitle className="text-red-800 dark:text-red-200">Qualcosa è andato storto</AlertTitle>
						<AlertDescription className="mt-2 text-red-700 dark:text-red-300">
							Si è verificato un errore durante il caricamento di questo componente. Prova a ricaricare la pagina o contatta il supporto se il problema persiste.
						</AlertDescription>
						<div className="mt-4 flex gap-2">
							<Button onClick={this.handleRetry} variant="default" size="sm" className="bg-red-600 hover:bg-red-700 text-white">
								<RefreshCw className="h-4 w-4 mr-2" />
								Riprova
							</Button>
							<Button 
								onClick={() => window.location.reload()} 
								variant="outline" 
								size="sm"
								className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/20"
							>
								Ricarica Pagina
							</Button>
						</div>
						{process.env.NODE_ENV === 'development' && this.state.error && (
							<details className="mt-4">
								<summary className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400">
									Dettagli Errore (Sviluppo)
								</summary>
								<pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
									{this.state.error.toString()}
									{this.state.errorInfo?.componentStack}
								</pre>
							</details>
						)}
					</Alert>
				</div>
			);
		}

		return this.props.children;
	}
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
	Component: React.ComponentType<P>,
	fallback?: ReactNode
) {
	return function WrappedComponent(props: P) {
		return (
			<ErrorBoundary fallback={fallback}>
				<Component {...props} />
			</ErrorBoundary>
		);
	};
}
