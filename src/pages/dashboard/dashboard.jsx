import { signOut } from "@firebase/auth";
import clsx from "clsx";
import { LogOut, Menu, Package, ReceiptText, ShoppingCart, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router";
import decal from '../../assets/adecal1.png';
import { auth } from "../../firebase";
import { useState } from "react";

const links = [
    { to: '/dashboard/product', text: 'Product', icon: <Package /> },
    { to: '/dashboard/product-details', text: 'Product Details', icon: <ReceiptText /> },
    { to: '/dashboard/customer', text: 'Customer', icon: <Users /> },
    { to: '/dashboard/transaksi', text: 'Transaksi', icon: <ShoppingCart /> },
]

function Dashboard() {
    const [minimize, setMinimize] = useState(false)
    return (<>
        <div className="flex">
            <div className="flex h-screen w-fit flex-col  items-center bg-green-800 p-6 py-12 text-white">
                <div className="flex w-full h-5 gap-x-2 mb-12 items-center">
                    <Menu onClick={() => setMinimize(!minimize)} className="hover:opacity-100 opacity-60" />
                    <img src={decal} alt="logo" className={clsx("w-20", { 'hidden': minimize })} />
                </div>
                <div className="flex gap-y-8 flex-col ">
                    {
                        links.map(data => (
                            <NavLink key={data.text} end className={({ isActive }) =>
                                clsx("flex font-bold gap-x-2", { "opacity-60 hover:opacity-100": !isActive })} to={data.to}>
                                {data.icon}
                                <span className={clsx("", { 'hidden': minimize })}>
                                    {data.text}
                                </span>
                            </NavLink>
                        ))
                    }
                </div>


                <div className="flex h-screen justify-start w-full items-end">
                    <button className="flex gap-4 font-bold hover:opacity-100 opacity-60 " onClick={() => { signOut(auth) }}>
                        <LogOut />
                        <span className={clsx({ 'hidden': minimize }, )}>
                            Logout
                        </span>
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