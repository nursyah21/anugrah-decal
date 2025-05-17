import { addDoc, collection, deleteDoc, doc, updateDoc } from "@firebase/firestore";
import clsx from "clsx";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import Modal from "../../components/modal";
import Table from "../../components/table";
import { fetcherKategoris, fetcherMerks, fetcherModels, fetcherProducts } from "../../lib/fetcher";
import { db } from "../../lib/firebase";

function Product() {
    const { data: products, isProductsLoading } = useSWR('products', fetcherProducts);
    const { data: merks, isMerksLoading } = useSWR('merks', fetcherMerks);
    const { data: models, isModelsLoading } = useSWR('models', fetcherModels);
    const { data: kategoris, isKategorisLoading } = useSWR('kategoris', fetcherKategoris);

    const [editingProduct, setEditingProduct] = useState(null);
    const [isDelete, setIsDelete] = useState(false);
    const { register, handleSubmit, reset, setValue, watch, formState: {isSubmitting} } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onSubmit = async (data) => {
        try {
            const imageBase64 = watch('imageChange') ?? data.image

            if (!imageBase64 && !editingProduct) {
                toast.error("Image is required");
                return;
            }

            const productData = {
                name: data.name,
                description: data.description,
                image: imageBase64,
                category: data.category,
                merk: data.merk,
                model: data.model,
                laminating: [
                    ...Object.entries(data.laminatingPrices || {}).map(([key, value]) => ({
                        name: key,
                        price: Number(value)
                    })),
                ],
                bahan: [
                    ...Object.entries(data.bahanPrices || {}).map(([key, value]) => ({
                        name: key,
                        price: Number(value)
                    })),
                ]
            };
            if (isDelete) {
                await deleteDoc(doc(db, "products", editingProduct.id));
                toast.success("Product deleted successfully");
            }
            else if (editingProduct) {
                await updateDoc(doc(db, "products", editingProduct.id), productData);
                toast.success("Product updated successfully");
            } 
            else {
                await addDoc(collection(db, "products"), productData);
                toast.success("Product added successfully");
            }

            reset();
            setEditingProduct(null);
            handleCloseModal();
            mutate('products');
        } catch (error) {
            toast.error(isDelete ? "Error delete product" : editingProduct ? "Error update product" : "Error saving product");
            console.log(error)
        }
    };

    const handleDelete = (product) => {
        setIsDelete(true)
        handleEdit(product)
    };

    const handleEdit = (data) => {
        setEditingProduct(data);
        setValue("product", data.product);
        setValue("description", data.description);
        setValue("category", data.category);
        setValue("merk", data.merk);
        setValue("model", data.model);
        setValue("image", data.image);
        setValue("laminatingPrice", data.laminating);
        setValue("bahanPrice", data.bahan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsDelete(false)
        setEditingProduct(null);
        reset();
    };


    const priceProduct = (product) => {
        const laminating = Math.min(...product.laminating.map(item => item.price))
        const bahan = Math.min(...product.bahan.map(item => item.price))
        const fixInfinitiny = (num) => num === Infinity ? 0 : num
        const total = fixInfinitiny(laminating) + fixInfinitiny(bahan);
        return total.toLocaleString()
    }

    if (isProductsLoading || isMerksLoading || isModelsLoading || isKategorisLoading) {
        return <>Please wait...</>
    }

    return (
        <div className="p-4 container">

            <div className="flex justify-between gap-x-4  items-center mb-4">
                <h2 className="text-2xl font-semibold">Product</h2>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">Add Product</button>
            </div>

            <Modal isOpen={isModalOpen} handleOpen={handleCloseModal} title={isDelete ? 'Delete Product' : editingProduct ? 'Edit Product' : 'Add Product'}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block mb-2">Product:</label>
                        <input disabled={isDelete} {...register("product")} className="w-full p-2 border rounded" required />
                    </div>

                    <div>
                        <label className="mb-2 block">Image: *max 512kb
                            {(watch("image")?.length > 0 || watch("imageChange")?.length > 0) && (
                                <img
                                    src={watch('imageChange') || watch("image")}
                                    alt="Image Preview"
                                    className={`mt-2 w-32 h-32 object-cover`}
                                />
                            )}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            className={clsx(isDelete && 'hidden', "w-full p-2 border rounded")}
                            required={!editingProduct}
                            onChange={(e) => {
                                const file = e.target.files[0]
                                if (file.size > 512 * 1024) {
                                    toast.error("File size must be less than 512KB");
                                    setValue('image', null)
                                    return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setValue("imageChange", reader.result);
                                };
                                reader.readAsDataURL(file);
                            }}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Description:</label>
                        <textarea disabled={isDelete} {...register("description")} className="w-full p-2 border rounded" required />
                    </div>

                    <div className={isDelete && 'hidden'}>
                        <label className="block mb-2">Category:</label>
                        <select {...register("category")} className="w-full p-2 border rounded" required>
                            <option value="">Select Category</option>
                            {kategoris?.map((option, id) =>
                                <option key={id} value={option.kategori}>{option.kategori}</option>
                            )}
                        </select>
                    </div>

                    <div className={isDelete && 'hidden'}>
                        <label className="block mb-2">Merk:</label>
                        <select {...register("merk")} className="w-full p-2 border rounded" required>
                            <option value="">Select Merk</option>
                            {merks?.map((option, id) =>
                                <option key={id} value={option.merk}>{option.merk}</option>
                            )}
                        </select>
                    </div>

                    <div className={isDelete && 'hidden'}>
                        <label className="block mb-2">Model:</label>
                        <select {...register("model")} className="w-full p-2 border rounded" required>
                            <option value="">Select Model</option>
                            {models?.filter(e=>e.merk == watch('merk')).map((option, id) =>
                                <option key={id} value={id}>{option.model}</option>
                            )}
                        </select>
                    </div>

                    <div className={isDelete && 'hidden'}>
                        <h3 className="font-bold mb-2">Laminating</h3>
                        <div className="space-y-2">
                            <div className="flex px-2 items-center space-x-4 overflow-x-scroll">
                                {["Glossy", "Matte", "Satin"].map((option) => (
                                    <label key={option} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            value={option}
                                            {...register("laminatedOptions")}
                                        />
                                        <span className="ml-2">{option}</span>
                                    </label>
                                ))}
                            </div>
                            {(watch("laminatedOptions") || []).map((option) => (
                                <label key={option} htmlFor="option">
                                    {option}
                                    <input
                                        key={option}
                                        type="number"
                                        placeholder={`Price for ${option}`}
                                        {...register(`laminatingPrices.${option}`)}
                                        className="w-full p-2 mb-2 border rounded"
                                        required
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={isDelete && 'hidden'}>
                        <h3 className="font-bold mb-2">Bahan</h3>
                        <div className="space-y-2">
                            <div className="flex px-2 items-center space-x-4 overflow-x-scroll">
                                {["Bahan1", "Bahan2", "Bahan3"].map((option) => (
                                    <label key={option} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            value={option}
                                            {...register("bahanOptions")}
                                        />
                                        <span className="ml-2">{option}</span>
                                    </label>
                                ))}
                            </div>
                            {(watch("bahanOptions") || []).map((option) => (
                                <label key={option} htmlFor="option">
                                    {option}
                                    <input
                                        type="number"
                                        placeholder={`Price for ${option}`}
                                        {...register(`bahanPrices.${option}`)}
                                        className="w-full p-2 mb-2 border rounded"
                                        required
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={clsx("btn", isDelete ? "btn-danger" : editingProduct ? "btn-warning" : "btn-primary")}
                    >
                        {isSubmitting ? 'Saving...' : (isDelete ? 'Delete Product' : editingProduct ? 'Update Product' : 'Add Product')}
                    </button>
                </form>
            </Modal>

            <Table rows={['#', 'Image', 'Product', 'Description', 'Category', 'Merk', 'Model', 'Price', '']}>
                {products?.map((data, id) => (
                    <tr key={id} >
                        <td>{id + 1}</td>
                        <td>
                            <img src={data.image} alt={data.name} className="w-24 h-24 object-cover rounded" />
                        </td>
                        <td>{data.product} </td>
                        <td>{data.description}</td>
                        <td>{data.category}</td>
                        <td>{data.merk}</td>
                        <td>{data.model}</td>
                        <td>{priceProduct(data)}</td>
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

        </div>
    );
}

export default Product;