import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "@firebase/firestore";
import { Edit, Trash, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { db } from "../../firebase";

const fetcher = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

function ProductDetails() {
    const { data: products, error, isLoading } = useSWR('products', fetcher);
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
                materials: [
                     ...Object.entries(data.materialPrices || {}).map(([key, value]) => ({
                        name: key,
                        price: Number(value)
                    })),
                ]
            };
            console.log(productData)

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
            mutate('products'); // Revalidate the data using SWR
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
                mutate('products'); // Revalidate the products data
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
        setValue("image", product.image);
        setValue("laminatingName", product.laminating[0]?.name);
        setValue("laminatingPrice", product.laminating[0]?.price);
        setValue("materialName", product.materials[0]?.name);
        setValue("materialPrice", product.materials[0]?.price);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        reset();
    };

    return (
        <div className="p-4">

            <div className="flex gap-x-4  items-center mb-4">
                <h2 className="text-2xl font-semibold">Product Details</h2>
                {/* {!isLoading && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Add New Product
                    </button>
                )} */}
            </div>

            {error && <div className="text-red-500">Failed to load products</div>}
            {isLoading && <div>Loading...</div>}

            

            {/* Modal */}
            {isModalOpen && (
                <div onClick={handleCloseModal} className="fixed inset-0 bg-[rgba(0,0,0,.8)] bg-opacity-20 flex items-center justify-center z-50">
                    <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg p-8 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X />
                            </button>
                        </div>

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
                                        setValue('imageChange', URL.createObjectURL(file))
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
                                    <div className="flex items-center space-x-4 overflow-x-scroll">
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
                                    {/* Render an input to update the price for each selected option */}
                                    {(watch("laminatedOptions") || []).map((option) => (
                                        <label key={option} htmlFor="option">
                                            {option}
                                            <input
                                                key={option}
                                                type="number"
                                                placeholder={`Price for ${option}`}
                                                {...register(`laminatingPrices.${option}`)}
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold mb-2">Bahan</h3>
                                <div className="space-y-2">
                                    {/* Render checkboxes dynamically using map */}
                                    <div className="flex items-center space-x-4 overflow-x-scroll">
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
                                    {/* Render an input to update the price for each selected option */}
                                    {(watch("bahanOptions") || []).map((option) => (
                                        <label key={option} htmlFor="option">
                                            {option}
                                            <input
                                                type="number"
                                                placeholder={`Price for ${option}`}
                                                {...register(`bahanPrices.${option}`)}
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-500  text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                            >
                                {isLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex gap-x-2">
                <button className="bg-green-800 text-white px-4 py-2  hover:opacity-80 rounded-lg">Merk</button>
                <button className="bg-green-800 text-white px-4 py-2  hover:opacity-80 rounded-lg">Model</button>
                <button className="bg-green-800 text-white px-4 py-2  hover:opacity-80 rounded-lg">Kategori</button>
                <button className="bg-green-800 text-white px-4 py-2  hover:opacity-80 rounded-lg">Bahan</button>
                <button className="bg-green-800 text-white px-4 py-2  hover:opacity-80 rounded-lg">Laminating</button>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-screen ">
                {products?.map(product => (
                    <div key={product.id} className="border p-4 rounded">
                        <img src={product.image} alt={product.name} className="w-full h-24 object-cover mb-2" />
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-sm">{product.description}</p>

                        {
                            (() => {
                                const laminatingPrices = product.laminating.map(item => item.price);
                                const materialPrices = product.materials.map(item => item.price);
                                const lowestLaminating = Math.min(...laminatingPrices);
                                const lowestMaterial = Math.min(...materialPrices);
                                const total = lowestLaminating + lowestMaterial;
                                return (
                                    <h4 className="font-semibold">
                                        Rp. {total}
                                    </h4>
                                );
                            })()
                        }

                        <div className="mt-4 space-x-2 justify-end flex">
                            <button
                                onClick={() => handleEdit(product)}
                                className="bg-yellow-500 text-white px-2 py-1 hover:opacity-60 rounded"
                            >
                                <Edit size={20} />
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-500 text-white px-2 py-1 hover:opacity-60 rounded"
                            >
                                <Trash size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
    );
}

export default ProductDetails;