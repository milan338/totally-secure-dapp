import abi from '../../abi.json';
import { useState, useRef } from 'react';
import { Modal, Stack, TextInput, Textarea, Group, Button, Loader } from '@mantine/core';
import { Contract } from 'ethers';
import { useUser } from 'components/context/UserContext';
import type { Dispatch, SetStateAction } from 'react';

interface PostFormProps {
    modalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    editingIndex?: number;
}

export default function PostForm(props: PostFormProps) {
    const { modalOpen, setModalOpen, editingIndex } = props;
    const { user } = useUser();
    const [titleErr, setTitleErr] = useState(false);
    const [contentErr, setContentErr] = useState(false);
    const [loading, setLoading] = useState(false); // TODO get this able to rerender while stuck inside the async
    const titleRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const onSubmit = async () => {
        if (!titleRef.current || !contentRef.current || !user.contractAddress || !user.provider)
            return;
        const err = { title: false, content: false };
        if (!titleRef.current.value) err.title = true;
        if (!contentRef.current.value) err.content = true;
        setTitleErr(err.title);
        setContentErr(err.content);
        if (err.title || err.content) return;
        const signer = user.provider.getSigner();
        const contract = new Contract(user.contractAddress, abi, signer);
        setLoading(true);
        try {
            if (editingIndex !== undefined)
                await contract.editPost(
                    editingIndex,
                    titleRef.current.value,
                    contentRef.current.value
                );
            await contract.addPost(titleRef.current.value, contentRef.current.value);
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
            }}
            title="New Post"
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
                    <Button onClick={() => onSubmit()}>
                        {loading ? (
                            <Loader variant="dots" color="white" />
                        ) : editingIndex === undefined ? (
                            'Submit post'
                        ) : (
                            'Submit edit'
                        )}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
