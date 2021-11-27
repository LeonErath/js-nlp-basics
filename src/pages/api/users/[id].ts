import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import auth0 from "../../../lib/auth0";
import { internalServerError } from "../../../util/api.util";

const userHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === "GET") {
    return getUser(req, res);
  }
  if (method === "PATCH") {
    return updateUser(req, res);
  }

  return getUser(req, res);
};

const getUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const {
      query: { id },
    } = req;
    const tokenCache = auth0.tokenCache(req, res);
    const { accessToken } = await tokenCache.getAccessToken({
      scopes: ["read:current_user"],
    });

    const response = await fetch(
      "https://nlp-basics.eu.auth0.com/api/v2/users/" + id,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userInfo = await response.json();
    res.status(200).json(userInfo);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status((error as any).status ?? 500).end(error.message);
    }
  }
};

const updateUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const {
      query: { id },
      body,
    } = req;

    const tokenCache = auth0.tokenCache(req, res);
    const { accessToken } = await tokenCache.getAccessToken({
      scopes: ["update:current_user_metadata", "read:current_user"],
    });
    console.log("BODY", body);

    const userInfo = await axios({
      url: "https://nlp-basics.eu.auth0.com/api/v2/users/" + id,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: body,
    });

    res.status(200).json(userInfo);
  } catch (error) {
    console.error(error);
    internalServerError(res, error);
  }
};

export default auth0.requireAuthentication(userHandler);
