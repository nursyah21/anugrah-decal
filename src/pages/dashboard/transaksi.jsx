import { addDoc, collection, deleteDoc, doc, updateDoc } from "@firebase/firestore";
import clsx from "clsx";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import Modal from "../../components/modal";
import Table from "../../components/table";
import { fetcherCustomers, fetcherProducts, fetcherTransactions } from "../../lib/fetcher";
import { db } from "../../lib/firebase";

function Transaksi() {
    const { data: customers, isCustomersLoading } = useSWR('customers', fetcherCustomers);
    const { data: products, isProductsLoading } = useSWR('products', fetcherProducts);
    const { data, isLoading } = useSWR('transaksis', fetcherTransactions);

    const [isOpen, setIsOpen] = useState(false)
    const [id, setId] = useState()
    const [isDelete, setIsDelete] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const { control, register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({
        defaultValues: {
            listProduct: [{id:Date.now(), product:'', }]
        }
    })
    const handleOpen = () => {
        setIsOpen(!isOpen)
        setIsDelete(false)
        setIsEditing(false)
        reset()
    }
    const onSubmit = async (data) => {
        try {
            if (isDelete) {
                await deleteDoc(doc(db, "transaksis", id));
                toast.success("Transaksi delete successfully")
            }
            else if (isEditing) {
                await updateDoc(doc(db, "transaksis", id), data)
                toast.success("Transaksi update successfully")
            }
            else {
                await addDoc(collection(db, "transaksis"), data)
                toast.success("Transaksi added successfully")
            }
            reset()
            mutate('transaksis')
            handleOpen()
        } catch (error) {
            toast.error(isDelete ? "Error delete transaksi" : isEditing ? "Error update transaksi" : "Error saving transaksi");
            console.log(error)
        }
    }

    const handleDelete = (data) => {
        handleOpen()
        handleEdit(data)
        setIsDelete(true)
    }
    const handleEdit = (data) => {
        handleOpen()
        setId(data.id)
        setValue('nama', data.nama)
        setValue('no_hp', data.no_hp)
        setIsEditing(true)
    }

    if (isLoading || isCustomersLoading || isProductsLoading) {
        return <>Please wait...</>
    }

    return (<>
        <div className="p-4 container">
            <div className="flex justify-between gap-x-4  items-center mb-4">
                <h2 className="text-2xl font-semibold">Transaksi</h2>
                <button onClick={handleOpen} className="btn btn-primary">Add Transaksi</button>
            </div>
            <Modal isOpen={isOpen} handleOpen={handleOpen} title={isDelete ? 'Delete Transaksi' : isEditing ? 'Update Transaksi' : 'Add Transaksi'}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block mb-2">Customer:</label>
                        {/* <input disabled={isDelete} {...register("nama")} className="w-full p-2 border rounded" required /> */}
                    </div>
                    <div>
                        <label className="block mb-2">Product:</label>
                        {/* <input disabled={isDelete} {...register("no_hp")} className="w-full p-2 border rounded" required /> */}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={clsx("btn", isDelete ? "btn-danger" : isEditing ? "btn-warning" : "btn-primary")}
                    >
                        {isSubmitting ? 'Saving...' : (isDelete ? 'Delete Transaksi' : isEditing ? 'Update Transaksi' : 'Add Transaksi')}
                    </button>
                </form>
            </Modal>
            <Table rows={['#', 'Produk', 'Total Harga', 'Tanggal', 'Status Pengerjaan', 'Status Pembayaran', '']}>
                {data?.map((data, id) => (
                    <tr key={id} >
                        <td>{id + 1}</td>
                        <td>
                            <div className="flex gap-2 justify-center items-center">
                                <button onClick={() => handleEdit(data)} className="btn-warning btn">
                                    <Edit size={16} />
                                </button>

                                <button onClick={() => handleDelete(data)} className="btn-danger btn">
                                    <Trash size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    </>);
}

export default Transaksi;