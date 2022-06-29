import { NextPage } from "next";
import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export const getServerSideProps = withSSRAuth(async context => {
  const api = getAPIClient(context);
  const response = await api.get("/me");
  console.log(response.data);

  return {
    props: {},
  };
});

const Dashboard: NextPage = () => {
  const { user } = useAuthContext();

  useEffect(() => {
    api
      .get("/me")
      .then(response => console.log(response.data))
      .catch();
  }, []);

  return <h1>Dashboard: {user?.email}</h1>;
};

export default Dashboard;
