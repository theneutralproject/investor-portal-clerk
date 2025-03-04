export const textFetchMock =
  (response: string) => async (): Promise<Response> =>
    Promise.resolve({
      ok: true,
      status: 200,
      text: async () => response,
    } as Response);

export const jsonFetchMock =
  (response: Record<string, unknown>) => async (): Promise<Response> =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () => response,
    } as Response);
