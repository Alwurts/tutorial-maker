import type { TVideoRawData } from "@/zod/remotion";

export const tutorialData: TVideoRawData = {
	title: "Using useCallback in React Functional Components",
	scenes: [
		{
			title: "Introduction to useCallback",
			code: {
				meta: "",
				value: `// Import useCallback from React
import React, { useCallback } from 'react';

function MyComponent() {
  /* Previous Code */

  // Define a callback function
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}`,
				lang: "javascript",
			},
			duration: 3,
		},
		{
			title: "Implementing useCallback",
			code: {
				meta: "",
				value: `import React, { useCallback } from 'react';

function MyComponent() {
  /* Previous Code */

  // Wrap the callback with useCallback
  const handleClick = useCallback(() => {
    console.log('Button clicked!');
  }, []); // Empty dependency array

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}`,
				lang: "javascript",
			},
			duration: 3,
		},
		{
			title: "Adding Dependencies",
			code: {
				meta: "",
				value: `import React, { 
  useCallback, 
  useState 
} from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  // Add count as a dependency
  const handleClick = useCallback(() => {
    console.log('Count:', count);
    setCount(count + 1);
  }, [count]);

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}`,
				lang: "javascript",
			},
			duration: 3,
		},
		{
			title: "Optimizing Child Components",
			code: {
				meta: "",
				value: `import React, { 
  useCallback, 
  useState 
} from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <>
      <ChildComponent onClick={handleClick} />
      <p>Count: {count}</p>
    </>
  );
}

// Memoized child component
const ChildComponent = React.memo(({ onClick }) => (
  <Child/>
));`,
				lang: "javascript",
			},
			duration: 3,
		},
	],
};
