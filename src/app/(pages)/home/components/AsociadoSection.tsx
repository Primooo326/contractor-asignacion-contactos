"use client";
import { getUserAByEmail } from "@api/goHighLevel/userA.api";
import { AssignUser2Contact } from "@api/goHighLevel/contacts.api";
import { toast } from "react-toastify";
import { DynamicIcon } from "@components/DynamicIcon";
import React, { useEffect, useRef, useState } from "react";
import { useSystemStore } from "@hooks/system.hook";
import { logAssignment } from "@api/assinged";

export default function AsociadoSection() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { setContactsSelected, contactsSelected } = useSystemStore();
  const [asociados, setAsociados] = useState<IUserA[]>([]);
  const [asociadoSelected, setAsociadoSelected] = useState<IUserA | null>(null);
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
              await logAssignment(
                contact.contactId,
                contact.fullName,
                contact.contactName,
                contact.contactName,
                contact.email,
                contact.phone,
                responseUser.users[0].id,
                responseUser.users[0].email
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

  const handleAsignarContactos = async () => {

    if (asociadoSelected) {
      contactsSelected.forEach(async (contact) => {
        await AssignUser2Contact(
          contact.contactId,
          asociadoSelected.id
        );
        await logAssignment(
          contact.contactId,
          contact.fullName,
          contact.contactName,
          contact.contactName,
          contact.email,
          contact.phone,
          asociadoSelected.id,
          asociadoSelected.email
        );

      });
      toast.success(
        `Se asignó ${contactsSelected.length} contacto${contactsSelected.length > 1 ? "s" : ""
        } al asociado: ${asociadoSelected.name}.`
      );
    } else {
      toast.error("Por favor seleccionar un asociado");
    }

  }
  const fetchAsociados = async () => {
    const responseUser = await getUserAByEmail("");
    setAsociados(responseUser.users);
  }

  const handleSelectAsociado = (asociadoId: string) => {
    const asociado = asociados.find((asociado) => asociado.id === asociadoId) || null;
    setAsociadoSelected(asociado);
  };

  useEffect(() => {
    fetchAsociados();
  }, []);

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchLogic();
    }
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // handleSearchLogic();
    handleAsignarContactos();
  };

  return (
    <div className="p-4 space-y-6 h-full overflow-hidden mb-6 border-t">
      <div className="flex items-end gap-4">
        <label className="form-control w-[400px]">
          <div className="label">
            <span className="label-text">Selecciona el asociado para asignar los contactos</span>
          </div>
          <select className="select select-bordered" onChange={(e) => handleSelectAsociado(e.target.value)}>
            <option disabled selected>Seleccionar asociado</option>
            {asociados.map((asociado) => (
              <option key={asociado.id} value={asociado.id}>
                {asociado.name}
              </option>
            ))}
          </select>

        </label>
        {/* <label className="input input-bordered input-sm flex items-center gap-2 w-[300px]">
          <DynamicIcon icon="fa-solid:search" className="text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            className="grow"
            placeholder="Buscar Asociado"
            onKeyUp={handleEnterKey}
          />
        </label> */}
        <button
          className="btn btn-primary ml-2"
          onClick={handleSearch}
        >
          Asignar{" "}
          <DynamicIcon icon="fa-solid:paper-plane" className="text-white" />
        </button>
      </div>
    </div>
  );
}
