import type { User } from "@supabase/supabase-js";

interface PostGeneratorProps {
	user: User;
}

const PostGenerator: React.FC<PostGeneratorProps> = ({ user }) => {
	return <div>Welcome, {user.email}</div>;
};

export default PostGenerator;
