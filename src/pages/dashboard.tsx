import { NextPage } from "next";
import { Fragment } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
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
  const userCanSeeMetrics = useCan({
    roles: ["administrator", "editor"],
  });

  // useEffect(() => {
  //   api
  //     .get("/me")
  //     .then(response => console.log(response.data))
  //     .catch();
  // }, []);

  return (
    <Fragment>
      <h1>Dashboard: {user?.email}</h1>

      {userCanSeeMetrics && <div>Métricas</div>}
    </Fragment>
  );
};

export default Dashboard;
