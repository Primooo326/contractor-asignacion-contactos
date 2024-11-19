"use client";
import { getUserAByEmail } from "@api/goHighLevel/userA.api";
import { AssignUser2Contact } from "@api/goHighLevel/contacts.api";
import { toast } from "react-toastify";
import { DynamicIcon } from "@components/DynamicIcon";
import React, { useRef } from "react";
import { useSystemStore } from "@hooks/system.hook";

export default function AsociadoSection() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { setContactsSelected, contactsSelected } = useSystemStore();

  const handleSearchLogic = async () => {
    if (inputRef.current && inputRef.current.value != "") {
      const users = await getUserAByEmail(inputRef.current.value);
      // console.log(users);
      if (contactsSelected.length === 0) {
        toast.error("Por favor seleccionar contactos a asignar");
        return;
      }
      if (users?.count > 1) {
        toast.error(
          "Se encontraron múltiples usuarios. Por favor verificar el correo del usuario"
        );
      } else {
        contactsSelected.forEach(async (contact) => {
          const response = await AssignUser2Contact(
            contact.contactId,
            users.users[0].id
          );

          toast.success(
            `Se asignó ${contactsSelected.length} contacto${
              contactsSelected.length > 1 ? "s" : ""
            } al usuario: ${users.users[0].name}.`
          );
          // console.log(response);
          // console.log(contact.id);
          // console.log(users.users[0].id);
        });
      }
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchLogic();
    }
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSearchLogic();
  };

  return (
    <div className="p-4 space-y-6 h-full overflow-hidden mb-6">
      <div className="flex justify-between items-center">
        <label className="input input-bordered input-sm flex items-center gap-2 w-1/2">
          <DynamicIcon icon="fa-solid:search" className="text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            className="grow"
            placeholder="Buscar Asociado"
            onKeyUp={handleEnterKey}
          />
          <button
            className="btn btn-sm btn-primary ml-2"
            onClick={handleSearch}
          >
            Asignar{" "}
            <DynamicIcon icon="fa-solid:paper-plane" className="text-white" />
          </button>
        </label>
      </div>
    </div>
  );
}
