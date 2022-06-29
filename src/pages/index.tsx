import { NextPage } from "next";
import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { withSSRGuest } from "../utils/withSSRGuest";

export const getServerSideProps = withSSRGuest();

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuthContext();

  return (
    <form
      noValidate
      onSubmit={async e => {
        e.preventDefault();

        setIsLoading(true);

        await signIn({
          email,
          password,
        });

        setIsLoading(false);
      }}
    >
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="E-mail"
      />

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Senha"
      />

      <button type="submit" disabled={isLoading}>
        Entrar
      </button>
    </form>
  );
};

export default Home;
