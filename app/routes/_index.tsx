import { json } from "@remix-run/node";
import { Form, useActionData, useSubmit } from "@remix-run/react";



import LogList from "components/LogList";
import { LogData } from "types/base";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return new Response("No valid file found", {
      status: 400,
    });
  }

  const fileText = await file.text();

  try {
    const jsonContent: LogData = JSON.parse(fileText);

    return json(jsonContent, { status: 200 });
  } catch (error) {
    return new Response("Invalid JSON file", {
      status: 400,
    });
  }
};
export default function Index() {
  const submit = useSubmit();
  const logs = useActionData<LogData>();

  return (
    <section className="">
      <Form
        method="post"
        encType="multipart/form-data"
        className="mb-6"
        onChange={(event) => submit(event.currentTarget)}
      >
        <label
          htmlFor="file"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Upload JSON Log File:
        </label>
        <input
          type="file"
          name="file"
          id="file"
          accept=".json"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
        />
      </Form>

      <LogList logs={logs as LogData} />
    </section>
  );
}
