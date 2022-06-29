import { NextPage } from "next";
import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";

const Dashboard: NextPage = () => {
  const { user } = useAuthContext();

  useEffect(() => {
    api
      .get("/me")
      .then(response => console.log(response))
      .catch();
  }, []);

  return <h1>Dashboard: {user?.email}</h1>;
};

export default Dashboard;
