import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = ((event) => {
  throw error(404, "Not Found");
}) satisfies PageLoad;
