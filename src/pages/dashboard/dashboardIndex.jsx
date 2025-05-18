import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function DashboardIndex() {
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const data = [
        { day: '01', revenue: 100 },
        { day: '02', revenue: 0 },
        { day: '03', revenue: 1000 }
    ];

    return (<>
        <div className="p-4 container">
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
            <h2 className="font-bold my-2">Laporan Data Sepanjang Bulan {bulan[new Date().getMonth()]}</h2>

            <div className="flex gap-4 py-4">
                <div className="flex-1 p-8 shadow-2xl max-w-[16] rounded-xl">
                    <h2 className="text-xl font-semibold">Total Transaksi</h2>
                    <span className="text-xl">12</span>
                </div>

                <div className="flex-1 p-8 shadow-2xl max-w-[16] rounded-xl">
                    <h2 className="text-xl font-semibold">Total Pendapatan</h2>
                    <span className="text-xl">Rp{(1200000).toLocaleString()}</span>
                </div>
            </div>
            <div className="flex-1 p-8 shadow-2xl rounded-xl">
                <h2 className="text-xl font-semibold my-4">Grafix Pendapatan</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="flex-1 p-8 shadow-2xl rounded-xl">
                <h2 className="text-xl font-semibold my-4">Grafix Transaksi</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>
    </>);
}

export default DashboardIndex;