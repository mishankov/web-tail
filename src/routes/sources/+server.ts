import type { RequestHandler } from './$types';

import { getConfig } from '$lib/server/config';

export const GET: RequestHandler = async () => {
    return new Response(JSON.stringify(getConfig()["sources"].map((value) => {
        return value["name"];
      })));
};