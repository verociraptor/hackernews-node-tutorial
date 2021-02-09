const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client')
const { PubSub } = require('apollo-server')

const pubsub = new PubSub()
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();
const { getUserId } = require('./utils');
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

// 1


const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
}


// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub, 
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  }
});

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
    );