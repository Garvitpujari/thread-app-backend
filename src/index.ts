import express from "express";
import createApolloGraphqlServer from "./graphql/index.js";  
import { expressMiddleware } from "@as-integrations/express5";
import UserService from "./services/user.js";
import "dotenv/config";

async function init(){


const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(express.json());

// Create graphql Server


// start graphql server


app.get("/",(req,res)=>{
    res.json({message:"Hello World!"});
});

const gqlServer = await createApolloGraphqlServer();
app.use("/graphql", expressMiddleware(gqlServer, {
    context: async ({ req }) => {
        const token = req.headers['authorization'];

        try {
            const user = UserService.decodeJWTToken(token as string);
            return { user };
        }
        catch (error) {
            console.log('error', error);
        }
    }
}));

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});


}



init();