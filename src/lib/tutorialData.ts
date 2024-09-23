import type { TVideoRawData } from "@/zod/remotion";

export const tutorialData: TVideoRawData = {
	title: "Working with JavaScript Date Object",
	scenes: [
		{
			title: "Creating a Date Object",
			code: {
				meta: "",
				value: `// Create a new Date object
const currentDate = new Date();`,
				lang: "javascript",
			},
			duration: 2,
		},
		{
			title: "Getting the Current Date",
			code: {
				meta: "",
				value: `// Create a new Date object
const currentDate = new Date();
console.log(currentDate);
// Output: Current date and time`,
				lang: "javascript",
			},
			duration: 1.5,
		},
		{
			title: "Getting the Current Date",
			code: {
				meta: "",
				value: `// Create a new Date object
const currentDate = new Date();

// Get the current date
console.log(currentDate);
// Output: Current date and time`,
				lang: "javascript",
			},
			duration: 2,
		},
		{
			title: "Using HTML5 Date Input",
			code: {
				meta: "",
				value: `// Create a new Date object
const currentDate = new Date();

// Get the current date
console.log(() => {
  console.log("Hey")
});
// Output: Current date and time`,
				lang: "javascript",
			},
			duration: 3,
		},
	],
};
