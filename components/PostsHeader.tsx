import { createStyles, Group, Stack, Text, Button } from '@mantine/core';
import type { Dispatch, SetStateAction } from 'react';

interface PostsHeaderProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const useStyles = createStyles(() => ({
    title: {
        fontWeight: 'bold',
        fontSize: '2rem',
    },
    statusButton: {
        width: '70%',
        marginLeft: '30%',
    },
    statusButtonWrapper: {
        marginTop: 'auto',
        marginBottom: '0.6rem',
    },
}));

export default function PostsHeader(props: PostsHeaderProps) {
    const { setModalOpen } = props;
    const { classes } = useStyles();
    return (
        <Group position="right" spacing="xl" grow>
            <Stack spacing="xs">
                <Text>Connected as:</Text>
                <Text className={classes.title}>Your timeline:</Text>
            </Stack>
            <div className={classes.statusButtonWrapper}>
                <Button
                    className={classes.statusButton}
                    onClick={() => setModalOpen(true)}
                    variant="outline"
                >
                    New Status
                </Button>
            </div>
        </Group>
    );
}
