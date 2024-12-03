// https://services.leadconnectorhq.com/users/search?companyId={{CompanyId}}&query=yesica.mica@contractorlevelup.com&locationId={{LocationIdContractor}}

import { CONTRACTOR_COMPANY_ID, CONTRACTOR_LOCATION_ID } from "@/config";
import { fetchApiContractor } from "../instances";

export async function getUserAByEmail(email: string): Promise<IUserAReturn> {
    return fetchApiContractor.get(`users/search?companyId=${CONTRACTOR_COMPANY_ID}&locationId=${CONTRACTOR_LOCATION_ID}`);
}