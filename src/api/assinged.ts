import { fetchApiBase } from "./instances";

export async function logAssignment(
  str_contact_id: string,
  str_full_name_contact: string,
  str_first_name_contact: string,
  str_last_name_contact: string,
  str_email_contact: string,
  str_phone_contact: string,
  str_iduser_high_level: string,
  str_email_assignment: string
): Promise<any> {
  try {
    const body = {
      contact_id: str_contact_id,
      full_name_contact: str_full_name_contact,
      first_name_contact: str_first_name_contact,
      last_name_contact: str_last_name_contact,
      email_contact: str_email_contact,
      phone_contact: str_phone_contact,
      iduser_high_level: str_iduser_high_level,
      email_assignment: str_email_assignment,
    };

    const response = await fetchApiBase.post(`/assignment`, body);
    return response;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Error desconocido al iniciar sesión.");
    }
  }
}
