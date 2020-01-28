import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const Home = () => {
  const { loading, error, data } = useQuery(gql`
    {
      allUsers {
        id
        email
      }
    }
  `);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  console.log(data);
  return data.allUsers.map(({ id, email }) => <h1 key={id}>{email}</h1>);
}

export default Home;
