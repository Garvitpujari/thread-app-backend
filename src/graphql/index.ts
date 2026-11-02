
import { ApolloServer } from "@apollo/server";
//import createApolloGraphqlServer from "./graphql/index.js";
import { User } from "./user/index.js";

async function createApolloGraphqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: `
            ${User.typeDefs}

            type Query {
                ${User.queries}

                # getContext resolver
                getContext: String
            }

            type Mutation {
                ${User.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
            },
            Mutation: {
                ...User.resolvers.mutations
            }
        }
    });

    await gqlServer.start();

    return gqlServer;
}

export default createApolloGraphqlServer;
