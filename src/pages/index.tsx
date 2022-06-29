import { NextPage } from "next";
import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuthContext();

  return (
    <form
      className={styles.container}
      noValidate
      onSubmit={async e => {
        e.preventDefault();

        await signIn({
          email,
          password,
        });
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

      <button type="submit">Entrar</button>
    </form>
  );
};

export default Home;
