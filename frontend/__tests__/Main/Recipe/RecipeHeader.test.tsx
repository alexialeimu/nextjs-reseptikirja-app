import React from 'react';
import {
    render,
    screen,
    queryByTestId,
    fireEvent,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import RecipeHeader from '../../../src/components/Main/Recipe/RecipeHeader';
import '@testing-library/jest-dom';
import RecipeOperations from '../../../src/graphql/operations/recipe';
import mockRouter from 'next-router-mock';
import {
    recipeMockData,
    sessionMockData,
} from '../../../__mocks__/mockData';

jest.mock('next/router', () => require('next-router-mock'));

const recipeData = {
    recipe: recipeMockData,
};

const mocks = [
    {
        request: {
            query: RecipeOperations.Queries.GET_RECIPE,
            variables: { id: '1' },
        },
        result: {
            data: {
                recipe: recipeMockData,
            },
        },
    },
];

describe('Recipe Header', () => {
    it('renders recipe name, servings, cook time, user, link and button components correctly', async () => {
        const { getByText } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <RecipeHeader
                    session={sessionMockData}
                    recipeData={recipeData}
                    recipeLoading={false}
                />
            </MockedProvider>
        );
        const recipeNameElement = getByText('Lemon-fudge');
        expect(recipeNameElement).toBeInTheDocument();

        const recipeServingsElement = getByText('12 servings');
        expect(recipeServingsElement).toBeInTheDocument();

        const recipeCookTimeElement = getByText('Cooks in 5 min');
        expect(recipeCookTimeElement).toBeInTheDocument();

        const recipeUserElement = getByText('Added by matti');
        expect(recipeUserElement).toBeInTheDocument();

        const recipeLinkElement = getByText('https://www.google.fi');
        expect(recipeLinkElement).toBeInTheDocument();

        const descriptionElement = queryByTestId(
            document.body,
            'descriptionElement'
        );
        expect(descriptionElement).toBeNull();

        expect(screen.getByTestId('backButton')).toBeInTheDocument();
        expect(screen.getByTestId('menuButton')).toBeInTheDocument();
        expect(screen.getByTestId('menuList')).toBeInTheDocument();
        expect(
            screen.getByTestId('servingsIcon')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('cookTimeIcon')
        ).toBeInTheDocument();
    });

    const recipeMock = {
        request: {
            query: RecipeOperations.Queries.GET_RECIPE,
            variables: { id: '2' },
        },
        error: new Error('An error occurred'),
    };
    it('should show error UI', async () => {
        render(
            <MockedProvider mocks={[recipeMock]} addTypename={false}>
                <RecipeHeader
                    session={sessionMockData}
                    recipeData={undefined}
                    recipeLoading={false}
                />
            </MockedProvider>
        );

        expect(
            await screen.findByText('Recipe Not Found')
        ).toBeInTheDocument();
    });

    it('should navigate to the home page when Back button is clicked', () => {
        // Set the initial url:
        mockRouter.push('/?recipeId=6465340c0c267d1727e3');

        // Render the component
        const { getByTestId } = render(
            <MockedProvider mocks={[recipeMock]} addTypename={false}>
                <RecipeHeader
                    session={sessionMockData}
                    recipeData={undefined}
                    recipeLoading={false}
                />
            </MockedProvider>
        );
        const backButton = getByTestId('backButton');

        // Simulate a click event on the Back button
        fireEvent.click(backButton);

        // Assert that the replace function of the router is called with the expected arguments
        expect(mockRouter).toMatchObject({
            asPath: '/',
            pathname: '/',
            query: {},
        });
    });
});
