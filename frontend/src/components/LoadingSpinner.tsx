import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
	size?: 'sm' | 'md' | 'lg' | 'xl';
	variant?: 'default' | 'page' | 'overlay';
	message?: string;
	className?: string;
}

const sizeClasses = {
	sm: 'w-4 h-4',
	md: 'w-6 h-6',
	lg: 'w-8 h-8',
	xl: 'w-12 h-12'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = 'md',
	variant = 'default',
	message,
	className
}) => {
	const spinnerClass = cn(
		'animate-spin text-primary',
		sizeClasses[size],
		className
	);

	if (variant === 'page') {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<Loader2 className={cn(spinnerClass, 'w-12 h-12')} />
				{message && (
					<p className="text-muted-foreground text-sm">{message}</p>
				)}
			</div>
		);
	}

	if (variant === 'overlay') {
		return (
			<div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
				<div className="bg-background p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
					<Loader2 className={cn(spinnerClass, 'w-8 h-8')} />
					{message && (
						<p className="text-muted-foreground text-sm">{message}</p>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center space-x-2">
			<Loader2 className={spinnerClass} />
			{message && (
				<span className="text-muted-foreground text-sm">{message}</span>
			)}
		</div>
	);
};

// Skeleton loading components
export const SongSkeleton: React.FC = () => (
	<div className="flex items-center space-x-4 p-4 animate-pulse">
		<div className="w-12 h-12 bg-muted rounded"></div>
		<div className="flex-1 space-y-2">
			<div className="h-4 bg-muted rounded w-3/4"></div>
			<div className="h-3 bg-muted rounded w-1/2"></div>
		</div>
		<div className="w-16 h-4 bg-muted rounded"></div>
	</div>
);

export const AlbumSkeleton: React.FC = () => (
	<div className="space-y-4 animate-pulse">
		<div className="aspect-square bg-muted rounded-lg"></div>
		<div className="space-y-2">
			<div className="h-4 bg-muted rounded w-3/4"></div>
			<div className="h-3 bg-muted rounded w-1/2"></div>
		</div>
	</div>
);

export const PlaylistSkeleton: React.FC = () => (
	<div className="flex space-x-4 p-4 animate-pulse">
		<div className="w-16 h-16 bg-muted rounded"></div>
		<div className="flex-1 space-y-2">
			<div className="h-4 bg-muted rounded w-2/3"></div>
			<div className="h-3 bg-muted rounded w-1/3"></div>
		</div>
	</div>
);
