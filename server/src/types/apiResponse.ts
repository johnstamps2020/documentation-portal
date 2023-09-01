// Test comment
export type ApiResponse = {
  status: number;
  body: any;
};

export type RedirectResponseBody = {
  redirectStatusCode: number;
  redirectUrl: string | null;
};

export type RedirectResponse = ApiResponse & {
  body: RedirectResponseBody;
};
