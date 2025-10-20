import '../../styles/components/posts/PostList.scss';

export default function PostList({ children }) {
    return (
        <div className='post-list'>{children}</div>
    );
};
