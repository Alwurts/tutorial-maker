import type { TVideoData } from "@/zod/remotion";

export const FPS = 30;

export const calculateTotalDurationInFrames = (
	scenes: TVideoData["scenes"],
) => {
	const totalDurationInSeconds = scenes.reduce(
		(sum, scene) => sum + scene.duration,
		0,
	);
	const totalDurationInFrames = totalDurationInSeconds * FPS;
	return totalDurationInFrames;
};

export const calculateAccumulatedFrames = (scenes: TVideoData["scenes"]) => {
	const indexAccumulatedFrames: Record<number, number> = {};
	let accumulatedFrames = 0;
	for (let sceneIndex = 0; sceneIndex < scenes.length; sceneIndex++) {
		indexAccumulatedFrames[sceneIndex] = accumulatedFrames;
		accumulatedFrames += scenes[sceneIndex].duration * FPS;
	}

	return indexAccumulatedFrames;
};
