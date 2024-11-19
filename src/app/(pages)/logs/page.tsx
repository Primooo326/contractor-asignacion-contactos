"use client"
import { getLogs } from '@api/logs.api';
import Table from '@components/Table';
import { ILog } from '@models/ILog.model';
import { ITableColumn } from '@models/ISystem.model';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function page() {

    const [data, setData] = useState<ILog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [paginationOptions, setPaginationOptions] = useState({
        currentItems: data,
        page: 1,
        take: 5,
        itemCount: data.length,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false
    });

    const fetchData = async (page: number = 1, limit: number = 5) => {
        setLoading(true);
        try {
            const response = await getLogs({ page, limit });
            setData(response.data);
            setPaginationOptions((prev) => ({
                ...prev,
                currentItems: response.data,
                itemCount: response.meta.itemCount,
                pageCount: Math.ceil(response.meta.itemCount / limit),
                hasPreviousPage: page > 1,
                hasNextPage: page < Math.ceil(response.meta.itemCount / limit),
            }));
        } catch (error) {
            toast.error("Error al cargar logs");
            console.error("Fetch logs error: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onChangePage = (page: number) => {
        setPaginationOptions({ ...paginationOptions, page });
        fetchData(page, paginationOptions.take);
    };

    const onChangePerPage = (newPerPage: number) => {
        setPaginationOptions((prev) => ({
            ...prev,
            limit: newPerPage === -1 ? prev.itemCount : newPerPage
        }));
        fetchData(paginationOptions.page, newPerPage === -1 ? paginationOptions.itemCount : newPerPage);
    };

    const columnas: ITableColumn<ILog>[] = [
        {
            name: 'Usuario en Sesión',
            cell: (row: ILog) => row.full_name,
            selector: (row: ILog) => row.full_name,
            sortable: true
        },
        {
            name: 'Nombre Contacto',
            cell: (row: ILog) => row.full_name_contact,
            selector: (row: ILog) => row.full_name_contact,
            sortable: true
        },
        {
            name: 'Correo Contacto',
            cell: (row: ILog) => row.email_contact,
            selector: (row: ILog) => row.email_contact,
            sortable: true
        },
        {
            name: 'Número Contacto',
            cell: (row: ILog) => row.phone_contact,
            selector: (row: ILog) => row.phone_contact,
            sortable: true
        },
        {
            name: 'Usuario Asignado',
            cell: (row: ILog) => row.email_assignment,
            selector: (row: ILog) => row.email_assignment,
            sortable: true
        },
        {
            name: 'Fecha Asignación',
            cell: (row: ILog) => row.assignment_date,
            selector: (row: ILog) => row.assignment_date,
            sortable: true
        }
    ]


    return (
        <div className='w-full h-full p-8'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-3xl font-bold'>Clientes</h1>

            </div>
            <Table data={data} columns={columnas} selectableRows={false}
                paginationOptions={paginationOptions} onChangePage={onChangePage} onChangePerPage={onChangePerPage} progressPending={loading} />

        </div>
    )
}
