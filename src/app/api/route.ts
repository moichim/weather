import { googleResolvers, googleTypeDefs } from "@/graphql/google/google";
import { integratedResolvers, integratedTypeDefs } from "@/graphql/integratedRoutes";
import { weatherResolvers, weatherTypeDefs } from "@/graphql/weather/weather";
import { thermoResolvers, thermoTypeDefs } from "@/thermal/providers/lrcProvider";
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";


const server = new ApolloServer({
    schema: buildSubgraphSchema([

        {
            typeDefs: weatherTypeDefs,
            resolvers: weatherResolvers,
        },

        {
            typeDefs: googleTypeDefs,
            resolvers: googleResolvers
        },

        {
            typeDefs: integratedTypeDefs,
            resolvers: integratedResolvers
        },

        {
            typeDefs: thermoTypeDefs,
            resolvers: thermoResolvers
        }

    ]),
});

// Typescript: req has the type NextRequest
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async req => ({ req }),
});

export { handler as GET, handler as POST };
