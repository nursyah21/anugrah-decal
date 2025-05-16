// import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "@firebase/firestore";
import { Edit, Trash, X } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import useSWR, { mutate } from "swr";
// import { db } from "../../firebase";

// const fetcher = async () => {
//     const querySnapshot = await getDocs(collection(db, "products"));
//     return querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//     }));
// };

function ProductDetails() {
    // const { data: products, error, isLoading } = useSWR('products', fetcher);
    // const [editingProduct, setEditingProduct] = useState(null);
    // const { register, handleSubmit, reset, setValue, watch } = useForm();
    // const [isModalOpen, setIsModalOpen] = useState(false);

    // const onSubmit = async (data) => {
    //     try {
    //         console.log(data)
    //         const imageBase64 = watch('imageChange') ?? data.image

    //         if (!imageBase64 && !editingProduct) {
    //             toast.error("Image is required");
    //             return;
    //         }

    //         const productData = {
    //             name: data.name,
    //             description: data.description,
    //             image: imageBase64,
    //             category: data.category,
    //             merk: data.merk,
    //             model: data.model,
    //             laminating: [
    //                 ...Object.entries(data.laminatingPrices || {}).map(([key, value]) => ({
    //                     name: key,
    //                     price: Number(value)
    //                 })),
    //             ],
    //             materials: [
    //                  ...Object.entries(data.materialPrices || {}).map(([key, value]) => ({
    //                     name: key,
    //                     price: Number(value)
    //                 })),
    //             ]
    //         };
    //         console.log(productData)

    //         if (editingProduct) {
    //             await updateDoc(doc(db, "products", editingProduct.id), productData);
    //             toast.success("Product updated successfully");
    //         } else {
    //             await addDoc(collection(db, "products"), productData);
    //             toast.success("Product added successfully");
    //         }

    //         reset();
    //         setEditingProduct(null);
    //         handleCloseModal();
    //         mutate('products'); // Revalidate the data using SWR
    //     } catch (error) {
    //         toast.error("Error saving product");
    //         console.log(error)
    //     }
    // };

    // const handleDelete = async (id) => {
    //     if (window.confirm("Are you sure you want to delete this product?")) {
    //         try {
    //             await deleteDoc(doc(db, "products", id));
    //             toast.success("Product deleted successfully");
    //             mutate('products'); // Revalidate the products data
    //         } catch (error) {
    //             toast.error("Error deleting product");
    //             console.log(error)
    //         }
    //     }
    // };

    // const handleEdit = (product) => {
    //     setEditingProduct(product);
    //     setValue("name", product.name);
    //     setValue("description", product.description);
    //     setValue("image", product.image);
    //     setValue("laminatingName", product.laminating[0]?.name);
    //     setValue("laminatingPrice", product.laminating[0]?.price);
    //     setValue("materialName", product.materials[0]?.name);
    //     setValue("materialPrice", product.materials[0]?.price);
    //     setIsModalOpen(true);
    // };

   

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

            {/* {error && <div className="text-red-500">Failed to load products</div>}
            {isLoading && <div>Loading...</div>} */}

            

            

            <div className="flex gap-x-2">
                <button className="btn-primary btn">Merk</button>
                <button className="btn-primary btn">Model</button>
                <button className="btn-primary btn">Kategori</button>
                <button className="btn-primary btn">Bahan</button>
                <button className="btn-primary btn">Laminating</button>
            </div>

           
        </div>
        
    );
}

export default ProductDetails;