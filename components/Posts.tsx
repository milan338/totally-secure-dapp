import { Timeline } from '@mantine/core';
import Post from './Post';

export default function Posts() {
    return (
        <Timeline bulletSize={20} pt="lg">
            {Array.apply(null, Array(20)).map((_, i) => (
                <Timeline.Item key={i}>
                    <Post />
                </Timeline.Item>
            ))}
        </Timeline>
    );
}
