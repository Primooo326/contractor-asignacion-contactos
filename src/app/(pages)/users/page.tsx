"use client"
import { useEffect, useState } from 'react'
import Table from '@components/Table'
import { ITableColumn } from '@models/ISystem.model';
import { IUser } from '@models/IUser.model';
import { useRouter } from 'next/navigation';
import { createUser, deleteUser, getUsers, updateUser } from '@api/users';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Modal from '@components/shared/Modal';
import { FaXmark } from 'react-icons/fa6';

export default function page() {


    const { register, handleSubmit, setValue, reset, getValues, watch } = useForm();

    const router = useRouter();
    const [data, setData] = useState<IUser[]>([]);
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
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

    const [userToEdit, setUserToEdit] = useState<any | null>(null);
    const [userToDelete, setUserToDelete] = useState<any | null>(null);
    const [inputVerify, setInputVerify] = useState<string>('');
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


    const handleCreate = () => {
        setUserToEdit({
            first_name: "",
            last_name: "",
            email: ""
        });
    };

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

    const columnas: ITableColumn<IUser>[] = [
        {
            name: 'Nombre Completo',
            cell: (row: IUser) => row.full_name,
            selector: (row: IUser) => row.full_name,
            sortable: true
        },
        {
            name: 'Primer Nombre',
            cell: (row: IUser) => row.first_name,
            selector: (row: IUser) => row.first_name,
            sortable: true
        },
        {
            name: 'Apellido',
            cell: (row: IUser) => row.last_name,
            selector: (row: IUser) => row.last_name,
            sortable: true
        },
        {
            name: 'Correo',
            cell: (row: IUser) => row.email,
            selector: (row: IUser) => row.email,
            sortable: true
        },
        {
            name: 'Administrador',
            cell: (row: IUser) => row.is_admin,
            selector: (row: IUser) => row.is_admin,
            sortable: true
        },
        {
            name: 'Acciones',
            cell: (row: IUser) => {
                return (
                    <div className='flex gap-5'>
                        <button className='btn btn-warning btn-sm' onClick={() => setUserToEdit(row)}>Editar</button>
                        <button className='btn btn-error btn-sm ml-2' onClick={() => setUserToDelete(row)}>Eliminar</button>
                    </div>
                )
            },
            selector: (row: IUser) => {
                return (
                    <div className='flex gap-5'>
                        <button className='btn btn-warning btn-sm' onClick={() => setUserToEdit(row)}>Editar</button>
                        <button className='btn btn-error btn-sm ml-2' onClick={() => setUserToDelete(row)}>Eliminar</button>
                    </div>
                )
            }
        }
    ]

    return (
        <div className='w-full h-full p-8'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-3xl font-bold'>Clientes</h1>
                <div className='flex gap-5'>
                    <button className='btn btn-success' onClick={handleCreate}>Nuevo usuario</button>
                </div>
            </div>
            <Table data={data} columns={columnas} selectableRows={false}
                paginationOptions={paginationOptions} onChangePage={onChangePage} onChangePerPage={onChangePerPage} progressPending={loading} />
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
        </div>
    )
}
