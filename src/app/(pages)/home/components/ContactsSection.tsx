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

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleEnterKey = (e: any) => {

    if (e.key === "Enter") {
      e.preventDefault();
      setQueryes([])
      setContactsList([])

      console.log(e.target.value.match(/(\+\d{11}|\(\d{3}\) \d{3}-\d{4}|\d{10})/g));
      setQueryes(e.target.value.match(/(\+\d{11}|\(\d{3}\) \d{3}-\d{4}|\d{10})/g));

    }

  };
  const handleSelectContact = (contact: IConversation) => {
    const contactFound = contactsSelected.findIndex((contactSelected) => contactSelected.id === contact.id);

    if (contactFound !== -1) {
      const newContactsSelected = contactsSelected.filter((c) => c.id !== contact.id);
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

  const handleDeleteAllContacts = () => {
    setContactsSelected([]);
    setQueryes([]);
    setContactsList([]);
    searchInputRef.current!.value = '';
    searchInputRef.current?.focus();
  }

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
    <div className="contactsSection">
      <div className="p-4 h-full flex flex-col space-y-4">
        <div className="flex justify-between items-center w-[300px] space-x-4">
          <label className="input input-bordered input-sm flex items-center gap-2 w-full">
            <DynamicIcon icon="fa-solid:search" className="" />
            <input
              type="text"
              className="grow"
              placeholder="Search user"
              onKeyUp={handleEnterKey}
              ref={searchInputRef}
            />
          </label>
          {
            contactsSelected.length !== 0 &&
            <button className='btn btn-warning btn-sm ' onClick={handleDeleteAllContacts}>
              Eliminar todos
              <FaXmark />
            </button>
          }
        </div>
        <h1 className="text-sm">
          {loading ? "Buscando..." : `${contactsSelected.length} contactos encontrados`}
        </h1>
        <div className='flex flex-wrap gap-4 w-full overflow-y-auto scrollbar-custom py-4'>

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
                <FaXmark />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}