import { useEffect } from "react";
import { TimelineEditor } from "./components/video/timeline-editor";
import { VideoPreview } from "./components/video/video-preview";
import { useVideoStore } from "./hooks/video-store";
import { tutorialData } from "./lib/tutorialData";
import { SceneEditor } from "./components/code/scene-editor";

export default function App() {
	const initializeVideoData = useVideoStore(
		(state) => state.initializeVideoData,
	);

	useEffect(() => {
		initializeVideoData(tutorialData);
	}, [initializeVideoData]);

	return (
		<div className="flex flex-col h-screen p-3 gap-2">
			<div className="flex-1 flex gap-2">
				<VideoPreview />
				<SceneEditor />
			</div>
			<TimelineEditor />
		</div>
	);
}
