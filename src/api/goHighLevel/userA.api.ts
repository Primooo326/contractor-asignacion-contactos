// https://services.leadconnectorhq.com/users/search?companyId={{CompanyId}}&query=yesica.mica@contractorlevelup.com&locationId={{LocationIdContractor}}

import { fetchApiContractor } from "../instances";

export async function getUserAByEmail(email: string): Promise<IUserAReturn> {
    return fetchApiContractor.get(`users/search?query=${email}`);
}

