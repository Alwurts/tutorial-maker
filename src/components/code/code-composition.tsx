import { Sequence } from "remotion";
import type { TVideoData } from "../../zod/remotion";
import { FPS } from "../../lib/video";
import { SceneProgressBar } from "./code-progress-bar";
import { CodeScene } from "./code-scene";

export const CodeComposition = ({ videoData }: { videoData: TVideoData }) => {
	return (
		<div className="text-[2.5rem]">
			{videoData.scenes.map((scene, index) => (
				<Sequence
					key={index}
					from={videoData.acumulatedFrames[index]}
					durationInFrames={scene.duration * FPS}
				>
					<CodeScene
						oldScene={videoData.scenes[index - 1]}
						newScene={scene}
						durationInFrames={scene.duration * FPS}
					/>
				</Sequence>
			))}

			<div className="absolute bottom-24 left-0 right-0 flex w-full px-24 gap-10">
				{videoData.scenes.map((scene, index) => (
					<SceneProgressBar
						key={index}
						scene={scene}
						framesAccumulated={videoData.acumulatedFrames[index]}
					/>
				))}
			</div>
		</div>
	);
};
