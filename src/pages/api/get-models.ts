import aws from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { MB_SIZE } from "../../data/filesize";

export type Model = {
  id: string;
  key: string;
  size: number;
  lastModified: string;
  url: string;
} & (aws.S3.Metadata | undefined);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: "v4",
  });

  const s3 = new aws.S3();

  const params = {
    Bucket: process.env.BUCKET_NAME || "",
  };

  const data = await s3.listObjectsV2(params).promise();

  const promises = data.Contents?.map((o) => {
    return new Promise((resolve, reject) => {
      if (!o || !o.Key) {
        return reject("No key found");
      }

      s3.headObject({
        Bucket: params.Bucket,
        Key: o.Key,
      })
        .promise()
        .then((headObject) => {
          resolve({
            id: o.ETag,
            key: o.Key,
            size: Math.round((100 * (o.Size ?? 0)) / MB_SIZE) / 100,
            lastModified: o.LastModified,
            url: `https://nlp-modals.s3.eu-central-1.amazonaws.com/${o.Key}`,
            ...headObject.Metadata,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  });

  const result = (await Promise.allSettled(promises as any[]))
    .filter((res) => res.status === "fulfilled")
    .map((res: any) => res.value);

  return res.status(200).json(result);
}
