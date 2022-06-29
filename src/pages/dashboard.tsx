import { NextPage } from "next";
import { Fragment } from "react";
import { Can } from "../components/Can";
import { useAuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export const getServerSideProps = withSSRAuth(async context => {
  const api = getAPIClient(context);
  await api.get("/me");

  return {
    props: {},
  };
});

const Dashboard: NextPage = () => {
  const { user } = useAuthContext();

  // useEffect(() => {
  //   api
  //     .get("/me")
  //     .then(response => console.log(response.data))
  //     .catch();
  // }, []);

  return (
    <Fragment>
      <h1>Dashboard: {user?.email}</h1>

      <Can permissions={["metrics.list"]}>
        <div>Métricas</div>
      </Can>
    </Fragment>
  );
};

export default Dashboard;
