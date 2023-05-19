import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteModal from '../../../../src/components/Main/RecipeList/Modal/DeleteModal';
import '@testing-library/jest-dom';
import RecipeOperations from '../../../../src/graphql/operations/recipe';
import mockRouter from 'next-router-mock';
import { recipeMockData } from '../../../../__mocks__/mockData';
import RecipeHeader from '@/src/components/Main/Recipe/RecipeHeader';
import { MockedProvider } from '@apollo/client/testing';

jest.mock('next/router', () => require('next-router-mock'));

const recipeData = {
    recipe: recipeMockData,
};

const mockDeleteRecipe = [
    {
        request: {
            query: RecipeOperations.Mutations.DELETE_RECIPE,
            variables: { recipeId: '6465340c0c267d1727e3' },
        },
        result: {
            data: {
                success: true,
            },
        },
    },
];

describe('Delete Modal', () => {
    it('renders delete modal (verification text, cancel/delete buttons) correctly', async () => {
        const { getByText } = render(
            <MockedProvider
                mocks={mockDeleteRecipe}
                addTypename={false}
            >
                <DeleteModal
                    recipe={recipeData}
                    isOpen={true}
                    onClose={() => {}}
                />
            </MockedProvider>
        );

        const verficationElement = getByText(
            'Are you sure you want to delete Lemon-fudge?'
        );
        expect(verficationElement).toBeInTheDocument();

        expect(
            screen.getByTestId('cancelButton')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('deleteButton')
        ).toBeInTheDocument();
    });

    it('on delete, update router', async () => {
        const mockDeleteRecipe = [
            {
                request: {
                    query: RecipeOperations.Mutations.DELETE_RECIPE,
                    variables: { recipeId: '6465340c0c267d1727e3' },
                },
                result: {
                    data: {
                        success: true,
                    },
                },
            },
        ];

        render(
            <MockedProvider
                mocks={mockDeleteRecipe}
                addTypename={false}
            >
                <DeleteModal
                    recipe={recipeData}
                    isOpen={true}
                    onClose={() => {}}
                />
            </MockedProvider>
        );

        // Click the button:
        fireEvent.click(screen.getByTestId('deleteButton'));

        // Ensure the router was updated:
        expect(mockRouter).toMatchObject({
            asPath: '',
            pathname: '',
            query: {},
        });
    });
});
