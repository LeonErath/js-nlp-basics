import { NextApiRequest, NextApiResponse } from "next";

import auth0 from "../../lib/auth0";
import { internalServerError } from "../../util/api.util";

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await auth0.handleLogin(req, res);
  } catch (error) {
    console.error(error);
    internalServerError(res, error);
  }
}
