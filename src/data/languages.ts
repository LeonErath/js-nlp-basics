export const langauges = ["German", "English", "Spannish"];

export const getLanguage = (key: string) => {
	const map = new Map([
		["German", "🇩🇪 German"],
		["English", "🇬🇧 English"],
		["Spannish", "🇪🇸 Spannish"],
	]);

	if (map.has(key)) {
		return map.get(key);
	}
	return key;
};
