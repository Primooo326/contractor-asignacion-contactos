export interface ILog {
    id_contact: number;
    id_user_contact: number;
    contact_id_contact: string;
    full_name_contact: string;
    first_name_contact: string;
    last_name_contact: string;
    email_contact: string;
    phone_contact: string;
    iduser_high_level_contact: string;
    email_assignment_contact: string;
    state_contact: number;
    assignment_date_contact: string;

    id_user: number;
    proyects_id_user: number;
    full_name_user: string;
    first_name_user: string;
    last_name_user: string;
    is_admin_user: number;
    email_user: string;
    password_user: string;
    last_password_update_user: string;
    state_user: number;
    created_at_user: string;
    updated_at_user: string;
}
