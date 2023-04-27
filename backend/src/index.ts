import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import { PrismaClient } from '@prisma/client';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import http from 'http';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { getSession } from 'next-auth/react';
import * as dotenv from 'dotenv';
import {
    GraphQLContext,
    Session,
    SubscriptionContext,
} from './util/types';
import cors from 'cors';
import { json } from 'body-parser';

async function main() {
    dotenv.config();
    const app = express();
    const httpServer = http.createServer(app);

    // Create our WebSocket server using the HTTP server we just set up.
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql/subscriptions',
    });

    // Context parameters
    const prisma = new PrismaClient();
    const pubsub = new PubSub();

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    // Save the returned server's info so we can shutdown this server later
    const serverCleanup = useServer(
        {
            schema,
            context: async (
                ctx: SubscriptionContext
            ): Promise<GraphQLContext> => {
                if (
                    ctx.connectionParams &&
                    ctx.connectionParams.session
                ) {
                    const { session } = ctx.connectionParams;

                    return { session, prisma, pubsub };
                }

                return { session: null, prisma, pubsub };
            },
        },
        wsServer
    );

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),
            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    await server.start();

    const corsOptions = {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
    };

    app.use(
        '/graphql',
        cors<cors.CorsRequest>(corsOptions),
        json(),
        expressMiddleware(server, {
            context: async ({ req }): Promise<GraphQLContext> => {
                const session = await getSession({ req });

                return {
                    session: session as Session,
                    prisma,
                    pubsub,
                };
            },
        })
    );

    const PORT = 4000;

    await new Promise<void>((resolve) =>
        httpServer.listen({ port: PORT }, resolve)
    );
    console.log(
        `🚀 Server is now running on http://localhost:${PORT}/graphql`
    );
}

main().catch((err) => console.log(err));
