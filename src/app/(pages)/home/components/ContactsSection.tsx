"use client";
import { DynamicIcon } from "@/components/DynamicIcon";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { getConversations } from "@/api/goHighLevel/conversations.api";
import { useSystemStore } from "@hooks/system.hook";
import { FaXmark } from "react-icons/fa6";

export default function ContactsSection() {
  const [contactsList, setContactsList] = useState<IConversation[]>([]);
  const { setContactsSelected, contactsSelected } = useSystemStore();
  const [queryes, setQueryes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const handleEnterKey = (e: any) => {

    if (e.key === "Enter") {
      e.preventDefault();
      setQueryes([]);
      setContactsList([]);
      setQueryes(
        e.target.value.match(/(\+\d{11}|\(\d{3}\) \d{3}-\d{4}|\d{10})/g) || []
      );
    }
  };
  const handleSelectContact = (contact: IConversation) => {
    const contactFound = contactsSelected.findIndex((contactSelected) => contactSelected.id === contact.id);

    if (contactFound !== -1) {
      const newContactsSelected = contactsSelected.filter((c, i) => i !== contactFound);
      setContactsSelected(newContactsSelected);
    } else {
      const newContactsSelected = [...contactsSelected, contact];
      setContactsSelected(newContactsSelected);
    }
  }
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
            if (
              data?.conversations.length === 1 &&
              contactsSelected.findIndex(
                (c) => c.id === data?.conversations[0].id
              ) === -1
            ) {
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
  };

  const handleClearAll = () => {
    setContactsSelected([]);
    setContactsList([]);
    setQueryes([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

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
    <div className="contactsSection w-full border-r border-base-300">
      <div className="p-4 space-y-6 h-full overflow-hidden mb-6 ">
        <div className="flex justify-between items-center w-[300px] space-x-4">
          <label className="input input-bordered input-sm flex items-center gap-2 w-full">
            <DynamicIcon icon="fa-solid:search" className="" />
            <input
              ref={inputRef}
              type="text"
              className="grow"
              placeholder="Search user"
              onKeyUp={handleEnterKey}
            />
          </label>
          {contactsSelected.length !== 0 && (
            <button className="btn btn-warning btn-sm" onClick={handleClearAll}>
              Eliminar todos
            </button>
          )}
        </div>
        <h1 className="text-sm">
          {loading
            ? "Buscando..."
            : `${contactsList.length} contactos encontrados`}
        </h1>
        <div className="space-y-2 overflow-y-auto scrollbar-custom pb-10 listContactsContainer">
          <div className='bodyChat overflow-y-auto scrollbar-custom p-4'>

            <div className='flex flex-wrap gap-4 w-full'>

              {contactsSelected.map((contact, index) => (
                <div key={index} className='p-1 pe-4 rounded-full w-fit border flex gap-2 hover:scale-105 transition-all duration-300 hover:bg-gray-100'>
                  <img src={`https://ui-avatars.com/api/?name=${contact!.contactName?.replaceAll(" ", "+")}&background=random`} alt="contractor" className='rounded-full' style={{ width: '40px' }} />
                  <div >
                    <h1 className='font-bold text-sm'>{contact!.contactName}</h1>
                    <p className='text-sm font-light'>
                      {contact!.email}
                    </p>
                  </div>
                  <button onClick={() => handleSelectContact(contact)}>
                    {/* <FaXmark /> */}
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* {contactsList.map((contact, index) => (
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
          ))} */}
        </div>
      </div>
    </div>
  );
}
