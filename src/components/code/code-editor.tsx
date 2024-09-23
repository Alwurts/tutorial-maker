import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { EditorView } from "@codemirror/view";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function CodeEditor({
	code,
	onChange,
	className,
}: {
	code: string;
	onChange: (code: string) => void;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<Label htmlFor="step-code">Code</Label>
			<CodeMirror
				value={code}
				theme={dracula}
				extensions={[
					javascript({ jsx: true }),
					EditorView.lineWrapping,
					EditorView.theme({
						"&": {
							maxHeight: "400px",
						},
						".cm-scroller": {
							overflow: "auto",
						},
					}),
				]}
				onChange={(value) => onChange(value)}
				className="border rounded-md"
				basicSetup={{
					lineNumbers: true,
					highlightActiveLineGutter: true,
					highlightActiveLine: false,
				}}
			/>
		</div>
	);
}
