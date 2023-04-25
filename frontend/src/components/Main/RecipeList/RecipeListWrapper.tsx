import { Session } from 'next-auth';

interface RecipeListWrapperProps {
    session: Session;
}

const RecipeListWrapper: React.FC<RecipeListWrapperProps> = ({
    session,
}) => {
    return <div>RecipeListWrapper</div>;
};

export default RecipeListWrapper;
