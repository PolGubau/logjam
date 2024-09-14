import { LogData } from "types/base";
import { renderLog } from "./renderLog";

const LogList = ({ logs }: { logs: LogData }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {logs ? (
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4">Log Data</h3>
          {renderLog(logs)}
        </div>
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No logs available. Upload a JSON file to display logs.
        </p>
      )}
    </div>
  );
};

export default LogList;
