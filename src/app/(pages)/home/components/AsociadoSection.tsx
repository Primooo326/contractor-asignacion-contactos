"use client";
import { getUserAByEmail } from '@api/goHighLevel/userA.api';
import { DynamicIcon } from '@components/DynamicIcon'
import React from 'react'

export default function AsociadoSection() {

    const handleEnterKey = async (e: any) => {

        if (e.key === "Enter") {
            e.preventDefault();
            const users = await getUserAByEmail(e.target.value);
            console.log(users);
        }

    };
    return (
        <div className="p-4 space-y-6 h-full overflow-hidden mb-6">

            <div className="flex justify-between items-center">
                <label className="input input-bordered input-sm flex items-center gap-2 w-full">
                    <DynamicIcon icon="fa-solid:search" className=" text-gray-500" />
                    <input
                        type="text"
                        className="grow"
                        placeholder="Buscar Asociado"
                        onKeyUp={handleEnterKey}
                    />
                </label>
            </div>
        </div>
    )
}
