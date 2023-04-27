import { Prisma, PrismaClient } from '@prisma/client';
import { Context } from 'apollo-server-core';
import { PubSub } from 'graphql-subscriptions';
import { ISODateString } from 'next-auth';

export interface GraphQLContext {
    session: Session | null;
    prisma: PrismaClient;
    pubsub: PubSub;
}

/**
 * Users
 */
export interface Session {
    user: User;
    expires: ISODateString;
}
export interface User {
    id: string;
    username: string;
    email: string;
    emailVerified: boolean;
    image: string;
    name: string;
}
export interface CreateUsernameResponse {
    success?: boolean;
    error?: string;
}

export interface SubscriptionContext extends Context {
    connectionParams: {
        session?: Session;
    };
}

// export type RecipePopulated = Prisma.RecipeGetPayload<{
//     include: typeof recipePopulated;
// }>;
