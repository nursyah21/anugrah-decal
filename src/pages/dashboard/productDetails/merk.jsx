import { useState } from "react";
import Modal from "../../../components/modal";
import Table from "../../../components/table";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import toast from "react-hot-toast";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "@firebase/firestore";
import { db } from "../../../lib/firebase";
import useSWR, { mutate } from "swr";
import { Edit, Trash } from "lucide-react";

const fetcher = async () => {
    const querySnapshot = await getDocs(collection(db, 'merks'));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

function Merk() {
    const { data, isLoading } = useSWR('merks', fetcher);
    const [isOpen, setIsOpen] = useState(false)
    const [id, setId] = useState()
    const [isDelete, setIsDelete] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm()
    const handleOpen = () => {
        setIsOpen(!isOpen)
        setIsDelete(false)
        setIsEditing(false)
        reset()
    }
    const onSubmit = async (data) => {
        try {
            if (isDelete) {
                await deleteDoc(doc(db, "merks", id));
                toast.success("Merk delete successfully")
            }
            else if (isEditing) {
                await updateDoc(doc(db, "merks", id), data)
                toast.success("Merk update successfully")
            }
            else {
                await addDoc(collection(db, "merks"), data)
                toast.success("Merk added successfully")
            }
            reset()
            mutate('merks')
            handleOpen()
        } catch (error) {
            toast.error(isDelete ? "Error delete merk" : isEditing ? "Error update merk" : "Error saving merk");
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
        setValue('merk', data.merk)
        setIsEditing(true)
    }


    return (<>
        {
            isLoading ? 'Please wait...' :
                <button onClick={handleOpen} className="my-2 w-full mb-4 btn btn-primary">Add Merk</button>
        }
        <Modal isOpen={isOpen} handleOpen={handleOpen} title="Add Merk">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-2">Merk:</label>
                    <input disabled={isDelete} {...register("merk")} className="w-full p-2 border rounded" required />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={clsx("btn", isDelete ? "btn-danger" : isEditing ? "btn-warning" : "btn-primary")}
                >
                    {isSubmitting ? 'Saving...' : (isDelete ? 'Delete Merk' : isEditing ? 'Update Merk' : 'Add Merk')}
                </button>
            </form>
        </Modal>
        <Table rows={['#', 'Merk', '']}>
            {data?.map((data, id) => (
                <tr key={id} >
                    <td>{id + 1}</td>
                    <td>{data.merk}</td>
                    <td>
                        <div className="flex flex-col gap-2 justify-center items-center">
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
    </>);
}

export default Merk;