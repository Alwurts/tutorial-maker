import { Button } from "./components/ui/button";

function App() {
	return (
		<div className="gap-5 flex flex-col items-center justify-center h-screen">
			<h1 className="text-3xl font-bold underline">Hello world!</h1>
			<Button variant={"outline"}>Click me</Button>
		</div>
	);
}

export default App;
