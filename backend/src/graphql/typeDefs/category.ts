import gql from 'graphql-tag';

const typeDefs = gql`
    type Category {
        id: String
        name: String
        recipes: [Recipe]
    }

    type Query {
        categories: [Category]
    }
`;

export default typeDefs;
