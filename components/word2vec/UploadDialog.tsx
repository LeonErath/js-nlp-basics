import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Progress, Select } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import axios from "axios";
import React, { useState } from "react";
import { getLanguage, langauges } from "../../data/languages";

const { Option } = Select;

interface Props {
	isOpen: boolean;
	onOk: () => void;
	onCancel: () => void;
}

export const UploadDialog: React.FC<Props> = (props) => {
	const [form] = Form.useForm();
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	const uploadModel = async () => {
		const data = await form.validateFields();

		const file = files[0];
		const filename = encodeURIComponent(file.name);

		setLoading(true);

		const res = await fetch(
			`/api/file-upload?file=${filename}&fileName=${data.name}&language=${data.language}`
		);

		const { url, fields } = await res.json();
		const formData = new FormData();

		Object.entries({ ...fields, file }).forEach(([key, value]: any) => {
			formData.append(key, value);
		});

		await axios
			.post(url, formData, {
				onUploadProgress: (p) => {
					setProgress(Math.round((100 * p.loaded) / p.total));
				},
			})
			.then((result) => {
				if (result.status === 204) {
					message.success("Your model was uploaded successfully! 🚀");
					props.onOk();
				} else {
					message.error("Your model could not be uploaded.");
				}
			})
			.catch((err: Error) => {
				message.error("An error occured: " + err.message);
			})
			.finally(() => {
				setLoading(false);
				setFiles([]);
			});
	};

	return (
		<Modal
			visible={props.isOpen}
			title="Title"
			onOk={uploadModel}
			onCancel={props.onCancel}
			footer={[
				<Button key="back" onClick={props.onCancel}>
					Cancel
				</Button>,
				<Button
					key="submit"
					type="primary"
					loading={loading}
					icon={<UploadOutlined />}
					onClick={uploadModel}>
					Upload
				</Button>,
			]}>
			<Form form={form} layout="vertical" name="basicForm">
				<Form.Item
					name="model"
					label="Your custom model"
					rules={[
						{
							required: true,
							message: "Please select a custom model to upload.",
						},
					]}>
					<Dragger
						accept="application/json"
						fileList={files}
						multiple={false}
						onRemove={() => setFiles([])}
						beforeUpload={(file) => {
							setFiles([file]);
							if (file.name.includes(".")) {
								form.setFieldsValue({ name: file.name.split(".")[0] });
							} else {
								form.setFieldsValue({ name: file.name });
							}
							return false;
						}}>
						<p className="ant-upload-text">
							<UploadOutlined /> Select a file
						</p>
						<p className="ant-upload-hint">
							Click or drag your model to this area to upload your<br></br>
							custom model. (Max. 50MB)
						</p>
					</Dragger>
				</Form.Item>
				{loading && <Progress percent={progress}></Progress>}
				<Form.Item
					name="name"
					label="Name"
					hidden={files.length === 0}
					style={{ marginTop: "16px" }}
					rules={[{ required: true, message: "Please name your model." }]}>
					<Input placeholder="Name your model..."></Input>
				</Form.Item>
				<Form.Item
					name="language"
					label="Choose a language"
					hidden={files.length === 0}
					style={{ marginTop: "16px" }}
					rules={[
						{
							required: true,
							message: "Please select a language for your model.",
						},
					]}>
					<Select placeholder="Select a language...">
						{langauges.map((l) => (
							<Option key={l} value={l}>
								{getLanguage(l)}
							</Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};
