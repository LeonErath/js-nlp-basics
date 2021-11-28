import { booleanObjectType } from 'aws-sdk/clients/iam';
import useApi, { fetchApi } from './use-api';

export interface Identity {
	connection: string;
	user_id: string;
	provider: string;
	isSocial: booleanObjectType;
}

export interface UserInfo {
	user_id?: string;
	email?: string;
	email_verified?: boolean;
	username?: string;
	phone_number?: string;
	phone_verified?: false;
	created_at?: string;
	updated_at?: string;
	identities?: Identity[];
	app_metadata?: any;
	user_metadata?: any;
	picture?: string;
	name?: string;
	nickname?: string;
	multifactor?: string[];
	last_ip?: string;
	last_login?: string;
	logins_count?: number;
	blocked?: boolean;
	given_name?: string;
	family_name?: string;
}

export interface UserInfoRequest {
	response: UserInfo | null;
	error: any | null;
	isLoading: boolean;
}

export const useUserInfo = (id: string) =>
	useApi<UserInfoRequest>(`/api/users/${id}`);

export const updateUserInfo = (id: string, userInfo: UserInfo) =>
	fetchApi<UserInfo>(`/api/users/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(userInfo),
	});
