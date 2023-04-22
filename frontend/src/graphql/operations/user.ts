import { gql } from '@apollo/client';

const userQueryStrings = {
    Queries: {},
    Mutations: {
        createUsername: gql`
            mutation CreateUsername($username: String!) {
                createUsername(username: $username) {
                    success
                    error
                }
            }
        `,
    },
    Subscriptions: {},
};

export default userQueryStrings;
