import { NextApiRequest, NextApiResponse } from "next";

import auth0 from "../../lib/authentication/auth0";
import { internalServerError } from "../../util/api.util";

export default async function me(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await auth0.handleProfile(req, res);
  } catch (error) {
    console.error(error);
    internalServerError(res, error);
  }
}
