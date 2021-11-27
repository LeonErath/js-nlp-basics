// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
	export interface DefaultTheme {
		primaryColor: string;
		lighgray: string;
		screenSmallPortrait: string;
		screenMediumPortrait: string;
		screenLargePortrait: string;
	}
}
