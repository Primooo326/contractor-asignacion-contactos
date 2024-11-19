"use client"

import React, { useEffect, useState } from 'react';
import "./styles.scss";
import { toast } from 'react-toastify';
import { createUser, deleteUser, getUsers, updateUser } from '@api/users';
import { DynamicIcon } from '@/components/DynamicIcon';
import Modal from '@/components/shared/Modal';
import { useForm } from 'react-hook-form';
import { FaXmark } from 'react-icons/fa6';
import { IUser } from '@models/IUser.model';
import { ITableColumn } from '@models/ISystem.model';

export default function Page() {
    const { register, handleSubmit, setValue, reset, getValues, watch } = useForm();

    const [data, setData] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [userToEdit, setUserToEdit] = useState<any | null>(null);
    const [userToDelete, setUserToDelete] = useState<any | null>(null);
    const [inputVerify, setInputVerify] = useState<string>('');
    const [paginationOptions, setPaginationOptions] = useState({
        currentItems: data,
        page: 1,
        take: 5,
        itemCount: data.length,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false
    });

    const first_name = watch("first_name", "");
    const last_name = watch("last_name", "");
    const email = watch("email", "");

    useEffect(() => {
        setButtonDisabled(
            first_name.length < 4 || last_name.length < 4 || email.length < 4
        );
    }, [first_name, last_name, email]);

    const fetchData = async (page: number = 1, take: number = 5) => {
        setLoading(true);
        try {
            const response = await getUsers({ page, take });
            setData(response.data);
            setPaginationOptions((prev) => ({
                ...prev,
                currentItems: response.data,
                itemCount: response.meta.itemCount,
                pageCount: Math.ceil(response.meta.itemCount / take),
                hasPreviousPage: page > 1,
                hasNextPage: page < Math.ceil(response.meta.itemCount / take),
            }));
        } catch (error) {
            toast.error("Error al cargar usuarios");
            console.error("Fetch users error: ", error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        setButtonDisabled(true);
        try {
            if (userToEdit?.first_name) {
                const response = await updateUser(data, userToEdit.id);
                if (response) {
                    fetchData();
                    setUserToEdit(null);
                    toast.success("Usuario actualizado correctamente");
                }
            } else {
                const response = await createUser(data);
                if (response.statusCode == 201) {
                    fetchData();
                    setUserToEdit(null);
                    toast.success("Usuario creado correctamente");
                } else {
                    toast.error(response.message);
                }
            }
        } catch (error: any) {
            console.error(error);
        }
        setButtonDisabled(false);
    };

    const onDeleteUser = async (id: string) => {
        setInputVerify('')
        setButtonDisabled(true);

        try {
            const response = await deleteUser(id);
            if (response) {
                fetchData();
                setUserToDelete(null);
                setInputVerify('');
                toast.success("Usuario eliminado correctamente");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Error al eliminar el usuario");
        }
        setButtonDisabled(false);
    };

    const handleCreate = () => {
        setUserToEdit({
            first_name: "",
            last_name: "",
            email: ""
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (userToEdit) {
            for (const key in userToEdit) {
                setValue(key, userToEdit[key]);
            }
        } else {
            reset();
        }
    }, [userToEdit]);

    const onChangePage = (page: number) => {
        setPaginationOptions({ ...paginationOptions, page });
        fetchData(page, paginationOptions.take);
    };

    const onChangePerPage = (newPerPage: number) => {
        setPaginationOptions((prev) => ({
            ...prev,
            take: newPerPage === -1 ? prev.itemCount : newPerPage
        }));
        fetchData(paginationOptions.page, newPerPage === -1 ? paginationOptions.itemCount : newPerPage);
    };

    return (
        <>
            <div className="page-container">
                <div className="table-container">
                    <div className="table-header">
                        <h1>Usuarios</h1>
                        <div className='flex gap-5'>
                            <button className='btn btn-success' onClick={handleCreate}>Nuevo Usuario</button>
                        </div>
                    </div>
                    {loading ? (
                        <div className="loading-spinner">Cargando datos...</div>
                    ) : (
                        <div className="table">
                            <div className="table-row table-header">
                                <div className="table-cell cell-full-name">Nombre Completo</div>
                                <div className="table-cell cell-first-name">Primer Nombre</div>
                                <div className="table-cell cell-last-name">Apellido</div>
                                <div className="table-cell cell-email">Correo</div>
                                <div className="table-cell cell-admin">Administrador</div>
                                <div className="table-cell cell-actions">Acciones</div>
                            </div>
                            {data.map((user) => (
                                <div key={user.id} className="table-row">
                                    <div className="table-cell cell-full-name">{user.full_name}</div>
                                    <div className="table-cell cell-first-name">{user.first_name}</div>
                                    <div className="table-cell cell-last-name">{user.last_name}</div>
                                    <div className="table-cell cell-email">{user.email}</div>
                                    <div className="table-cell cell-admin">
                                        {user.is_admin ? (
                                            <DynamicIcon icon="flat-color-icons:ok" className="text-3xl" />
                                        ) : (
                                            <DynamicIcon icon="mdi:cross-circle" className="text-3xl" />
                                        )}
                                    </div>
                                    <div className="table-cell cell-actions">
                                        <button className="btn btn-warning btn-sm" onClick={() => setUserToEdit(user)}>Editar</button>
                                        <button className="btn btn-error btn-sm ml-2" onClick={() => setUserToDelete(user)}>Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="pagination-container">
                        <select onChange={(e) => onChangePerPage(Number(e.target.value))} value={paginationOptions.take}>
                            <option value={5}>Items por página: 5</option>
                            <option value={10}>Items por página: 10</option>
                            <option value={15}>Items por página: 15</option>
                            <option value={20}>Items por página: 20</option>
                            <option value={-1}>Todos los items</option>
                        </select>
                        <div>
                            Página {paginationOptions.page} de {paginationOptions.pageCount}
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
            <Modal id="Usuario" className="rounded-xl w-[900px]" isOpen={userToEdit} onClose={() => { setUserToEdit(null) }}>
                <div className='modal-header flex justify-between items-center border-b w-full px-10' >
                    <h1 className='text-2xl font-bold'>
                        {userToEdit?.first_name ? "Editar Usuario" : "Nuevo Usuario"}
                    </h1>
                    <button onClick={() => setUserToEdit(null)}>
                        <FaXmark />
                    </button>
                </div>
                <div className='p-5'>
                    <form className='w-full space-y-4'>
                        <div className="flex flex-col gap-1">
                            <label className='label'>Primer Nombre</label>
                            <input
                                type="text"
                                className='input input-bordered w-full'
                                {...register('first_name', { required: true, minLength: 3 })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className='label'>Apellido</label>
                            <input
                                type="text"
                                className='input input-bordered w-full'
                                {...register('last_name', { required: true, minLength: 3 })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className='label'>Correo</label>
                            <input
                                type="email"
                                className='input input-bordered w-full'
                                {...register('email', { required: true, minLength: 3 })}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <label className='label'>¿Es administrador?</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    {...register('is_admin')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='flex justify-end gap-3'>
                            <button className='btn btn-error t-white' onClick={() => setUserToEdit(null)}>Cancelar</button>
                            <button className='btn btn-success t-white' disabled={buttonDisabled} onClick={handleSubmit(onSubmit)}>Guardar</button>
                        </div>
                    </form>
                </div>
            </Modal>
            {userToDelete && (
                <Modal id='modalDeleteUser' className="rounded-xl " isOpen={userToDelete} onClose={() => setUserToDelete(null)} >
                    <div className='modal-header flex justify-between items-center border-b w-full px-10' >
                        <h1 className='text-2xl font-bold'>Eliminar Usuario</h1>
                        <button onClick={() => setUserToDelete(null)}>
                            <FaXmark />
                        </button>
                    </div>
                    <div className='p-10 flex flex-col items-center gap-3'>
                        <h1 className='text-xl'>¿Está seguro de eliminar el usuario?</h1>
                        <p className='font-bold mb-5'>
                            Para confirmar la eliminación del usuario, por favor digite "confirmar".
                        </p>
                        <div className="form-control">
                            <input type="text" placeholder="Digite confirmar" className="input input-bordered" value={inputVerify} onChange={(e) => setInputVerify(e.target.value)} onPaste={(e) => e.preventDefault()} />
                        </div>
                        <div className='flex justify-center gap-5 mt-5'>
                            <button className="btn btn-error t-white" onClick={() => setUserToDelete(null)}>Cancelar</button>
                            <button className="btn btn-success t-white" onClick={() => onDeleteUser(userToDelete.id)} disabled={inputVerify !== `confirmar`}>Eliminar</button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
