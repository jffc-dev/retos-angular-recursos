import { environment } from "../../environments/environment";

export const SUPABASE_REST_URL = `${environment.supabaseApi}/rest/v1`;

export const SUPABASE_HEADERS = {
  apikey: environment.supabaseKey,
};
