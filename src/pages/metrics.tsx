import { NextPage } from "next";
import { Fragment } from "react";
import { getAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export const getServerSideProps = withSSRAuth(
  async context => {
    const api = getAPIClient(context);
    await api.get("/me");

    return {
      props: {},
    };
  },
  {
    permissions: ["metrics.list"],
    roles: ["administrator"],
  },
);

const Metrics: NextPage = () => (
  <Fragment>
    <h1>Metrics</h1>
  </Fragment>
);

export default Metrics;
