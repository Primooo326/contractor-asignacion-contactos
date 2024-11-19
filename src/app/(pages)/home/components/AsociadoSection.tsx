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

      try {

        const responseUser = await getUserAByEmail(inputRef.current.value);

        if (responseUser.users.length === 0) {
          toast.error("No se encontró ningún asociado con ese correo");

        } else {

          if (contactsSelected.length === 0) {

            toast.error("Por favor seleccionar contactos a asignar");
            return;

          }
          if (responseUser?.count > 1) {

            toast.error(
              "Se encontraron múltiples asociados. Por favor verificar el correo del asociado"
            );
            return

          }
          else {
            contactsSelected.forEach(async (contact) => {
              await AssignUser2Contact(
                contact.contactId,
                responseUser.users[0].id
              );
            });
            toast.success(
              `Se asignó ${contactsSelected.length} contacto${contactsSelected.length > 1 ? "s" : ""
              } al asociado: ${responseUser.users[0].name}.`
            );
          }
        }

      } catch (error) {
        console.log(error);
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
    <div className="p-4 space-y-6 h-full overflow-hidden mb-6 border-t">
      <div className="flex gap-4">
        <label className="input input-bordered input-sm flex items-center gap-2 w-[300px]">
          <DynamicIcon icon="fa-solid:search" className="text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            className="grow"
            placeholder="Buscar Asociado"
            onKeyUp={handleEnterKey}
          />
        </label>
        <button
          className="btn btn-sm btn-primary ml-2"
          onClick={handleSearch}
        >
          Asignar{" "}
          <DynamicIcon icon="fa-solid:paper-plane" className="text-white" />
        </button>
      </div>
    </div>
  );
}
