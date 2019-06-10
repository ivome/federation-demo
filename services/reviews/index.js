const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Review @key(fields: "id") {
    id: ID!
    body: String
    author: User
    product: Product
  }

  extend type User @key(fields: "username") {
    username: String @external
    reviews: [Review]
  }

  extend type Product @key(fields: "upc") {
    upc: String! @external
    reviews: [Review]
  }
`;

const resolvers = {
  Review: {
    author(review) {
      return { __typename: "User", username: '@ada' };
    }
  },
  User: {
    reviews(user) {
      return reviews.filter(review => review.authorID === user.id);
    },
    numberOfReviews(user) {
      return reviews.filter(review => review.authorID === user.id).length;
    },
    username(user) {
      if (user.username) return user.username;
      const found = usernames.find(username => username.id === user.id);
      return found ? found.username : null;
    }
  },
  Product: {
    reviews(product) {
      return reviews.filter(review => review.product.upc === product.upc);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const usernames = [
  { id: "1", username: "@ada" },
  { id: "2", username: "@complete" }
];
const reviews = [
  {
    id: "1",
    authorUsername: "@ada",
    product: { upc: "1" },
    body: "Love it!"
  },
  {
    id: "2",
    authorUsername: "@ada",
    product: { upc: "2" },
    body: "Too expensive."
  },
  {
    id: "3",
    authorUsername: "@ada",
    product: { upc: "3" },
    body: "Could be better."
  },
  {
    id: "4",
    authorUsername: "@ada",
    product: { upc: "1" },
    body: "Prefer something else."
  }
];
