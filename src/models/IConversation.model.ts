interface IConversation {
    id: string;
    locationId: string;
    dateAdded: number;
    dateUpdated: number;
    lastMessageDate: number;
    lastMessageType: string;
    lastMessageBody: string;
    lastOutboundMessageAction: string;
    lastMessageDirection: string;
    inbox: boolean;
    unreadCount: number;
    assignedTo: string;
    lastManualMessageDate: number;
    followers: string[];
    contactId: string;
    fullName: string;
    contactName: string;
    email: string;
    phone: string;
    tags: string[];
    type: string;
    scoring: any[];
    attributed?: boolean | null;
    sort: number[];
}

interface IConversationsReturn {
    conversations: IConversation[];
}

interface IConversationsResponse {
    conversations: IConversation[];
    total: number;
    traceId: string;
}
