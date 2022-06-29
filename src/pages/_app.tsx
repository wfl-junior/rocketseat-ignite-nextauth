import { AppProps } from "next/app";
import { AuthContextProvider } from "../contexts/AuthContext";
import "../styles/globals.css";

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <AuthContextProvider>
    <Component {...pageProps} />
  </AuthContextProvider>
);

export default App;
