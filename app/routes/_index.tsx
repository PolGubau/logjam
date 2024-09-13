import { Form, useSubmit } from "@remix-run/react";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return new Response("No file found", {
      status: 400,
    });
  }

  const reader = file.stream().getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value);
  }

  return new Response(result, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default function Index() {
  const submit = useSubmit();

  return (
    <section className="grid h-full place-items-center">
      <Form
        method="post"
        onChange={(event) => {
          submit(event.currentTarget, {
            replace: true,
          });
        }}
      >
        {/* JSON input */}
        <input type="file" name="file" accept=".json" />
      </Form>
    </section>
  );
}
