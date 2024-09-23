import { create } from "zustand";
import type {
	TVideoData,
	TCodeScene,
	TCodeRawScene,
	TVideoRawData,
} from "../zod/remotion";
import { highlight } from "codehike/code";
import {
	calculateAccumulatedFrames,
	calculateTotalDurationInFrames,
} from "../lib/video";
import type { PlayerRef } from "@remotion/player";
import { createRef } from "react";
import { v4 as uuidv4 } from "uuid";

interface VideoStore {
	playerRef: React.RefObject<PlayerRef>;
	videoData: TVideoData;
	currentFrame: number;
	selectedSceneId: string | null;
	setSelectedSceneId: (sceneId: string) => void;
	isPlaying: boolean;
	playerTogglePlay: () => void;
	playerSeekTo: (frame: number) => void;
	setIsPlaying: (isPlaying: boolean) => void;
	setCurrentFrame: (frame: number) => void;
	updateVideoData: (newData: TVideoData) => void;
	updateScenesOrder: (newScenes: TVideoData["scenes"]) => void;
	initializeVideoData: (tutorialData: TVideoRawData) => Promise<void>;
	updateScene: (
		sceneId: string,
		updates: Partial<TCodeRawScene>,
	) => Promise<void>;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
	playerRef: createRef<PlayerRef>(),
	videoData: {
		title: "",
		scenes: [],
		durationInFrames: 0,
		acumulatedFrames: {},
	},
	isPlaying: false,
	selectedSceneId: null,
	setSelectedSceneId: (sceneId) => set({ selectedSceneId: sceneId }),
	currentFrame: 0,
	playerTogglePlay: () => {
		const player = useVideoStore.getState().playerRef.current;
		if (player) {
			player.toggle();
		}
	},
	playerSeekTo: (frame) => {
		const player = useVideoStore.getState().playerRef.current;
		if (player) {
			player.seekTo(frame);
		}
	},
	setIsPlaying: (isPlaying) => set({ isPlaying }),
	setCurrentFrame: (frame) => set({ currentFrame: frame }),
	updateVideoData: (newData) => set({ videoData: newData }),
	updateScenesOrder: (newScenes) =>
		set((state) => {
			const durationInFrames = calculateTotalDurationInFrames(newScenes);
			const acumulatedFrames = calculateAccumulatedFrames(newScenes);

			return {
				videoData: {
					...state.videoData,
					scenes: newScenes,
					durationInFrames,
					acumulatedFrames,
				},
			};
		}),
	initializeVideoData: async (tutorialData: TVideoRawData) => {
		const highlightedScenes = await Promise.all(
			tutorialData.scenes.map(
				async (scene): Promise<TCodeScene> => ({
					...scene,
					id: uuidv4(),
					code: await highlight(
						{
							lang: scene.code.lang,
							value: scene.code.value,
							meta: scene.code.meta,
						},
						"github-dark",
					),
				}),
			),
		);

		const durationInFrames = calculateTotalDurationInFrames(highlightedScenes);
		const acumulatedFrames = calculateAccumulatedFrames(highlightedScenes);

		set({
			videoData: {
				...tutorialData,
				scenes: highlightedScenes,
				durationInFrames,
				acumulatedFrames,
			},
		});
	},
	updateScene: async (sceneId, { code, duration, title }) => {
		const { videoData } = get();
		const sceneToUpdate = videoData.scenes.find(
			(scene) => scene.id === sceneId,
		);

		if (!sceneToUpdate) {
			throw new Error("Scene not found");
		}

		const updatedScene = {
			...sceneToUpdate,
			title: title ?? sceneToUpdate.title,
			duration: duration ?? sceneToUpdate.duration,
			code: code
				? await highlight(
						{
							lang: code.lang,
							value: code.value,
							meta: code.meta,
						},
						"github-dark",
					)
				: sceneToUpdate.code,
		};

		const updatedScenes = videoData.scenes.map((scene) =>
			scene.id === sceneId ? updatedScene : scene,
		);

		const durationInFrames = calculateTotalDurationInFrames(updatedScenes);
		const acumulatedFrames = calculateAccumulatedFrames(updatedScenes);

		set({
			videoData: {
				...videoData,
				scenes: updatedScenes,
				durationInFrames,
				acumulatedFrames,
			},
		});
	},
}));
