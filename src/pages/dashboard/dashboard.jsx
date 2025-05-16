import { signOut } from "@firebase/auth";
import { LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router";
import decal from '../../assets/adecal1.png';
import { auth } from "../../firebase";

const links = [
    { to: '/dashboard', text: 'Dashboard' },
    { to: '/dashboard/product', text: 'Product' },
    { to: '/dashboard/merk', text: 'Merk' },
    { to: '/dashboard/model', text: 'Model' },
    { to: '/dashboard/category', text: 'Kategori' },
    { to: '/dashboard/bahan', text: 'Bahan' },
    { to: '/dashboard/laminating', text: 'Laminating' },
    { to: '/dashboard/customer', text: 'Customer' },
    { to: '/dashboard/transaksi', text: 'Transaksi' },
]

function Dashboard() {

    return (<>
        <div className="flex">

            <div className="flex h-screen w-fit flex-col  items-center bg-green-800 p-6 py-12 text-white">

                <img src={decal} alt="" className="w-24 h-5 mb-12" />
                <div className="flex gap-y-4 flex-col  pr-12">
                    {
                        links.map(data => (
                            <NavLink key={data.text} end className={({ isActive }) =>
                                isActive ? 'font-bold' : 'opacity-60 font-bold hover:opacity-100'} to={data.to}>
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