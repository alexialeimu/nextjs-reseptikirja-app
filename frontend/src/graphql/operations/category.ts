import { gql } from '@apollo/client';

const categoryQueryStrings = {
    Queries: {
        GET_ALL_CATEGORIES: gql`
            query Categories {
                categories {
                    id
                    name
                    # recipes {
                    #     name
                    # }
                }
            }
        `,
    },
    Mutations: {},
    Subscriptions: {},
};

export default categoryQueryStrings;
