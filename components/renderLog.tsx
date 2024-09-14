// Helper function to render a log object recursively
export function renderLog(log: any, depth = 0) {
  return (
    <div className={`ml-${depth * 4}`}>
      {Object.keys(log).map((key) => {
        const value = log[key];

        return typeof value === "object" && value !== null ? (
          // Recursively render nested objects
          <div key={key} className="mb-2">
            <details>
              <summary className="cursor-pointer font-semibold">{key}</summary>
              {renderLog(value, depth + 1)}
            </details>
          </div>
        ) : (
          // Render key-value pairs for primitive values
          <div key={key} className="mb-1">
            <span className="font-semibold">{key}:</span>{" "}
            <span className="text-gray-700">{String(value)}</span>
          </div>
        );
      })}
    </div>
  );
}
