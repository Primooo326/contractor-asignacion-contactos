"use client"

import React, { useEffect, useState } from 'react';
import "./styles.scss";
import { toast } from 'react-toastify';
import { DynamicIcon } from '@/components/DynamicIcon';
import { getLogs } from '@api/logs.api';
import { ILog } from '@models/ILog.model';

export default function Page() {
    const [data, setData] = useState<ILog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [paginationOptions, setPaginationOptions] = useState({
        currentItems: data,
        page: 1,
        limit: 5,
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
        fetchData(page, paginationOptions.limit);
    };

    const onChangePerPage = (newPerPage: number) => {
        setPaginationOptions((prev) => ({
            ...prev,
            limit: newPerPage === -1 ? prev.itemCount : newPerPage
        }));
        fetchData(paginationOptions.page, newPerPage === -1 ? paginationOptions.itemCount : newPerPage);
    };

    return (
        <>
            <div className="page-container">
                <div className="table-container">
                    <div className="table-header">
                        <h1>Auditoria</h1>
                    </div>
                    {loading ? (
                        <div className="loading-spinner">Cargando datos...</div>
                    ) : (
                        <div className="table">
                            <div className="table-row table-header">
                                <div className="table-cell cell-full-name-1-h">Usuario en Sesión</div>
                                <div className="table-cell cell-full-name-3">Nombre Contacto</div>
                                <div className="table-cell cell-email-1">Correo Contacto</div>
                                <div className="table-cell cell-email">Número Contacto</div>
                                <div className="table-cell cell-full-name-2-h">Usuario Asignado</div>
                                <div className="table-cell cell-email">Fecha Asignación</div>
                            </div>
                            {data.map((log) => (
                                <div key={log.id} className="table-row">
                                    <div className="table-cell cell-full-name-1">{log.full_name}</div>
                                    <div className="table-cell cell-full-name-3">{log.full_name_contact}</div>
                                    <div className="table-cell cell-email-1">{log.email_contact}</div>
                                    <div className="table-cell cell-email">{log.phone_contact}</div>
                                    <div className="table-cell cell-full-name-2">{log.email_assignment}</div>
                                    <div className="table-cell cell-email">
                                        {new Date(log.assignment_date).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric"
                                        })}
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                    <div className="pagination-container">
                        <select onChange={(e) => onChangePerPage(Number(e.target.value))} value={paginationOptions.limit}>
                            <option value={5}>Items por página: 5</option>
                            <option value={10}>Items por página: 10</option>
                            <option value={15}>Items por página: 15</option>
                            <option value={20}>Items por página: 20</option>
                            <option value={-1}>Todos los items</option>
                        </select>
                        <div>
                            Página {paginationOptions.page} de {paginationOptions.page}
                        </div>
                        <button className="btn btn-circle btn-ghost btn-pagination" onClick={() => onChangePage(1)} disabled={!paginationOptions.hasPreviousPage}>
                            <DynamicIcon icon='mdi:chevron-double-left' className='text-3xl' />
                        </button>
                        <button className="btn btn-circle btn-ghost btn-pagination" onClick={() => onChangePage(paginationOptions.page - 1)} disabled={!paginationOptions.hasPreviousPage}>
                            <DynamicIcon icon='ci:chevron-left-md' className='text-3xl' />
                        </button>
                        <button className="btn btn-circle btn-ghost btn-pagination" onClick={() => onChangePage(paginationOptions.page + 1)} disabled={!paginationOptions.hasNextPage}>
                            <DynamicIcon icon='ci:chevron-right-md' className='text-3xl' />
                        </button>
                        <button className="btn btn-circle btn-ghost btn-pagination" onClick={() => onChangePage(paginationOptions.pageCount)} disabled={!paginationOptions.hasNextPage}>
                            <DynamicIcon icon='mdi:chevron-double-right' className='text-3xl' />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
