import { fetchApiContractor } from "../instances";

export async function getOneContact(contactId: string): Promise<IContactResponse> {
    return fetchApiContractor.get(`contacts/${contactId}`);
}

export async function searchContact(search: string): Promise<IContactSearchResponse> {
    return fetchApiContractor.get(`contacts/?locationId=7gcRvmSzndyAWZHzYU01&query=${search}`);
}


export async function AssignUser2Contact(contactId: string, userId: string): Promise<IContactAssingResponse> {
    const body = {
        assignedTo: userId,
    };
    return fetchApiContractor.put(`contacts/${contactId}`, body);
}
