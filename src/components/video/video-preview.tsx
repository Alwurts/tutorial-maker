import { Player, type CallbackListener } from "@remotion/player";
import { CodeComposition } from "../code/code-composition";
import { FPS } from "../../lib/video";
import { useVideoStore } from "../../hooks/video-store";
import { useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";

function PlayerOnly() {
	const playerRef = useVideoStore((state) => state.playerRef);
	const videoData = useVideoStore((state) => state.videoData);
	const setIsPlaying = useVideoStore((state) => state.setIsPlaying);
	const setCurrentFrame = useVideoStore((state) => state.setCurrentFrame);

	const setupEventListeners = useCallback(() => {
		const current = playerRef.current;
		if (!current) return;

		const onPlay: CallbackListener<"play"> = () => {
			setIsPlaying(true);
		};
		const onPause: CallbackListener<"pause"> = () => {
			setIsPlaying(false);
		};
		const onFrameUpdate: CallbackListener<"frameupdate"> = (e) => {
			setCurrentFrame(e.detail.frame);
		};

		current.addEventListener("play", onPlay);
		current.addEventListener("pause", onPause);
		current.addEventListener("frameupdate", onFrameUpdate);

		return () => {
			current.removeEventListener("play", onPlay);
			current.removeEventListener("pause", onPause);
			current.removeEventListener("frameupdate", onFrameUpdate);
		};
	}, [setIsPlaying, setCurrentFrame, playerRef]);

	useEffect(() => {
		if (playerRef.current) {
			return setupEventListeners();
		}

		const intervalId = setInterval(() => {
			if (playerRef.current) {
				clearInterval(intervalId);
				setupEventListeners();
			}
		}, 100);

		return () => clearInterval(intervalId);
	}, [setupEventListeners, playerRef]);

	if (videoData.scenes.length === 0) {
		return (
			<div className="h-full w-full flex-1 flex items-center justify-center">
				<Loader2 className="w-4 h-4 animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex-1">
			<Player
				ref={playerRef}
				component={CodeComposition}
				durationInFrames={videoData.durationInFrames}
				compositionWidth={1080}
				compositionHeight={1920}
				fps={FPS}
				moveToBeginningWhenEnded={false}
				className="rounded-xl"
				style={{
					width: "100%",
					height: "100%",
				}}
				inputProps={{ videoData }}
			/>
		</div>
	);
}

export function VideoPreview() {
	return (
		<div className="bg-muted w-2/3 overflow-hidden h-full flex flex-col items-stretch justify-stretch border-2 border-border rounded-lg">
			<PlayerOnly />
		</div>
	);
}
