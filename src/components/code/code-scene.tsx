import { FPS } from "../../lib/video";
import {
	useTokenTransitions,
	tokenTransitions,
} from "../../hooks/token-transition";
import type { TCodeScene } from "../../zod/remotion";
import { Pre } from "codehike/code";

interface SceneProps {
	oldScene?: TCodeScene;
	newScene: TCodeScene;
	durationInFrames: number;
}

export const CodeScene = ({ oldScene, newScene }: SceneProps) => {
	const { code, ref } = useTokenTransitions(
		oldScene?.code,
		newScene.code,
		1 * FPS,
	);
	return (
		<div className="w-full bg-gradient-to-br from-blue-400 to-blue-600 p-12">
			<div className="p-16 gap-6 flex flex-col justify-start items-stretch bg-[#011525] h-full rounded-3xl">
				<Pre ref={ref} code={code} handlers={[tokenTransitions]} className="whitespace-pre-wrap" />
			</div>
		</div>
	);
};
