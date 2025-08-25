import React from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipi di toast personalizzati
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
	message: string;
	type: ToastType;
	onDismiss?: () => void;
}

const ToastContent: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
	const icons = {
		success: CheckCircle,
		error: XCircle,
		warning: AlertCircle,
		info: Info
	};

	const styles = {
		success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/10 dark:border-green-900/20 dark:text-green-200',
		error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/10 dark:border-red-900/20 dark:text-red-200',
		warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/10 dark:border-yellow-900/20 dark:text-yellow-200',
		info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/10 dark:border-blue-900/20 dark:text-blue-200'
	};

	const iconStyles = {
		success: 'text-green-600 dark:text-green-400',
		error: 'text-red-600 dark:text-red-400',
		warning: 'text-yellow-600 dark:text-yellow-400',
		info: 'text-blue-600 dark:text-blue-400'
	};

	const Icon = icons[type];

	return (
		<div className={cn(
			'flex items-center gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm animate-slide-in-right',
			styles[type]
		)}>
			<Icon className={cn('w-5 h-5 flex-shrink-0', iconStyles[type])} />
			<p className="flex-1 text-sm font-medium">{message}</p>
			{onDismiss && (
				<button
					onClick={onDismiss}
					className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
				>
					<X className="w-4 h-4" />
				</button>
			)}
		</div>
	);
};

// Funzioni helper per i toast
export const showToast = {
	success: (message: string) => {
		toast.custom((t) => (
			<ToastContent 
				message={message} 
				type="success" 
				onDismiss={() => toast.dismiss(t.id)}
			/>
		), {
			duration: 4000,
			position: 'top-right'
		});
	},

	error: (message: string) => {
		toast.custom((t) => (
			<ToastContent 
				message={message} 
				type="error" 
				onDismiss={() => toast.dismiss(t.id)}
			/>
		), {
			duration: 6000,
			position: 'top-right'
		});
	},

	warning: (message: string) => {
		toast.custom((t) => (
			<ToastContent 
				message={message} 
				type="warning" 
				onDismiss={() => toast.dismiss(t.id)}
			/>
		), {
			duration: 5000,
			position: 'top-right'
		});
	},

	info: (message: string) => {
		toast.custom((t) => (
			<ToastContent 
				message={message} 
				type="info" 
				onDismiss={() => toast.dismiss(t.id)}
			/>
		), {
			duration: 4000,
			position: 'top-right'
		});
	}
};

// Messaggi predefiniti in italiano
export const ToastMessages = {
	// Musica
	songAdded: 'Brano aggiunto alla coda',
	songLiked: 'Brano aggiunto ai preferiti',
	songUnliked: 'Brano rimosso dai preferiti',
	playlistCreated: 'Playlist creata con successo',
	playlistUpdated: 'Playlist aggiornata',
	playlistDeleted: 'Playlist eliminata',

	// Errori
	networkError: 'Errore di connessione. Riprova più tardi.',
	playbackError: 'Errore durante la riproduzione',
	uploadError: 'Errore durante il caricamento del file',
	authError: 'Errore di autenticazione',
	genericError: 'Si è verificato un errore imprevisto',

	// Successo
	saved: 'Salvato con successo',
	updated: 'Aggiornato con successo',
	deleted: 'Eliminato con successo',
	copied: 'Copiato negli appunti',

	// Info
	loading: 'Caricamento in corso...',
	connecting: 'Connessione in corso...',
	syncing: 'Sincronizzazione in corso...',

	// Avvisi
	offline: 'Sei offline. Alcune funzioni potrebbero non essere disponibili.',
	limitReached: 'Limite raggiunto',
	sessionExpired: 'Sessione scaduta. Effettua nuovamente l\'accesso.'
};

// Componente Toaster personalizzato
export const CustomToaster: React.FC = () => {
	return (
		<Toaster
			position="top-right"
			reverseOrder={false}
			gutter={8}
			containerClassName=""
			containerStyle={{}}
			toastOptions={{
				className: '',
				style: {
					background: 'transparent',
					border: 'none',
					boxShadow: 'none',
					padding: 0,
					margin: 0
				}
			}}
		/>
	);
};

// Hook per usare i toast con messaggi predefiniti
export const useToast = () => {
	return {
		showSuccess: showToast.success,
		showError: showToast.error,
		showWarning: showToast.warning,
		showInfo: showToast.info,
		messages: ToastMessages
	};
};
