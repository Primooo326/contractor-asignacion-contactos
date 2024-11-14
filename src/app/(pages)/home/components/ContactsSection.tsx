"use client";
import { DynamicIcon } from "@/components/DynamicIcon";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getConversations } from "@/api/goHighLevel/conversations.api";
import { useSystemStore } from "@hooks/system.hook";

export default function ContactsSection() {


  const [contactsList, setContactsList] = useState<IConversation[]>([]);
  const { setContactsSelected, contactsSelected } = useSystemStore();
  const [queryes, setQueryes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string>("");
  const handleEnterKey = (e: any) => {

    if (e.key === "Enter") {
      e.preventDefault();
      setQueryes([])
      setContactsList([])

      console.log(e.target.value.match(/(\+\d{11}|\(\d{3}\) \d{3}-\d{4}|\d{10})/g));
      setQueryes(e.target.value.match(/(\+\d{11}|\(\d{3}\) \d{3}-\d{4}|\d{10})/g));

    }

  };
  const decodeToken = (token: any) => {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  };
  const fetchSearchUser = async () => {
    try {
      setLoading(true);

      for (let i = 0; i < queryes.length; i++) {
        console.log(queryes[i]);
        getConversations(null, queryes[i]).then((data) => {
          console.log(data);
          setContactsList((prevContacts) => {
            console.log([...prevContacts, ...data?.conversations]);
            if (data?.conversations.length === 1 && contactsSelected.findIndex(c => c.id === data?.conversations[0].id) === -1) {
              selectContact(data?.conversations[0]);
            }

            return [...prevContacts, ...data?.conversations];
          });
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

  };

  const selectContact = (contact: IConversation) => {

    setContactsSelected((prevContacts) => {
      const newContactsSelected = [...prevContacts, contact];
      return newContactsSelected;
    });

  }

  useEffect(() => {
    const token = Cookies.get("token") || null;
    if (token) {
      const decoded = decodeToken(token);
      console.log(decoded);
      if (!decoded.isAdmin) {

        setAssignedTo(decoded.idUser_High_Level);
      }
    }
  }, []);

  useEffect(() => {
    fetchSearchUser();
  }, [queryes]);


  return (
    <div className="drawer2">
      <div className="p-4 space-y-6 h-full overflow-hidden mb-6">
        <div className="flex justify-between items-center">
          <label className="input input-bordered input-sm flex items-center gap-2 w-full">
            <DynamicIcon icon="fa-solid:search" className=" text-gray-500" />
            <input
              type="text"
              className="grow"
              placeholder="Search user"
              onKeyUp={handleEnterKey}
            />
          </label>
        </div>
        <h1 className="text-center text-sm text-gray-500 mt-4">
          {loading ? "Buscando..." : `${contactsList.length} contactos encontrados`}
        </h1>
        <div className="space-y-2 overflow-y-auto scrollbar-custom pb-10 listContactsContainer">
          {contactsList.map((contact, index) => (
            <div
              key={index}
              className={`flex justify-between items-center w-full hover:bg-gray-100 p-4 rounded-lg ${contactsSelected.findIndex((contactSelected) => contactSelected.id === contact.id) !== -1 ? "bg-slate-100" : ""}`}
              onClick={() => selectContact(contact)}
            >
              <div className="flex items-center gap-2 w-full">
                <img
                  src={`https://ui-avatars.com/api/?name=${contact.contactName}&background=random`}
                  alt="contractor"
                  className="rounded-full"
                  style={{ width: "40px" }}
                />
                <div>
                  <h1 className="font-bold text-sm">
                    {contact.contactName}
                  </h1>
                  <p className="text-sm font-light line-clamp-1">
                    {contact.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}