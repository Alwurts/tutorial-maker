import { z } from "zod";
import { HighlightedCodeBlock } from "codehike/blocks";

const ZCodeScene = z.object({
	id: z.string(),
	title: z.string(),
	code: HighlightedCodeBlock,
	duration: z.number(),
});

const ZCodeRawScene = z.object({
	title: z
		.string()
		.describe("Title of the code scene or step in the tutorial."),
	code: z
		.object({
			meta: z.string().describe("Meta information about the code."),
			value: z.string().describe("Code string"),
			lang: z
				.string()
				.describe(
					"Language of the code. 'javascript','typescript','python','html','css'",
				),
		})
		.describe(
			"Object with the code of the code scene. It should illustrate one step in the tutorial.",
		),
	duration: z
		.number()
		.describe(
			"Duration of the code scene in seconds with 1 decimal. Normally around 2 seconds",
		),
});

export type TCodeScene = z.infer<typeof ZCodeScene>;
export type TCodeRawScene = z.infer<typeof ZCodeRawScene>;

const ZVideoData = z.object({
	title: z.string(),
	scenes: z.array(ZCodeScene),
	durationInFrames: z.number(),
	acumulatedFrames: z.record(z.number()),
});

export const ZVideoRawData = z.object({
	title: z.string().describe("Title of the tutorial video."),
	scenes: z
		.array(ZCodeRawScene)
		.describe(
			"Code scenes of the tutorial video. Each code scene indicates a step in the tutorial, there is a of the code between each scene.",
		),
});

export type TVideoData = z.infer<typeof ZVideoData>;
export type TVideoRawData = z.infer<typeof ZVideoRawData>;
