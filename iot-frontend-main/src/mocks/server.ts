import { setupServer } from "msw/node";

import { handlers } from "./handlers";

export const serverWorker = setupServer(...handlers);
export default serverWorker;
