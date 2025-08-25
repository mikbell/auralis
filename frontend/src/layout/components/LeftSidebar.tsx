import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle, Settings } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();
	const { isAdmin, checkAdminStatus } = useAuthStore();

	useEffect(() => {
		fetchAlbums();
		checkAdminStatus();
	}, [fetchAlbums, checkAdminStatus]);

	console.log({ albums });

	return (
		<div className='h-full flex flex-col gap-2 p-2'>
			{/* Navigation menu */}
			<div className='rounded-lg bg-zinc-900/80 backdrop-blur-md p-3 sm:p-4'>
				<div className='space-y-1 sm:space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-center sm:justify-start text-white hover:bg-zinc-800 h-10 sm:h-auto px-2 sm:px-3",
							})
						)}
					>
						<HomeIcon className='size-5 sm:mr-2' />
						<span className='hidden sm:inline'>Home</span>
					</Link>

					<SignedIn>
						<Link
							to={"/chat"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-center sm:justify-start text-white hover:bg-zinc-800 h-10 sm:h-auto px-2 sm:px-3",
								})
							)}
						>
							<MessageCircle className='size-5 sm:mr-2' />
							<span className='hidden sm:inline'>Chat</span>
						</Link>

						{/* Admin link - shown only to admins */}
						{isAdmin && (
							<Link
								to={"/admin"}
								className={cn(
									buttonVariants({
										variant: "ghost",
										className: "w-full justify-center sm:justify-start text-white hover:bg-zinc-800 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 h-10 sm:h-auto px-2 sm:px-3",
									})
								)}
							>
								<Settings className='size-5 text-orange-400 sm:mr-2' />
								<span className='hidden sm:inline text-orange-400 font-medium'>Admin</span>
							</Link>
						)}
					</SignedIn>
				</div>
			</div>

			{/* Library section */}
			<div className='flex-1 rounded-lg bg-zinc-900/80 backdrop-blur-md p-3 sm:p-4 min-h-0'>
				<div className='flex items-center justify-center sm:justify-start mb-3 sm:mb-4'>
					<div className='flex items-center text-white'>
						<Library className='size-5 sm:mr-2' />
						<span className='hidden sm:inline'>Library</span>
					</div>
				</div>

				<ScrollArea className='h-full max-h-[60vh] sm:max-h-none'>
					<div className='space-y-1 sm:space-y-2'>
						{isLoading ? (
							<PlaylistSkeleton />
						) : (
							albums.map((album) => (
								<Link
									to={`/albums/${album._id}`}
									key={album._id}
									className='p-2 sm:p-3 hover:bg-zinc-800 rounded-md flex items-center gap-2 sm:gap-3 group cursor-pointer transition-colors'
								>
									<img
										src={album.imageUrl}
										alt={`${album.title} cover`}
										className='size-10 sm:size-12 rounded-md flex-shrink-0 object-cover'
									/>

									<div className='flex-1 min-w-0 hidden sm:block'>
										<p className='font-medium truncate text-sm sm:text-base'>{album.title}</p>
										<p className='text-xs sm:text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
									</div>

									{/* Mobile: show only image with tooltip */}
									<div className='sm:hidden' title={`${album.title} - ${album.artist}`}>
										{/* Tooltip handled by title attribute */}
									</div>
								</Link>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};
export default LeftSidebar;
