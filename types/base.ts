// Define the shape of a basic log entry
export type LogEntry = {
  timestamp: string; // ISO string representing the time
  level: "info" | "warn" | "error"; // Log level, could be more like "debug", etc.
  message: string; // Main log message
  details?: NestedLogObject; // Optional details field for any extra data
};

// A nested object that can include key-value pairs of any depth
export type NestedLogObject = {
  [key: string]: string | number | boolean | NestedLogObject | null;
};

// The entire log could be a single object or an array of log entries
export type LogData = LogEntry | NestedLogObject | LogEntry[];

// Example of a response type that contains the parsed logs
export type LogResponse = {
  logs: LogData;
};
