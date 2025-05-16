import { signOut } from "@firebase/auth";
import clsx from "clsx";
import { LogOut, Package, ReceiptText, ShoppingCart, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router";
import decal from '../../assets/adecal1.png';
import { auth } from "../../firebase";

const links = [
    { to: '/dashboard/product', text: 'Product', icon: <Package /> },
    { to: '/dashboard/product-details', text: 'Product Details', icon: <ReceiptText /> },
    
    { to: '/dashboard/customer', text: 'Customer', icon: <Users /> },
    { to: '/dashboard/transaksi', text: 'Transaksi', icon: <ShoppingCart /> },
]

function Dashboard() {

    return (<>
        <div className="flex">

            <div className="flex h-screen w-fit flex-col  items-center bg-green-800 p-6 py-12 min-w-64 text-white">

                <img src={decal} alt="" className="w-24 h-5 mb-12" />
                <div className="flex gap-y-8 flex-col  pr-12">
                    {
                        links.map(data => (
                            <NavLink key={data.text} end className={({ isActive }) => 
                                 clsx("flex font-bold gap-x-2", { "opacity-60 hover:opacity-100": !isActive })} to={data.to}>
                                {data.icon}
                                {data.text}
                            </NavLink>
                        ))
                    }
                </div>


                <div className="flex h-screen justify-start w-full items-end">
                    <button className="flex gap-4 font-bold hover:opacity-100 opacity-60 " onClick={() => { signOut(auth) }}>
                        <LogOut /> Logout
                    </button>
                </div>
            </div>
            <div className="flex flex-1 container m-4">
                <Outlet />
            </div>
        </div>

    </>);
}

export default Dashboard;