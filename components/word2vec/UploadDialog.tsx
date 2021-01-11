import {
	CheckCircleTwoTone,
	DeleteOutlined,
	LoadingOutlined,
	StopOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Progress, Select } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import axios from 'axios';
import word2vec from './Word2Vec';
import React, { useEffect, useState } from 'react';
import { getLanguage, langauges } from '../../data/languages';

const { Option } = Select;

interface Props {
	isOpen: boolean;
	onOk: () => void;
	onCancel: () => void;
}

const wordVectors = word2vec();

export const UploadDialog: React.FC<Props> = (props) => {
	const [form] = Form.useForm();
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [content, setContent] = useState(null);
	const [loadingModel, setLoadingModel] = useState(false);
	const [modelValid, setModelValid] = useState(null);

	useEffect(() => {
		setLoadingModel(true);
		wordVectors
			.dispose()
			.loadModel(JSON.parse(content))
			.then(() => {
				setModelValid(true);
			})
			.catch((err) => {
				console.error(err);
				setModelValid(false);
			})
			.finally(() => {
				setLoadingModel(false);
			});
	}, [content]);

	const uploadModel = async () => {
		const data = await form.validateFields();

		if (!modelValid) {
			return;
		}

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
					message.success('Your model was uploaded successfully! 🚀');
					setFiles([]);
					setContent(null);
					setModelValid(null);
					props.onOk();
				} else {
					message.error('Your model could not be uploaded.');
				}
			})
			.catch((err: Error) => {
				message.error('An error occured: ' + err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const readSingleFile = (file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			setContent(e.target.result);
		};
		reader.readAsText(file);
	};

	return (
		<Modal
			style={{ width: 600 }}
			visible={props.isOpen}
			title="Title"
			onOk={uploadModel}
			onCancel={props.onCancel}
			footer={[
				<Button key="back" onClick={props.onCancel}>
					Cancel
				</Button>,
				<Button
					disabled={!modelValid}
					key="submit"
					type="primary"
					loading={loading}
					icon={<UploadOutlined />}
					onClick={uploadModel}
				>
					Upload
				</Button>,
			]}
		>
			<Form form={form} layout="vertical" name="basicForm">
				<Form.Item
					name="model"
					label="Your custom model"
					rules={[
						{
							required: true,
							message: 'Please select a custom model to upload.',
						},
					]}
				>
					<Dragger
						accept="application/json"
						fileList={files}
						multiple={false}
						onRemove={() => {
							setFiles([]);
							setContent(null);
							setModelValid(null);
						}}
						itemRender={(item, file) => {
							return (
								<>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											margin: '4px',
										}}
									>
										{file.name}
										<div
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
											{loadingModel && (
												<LoadingOutlined />
											)}
											{modelValid ? (
												<CheckCircleTwoTone
													twoToneColor="#52c41a"
													style={{ margin: '4px' }}
												/>
											) : (
												<StopOutlined
													style={{
														margin: '4px',
														fill: '#c70303',
													}}
												/>
											)}
											<Button
												size="small"
												shape="circle"
												onClick={() => {
													setFiles([]);
													setContent(null);
													setModelValid(null);
												}}
												icon={<DeleteOutlined />}
											></Button>
										</div>
									</div>

									{loading && (
										<Progress percent={progress}></Progress>
									)}
								</>
							);
						}}
						beforeUpload={(file) => {
							readSingleFile(file);

							setFiles([file]);
							if (file.name.includes('.')) {
								form.setFieldsValue({
									name: file.name.split('.')[0],
								});
							} else {
								form.setFieldsValue({ name: file.name });
							}
							return false;
						}}
					>
						<p className="ant-upload-text">
							<UploadOutlined /> Select a file
						</p>
						<p className="ant-upload-hint">
							Click or drag your model to this area to upload your
							<br></br>
							custom model. (Max. 50MB)
						</p>
					</Dragger>
				</Form.Item>

				<Form.Item
					name="name"
					label="Name"
					hidden={files.length === 0}
					style={{ marginTop: '16px' }}
					rules={[
						{ required: true, message: 'Please name your model.' },
					]}
				>
					<Input placeholder="Name your model..."></Input>
				</Form.Item>
				<Form.Item
					name="language"
					label="Choose a language"
					hidden={files.length === 0}
					style={{ marginTop: '16px' }}
					rules={[
						{
							required: true,
							message: 'Please select a language for your model.',
						},
					]}
				>
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
