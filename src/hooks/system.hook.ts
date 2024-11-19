import { create } from 'zustand';

interface SystemState {

    contactsSelected: IConversation[];
    isAdmin: boolean;
    setIsAdmin: (isAdmin: boolean) => void;
    setContactsSelected: (contactsSelected: IConversation[] | ((prevMessages: IConversation[]) => IConversation[])) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
    contactsSelected: [],
    isAdmin: false,
    setIsAdmin: (isAdmin: boolean) => {
        set((state) => ({
            isAdmin: isAdmin
        }))
        return isAdmin;
    },
    setContactsSelected: (contactsSelected: IConversation[] | ((prevMessages: IConversation[]) => IConversation[])) => {
        set((state) => ({
            contactsSelected: typeof contactsSelected === 'function' ? contactsSelected(state.contactsSelected) : contactsSelected,
        }))
    }
}));