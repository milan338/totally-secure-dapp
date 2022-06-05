import { createContext, useReducer, useContext } from 'react';
import { providers } from 'ethers';
import type { ReactNode } from 'react';

interface UserContextProps {
    children: ReactNode;
}

type UserState = {
    active: boolean;
    provider?: providers.Web3Provider;
    account?: string;
    chainId?: number;
};
type UserData = Partial<UserState>;
type UserDispatch = (action: UserData) => void;
type UserContextT = { user: UserState; dispatchUser: UserDispatch };

function userReducer(user: UserState, data: UserData): UserState {
    return { ...user, ...data };
}

const UserContext = createContext<UserContextT | undefined>(undefined);

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) throw new Error('useUser must be used within a UserProvider');
    return context;
}

export default function UserProvider(props: UserContextProps) {
    const { children } = props;
    const [user, dispatchUser] = useReducer(userReducer, { active: false });
    const value = { user, dispatchUser };
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
