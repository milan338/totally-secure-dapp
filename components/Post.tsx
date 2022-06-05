import { createStyles, Text, Stack } from '@mantine/core';

const useStyles = createStyles(() => ({
    title: {
        fontWeight: 'bold',
        fontSize: '1.8rem',
    },
    content: {
        fontSize: '1.3rem',
    },
}));

export default function Post() {
    const { classes } = useStyles();
    return (
        <Stack spacing="xs">
            <Text className={classes.title}>Title</Text>
            <Text className={classes.content}>Content</Text>
        </Stack>
    );
}
