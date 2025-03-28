import {
  ApolloLink,
  type FetchResult,
  Observable,
  type Operation,
} from "@apollo/client";
import { print } from "graphql";

type SSELinkOptions = EventSourceInit & { uri: string };

class SSELink extends ApolloLink {
  constructor(private options: SSELinkOptions) {
    super();
  }

  request(operation: Operation): Observable<FetchResult> {
    const url = new URL(this.options.uri);
    url.searchParams.append("query", print(operation.query));
    if (operation.operationName)
      url.searchParams.append("operationName", operation.operationName);
    if (operation.variables)
      url.searchParams.append("variables", JSON.stringify(operation.variables));
    if (operation.extensions)
      url.searchParams.append(
        "extensions",
        JSON.stringify(operation.extensions),
      );

    return new Observable((sink) => {
      const eventsource = new EventSource(url.toString(), this.options);
      eventsource.onmessage = function (event) {
        const data = JSON.parse(event.data as string) as FetchResult;
        sink.next(data);
        if (eventsource.readyState === 2) sink.complete();
      };
      eventsource.onerror = function (error) {
        sink.error(error);
      };
      eventsource.addEventListener("complete", () => {
        eventsource.close(); // If operation ends, close the connection and prevent the client from reconnecting
      });
      return () => eventsource.close();
    });
  }
}

export { SSELink };
