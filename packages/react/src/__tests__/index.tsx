import React from "react";
import { render as renderTL, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import fetch from "node-fetch";
import "@testing-library/jest-dom";
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

  const FLAG_ENDPOINT = `http://localhost:4000*`;
  const worker = setupServer();
  let socket: any;

  beforeEach(() => {
    socket = { close: jest.fn() };
    (globalThis as any).fetch = jest.fn(fetch);
    (globalThis as any).WebSocket = jest.fn(() => socket);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(() => worker.listen());
  afterEach(() => worker.resetHandlers());
  afterAll(() => worker.close());

  describe("initial loading (fetch)", () => {
    it("shows the initial flags after loading (newHomepage is false)", () => {
      worker.use(
        rest.get(FLAG_ENDPOINT, (_, res, ctx) => {
          return res(ctx.json({ newHomepage: false }));
        })
      );

      render();

      expect(screen.getByText("Old variant")).toBeInTheDocument();
    });

    it("shows the initial flags after loading (newHomepage is true)", async () => {
      worker.use(
        rest.get(FLAG_ENDPOINT, (_, res, ctx) => {
          return res(ctx.json({ newHomepage: true }));
        })
      );

      render();

      await waitFor(() =>
        expect(screen.getByText("New variant")).toBeInTheDocument()
      );

      expect((global as any).WebSocket).toHaveBeenCalledWith(
        "ws://localhost:1234?client_key=valid-sdk-key"
      );
    });
  });
});
