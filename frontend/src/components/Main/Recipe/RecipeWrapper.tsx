import { Session } from 'next-auth';

interface RecipeWrapperProps {
    session: Session;
}

const RecipeWrapper: React.FC<RecipeWrapperProps> = ({ session }) => {
    return <div>RecipeWrapper</div>;
};

export default RecipeWrapper;
