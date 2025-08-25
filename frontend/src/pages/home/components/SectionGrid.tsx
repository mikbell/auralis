import type { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";

type SectionGridProps = {
	title: string;
	songs: Song[];
	isLoading: boolean;
};
const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
	if (isLoading) return <SectionGridSkeleton />;

	return (
		<div className='mb-6 sm:mb-8'>
			<div className='flex items-center justify-between mb-3 sm:mb-4'>
				<h2 className='text-lg sm:text-xl md:text-2xl font-bold'>{title}</h2>
				<Button variant='link' className='text-xs sm:text-sm text-zinc-400 hover:text-white hidden sm:block'>
					Mostra tutto
				</Button>
			</div>

			{/* Responsive grid: mobile 2 cols, tablet 3 cols, desktop 4-6 cols */}
			<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4'>
				{songs.map((song) => (
					<div
						key={song._id}
						className='bg-zinc-800/40 backdrop-blur-sm p-3 sm:p-4 rounded-lg hover:bg-zinc-700/40 transition-all duration-300 group cursor-pointer'
					>
						<div className='relative mb-2 sm:mb-4'>
							<div className='aspect-square rounded-md shadow-lg overflow-hidden'>
								<img
									src={song.imageUrl}
									alt={song.title}
									className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
									loading='lazy'
								/>
							</div>
							<PlayButton song={song} />
						</div>
						<h3 className='font-medium mb-1 sm:mb-2 truncate text-sm sm:text-base'>{song.title}</h3>
						<p className='text-xs sm:text-sm text-zinc-400 truncate'>{song.artist}</p>
					</div>
				))}
			</div>
		</div>
	);
};
export default SectionGrid;
