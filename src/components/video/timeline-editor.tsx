// Import necessary modules
import { useVideoStore } from "../../hooks/video-store";
import { FPS } from "../../lib/video";
import { useRef, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
	PauseIcon,
	PlayIcon,
	PlusIcon,
	ScissorsIcon,
	ZoomInIcon,
	ZoomOutIcon,
} from "lucide-react";
import type { TVideoData, TCodeScene } from "@/zod/remotion";
import { Card } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

// Import dnd-kit modules
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function TimelineEditor() {
	const videoData = useVideoStore((state) => state.videoData);
	const currentFrame = useVideoStore((state) => state.currentFrame);
	const isPlaying = useVideoStore((state) => state.isPlaying);
	const togglePlay = useVideoStore((state) => state.playerTogglePlay);

	const [zoom, setZoom] = useState(1);

	const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 5));
	const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.5));

	return (
		<div className="gap-1 w-full flex flex-col justify-stretch items-stretch border-2 border-border rounded-lg">
			<div className="flex justify-between items-center p-2">
				<div className="flex gap-1">
					<Button variant="ghost" size="icon" className="w-5 h-5">
						<ScissorsIcon className="w-4 h-4" />
					</Button>
					<Button variant="ghost" size="icon" className="w-5 h-5">
						<PlusIcon className="w-4 h-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="w-6 h-6"
						onClick={handleZoomIn}
					>
						<ZoomInIcon className="w-4 h-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="w-6 h-6"
						onClick={handleZoomOut}
					>
						<ZoomOutIcon className="w-4 h-4" />
					</Button>
				</div>
				<div className="flex-1 flex justify-center items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="w-6 h-6"
						onClick={togglePlay}
					>
						{isPlaying ? (
							<PauseIcon className="w-4 h-4" />
						) : (
							<PlayIcon className="w-4 h-4" />
						)}
					</Button>
					<Separator className="h-5" orientation="vertical" />
					<span className="text-xs font-semibold mr-2">
						{(currentFrame / FPS).toFixed(2)} :{" "}
						{(videoData.durationInFrames / FPS).toFixed(2)}
					</span>
				</div>
			</div>
			<TimeLine videoData={videoData} zoom={zoom} />
		</div>
	);
}

function TimeLine({
	videoData,
	zoom,
}: {
	videoData: TVideoData;
	zoom: number;
}) {
	const timelineRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const currentFrame = useVideoStore((state) => state.currentFrame);
	const seekToFrame = useVideoStore((state) => state.playerSeekTo);

	const updateScenesOrder = useVideoStore((state) => state.updateScenesOrder);

	const [scenes, setScenes] = useState(videoData.scenes);

	useEffect(() => {
		setScenes(videoData.scenes);
	}, [videoData.scenes]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	);

	// Define the base number of pixels per frame at zoom level 1
	const basePixelsPerFrame = 2; // Adjust this value as needed

	// Calculate pixels per frame based on zoom level
	const pixelsPerFrame = basePixelsPerFrame * zoom;

	// Total timeline width
	const timelineWidth = videoData.durationInFrames * pixelsPerFrame;

	// Tracker position
	const trackerPosition = currentFrame * pixelsPerFrame;

	// Handle dragging the tracker
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseMove = (e: MouseEvent) => {
		const timelineRect = timelineRef.current?.getBoundingClientRect();
		if (!timelineRect) return;

		let newLeft = e.clientX - timelineRect.left;

		// Clamp newLeft between 0 and timelineWidth
		newLeft = Math.max(0, Math.min(newLeft, timelineWidth));

		// Calculate new currentFrame
		const newCurrentFrame = Math.round(newLeft / pixelsPerFrame);

		seekToFrame(newCurrentFrame);
	};

	const handleMouseUp = () => {
		setIsDragging(false);
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			const oldIndex = scenes.findIndex((scene) => scene.id === active.id);
			const newIndex = scenes.findIndex((scene) => scene.id === over?.id);

			const newScenes = arrayMove(scenes, oldIndex, newIndex);

			setScenes(newScenes);

			// Update the store
			updateScenesOrder(newScenes);
		}
	};

	return (
		<div className="relative flex-1 bg-muted overflow-hidden">
			<ScrollArea className="h-full px-2 pt-2 pb-3">
				<div
					ref={timelineRef}
					className="relative h-full flex flex-row items-stretch"
					style={{ width: `${timelineWidth}px` }}
				>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={scenes.map((scene) => scene.id)}
							strategy={horizontalListSortingStrategy}
						>
							{scenes.map((scene) => {
								return (
									<SortableItem
										key={scene.id}
										scene={scene}
										pixelsPerFrame={pixelsPerFrame}
										isDragging={isDragging}
									/>
								);
							})}
						</SortableContext>
					</DndContext>

					{/* Tracker */}
					<div
						className="absolute top-0 h-full flex flex-col justify-start items-start"
						style={{ left: `${trackerPosition}px` }}
					>
						<div
							className="w-[9px] h-[9px] relative -left-1 bg-red-500 rounded-full pointer-events-auto"
							style={{ cursor: isDragging ? "grabbing" : "grab" }}
							onMouseDown={handleMouseDown}
						/>
						<div className="w-0.5 h-full bg-red-500" />
					</div>
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}

function SortableItem({
	scene,
	pixelsPerFrame,
	isDragging,
}: {
	scene: TCodeScene;
	pixelsPerFrame: number;
	isDragging: boolean;
}) {
	const setSelectedScene = useVideoStore((state) => state.setSelectedSceneId);
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging: isSorting,
	} = useSortable({ id: scene.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		width: `${scene.duration * FPS * pixelsPerFrame}px`,
		opacity: isSorting ? 0.5 : 1,
	};

	return (
		<Card
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={cn(
				"h-20 cursor-pointer bg-primary text-primary-foreground p-2",
				{
					"hover:bg-primary/90": !isDragging,
				},
			)}
			onClick={() => {
				setSelectedScene(scene.id);
			}}
		>
			<span className="text-xs font-semibold">Scene</span>
			<div className="text-xs truncate">{scene.title}</div>
		</Card>
	);
}
