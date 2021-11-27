import { NextApiResponse } from "next";

export const internalServerError = (res: NextApiResponse, error: unknown) => {
  res.status((error as any).status ?? 500).end((error as any).message ?? "");
};
