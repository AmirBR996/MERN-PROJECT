import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Star,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ArrowRight,
  X
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  getMyProducts,
  deleteProduct
} from "../api/product.api";
import {
  getSellerStats,
  getSellerSalesAnalytics,
  getSellerOrders
} from "../api/order.api"; 
import AddProductForm from "../components/form/AddProductForm";
import Button from "../components/ui/Button";

const StatCard = ({ label, value, trend, trendType }) => (
  <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="rounded-full bg-stone-100 p-2 text-stone-600">
        {label === "Total Earnings" && <TrendingUp className="h-5 w-5" />}
        {label === "Total Orders" && <ShoppingBag className="h-5 w-5" />}
        {label === "Active Products" && <Package className="h-5 w-5" />}
        {label === "Rating" && <Star className="h-5 w-5" />}
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          trendType === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
        }`}>
          {trendType === "up" ? "+" : ""}{trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="text-2xl font-serif font-bold text-stone-900">{value}</p>
    </div>
  </div>
);

const FarmerDashboard = () => {
  const [stats, setStats] = useState({ totalEarnings: 0, totalOrders: 0, activeProducts: 0, rating: 0 });
  const [analytics, setAnalytics] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, analyticsData, ordersData, productsData] = await Promise.all([
        getSellerStats(),
        getSellerSalesAnalytics(),
        getSellerOrders(),
        getMyProducts()
      ]);
      setStats(statsData);
      setAnalytics(analyticsData);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleProductAction = async (id, action) => {
    if (action === 'delete') {
      if (window.confirm("Delete this product?")) {
        await deleteProduct(id);
        loadDashboardData();
      }
    } else if (action === 'edit') {
      const product = products.find(p => p._id === id);
      setEditingProduct(product);
      setIsModalOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-green-900">Farmer Dashboard</h1>
          </div>
          <Button
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* KPI Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Earnings" value={`₹${stats.totalEarnings.toLocaleString()}`}  trendType="up" />
          <StatCard label="Total Orders" value={stats.totalOrders}  trendType="up" />
          <StatCard label="Active Products" value={stats.activeProducts}  trendType="up" />
          <StatCard label="Rating" value={stats.rating}  trendType="up" />
        </div>

        {/* Sales Analytics */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-stone-900 mb-6">Sales Analytics</h3>
          <div className="h-80 w-full">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center text-stone-400">Loading charts...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <Tooltip
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#166534" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* Recent Orders */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900 mb-6">Recent Orders</h3>
            <div className="space-y-4">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="h-16 w-full bg-stone-100 animate-pulse rounded-xl" />)
              ) : orders.length === 0 ? (
                <p className="text-center py-10 text-stone-400">No recent orders found</p>
              ) : (
                orders.map(order => (
                  <div key={order._id} className="flex items-center justify-between p-4 rounded-xl border border-stone-100 hover:border-emerald-200 transition-colors">
                    <div>
                      <p className="font-bold text-stone-900">{order.orderId}</p>
                      <p className="text-xs text-stone-500">{order.customerName} • {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-stone-900">₹{order.amount}</p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* My Products */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900 mb-6">My Products</h3>
            <div className="space-y-4">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="h-16 w-full bg-stone-100 animate-pulse rounded-xl" />)
              ) : products.length === 0 ? (
                <p className="text-center py-10 text-stone-400">No products listed yet</p>
              ) : (
                products.map(product => (
                  <div key={product._id} className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <img src={product.image_url} alt="" className="h-12 w-12 rounded-lg object-cover bg-stone-200" />
                      <div>
                        <p className="font-bold text-stone-900">{product.name}</p>
                        <p className="text-xs text-stone-500">₹{product.price}/kg</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleProductAction(product._id, 'view')} className="p-2 text-stone-400 hover:text-emerald-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleProductAction(product._id, 'edit')} className="p-2 text-stone-400 hover:text-emerald-600 transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleProductAction(product._id, 'delete')} className="p-2 text-stone-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 border-b">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => { setIsModalOpen(false); setEditingProduct(null); }}
                  className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <AddProductForm
                  initialData={editingProduct}
                  onSubmitSuccess={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                    loadDashboardData();
                  }}
                  onCancel={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default FarmerDashboard;
