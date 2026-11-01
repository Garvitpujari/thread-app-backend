import express from "express";
import {ApolloServer} from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

async function init(){


const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(express.json());

// Create graphql Server

const gqlServer= new ApolloServer({
    typeDefs:`
       type Query{
          hello:String 
          say(name:String):String
       }

    `,
    resolvers:{
        Query:{
            hello : ()=> `Hey there , I m a graphql server`,
            say: (_,{name}: {name:string})=> `Hey ${name} , How are you ? `
        }, 

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