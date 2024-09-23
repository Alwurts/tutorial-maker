import { useVideoStore } from "@/hooks/video-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TCodeRawScene } from "@/zod/remotion";
import { CodeEditor } from "./code-editor";
import { useMemo } from "react";

export function SceneEditor() {
	const { videoData, updateScene } = useVideoStore();

	const selectedSceneId = useVideoStore((state) => state.selectedSceneId);
	const selectedScene = useMemo(
		() => videoData.scenes.find((scene) => scene.id === selectedSceneId),
		[videoData.scenes, selectedSceneId],
	);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!selectedScene) return;
		updateScene(selectedScene.id, { title: e.target.value });
	};

	const handleCodeChange = (newCode: string) => {
		if (!selectedScene) return;
		const updatedCode: TCodeRawScene["code"] = {
			lang: selectedScene.code.lang,
			value: newCode,
			meta: selectedScene.code.meta,
		};
		updateScene(selectedScene.id, { code: updatedCode });
	};

	const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!selectedScene) return;
		updateScene(selectedScene.id, {
			duration: Number.parseFloat(e.target.value),
		});
	};

	if (!selectedScene) {
		return (
			<div className="flex-1 border-2 border-border rounded-lg">
				<div className="p-4 bg-muted">
					<h2 className="text-lg font-semibold">Scene Editor</h2>
				</div>
				<div className="flex justify-center items-center h-full">
					<p>No scene selected</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-1/3 border-2 border-border rounded-lg">
			<div className="p-4 bg-muted">
				<h2 className="text-lg font-semibold">Scene Editor</h2>
			</div>
			<div className="grid grid-cols-6 gap-4 p-4">
				<div className="flex flex-col gap-2 col-span-4">
					<Label htmlFor="scene-title">Title</Label>
					<Input
						id="scene-title"
						value={selectedScene.title}
						onChange={handleTitleChange}
					/>
				</div>
				<CodeEditor
					className="col-span-6"
					code={selectedScene.code.value}
					onChange={handleCodeChange}
				/>
				<div className="flex flex-col gap-2 col-span-2 lg:col-span-1">
					<Label htmlFor="scene-duration">Duration (seconds)</Label>
					<Input
						id="scene-duration"
						type="number"
						step={0.1}
						value={selectedScene.duration}
						onChange={handleDurationChange}
					/>
				</div>
			</div>
		</div>
	);
}
