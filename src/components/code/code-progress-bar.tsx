import { FPS } from "../../lib/video";
import type { TCodeScene } from "../../zod/remotion";
import { useCurrentFrame } from "remotion";

interface SceneProgressBarProps {
	scene: TCodeScene;
	framesAccumulated: number;
}

export const SceneProgressBar = ({
	scene,
	framesAccumulated,
}: SceneProgressBarProps) => {
	const frame = useCurrentFrame();
	const sceneDurationInFrames = scene.duration * FPS;
	const progress = Math.min(
		1,
		Math.max(0, (frame - framesAccumulated) / sceneDurationInFrames),
	);

	return (
		<div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
			<div
				className="h-full bg-blue-500 transition-all duration-300 ease-linear"
				style={{ width: `${progress * 100}%` }}
			/>
		</div>
	);
};
