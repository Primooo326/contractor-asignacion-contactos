interface IAttributionSource {
    sessionSource: string;
    medium: string;
}

interface ICreatedBy {
    source: string;
    channel: string;
    sourceId: string;
    timestamp: string;
}

interface IDndSetting {
    status: string;
    message: string;
}

interface IDndSettings {
    SMS: IDndSetting;
    Call: IDndSetting;
    Email: IDndSetting;
    WhatsApp: IDndSetting;
    FB: IDndSetting;
    GMB: IDndSetting;
}

interface IContact {
    id: string;
    dateAdded: string;
    type: string;
    locationId: string;
    firstName: string;
    firstNameLowerCase: string;
    fullNameLowerCase: string;
    lastName: string;
    lastNameLowerCase: string;
    email: string;
    emailLowerCase: string;
    phone: string;
    country: string;
    attributionSource: IAttributionSource;
    createdBy: ICreatedBy;
    followers: string[];
    assignedTo: string;
    dndSettings: IDndSettings;
    dnd: boolean;
    tags: string[];
    dateUpdated: string;
    customFields: any[];
    additionalEmails: any[];
    additionalPhones: any[];
}


//-------------------------------

interface IAttribution {
    utmSessionSource: string;
    isFirst: boolean;
    medium: string;
}

interface IDndSettings {
    [channel: string]: {
        message: string;
        status: string;
    };
}

interface IContactSearched {
    id: string;
    locationId: string;
    contactName: string;
    firstName: string;
    lastName: string;
    firstNameRaw: string;
    lastNameRaw: string;
    companyName: string | null;
    email: string;
    phone: string;
    dnd: boolean;
    dndSettings: IDndSettings;
    type: string;
    source: string | null;
    assignedTo: string;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    address1: string | null;
    dateAdded: string;
    dateUpdated: string;
    dateOfBirth: string | null;
    businessId: string | null;
    tags: string[];
    followers: string[];
    country: string;
    website: string | null;
    additionalEmails: string[];
    attributions: IAttribution[];
    timezone?: string;
    customFields: any[];
}

interface IMeta {
    total: number;
    nextPageUrl: string;
    startAfterId: string;
    startAfter: number;
    currentPage: number;
    nextPage: number;
    prevPage: number | null;
}
interface IContactSearchResponse {
    contacts: IContactSearched[];
    meta: IMeta;
    traceId: string;
}
interface IContactResponse {
    contact: IContact;
    traceId: string;
}
