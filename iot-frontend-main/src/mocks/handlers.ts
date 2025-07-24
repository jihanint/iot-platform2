import { rest } from "msw";

// mock data
import { loginResponse } from "./data/login";

export const handlers = [
  rest.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, (_req, res, ctx) => {
    return res(ctx.delay(1500), ctx.status(200), ctx.json({ statusCode: 200, message: "success", ...loginResponse }));
  }),
];
