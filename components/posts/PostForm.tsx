import { useState, useRef } from 'react';
import { Stack, TextInput, Textarea, Group, Button } from '@mantine/core';
import type { Dispatch, SetStateAction } from 'react';

interface PostFormProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function PostForm(props: PostFormProps) {
    const { setModalOpen } = props;
    const [titleErr, setTitleErr] = useState(false);
    const [contentErr, setContentErr] = useState(false);
    const titleRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const onSubmit = () => {
        if (!titleRef.current || !contentRef.current) return;
        const err = { title: false, content: false };
        if (!titleRef.current.value) err.title = true;
        if (!contentRef.current.value) err.content = true;
        setTitleErr(err.title);
        setContentErr(err.content);
        if (err.title || err.content) return;
        // setModalOpen(false);
        // TODO show loading on the button
    };
    return (
        <Stack>
            <TextInput ref={titleRef} label="Title" placeholder="Status title" error={titleErr} />
            <Textarea
                ref={contentRef}
                label="Content"
                placeholder="Status content"
                error={contentErr}
            />
            <Group position="right">
                <Button onClick={onSubmit}>Submit</Button>
            </Group>
        </Stack>
    );
}
