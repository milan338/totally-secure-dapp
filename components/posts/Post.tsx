import { createStyles, Text, Stack } from '@mantine/core';

interface PostProps {
    title: string;
    content: string;
}

const useStyles = createStyles(() => ({
    title: {
        fontWeight: 'bold',
        fontSize: '1.8rem',
    },
    content: {
        fontSize: '1.3rem',
    },
}));

export default function Post(props: PostProps) {
    const { title, content } = props;
    const { classes } = useStyles();
    return (
        <Stack spacing="xs">
            <Text className={classes.title}>{title}</Text>
            <Text className={classes.content}>{content}</Text>
        </Stack>
    );
}
