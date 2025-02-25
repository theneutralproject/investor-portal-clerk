export const textFetchMock =
  (response: string) => async (): Promise<Response> =>
    Promise.resolve({
      ok: true,
      status: 200,
      text: async () => response,
    } as Response);

export const csvEquityMilestoneDataMissingFetchMock =
  async (): Promise<Response> =>
    Promise.resolve({
      ok: true,
      status: 200,
      text: async () => 'date,aUnitReturns,cUnitReturns',
    } as Response);
