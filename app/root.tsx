import {
  Form,
  Links,
  Meta,
  Scripts,
  NavLink,
  ScrollRestoration,
  Outlet,
  useNavigation,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { createEmptyContact, getContacts } from "./data";
import { json, redirect } from "@remix-run/node";

import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";

import appStylesHref from "./app.css?url";
import { useEffect } from "react";
import {
  Button,
  Input,
  Link,
  PoluiProvider,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Toaster,
} from "pol-ui";

//
export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

//
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

export const meta: MetaFunction = ({ location }) => {
  const searchQuery = new URLSearchParams(location.search).get("q");
  if (searchQuery) {
    return [
      {
        title: `Logjam | Search results for "${searchQuery}"`,
      },
    ];
  }
  return [
    {
      title: "Logjam",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  //
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  //
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <PoluiProvider>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={15}>
              <aside className="p-6 w-full bg-secondary-100 flex flex-col gap-6 @container">
                <h1>
                  <Link href="/">Logjam</Link>
                </h1>
                <div className="@[17.5rem]:bg-red-300 bg-blue-700 ">
                  <Form
                    id="search-form"
                    role="search"
                    onChange={(event) => {
                      const isFirstSearch = q === null;
                      submit(event.currentTarget, {
                        replace: !isFirstSearch,
                      });
                    }}
                  >
                    <Input
                      id="q"
                      defaultValue={q || ""}
                      aria-label="Search contacts"
                      className={searching ? "loading" : ""}
                      placeholder="Search"
                      type="search"
                      name="q"
                      leftComponent={
                        searching ? (
                          <div aria-hidden={!searching} id="search-spinner" />
                        ) : (
                          <div id="search-spinner" aria-hidden hidden={true} />
                        )
                      }
                    />
                  </Form>
                  <Form method="post">
                    <Button type="submit">New</Button>
                  </Form>
                </div>
                <nav>
                  {contacts.length ? (
                    <ul>
                      {contacts.map((contact) => (
                        <li key={contact.id}>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              isActive ? "active" : isPending ? "pending" : ""
                            }
                            to={`contacts/${contact.id}`}
                          >
                            {contact.first || contact.last ? (
                              <>
                                {contact.first} {contact.last}
                              </>
                            ) : (
                              <i>No Name</i>
                            )}{" "}
                            {contact.favorite ? <span>★</span> : null}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      <i>No contacts</i>
                    </p>
                  )}
                </nav>
              </aside>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div
                id="detail"
                className={
                  navigation.state === "loading" && !searching ? "loading" : ""
                }
              >
                <Outlet />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          <ScrollRestoration />
          <Scripts />
          <Toaster />
        </PoluiProvider>
      </body>
    </html>
  );
}
