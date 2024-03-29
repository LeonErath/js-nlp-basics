import "antd/dist/antd.css";
import React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import Navbar from "./navigation/Navbar";
import { useFetchUser, UserProvider } from "../lib/authentication/user";
import { myTheme } from "../styles/Theme";
import RedirectToLogin from "./login-redirect";
import { LoadingSpinner } from "./LoadingSpinner";
import Sidebar from "./navigation/Sidebar";

const GlobalStyle = createGlobalStyle`
	html,body {
		box-sizing: border-box;
		height: 100%;
	}

	#__next {
		height: 100%;
	}
`;

const Page = (props: any) => {
  const { user, loading } = useFetchUser();

  if (!user && !loading) {
    return <RedirectToLogin />;
  }

  if (loading) {
    return <LoadingSpinner text="Signing you in..." />;
  }

  return (
    <UserProvider value={{ user, loading }}>
      <ThemeProvider theme={myTheme}>
        <GlobalStyle />
        <div
          style={{
            height: "100%",
            display: "flex",
            flexFlow: "column",
          }}
        >
          <Navbar />
          <div
            style={{
              height: "100%",
              display: "flex",
              flexFlow: "row",
            }}
          >
            <Sidebar />
            {props.children}
          </div>
        </div>
      </ThemeProvider>
    </UserProvider>
  );
};

export default Page;
