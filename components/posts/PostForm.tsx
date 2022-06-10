import { useState, useRef } from 'react';
import { Modal, Stack, TextInput, Textarea, Group, Button } from '@mantine/core';
import { useUser } from 'components/context/UserContext';
import { usePosts } from 'components/context/PostsContext';
import type { Dispatch, SetStateAction } from 'react';
import type { ContractTransaction } from 'ethers';
import type { PostPublishedEvent, PostEditedEvent } from 'ethtypes/TotallySecureDapp';

interface PostFormProps {
    modalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    editingIndex?: number;
}

export default function PostForm(props: PostFormProps) {
    const { modalOpen, setModalOpen, editingIndex } = props;
    const { user } = useUser();
    const { dispatchPosts } = usePosts();
    const [titleErr, setTitleErr] = useState(false);
    const [contentErr, setContentErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const titleRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const onSubmit = async () => {
        if (!titleRef.current || !contentRef.current || !user.contract || !user.provider) return;
        const err = { title: false, content: false };
        if (!titleRef.current.value) err.title = true;
        if (!contentRef.current.value) err.content = true;
        setTitleErr(err.title);
        setContentErr(err.content);
        if (err.title || err.content) return;
        setLoading(true);
        try {
            if (editingIndex !== undefined) {
                const tx: ContractTransaction = await user.contract.editPost(
                    editingIndex,
                    titleRef.current.value,
                    contentRef.current.value
                );
                const receipt = await tx.wait();
                const editEvents = receipt.events?.filter((e) => {
                    return e.event === 'PostEdited';
                });
                if (editEvents) {
                    const [event] = editEvents as Array<PostEditedEvent>;
                    const { index } = event.args;
                    const newPost = await user.contract._posts(index);
                    dispatchPosts({ editPost: { i: index.toNumber(), post: newPost } });
                }
            } else {
                const tx: ContractTransaction = await user.contract.addPost(
                    titleRef.current.value,
                    contentRef.current.value
                );
                const receipt = await tx.wait();
                const publishEvents = receipt.events?.filter((e) => {
                    return e.event === 'PostPublished';
                });
                if (publishEvents) {
                    const [event] = publishEvents as Array<PostPublishedEvent>;
                    const { index } = event.args;
                    const newPost = await user.contract._posts(index);
                    dispatchPosts({ addPost: newPost });
                }
            }
            setModalOpen(false);
        } catch {}
        setLoading(false);
    };
    return (
        <Modal
            opened={modalOpen}
            onClose={() => {
                setModalOpen(false);
                setLoading(false);
                setTitleErr(false);
                setContentErr(false);
            }}
            title={editingIndex === undefined ? 'New Post' : 'Editing Post'}
            centered
        >
            <Stack>
                <TextInput ref={titleRef} label="Title" placeholder="Post title" error={titleErr} />
                <Textarea
                    ref={contentRef}
                    label="Content"
                    placeholder="Post content"
                    error={contentErr}
                />
                <Group position="right">
                    <Button
                        onClick={loading ? () => undefined : () => onSubmit()}
                        loading={loading}
                    >
                        {editingIndex === undefined ? 'Submit post' : 'Submit edit'}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
