import Document, { Head, Main, NextScript, Html } from "next/document";
import { ServerStyleSheet } from "styled-components";

interface Props {
  styleTags: unknown;
}

export default class MyDocument extends Document<Props> {
  static getInitialProps({ renderPage }: any) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(
      (App: any) => (props: any) => sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    const { styleTags } = this.props;
    return (
      <Html>
        <Head>{styleTags as any}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
