import { useEffect, useState } from 'react';

function initialState(args?) {
	return {
		response: null,
		error: null,
		isLoading: true,
		...args,
	};
}

export default <T,>(url, options = {}): T => {
	const [state, setState] = useState(() => initialState());

	const fetchData = async () => {
		try {
			const res = await fetch(url, {
				...options,
			});

			if (res.status >= 400) {
				setState(
					initialState({
						error: await res.json(),
						isLoading: false,
					})
				);
			} else {
				setState(
					initialState({
						response: await res.json(),
						isLoading: false,
					})
				);
			}
		} catch (error) {
			setState(
				initialState({
					error: {
						error: error.message,
					},
					isLoading: false,
				})
			);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return { ...state, fetchData };
};

export const fetchApi = async <T,>(
	url: string,
	options?: RequestInit
): Promise<T> => {
	const res = await fetch(url, {
		...options,
	});
	return res.json();
};
