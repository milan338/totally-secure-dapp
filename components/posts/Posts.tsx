import { useEffect } from 'react';
import { Timeline } from '@mantine/core';
import { useUser } from 'components/context/UserContext';
import { usePosts } from 'components/context/PostsContext';
import Post from './Post';

export default function Posts() {
    const { user } = useUser();
    const { posts, dispatchPosts } = usePosts();
    useEffect(() => {
        dispatchPosts({ clearPosts: true });
        const getPosts = async () => {
            if (!user.contract) return;
            const nPosts = await user.contract.nPosts();
            for (let i = 0; i < nPosts.toBigInt(); i++) {
                const post = await user.contract._posts(i);
                dispatchPosts({ addPost: post });
            }
        };
        getPosts();
    }, [user, dispatchPosts]);
    return (
        <Timeline bulletSize={20} pt="lg">
            {posts
                .slice(0)
                .reverse()
                .map((post, i) => (
                    <Timeline.Item key={`post-${i}`}>
                        <Post title={post.title} content={post.content} />
                    </Timeline.Item>
                ))}
        </Timeline>
    );
}
