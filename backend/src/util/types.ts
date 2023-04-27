import { Prisma, PrismaClient } from '@prisma/client';
import { Context } from 'apollo-server-core';
import { PubSub } from 'graphql-subscriptions';
import { ISODateString } from 'next-auth';
import { recipePopulated } from '../graphql/resolvers/recipe';

/**
 * Server Configuration
 */
export interface Session {
    user: User;
    expires: ISODateString;
}

export interface GraphQLContext {
    session: Session | null;
    prisma: PrismaClient;
    pubsub: PubSub;
}

export interface SubscriptionContext extends Context {
    connectionParams: {
        session?: Session;
    };
}

/**
 * Users
 */
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

/**
 * Recipes
 */
export type RecipePopulated = Prisma.RecipeGetPayload<{
    include: typeof recipePopulated;
}>;
