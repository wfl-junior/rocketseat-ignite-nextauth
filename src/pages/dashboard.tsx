import { NextPage } from "next";
import { useAuthContext } from "../contexts/AuthContext";

const Dashboard: NextPage = () => {
  const { user } = useAuthContext();

  return <h1>Dashboard: {user?.email}</h1>;
};

export default Dashboard;
