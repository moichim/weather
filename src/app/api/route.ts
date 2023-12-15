import { googleResolvers, googleTypeDefs } from "@/graphql/google";
import { placesResolvers, placesTypeDefs } from "@/graphql/places";
import { weatherResolvers, weatherTypeDefs } from "@/graphql/weather";
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";


const server = new ApolloServer({
    schema: buildSubgraphSchema([

        {
            typeDefs: placesTypeDefs,
            resolvers: placesResolvers,
        },

        {
            typeDefs: weatherTypeDefs,
            resolvers: weatherResolvers,
        },

        {
            typeDefs: googleTypeDefs,
            resolvers: googleResolvers
        }
    
      ]),
});

// Typescript: req has the type NextRequest
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async req => ({ req }),
});

export { handler as GET, handler as POST };
