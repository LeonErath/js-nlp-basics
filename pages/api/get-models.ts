import { ok } from "assert";
import aws from "aws-sdk";

export default async function handler(req, res) {
	aws.config.update({
		accessKeyId: process.env.ACCESS_KEY,
		secretAccessKey: process.env.SECRET_KEY,
		region: process.env.REGION,
		signatureVersion: "v4",
	});

	const s3 = new aws.S3();

	const params = {
		Bucket: process.env.BUCKET_NAME,
	};

	const data = await s3.listObjectsV2(params).promise();

	const promises = data.Contents?.map((o) => {
		return new Promise((resolve, reject) => {
			s3.headObject({
				Bucket: process.env.BUCKET_NAME,
				Key: o.Key,
			})
				.promise()
				.then((headObject) => {
					resolve({
						id: o.ETag,
						key: o.Key,
						size: o.Size,
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

	const result = (await Promise.allSettled(promises))
		.filter((res) => res.status === "fulfilled")
		.map((res: any) => res.value);

	return res.status(200).json(result);
}
