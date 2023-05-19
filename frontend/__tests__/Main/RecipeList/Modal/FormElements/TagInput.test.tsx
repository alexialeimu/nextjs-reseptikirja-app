import React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    getAllByText,
    queryByText,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryOperations from '../../../../../src/graphql/operations/category';
import { allCategoriesMockData } from '../../../../../__mocks__/mockData';
import { MockedProvider } from '@apollo/client/testing';
import TagInput from '../../../../../src/components/Main/RecipeList/Modal/FormElements/TagInput';

const mockGetAllRecipes = [
    {
        request: {
            query: CategoryOperations.Queries.GET_ALL_CATEGORIES,
        },
        result: {
            data: allCategoriesMockData,
        },
    },
];

describe('Modal form > Tag Input', () => {
    it('renders title and tag components correctly', async () => {
        const { getByText } = render(
            <MockedProvider
                mocks={mockGetAllRecipes}
                addTypename={false}
            >
                <TagInput
                    title="Categories"
                    data={allCategoriesMockData.categories.map(
                        (i) => i.name
                    )}
                    helpText=""
                    changeCategories={() => {}}
                />
            </MockedProvider>
        );

        const titleElement = getByText('Categories');
        expect(titleElement).toBeInTheDocument();

        await waitFor(() => {
            allCategoriesMockData.categories.forEach((category) => {
                const categoryTag = getByText(category.name);
                expect(categoryTag).toBeInTheDocument();
            });
        });
    });

    it('when tag is clicked, it should change "selected" element to "not selected" and vice versa', async () => {
        // Arrange
        render(
            <MockedProvider
                mocks={mockGetAllRecipes}
                addTypename={false}
            >
                <TagInput
                    title="Categories"
                    data={allCategoriesMockData.categories
                        .slice(0, 2)
                        .map((i) => i.name)}
                    helpText=""
                    changeCategories={() => {}}
                />
            </MockedProvider>
        );

        /**
         * Let's first test the first element of category mock data
         * that it initially "selected"
         */
        const tagElement = await screen.findByText(
            allCategoriesMockData.categories[0].name
        );
        expect(tagElement).toBeInTheDocument();

        let siblingElement = tagElement.nextSibling;

        while (siblingElement) {
            if (siblingElement.textContent === 'Selected') {
                // Found the sibling element with text "Selected"
                break;
            }
            siblingElement = siblingElement.nextSibling;
        }

        expect(siblingElement).toBeInTheDocument();

        // user clicks the tag:
        fireEvent.click(tagElement);

        while (siblingElement) {
            if (siblingElement.textContent === 'Not selected') {
                // Found the sibling element with text "Selected"
                break;
            }
            siblingElement = siblingElement.nextSibling;
        }

        expect(siblingElement).toBeInTheDocument();

        /**
         * Let's then test the last element of category mock data
         * that it initially "not selected"
         */
        const tagElement2 = await screen.findByText(
            allCategoriesMockData.categories[
                allCategoriesMockData.categories.length - 1
            ].name
        );
        expect(tagElement2).toBeInTheDocument();

        let siblingElement2 = tagElement2.nextSibling;

        while (siblingElement2) {
            if (siblingElement2.textContent === 'Not selected') {
                // Found the sibling element with text "Selected"
                break;
            }
            siblingElement2 = siblingElement2.nextSibling;
        }

        expect(siblingElement2).toBeInTheDocument();

        // user clicks the tag:
        fireEvent.click(tagElement2);

        while (siblingElement2) {
            if (siblingElement2.textContent === 'Selected') {
                // Found the sibling element with text "Selected"
                break;
            }
            siblingElement2 = siblingElement2.nextSibling;
        }

        expect(siblingElement2).toBeInTheDocument();
    });

    it("when tag entered + ',' pressed, tag should be added to the list with 'selected' and the text field emptied", async () => {
        const { queryByText } = render(
            <MockedProvider
                mocks={mockGetAllRecipes}
                addTypename={false}
            >
                <TagInput
                    title="Categories"
                    data={allCategoriesMockData.categories
                        .slice(0, 2)
                        .map((i) => i.name)}
                    helpText=""
                    changeCategories={() => {}}
                />
            </MockedProvider>
        );
        const inputElement = await screen.findByTestId('input-field');

        fireEvent.change(inputElement, {
            target: { value: 'New category' },
        });
        fireEvent.keyDown(inputElement, { key: ',', code: 'Comma' });

        expect(queryByText('New category')).toBeInTheDocument();
        expect((inputElement as HTMLInputElement).value).toBe('');
    });

    it("when '×' is clicked, the tag should be removed", async () => {
        const { queryByText } = render(
            <MockedProvider
                mocks={mockGetAllRecipes}
                addTypename={false}
            >
                <TagInput
                    title="Categories"
                    data={allCategoriesMockData.categories
                        .slice(0, 2)
                        .map((i) => i.name)}
                    helpText=""
                    changeCategories={() => {}}
                />
            </MockedProvider>
        );

        const inputElement = await screen.findByTestId('input-field');

        fireEvent.change(inputElement, {
            target: { value: 'Food category' },
        });
        fireEvent.keyDown(inputElement, { key: ',', code: 'Comma' });

        const tagElement = queryByText('Food category');
        expect(tagElement).toBeInTheDocument();

        if (!tagElement) return;
        // find the sibling element ("×" element)
        let siblingElement = tagElement && tagElement.nextSibling;

        while (siblingElement) {
            if (siblingElement.textContent === '×') {
                // Found the sibling element with text "×"
                break;
            }
            siblingElement = siblingElement.nextSibling;
        }

        expect(siblingElement).toBeInTheDocument();

        // user clicks "×":
        fireEvent.click(siblingElement as Element);

        expect(siblingElement).not.toBeInTheDocument();
    });
});
