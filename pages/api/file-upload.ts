import { NowRequest, NowResponse } from "@vercel/node";
import aws from "aws-sdk";
import { MB_SIZE } from "../../data/filesize";

export default async function handler(req: NowRequest, res: NowResponse) {
	aws.config.update({
		accessKeyId: process.env.ACCESS_KEY,
		secretAccessKey: process.env.SECRET_KEY,
		region: process.env.REGION,
		signatureVersion: "v4",
	});
	console.log(req.query);

	const s3 = new aws.S3();

	const request = s3.createPresignedPost({
		Bucket: process.env.BUCKET_NAME,
		Fields: {
			key: req.query.file,
		},
		Expires: 60,
		Conditions: [
			["content-length-range", 0, MB_SIZE * 50], // up to 50 MB
			["eq", "$x-amz-meta-name", req.query.fileName],
			["eq", "$x-amz-meta-language", req.query.language],
		],
	});
	request.fields["x-amz-meta-name"] = req.query.fileName as any;
	request.fields["x-amz-meta-language"] = req.query.language as any;

	const post = await request;

	res.status(200).json(post);
}
