import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";

// The composition you want to render
const compositionId = "main";

// You only have to create a bundle once, and you may reuse it
// for multiple renders that you can parametrize using input props.
const bundleLocation = await bundle({
	entryPoint: path.resolve("./src/remotion/index.ts"),
	// If you have a webpack override in remotion.config.ts, pass it here as well.
	webpackOverride: (config) => config,
});

export const renderVideo = async () => {
	console.log("Rendering video...");
	// Get the composition you want to render. Pass `inputProps` if you
	// want to customize the duration or other metadata.
	const composition = await selectComposition({
		serveUrl: bundleLocation,
		id: compositionId,
	});

	// Render the video. Pass the same `inputProps` again
	// if your video is parametrized with data.
	await renderMedia({
		composition,
		serveUrl: bundleLocation,
		codec: "h264",
		outputLocation: `out/${compositionId}.mp4`,
	});

	console.log("Render done!");
};
