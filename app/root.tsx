import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";

import { json } from "@remix-run/node";
import {
  Form,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { getContacts } from "./data";

import {
  cn,
  Input,
  Link,
  PoluiProvider,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Toaster,
} from "pol-ui";
import { useEffect } from "react";
import appStylesHref from "./app.css?url";

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
            <ResizablePanel minSize={15} defaultSize={20}>
              <aside className="flex w-full flex-col gap-6 bg-secondary-100 p-3 @container/sidebar">
                <header className="flex items-center justify-between gap-2">
                  <h1>
                    <Link href="/">Logjam</Link>
                  </h1>
                </header>

                <div className="flex flex-col gap-4">
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
                </div>
                <nav>
                  {contacts.length ? (
                    <ul>
                      {contacts.map((contact) => (
                        <li key={contact.id}>
                          <NavLink
                            className={({ isActive, isPending }) =>
                              cn(
                                "@xs/sidebar:text-base flex w-full overflow-hidden truncate text-ellipsis whitespace-nowrap rounded-lg p-2 text-sm",
                                {
                                  "font-bold": contact.favorite,
                                  "bg-secondary-300": isActive,
                                  "hover:bg-secondary-200": !isActive,
                                  "opacity-75": isPending,
                                },
                              )
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
            <ResizablePanel minSize={50}>
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
