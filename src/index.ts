import express from "express";
import {ApolloServer} from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import {prismaClient} from "./lib/db.js";
import "dotenv/config";

async function init(){


const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(express.json());

// Create graphql Server
const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
            say(name: String): String
        }

        type Mutation {
            createUser(
                firstName: String!
                lastName: String!
                email: String!
                password: String!
            ): Boolean
        }
    `,
    resolvers: {
        Query: {
            hello: () => `Hey there, I am a GraphQL server`,
            say: (_: unknown, { name }: { name: string }) =>
                `Hey ${name}, how are you?`
        },
        Mutation: {
            createUser: async (
                _: unknown,
                {
                    firstName,
                    lastName,
                    email,
                    password
                }: {
                    firstName: string;
                    lastName: string;
                    email: string;
                    password: string;
                }
            ) => {
                await prismaClient.user.create({
                    data: {
                        email,
                        firstName,
                        lastName,
                        password,
                        salt: "random_salt"
                    }
                });

                return true;
            }
        }
    }
});

// start graphql server
await gqlServer.start();

app.get("/",(req,res)=>{
    res.json({message:"Hello World!"});
});

app.use("/graphql",expressMiddleware(gqlServer));

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});


}



init();