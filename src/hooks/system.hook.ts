import { create } from 'zustand';

interface SystemState {

    contactsSelected: IConversation[];
    setContactsSelected: (contactsSelected: IConversation[] | ((prevMessages: IConversation[]) => IConversation[])) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
    contactsSelected: [],
    setContactsSelected: (contactsSelected: IConversation[] | ((prevMessages: IConversation[]) => IConversation[])) => {
        set((state) => ({
            contactsSelected: typeof contactsSelected === 'function' ? contactsSelected(state.contactsSelected) : contactsSelected,
        }))
    }
}));