import { addDoc, collection, deleteDoc, doc, updateDoc, getDocs } from "@firebase/firestore";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import Modal from "../../components/modal";
import Table from "../../components/table";
import { db } from "../../lib/firebase";

const fetcher = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

function Product() {
    const { data: products, isLoading } = useSWR('products', fetcher);
    const [editingProduct, setEditingProduct] = useState(null);
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onSubmit = async (data) => {
        try {
            console.log(data)
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

            if (editingProduct) {
                await updateDoc(doc(db, "products", editingProduct.id), productData);
                toast.success("Product updated successfully");
            } else {
                await addDoc(collection(db, "products"), productData);
                toast.success("Product added successfully");
            }

            reset();
            setEditingProduct(null);
            handleCloseModal();
            mutate('products');
        } catch (error) {
            toast.error("Error saving product");
            console.log(error)
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteDoc(doc(db, "products", id));
                toast.success("Product deleted successfully");
                mutate('products');
            } catch (error) {
                toast.error("Error deleting product");
                console.log(error)
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setValue("name", product.name);
        setValue("description", product.description);
        setValue("category", product.category);
        setValue("merk", product.merk);
        setValue("model", product.model);
        setValue("image", product.image);
        setValue("laminatingPrice", product.laminating);
        setValue("bahanPrice", product.bahan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        reset();
    };


    const priceProduct = (product) => {
        const total = Math.min(...product.laminating.map(item => item.price)) + Math.min(...product.bahan.map(item => item.price));
        return total.toLocaleString()
    }

    return (
        <div className="p-4 container">

            <div className="flex justify-between gap-x-4  items-center mb-4">
                <h2 className="text-2xl font-semibold">Product {isLoading && '...'}</h2>
                {!isLoading && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary"
                    >
                        Add New Product
                    </button>
                )}
            </div>

            <Modal isOpen={isModalOpen} handleOpen={handleCloseModal} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block mb-2">Name:</label>
                        <input {...register("name")} className="w-full p-2 border rounded" required />
                    </div>

                    <div>
                        <label className="block mb-2">Image: *max 512kb
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
                            className="w-full p-2 border rounded"
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
                        <textarea {...register("description")} className="w-full p-2 border rounded" required />
                    </div>

                    <div>
                        <label className="block mb-2">Category:</label>
                        <select {...register("category")} className="w-full p-2 border rounded" required>
                            <option value="">Select Category</option>
                            {["Category A", "Category B", "Category C"].map((option) =>
                                <option key={option} value={option}>{option}</option>
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2">Merk:</label>
                        <select {...register("merk")} className="w-full p-2 border rounded" required>
                            <option value="">Select Merk</option>
                            {["Brand A", "Brand B", "Brand C"].map((option) =>
                                <option key={option} value={option}>{option}</option>
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2">Model:</label>
                        <select {...register("model")} className="w-full p-2 border rounded" required>
                            <option value="">Select Model</option>
                            {["Model A", "Model B", "Model C"].map((option) =>
                                <option key={option} value={option}>{option}</option>
                            )}
                        </select>
                    </div>

                    <div>
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

                    <div>
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
                        disabled={isLoading}
                        className="btn btn-primary"
                    >
                        {isLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                    </button>
                </form>
            </Modal>

            <Table rows={['#', 'Image', 'Name', 'Description', 'Category', 'Merk', 'Model', 'Price', 'Action']}>
                {products?.map((product, id) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td>{id + 1}</td>
                        <td className="p-4">
                            <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded" />
                        </td>
                        <td className="p-4 "> {product.name}  </td>
                        <td className="p-4">{product.description}</td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4">{product.merk}</td>
                        <td className="p-4">{product.model}</td>
                        <td className="p-4">{priceProduct(product)}</td>
                        <td className="p-4">
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <button onClick={() => handleEdit(product)} className="btn-warning btn">
                                    <Edit size={16} />
                                </button>

                                <button onClick={() => handleDelete(product.id)} className="btn-danger btn">
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