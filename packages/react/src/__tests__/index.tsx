import React from "react";
import { render as renderTL } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { WebSocketServer, WebSocket } from "ws";
import fetch from "node-fetch";
import { ProgressivelyProvider } from "../ProgressivelyProvider";
import { ProgressivelyProviderProps } from "../types";
import { useFlags } from "../useFlags";

const FlaggedComponent = () => {
  const { flags } = useFlags();

  if (flags.newHomepage) {
    return <div style={{ background: "red", color: "white" }}>New variant</div>;
  }

  return <div style={{ background: "lightblue" }}>Old variant</div>;
};

describe("React-sdk root", () => {
  const render = (props?: ProgressivelyProviderProps) =>
    renderTL(
      <ProgressivelyProvider {...(props || {})} clientKey="valid-sdk-key">
        <FlaggedComponent />
      </ProgressivelyProvider>
    );

  // HTTP
  (globalThis as any).fetch = jest.fn(fetch);
  const FLAG_ENDPOINT = `http://localhost:4000*`;
  const worker = setupServer();

  // WS
  (globalThis as any).WebSocket = WebSocket;
  let wss: WebSocketServer;
  let ws: WebSocket;
  let intervalId: NodeJS.Timer;

  beforeEach(() => {
    wss = new WebSocketServer({
      port: 1234,
    });

    wss.on("connection", (websocket) => {
      ws = websocket;
    });
  });

  afterEach(() => {
    clearInterval(intervalId);
    wss.clients.forEach((client) => client.terminate());
    wss.close();
  });

  beforeAll(() => worker.listen());
  afterEach(() => worker.resetHandlers());
  afterAll(() => worker.close());

  it("", () => {
    render();
  });
});
