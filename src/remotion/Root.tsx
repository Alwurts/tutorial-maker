import { Composition } from "remotion";

import "../app/globals.css";
import { useVideoStore } from "src/hooks/video-store";
import { CodeComposition } from "src/components/code/code-composition";
import { FPS } from "src/lib/video";

export const RemotionRoot: React.FC = () => {
	const videoData = useVideoStore((state) => state.videoData);

	return (
		<Composition
			id="main"
			component={CodeComposition}
			durationInFrames={videoData.durationInFrames}
			fps={FPS}
			width={1080}
			height={1920}
			defaultProps={{ videoData }}
		/>
	);
};
