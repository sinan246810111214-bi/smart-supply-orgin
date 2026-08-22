import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  Users,
  Warehouse,
  Printer,
  Trash2,
  Edit3,
  Plus,
  Save,
  X,
  Search,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  FileText,
  Clock,
  Coins,
  Package,
  Calendar,
  Undo2,
  Check,
  RotateCcw,
  Truck
} from "lucide-react";

import { Product } from "../types";

// Fixed Return Address
const FROM_ADDRESS = {
  name: "Muhammed Muksith v",
  address: "vazhengal H, palliyal thodi, near amlp school west mappattukara, kulukkallur po",
  pincode: "679337"
};

interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  pincode: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  timestamp: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  pincode: string;
  totalOrders: number;
  totalSpent: number;
}

interface AdminPanelProps {
  onBackToShop: () => void;
  productsList: Product[];
  onProductsUpdate: (updated: Product[]) => void;
}

export default function AdminPanel({ onBackToShop, productsList, onProductsUpdate }: AdminPanelProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders" | "customers" | "inventory" | "labels">("dashboard");

  // Local state for CRUD operations
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isLabelPreviewOpen, setIsLabelPreviewOpen] = useState(false);

  // Search and Filter states
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>("all");
  const [customerSearch, setCustomerSearch] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");

  // Modals and form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // New product form state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    id: "",
    name: "",
    tagline: "",
    description: "",
    originalPrice: 299,
    discountedPrice: 149,
    discountPercent: 50,
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
    gallery: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"],
    features: ["High-quality product", "Long-lasting durability", "Fast free COD shipping included"],
    tag: "New Arrival",
    rating: 5.0,
    reviewCount: 1,
    specs: { "Material": "Premium Grade", "Warranty": "6 Months Warranty" }
  });

  // Track product stock level (stored in localStorage)
  const [inventory, setInventory] = useState<Record<string, number>>({});

  // Initialize and load everything from localStorage on mount
  useEffect(() => {
    // 1. Load Orders or Seed
    const savedOrders = localStorage.getItem("smart_supply_orders");
    let currentOrders: Order[] = [];
    if (savedOrders) {
      currentOrders = JSON.parse(savedOrders);
    } else {
      // High-quality mock seed orders
      currentOrders = [
        {
          id: "SS-341905-182",
          name: "Vipin K. R.",
          phone: "9845321045",
          address: "Karthika Nivas, Near Temple, Thrissur",
          pincode: "680001",
          productName: "Smart Supply Ultimate 5-in-1 Best Seller Combo",
          quantity: 1,
          totalPrice: 999,
          status: "Pending",
          timestamp: "21/08/2026, 12:45:10 PM"
        },
        {
          id: "SS-721498-554",
          name: "Fathima Noora",
          phone: "7012948576",
          address: "Arakkal House, Beach Road, Kozhikode",
          pincode: "673003",
          productName: "3-Stage Professional Knife Sharpener",
          quantity: 1,
          totalPrice: 249,
          status: "Shipped",
          timestamp: "21/08/2026, 02:10:45 PM"
        },
        {
          id: "SS-910432-881",
          name: "Akhil Joseph",
          phone: "8129483726",
          address: "Kunnel Villa, Kadavanthra, Ernakulam",
          pincode: "682020",
          productName: "Mini Foldable Self-Squeeze Desktop Mop",
          quantity: 1,
          totalPrice: 249,
          status: "Delivered",
          timestamp: "20/08/2026, 09:30:15 AM"
        },
        {
          id: "SS-551029-432",
          name: "Anjana Nair",
          phone: "9562718293",
          address: "Devi Krupa, Pattom PO, Thiruvananthapuram",
          pincode: "695004",
          productName: "Multifunctional Liquid Shoe Cleaning Brush with Soap Dispenser",
          quantity: 2,
          totalPrice: 300,
          status: "Pending",
          timestamp: "21/08/2026, 04:15:22 PM"
        },
        {
          id: "SS-223405-119",
          name: "Mohammed Shafi",
          phone: "9945382012",
          address: "Shafi Manzil, Near Town Masjid, Malappuram",
          pincode: "676505",
          productName: "Silicone Bottle Cleaning Brush",
          quantity: 1,
          totalPrice: 249,
          status: "Pending",
          timestamp: "21/08/2026, 05:25:00 PM"
        },
        {
          id: "SS-883491-411",
          name: "Priya Lakshmi",
          phone: "9048321092",
          address: "Lakshmi Nivas, Fort Road, Palakkad",
          pincode: "678001",
          productName: "Smart Supply Ultimate 5-in-1 Best Seller Combo",
          quantity: 1,
          totalPrice: 999,
          status: "Shipped",
          timestamp: "20/08/2026, 11:15:40 AM"
        },
        {
          id: "SS-112398-502",
          name: "Midhun Kumar",
          phone: "8086214352",
          address: "Sree Hari, Bypass Junction, Kannur",
          pincode: "670002",
          productName: "3-Stage Professional Knife Sharpener",
          quantity: 1,
          totalPrice: 249,
          status: "Delivered",
          timestamp: "19/08/2026, 03:40:12 PM"
        },
        {
          id: "SS-445612-990",
          name: "Arun Bose",
          phone: "9447215392",
          address: "Bose Cottage, Kanjikuzhy, Kottayam",
          pincode: "686004",
          productName: "Multifunctional 4-in-1 Vegetable & Fruit Peeler",
          quantity: 1,
          totalPrice: 199,
          status: "Pending",
          timestamp: "21/08/2026, 06:12:05 PM"
        }
      ];
      localStorage.setItem("smart_supply_orders", JSON.stringify(currentOrders));
    }
    setOrders(currentOrders);

    // 2. Load or Initialize Inventory levels
    const savedInventory = localStorage.getItem("smart_supply_inventory");
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    } else {
      const initialStock: Record<string, number> = {};
      productsList.forEach((p) => {
        initialStock[p.id] = Math.floor(15 + Math.random() * 45); // Random default stocks
      });
      setInventory(initialStock);
      localStorage.setItem("smart_supply_inventory", JSON.stringify(initialStock));
    }
  }, [productsList]);

  // Synchronize customers and order totals whenever orders change
  useEffect(() => {
    if (orders.length === 0) return;

    // Build customers map from order records
    const custMap: Record<string, Customer> = {};
    orders.forEach((ord) => {
      const key = ord.phone;
      if (custMap[key]) {
        custMap[key].totalOrders += 1;
        custMap[key].totalSpent += ord.totalPrice;
      } else {
        custMap[key] = {
          id: `CUST-${ord.phone.slice(-6)}`,
          name: ord.name,
          phone: ord.phone,
          address: ord.address,
          pincode: ord.pincode,
          totalOrders: 1,
          totalSpent: ord.totalPrice
        };
      }
    });

    setCustomers(Object.values(custMap));
  }, [orders]);

  // Save inventory to localStorage on state update
  const saveInventory = (newInv: Record<string, number>) => {
    setInventory(newInv);
    localStorage.setItem("smart_supply_inventory", JSON.stringify(newInv));
  };

  // Save orders to localStorage on state update
  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem("smart_supply_orders", JSON.stringify(newOrders));
  };

  // --- CRUD FUNCTIONS ---

  // 1. PRODUCT CRUD
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = newProduct.name ? newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `prod-${Date.now()}`;
    const productToAdd: Product = {
      id: cleanId,
      name: newProduct.name || "Unnamed Product",
      tagline: newProduct.tagline || "Problem solver",
      description: newProduct.description || "No description provided",
      originalPrice: Number(newProduct.originalPrice) || 499,
      discountedPrice: Number(newProduct.discountedPrice) || 249,
      discountPercent: Math.round(((Number(newProduct.originalPrice) - Number(newProduct.discountedPrice)) / Number(newProduct.originalPrice)) * 100),
      imageUrl: newProduct.imageUrl || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
      gallery: newProduct.gallery || [],
      features: newProduct.features || [],
      tag: newProduct.tag || "New",
      rating: Number(newProduct.rating) || 5.0,
      reviewCount: Number(newProduct.reviewCount) || 1,
      specs: newProduct.specs || {}
    };

    const updated = [...productsList, productToAdd];
    onProductsUpdate(updated);

    // Update inventory level as well
    const updatedInv = { ...inventory, [productToAdd.id]: 50 };
    saveInventory(updatedInv);

    setIsAddingProduct(false);
    // Reset form
    setNewProduct({
      id: "",
      name: "",
      tagline: "",
      description: "",
      originalPrice: 299,
      discountedPrice: 149,
      discountPercent: 50,
      imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
      gallery: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"],
      features: ["Premium smart home gadget", "Saves daily time and effort"],
      tag: "New",
      rating: 5.0,
      reviewCount: 1,
      specs: { "Warranty": "6 Months Warranty" }
    });
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const discountPct = Math.round(((editingProduct.originalPrice - editingProduct.discountedPrice) / editingProduct.originalPrice) * 100);
    const updatedProduct = { ...editingProduct, discountPercent: discountPct };

    const updated = productsList.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    onProductsUpdate(updated);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updated = productsList.filter((p) => p.id !== id);
      onProductsUpdate(updated);

      // Remove from inventory state
      const updatedInv = { ...inventory };
      delete updatedInv[id];
      saveInventory(updatedInv);
    }
  };

  // 2. ORDER CRUD
  const handleUpdateOrderStatus = (orderId: string, status: Order["status"]) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    saveOrders(updated);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const updated = orders.filter((o) => o.id !== orderId);
      saveOrders(updated);
      setSelectedOrderIds(selectedOrderIds.filter((id) => id !== orderId));
    }
  };

  const handleEditOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    const updated = orders.map((o) => (o.id === editingOrder.id ? editingOrder : o));
    saveOrders(updated);
    setEditingOrder(null);
  };

  // 3. CUSTOMER CRUD
  const handleEditCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    // Update customer profiles by modifying all corresponding orders
    const updatedOrders = orders.map((o) => {
      if (o.phone === editingCustomer.phone) {
        return {
          ...o,
          name: editingCustomer.name,
          address: editingCustomer.address,
          pincode: editingCustomer.pincode
        };
      }
      return o;
    });

    saveOrders(updatedOrders);
    setEditingCustomer(null);
  };

  // 4. INVENTORY BATCH UPDATES
  const handleStockChange = (productId: string, value: number) => {
    const currentStock = inventory[productId] || 0;
    const newStock = Math.max(0, currentStock + value);
    const updatedInv = { ...inventory, [productId]: newStock };
    saveInventory(updatedInv);
  };

  // 5. SHIPPING LABEL SELECTION CONTROLS
  const toggleSelectOrder = (id: string) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter((oid) => oid !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  };

  const handleSelectAllOrders = () => {
    const filteredOrders = orders.filter((o) => {
      const matchesSearch = o.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.phone.includes(orderSearch) ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesFilter = orderFilterStatus === "all" || o.status === orderFilterStatus;
      return matchesSearch && matchesFilter;
    });

    const allFilteredIds = filteredOrders.map((o) => o.id);
    const allSelected = allFilteredIds.every((id) => selectedOrderIds.includes(id));

    if (allSelected) {
      // Deselect all filtered
      setSelectedOrderIds(selectedOrderIds.filter((id) => !allFilteredIds.includes(id)));
    } else {
      // Select all filtered (without duplication)
      const merged = Array.from(new Set([...selectedOrderIds, ...allFilteredIds]));
      setSelectedOrderIds(merged);
    }
  };

  // Pagination Chunk helper
  const chunkSelectedOrders = () => {
    const selected = orders.filter((o) => selectedOrderIds.includes(o.id));
    const chunks: Order[][] = [];
    for (let i = 0; i < selected.length; i += 6) {
      chunks.push(selected.slice(i, i + 6));
    }
    return chunks;
  };

  const labelPages = chunkSelectedOrders();

  // Print function
  const triggerPrint = () => {
    window.print();
  };

  // Dashboard calculations
  const totalSales = orders.filter((o) => o.status !== "Cancelled").reduce((acc, o) => acc + o.totalPrice, 0);
  const totalPendingOrders = orders.filter((o) => o.status === "Pending").length;
  const totalShippedOrders = orders.filter((o) => o.status === "Shipped").length;
  const totalDeliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const averageOrderVal = orders.length > 0 ? Math.round(totalSales / orders.filter((o) => o.status !== "Cancelled").length || 1) : 0;

  // Filter lists
  const filteredProducts = productsList.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.tagline.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch) ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.productName.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderFilterStatus === "all" || o.status === orderFilterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch) ||
    c.address.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredInventory = productsList.filter((p) =>
    p.name.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 pb-16 print:bg-white print:p-0">
      {/* HEADER BAR - Hides when printing labels */}
      <header className="bg-white border-b border-gray-150 sticky top-0 z-40 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-md">
              <Warehouse className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5">
                SMART SUPPLY <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black">ADMIN CONTROL</span>
              </h1>
              <p className="text-xs text-gray-500 font-semibold">Central Logistics, Inventory & Shipping Terminal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToShop}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
              <span>Back to Customer Store</span>
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CORE GRID CONTAINER - Hides when printing */}
      <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full print:hidden">
        
        {/* SIDEBAR TABS BAR */}
        <aside className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none sticky top-[80px] self-start z-10">
          <button
            onClick={() => { setActiveTab("dashboard"); setIsLabelPreviewOpen(false); }}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-150"
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span>📊 Dashboard Summary</span>
          </button>

          <button
            onClick={() => { setActiveTab("products"); setIsLabelPreviewOpen(false); }}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "products"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-150"
            }`}
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            <span>📦 Manage Products ({productsList.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab("orders"); setIsLabelPreviewOpen(false); }}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-150"
            }`}
          >
            <TrendingUp className="w-4.5 h-4.5" />
            <span>📋 Orders & Shipping ({orders.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab("customers"); setIsLabelPreviewOpen(false); }}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "customers"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-150"
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span>👥 Customer List ({customers.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab("inventory"); setIsLabelPreviewOpen(false); }}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "inventory"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-150"
            }`}
          >
            <Warehouse className="w-4.5 h-4.5" />
            <span>⚙️ Inventory Alerts</span>
          </button>

          <button
            onClick={() => { setActiveTab("labels"); setIsLabelPreviewOpen(true); }}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "labels" || isLabelPreviewOpen
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-150"
            }`}
          >
            <Printer className="w-4.5 h-4.5 animate-pulse" />
            <span>🏷️ Shipping A4 Labels ({selectedOrderIds.length})</span>
          </button>
        </aside>

        {/* WORKSPACE CONTENT AREA */}
        <main className="lg:col-span-9 flex flex-col gap-6">

          {/* ==================== TAB 1: DASHBOARD OVERVIEW ==================== */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-black tracking-tight text-gray-900">📊 Logistics Terminal Analytics</h2>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">Real-time status updates and order stats.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-emerald-50 border border-emerald-100 p-4.5 rounded-2xl">
                    <Coins className="w-5 h-5 text-emerald-600 mb-2" />
                    <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Total Sales</p>
                    <p className="text-xl font-black text-emerald-950 mt-1">₹{totalSales}</p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-100 p-4.5 rounded-2xl">
                    <Clock className="w-5 h-5 text-amber-600 mb-2" />
                    <p className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Pending Orders</p>
                    <p className="text-xl font-black text-amber-950 mt-1">{totalPendingOrders}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-4.5 rounded-2xl">
                    <Truck className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Shipped Parcels</p>
                    <p className="text-xl font-black text-blue-950 mt-1">{totalShippedOrders}</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-100 p-4.5 rounded-2xl">
                    <CheckCircle className="w-5 h-5 text-purple-600 mb-2" />
                    <p className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Delivered COD</p>
                    <p className="text-xl font-black text-purple-950 mt-1">{totalDeliveredOrders}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 border border-gray-150 p-4.5 rounded-2xl">
                    <p className="text-xs font-bold text-gray-500">Average Order Value (AOV)</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">₹{averageOrderVal}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">Calculated across completed and active orders</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-150 p-4.5 rounded-2xl">
                    <p className="text-xs font-bold text-gray-500">Total Active Orders</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{orders.length} orders</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">Excludes fully archived records</p>
                  </div>
                </div>
              </div>

              {/* QUICK LOGISTICS ALERTS */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
                <h3 className="font-black text-sm text-gray-900 uppercase tracking-wider mb-4">🔔 Critical Priority Reminders</h3>
                <div className="flex flex-col gap-3">
                  {totalPendingOrders > 0 && (
                    <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl flex items-start gap-3 text-xs">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold text-amber-900">{totalPendingOrders} Orders Awaiting Verification call</p>
                        <p className="text-amber-800 text-[11px] mt-0.5">Please check telephone numbers, verify address and click "Mark as Shipped" to generate shipping manifests.</p>
                      </div>
                    </div>
                  )}

                  {selectedOrderIds.length === 0 && (
                    <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl flex items-start gap-3 text-xs">
                      <Printer className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold text-blue-900">No Orders Selected for Shipping Labels</p>
                        <p className="text-blue-800 text-[11px] mt-0.5">Head over to the "Orders" tab, select multiple orders using checkboxes, and generate 2x3 grid shipping label sheets dynamically!</p>
                      </div>
                    </div>
                  )}

                  {Object.values(inventory).some((qty) => Number(qty) < 10) && (
                    <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl flex items-start gap-3 text-xs">
                      <Warehouse className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold text-rose-900">Low Stock Alert Detected!</p>
                        <p className="text-rose-800 text-[11px] mt-0.5">Some high-demand kitchen gadget stock inventories are dipping below critical levels. Update supply status in the inventory tab.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: PRODUCTS MANAGEMENT (CRUD) ==================== */}
          {activeTab === "products" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-black tracking-tight text-gray-900">📦 Catalog Storage Manager</h2>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">Add, Edit, and Delete products dynamically inside your system.</p>
                  </div>
                  <button
                    onClick={() => setIsAddingProduct(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md shadow-emerald-100 flex items-center gap-1.5 transition-all self-stretch sm:self-auto justify-center cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Product</span>
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search smart supply products catalog..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-250 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold transition-all"
                  />
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto border border-gray-150 rounded-2xl bg-white shadow-inner">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150 font-black text-gray-700 uppercase tracking-wider">
                        <th className="p-4">Product Details</th>
                        <th className="p-4">Original Price</th>
                        <th className="p-4">Offer Price</th>
                        <th className="p-4">Saving Tag</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors font-semibold">
                          <td className="p-4 flex items-center gap-3">
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-gray-100 shadow-sm shrink-0" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-extrabold text-gray-950 text-xs">{p.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold mt-0.5">{p.id}</p>
                            </div>
                          </td>
                          <td className="p-4 text-gray-500 font-bold line-through">₹{p.originalPrice}</td>
                          <td className="p-4 text-emerald-600 font-extrabold">₹{p.discountedPrice}</td>
                          <td className="p-4">
                            <span className="bg-rose-50 border border-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-[9px] font-black">
                              {p.discountPercent}% OFF
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MODAL 1: ADD NEW PRODUCT */}
              {isAddingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in print:hidden">
                  <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden max-h-[85vh] flex flex-col">
                    <div className="bg-emerald-600 p-5 text-white flex justify-between items-center">
                      <div>
                        <h3 className="font-black text-sm uppercase tracking-wider">Create New Supply Listing</h3>
                        <p className="text-[11px] text-emerald-100 font-semibold mt-0.5">Fills automatically with smart defaults</p>
                      </div>
                      <button onClick={() => setIsAddingProduct(false)} className="bg-emerald-700 hover:bg-emerald-800 p-1.5 rounded-lg text-white transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddProduct} className="p-6 flex flex-col gap-4 overflow-y-auto text-xs">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">Product Name</span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Electric Garlic Chopper"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">Display Tagline</span>
                        <input
                          type="text"
                          placeholder="e.g. Chop Ginger, Chillies and Garlic in 3 Seconds!"
                          value={newProduct.tagline}
                          onChange={(e) => setNewProduct({ ...newProduct, tagline: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-gray-700">Original Price (₹)</span>
                          <input
                            type="number"
                            required
                            placeholder="699"
                            value={newProduct.originalPrice}
                            onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-gray-700">Offer Price (₹)</span>
                          <input
                            type="number"
                            required
                            placeholder="249"
                            value={newProduct.discountedPrice}
                            onChange={(e) => setNewProduct({ ...newProduct, discountedPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">Image Cover URL</span>
                        <input
                          type="text"
                          required
                          value={newProduct.imageUrl}
                          onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value, gallery: [e.target.value] })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">Overview Description</span>
                        <textarea
                          rows={3}
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow-lg mt-2 cursor-pointer text-xs"
                      >
                        Publish Catalog Listing
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* MODAL 2: EDIT EXISTING PRODUCT */}
              {editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in print:hidden">
                  <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden max-h-[85vh] flex flex-col">
                    <div className="bg-emerald-600 p-5 text-white flex justify-between items-center">
                      <div>
                        <h3 className="font-black text-sm uppercase tracking-wider">Modify Supply Details</h3>
                        <p className="text-[11px] text-emerald-100 font-semibold mt-0.5">Product Identifier: {editingProduct.id}</p>
                      </div>
                      <button onClick={() => setEditingProduct(null)} className="bg-emerald-700 hover:bg-emerald-800 p-1.5 rounded-lg text-white transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleEditProductSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto text-xs">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">Product Name</span>
                        <input
                          type="text"
                          required
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">Display Tagline</span>
                        <input
                          type="text"
                          value={editingProduct.tagline}
                          onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-gray-700">Original Price (₹)</span>
                          <input
                            type="number"
                            required
                            value={editingProduct.originalPrice}
                            onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-gray-700">Offer Price (₹)</span>
                          <input
                            type="number"
                            required
                            value={editingProduct.discountedPrice}
                            onChange={(e) => setEditingProduct({ ...editingProduct, discountedPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">Image Cover URL</span>
                        <input
                          type="text"
                          required
                          value={editingProduct.imageUrl}
                          onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">Overview Description</span>
                        <textarea
                          rows={3}
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow-lg mt-2 cursor-pointer text-xs"
                      >
                        Save Catalog Details
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 3: ORDERS MANAGEMENT (CRUD) ==================== */}
          {activeTab === "orders" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-gray-900">📋 Dispatch Shipping Ledger</h2>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">Check COD order queues, select rows, and bulk print exact A4 shipping manifests.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search ledger by order ID, name, phone, city..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-250 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <select
                    value={orderFilterStatus}
                    onChange={(e) => setOrderFilterStatus(e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-250 rounded-xl text-xs font-black text-gray-700 focus:outline-none"
                  >
                    <option value="all">Show All Statuses</option>
                    <option value="Pending">🟢 Pending</option>
                    <option value="Shipped">🔵 Shipped</option>
                    <option value="Delivered">🟣 Delivered</option>
                    <option value="Cancelled">🔴 Cancelled</option>
                  </select>
                </div>

                {/* Bulk Actions Bar */}
                <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={handleSelectAllOrders}
                      checked={
                        filteredOrders.length > 0 &&
                        filteredOrders.every((fo) => selectedOrderIds.includes(fo.id))
                      }
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    />
                    <span className="font-extrabold text-emerald-950">
                      {selectedOrderIds.length} orders chosen for label printing
                    </span>
                  </div>

                  {selectedOrderIds.length > 0 && (
                    <button
                      onClick={() => { setActiveTab("labels"); setIsLabelPreviewOpen(true); }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] px-4 py-2 rounded-xl shadow-md shadow-emerald-100 flex items-center gap-1.5 transition-all self-stretch sm:self-auto justify-center cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Selected Labels ({selectedOrderIds.length})</span>
                    </button>
                  )}
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto border border-gray-150 rounded-2xl bg-white shadow-inner">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150 font-black text-gray-700 uppercase tracking-wider">
                        <th className="p-4 w-12 text-center">Sel</th>
                        <th className="p-4">ID & Date</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Items / Total</th>
                        <th className="p-4">Dispatch Status</th>
                        <th className="p-4 text-right">Ledger Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400 font-extrabold">
                            No matching ledger records located.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-gray-50/30 transition-all font-semibold">
                            <td className="p-4 text-center">
                              <input
                                type="checkbox"
                                checked={selectedOrderIds.includes(o.id)}
                                onChange={() => toggleSelectOrder(o.id)}
                                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                              />
                            </td>
                            <td className="p-4">
                              <p className="font-extrabold text-gray-950">{o.id}</p>
                              <p className="text-[10px] text-gray-400 font-bold mt-0.5">{o.timestamp.split(",")[0]}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-extrabold text-gray-950">{o.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold mt-0.5 flex items-center gap-1">
                                📞 <b>{o.phone}</b>
                              </p>
                              <p className="text-[10px] text-gray-500 font-bold max-w-[180px] truncate mt-0.5">{o.address}, {o.pincode}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-extrabold text-gray-950 text-[11px] truncate max-w-[150px]">{o.productName}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">Qty: {o.quantity} • <b className="text-emerald-600">₹{o.totalPrice}</b></p>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                o.status === "Pending"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : o.status === "Shipped"
                                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                                    : o.status === "Delivered"
                                      ? "bg-purple-100 text-purple-800 border border-purple-200"
                                      : "bg-gray-100 text-gray-600 border border-gray-200"
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <select
                                  value={o.status}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as Order["status"])}
                                  className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-black text-gray-700 outline-none"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                                <button
                                  onClick={() => setEditingOrder(o)}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Order Address"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(o.id)}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Order"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MODAL 3: EDIT ORDER ADDRESS */}
              {editingOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in print:hidden">
                  <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden text-xs">
                    <div className="bg-emerald-600 p-5 text-white flex justify-between items-center">
                      <div>
                        <h3 className="font-black uppercase tracking-wider">Correct Customer Shipping Address</h3>
                        <p className="text-[11px] text-emerald-100 font-semibold mt-0.5">Order ID: {editingOrder.id}</p>
                      </div>
                      <button onClick={() => setEditingOrder(null)} className="bg-emerald-700 hover:bg-emerald-800 p-1.5 rounded-lg text-white cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleEditOrderSubmit} className="p-6 flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">Recipient Name</span>
                        <input
                          type="text"
                          required
                          value={editingOrder.name}
                          onChange={(e) => setEditingOrder({ ...editingOrder, name: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">WhatsApp Mobile Number</span>
                        <input
                          type="text"
                          required
                          value={editingOrder.phone}
                          onChange={(e) => setEditingOrder({ ...editingOrder, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold animate-pulse"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">Full Shipping Address</span>
                        <textarea
                          rows={3}
                          required
                          value={editingOrder.address}
                          onChange={(e) => setEditingOrder({ ...editingOrder, address: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">6-Digit Pincode</span>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={editingOrder.pincode}
                          onChange={(e) => setEditingOrder({ ...editingOrder, pincode: e.target.value.replace(/\D/g, "") })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl mt-2 cursor-pointer"
                      >
                        Update Delivery Address
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 4: CUSTOMERS LIST (CRUD) ==================== */}
          {activeTab === "customers" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-gray-900">👥 Customer CRM Accounts</h2>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">Search and view verified smart supply purchase histories.</p>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search verified customers by name, phone or full location..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-250 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Customers Table */}
                <div className="overflow-x-auto border border-gray-150 rounded-2xl bg-white shadow-inner">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150 font-black text-gray-700 uppercase tracking-wider">
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Verified Mobile</th>
                        <th className="p-4">Default Address</th>
                        <th className="p-4">Orders Placed</th>
                        <th className="p-4">Spent Value</th>
                        <th className="p-4 text-right">CRM Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400 font-extrabold">
                            No verified consumer records found.
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((c) => (
                          <tr key={c.id} className="hover:bg-gray-50/50 transition-colors font-semibold">
                            <td className="p-4 font-extrabold text-gray-950">{c.name}</td>
                            <td className="p-4 text-gray-900 font-bold">📞 {c.phone}</td>
                            <td className="p-4 text-gray-500 font-bold max-w-[200px] truncate">{c.address}, {c.pincode}</td>
                            <td className="p-4 text-center">
                              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                                {c.totalOrders} Orders
                              </span>
                            </td>
                            <td className="p-4 text-emerald-600 font-extrabold">₹{c.totalSpent}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setEditingCustomer(c)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Edit Customer Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MODAL 4: EDIT CUSTOMER CRM DETAILS */}
              {editingCustomer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in print:hidden">
                  <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden text-xs">
                    <div className="bg-emerald-600 p-5 text-white flex justify-between items-center">
                      <div>
                        <h3 className="font-black uppercase tracking-wider">Update CRM Profile</h3>
                        <p className="text-[11px] text-emerald-100 font-semibold mt-0.5">Customer: {editingCustomer.name}</p>
                      </div>
                      <button onClick={() => setEditingCustomer(null)} className="bg-emerald-700 hover:bg-emerald-800 p-1.5 rounded-lg text-white cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleEditCustomerSubmit} className="p-6 flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">Display Name</span>
                        <input
                          type="text"
                          required
                          value={editingCustomer.name}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">WhatsApp Phone (Not Editable)</span>
                        <input
                          type="text"
                          disabled
                          value={editingCustomer.phone}
                          className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-xs font-extrabold text-gray-500 cursor-not-allowed"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">Billing & Delivery Address</span>
                        <textarea
                          rows={3}
                          required
                          value={editingCustomer.address}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-700">6-Digit Pincode</span>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={editingCustomer.pincode}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, pincode: e.target.value.replace(/\D/g, "") })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl mt-2 cursor-pointer"
                      >
                        Save Customer Profile
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 5: INVENTORY LOGS & WARNS ==================== */}
          {activeTab === "inventory" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-gray-900">⚙️ Warehouse Storage Terminal</h2>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">Control live supply counters and configure automatic low-stock alarms.</p>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search logistics stockpile by name..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-250 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>

                {/* Inventory Stock Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredInventory.map((p) => {
                    const stock = inventory[p.id] || 0;
                    return (
                      <div key={p.id} className="bg-white border border-gray-150 rounded-2xl p-4.5 flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start gap-3">
                          <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-gray-100 shadow-sm shrink-0" referrerPolicy="no-referrer" />
                          <div className="text-xs">
                            <p className="font-extrabold text-gray-950 truncate max-w-[200px]">{p.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">ID: {p.id}</p>
                            
                            <div className="mt-2.5">
                              {stock === 0 ? (
                                <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                                  🚨 OUT OF STOCK
                                </span>
                              ) : stock < 10 ? (
                                <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                                  ⚠️ LOW STOCK ALERT
                                </span>
                              ) : (
                                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                                  ✅ IN STOCK & GOOD
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-150 mt-1">
                          <span className="text-[11px] font-black text-gray-500 uppercase tracking-wide">Live Stock</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleStockChange(p.id, -10)}
                              className="w-7 h-7 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer"
                              title="-10 Packets"
                            >
                              -10
                            </button>
                            <button
                              onClick={() => handleStockChange(p.id, -1)}
                              className="w-7 h-7 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer"
                              title="-1 Packet"
                            >
                              -1
                            </button>
                            <span className="text-sm font-black text-gray-950 w-8 text-center">{stock}</span>
                            <button
                              onClick={() => handleStockChange(p.id, 1)}
                              className="w-7 h-7 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer"
                              title="+1 Packet"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleStockChange(p.id, 10)}
                              className="w-7 h-7 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer"
                              title="+10 Packets"
                            >
                              +10
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 6: SHIPPING LABEL GENERATOR (A4 LAYOUT PREVIEW) ==================== */}
          {(activeTab === "labels" || isLabelPreviewOpen) && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-black tracking-tight text-gray-900">🏷️ Premium A4 Shipping Manifests</h2>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">Strictly formatted in standard A4 sheets (2x3 grid, exactly 6 labels per page).</p>
                  </div>

                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    <button
                      onClick={triggerPrint}
                      disabled={selectedOrderIds.length === 0}
                      className={`font-black text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedOrderIds.length === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100"
                      }`}
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Labels</span>
                    </button>

                    <button
                      onClick={triggerPrint}
                      disabled={selectedOrderIds.length === 0}
                      className={`font-black text-xs px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedOrderIds.length === 0
                          ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-gray-50 border-gray-250 text-gray-700"
                      }`}
                    >
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* Print Hint Alert Banner */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs leading-normal mt-5">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-amber-900">💡 Dynamic Printing & PDF Export Guide</p>
                    <p className="text-amber-800 text-[11px] mt-1 font-semibold">
                      To export as a high-quality PDF or print on actual sheets:
                    </p>
                    <ul className="list-disc pl-4 mt-1 space-y-1 text-amber-800 text-[11px] font-medium">
                      <li>Click the <b>Print Labels</b> or <b>Download PDF</b> buttons above.</li>
                      <li>In the browser Print Destination, choose <b>"Save as PDF"</b> or choose your physical printer.</li>
                      <li>Under More Settings, set <b>Margins to "None"</b> and check <b>"Background graphics"</b> to preserve grid dividers.</li>
                    </ul>
                  </div>
                </div>

                {/* Active Selection Info */}
                <div className="mt-5 border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-black text-gray-900">Currently selected: </span>
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md">
                      {selectedOrderIds.length} parcels chosen
                    </span>
                  </div>

                  <div className="text-gray-500 font-bold">
                    Required Paper Size: <b className="text-gray-800 font-extrabold uppercase">{labelPages.length} x A4 Sheets</b>
                  </div>
                </div>

                {/* GRID PREVIEW (Visual representation of what gets printed) */}
                {selectedOrderIds.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl mt-6">
                    <Printer className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-black text-xs uppercase tracking-wider">No manifests compiled</p>
                    <p className="text-[11px] text-gray-500 font-medium max-w-sm mx-auto mt-1">
                      Go to the <b>"Orders & Shipping"</b> tab and select multiple order records using the checkboxes to generate active labels.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8 mt-6">
                    {labelPages.map((pageChunk, pageIndex) => (
                      <div key={pageIndex} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-400 px-1">
                          <span>📄 Visual Preview of Sheet #{pageIndex + 1} (A4 size)</span>
                          <span>Contains {pageChunk.length} of 6 labels</span>
                        </div>

                        {/* Visual mockup of the A4 layout (for user workspace feedback) */}
                        <div className="bg-white border-2 border-gray-200 shadow-xl rounded-lg overflow-hidden max-w-[650px] mx-auto w-full aspect-[1/1.4142] p-4 flex flex-col justify-between">
                          <div className="grid grid-cols-2 grid-rows-3 gap-3 w-full h-full">
                            {pageChunk.map((ord) => (
                              <div
                                key={ord.id}
                                className="border-2 border-dashed border-gray-300 hover:border-emerald-400 transition-colors p-3.5 rounded-xl flex flex-col justify-between bg-gray-50/50 text-[10px]"
                              >
                                {/* Return From section */}
                                <div className="border-b border-gray-200 pb-1.5 flex flex-col">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[9px] bg-gray-200 text-gray-700 font-black tracking-widest px-1.5 py-0.5 rounded">FROM (RETURN)</span>
                                    <span className="font-extrabold text-[8px] text-gray-400 uppercase">SMART SUPPLY</span>
                                  </div>
                                  <p className="font-black text-gray-800 text-[10px] mt-1">{FROM_ADDRESS.name}</p>
                                  <p className="text-gray-500 leading-tight text-[8px] mt-0.5">{FROM_ADDRESS.address}</p>
                                  <p className="font-black text-gray-800 text-[9px] mt-0.5">PIN: {FROM_ADDRESS.pincode}</p>
                                </div>

                                {/* Recipient To section */}
                                <div className="py-2.5 flex-1 flex flex-col justify-center">
                                  <span className="text-[9px] bg-emerald-600 text-white font-black tracking-widest px-1.5 py-0.5 rounded self-start">TO (DELIVER)</span>
                                  <p className="font-black text-gray-900 text-xs mt-1.5">{ord.name}</p>
                                  <p className="text-gray-700 font-extrabold text-[9px] mt-0.5">📞 WhatsApp: {ord.phone}</p>
                                  <p className="text-gray-600 font-bold leading-snug text-[9px] mt-1 line-clamp-2">{ord.address}</p>
                                  <p className="font-black text-gray-950 text-[10px] mt-1">📮 PIN Code: {ord.pincode}</p>
                                </div>

                                {/* Footer details */}
                                <div className="border-t border-gray-200 pt-1.5 flex justify-between items-center">
                                  <div>
                                    <p className="font-black text-gray-800 text-[8px]">ITEM: {ord.productName.slice(0, 18)}...</p>
                                    <p className="text-[7px] text-gray-400 mt-0.5">Qty: {ord.quantity} • ID: {ord.id}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded">COD PARCEL</p>
                                    <p className="font-black text-emerald-600 text-[10px] mt-0.5">₹{ord.totalPrice}</p>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Pad remaining cells on sheet with empty placeholders */}
                            {Array.from({ length: 6 - pageChunk.length }).map((_, idx) => (
                              <div
                                key={`empty-${idx}`}
                                className="border border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 text-[9px] text-gray-300 font-extrabold uppercase tracking-widest"
                              >
                                EMPTY GRID LABEL
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* PRINT-ONLY AREA: HIDDEN ON BROWSER PREVIEW, ONLY RENDERS ON PAPER PRINT */}
      {/* ========================================================================= */}
      <div className="hidden print:block print:p-0 print:m-0 w-full">
        {labelPages.map((pageChunk, pageIndex) => (
          <div
            key={`print-page-${pageIndex}`}
            className="print-page-layout border-none p-0 m-0 w-[210mm] h-[297mm] flex flex-col justify-between"
            style={{
              pageBreakAfter: "always",
              boxSizing: "border-box"
            }}
          >
            {/* Exactly 2 Columns and 3 Rows Grid */}
            <div
              className="grid grid-cols-2 grid-rows-3 w-full h-full p-[4mm] gap-[4mm]"
              style={{
                boxSizing: "border-box"
              }}
            >
              {pageChunk.map((ord) => (
                <div
                  key={`print-label-${ord.id}`}
                  className="border-2 border-dashed border-gray-400 p-[5mm] rounded-2xl flex flex-col justify-between bg-white text-[11px] leading-normal h-full"
                  style={{
                    boxSizing: "border-box",
                    height: "100%",
                    minHeight: "0"
                  }}
                >
                  {/* FROM ADDRESS */}
                  <div className="border-b-2 border-gray-300 pb-[3mm] flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-black text-white font-black tracking-widest px-2 py-0.5 rounded">SENDER (RETURN)</span>
                      <span className="font-black text-[11px] tracking-wide text-emerald-600">SMART SUPPLY®</span>
                    </div>
                    <p className="font-black text-gray-900 text-[12px] mt-1.5">{FROM_ADDRESS.name}</p>
                    <p className="text-gray-600 text-[10px] leading-relaxed mt-0.5">{FROM_ADDRESS.address}</p>
                    <p className="font-black text-gray-900 text-[11px] mt-0.5">PIN Code: {FROM_ADDRESS.pincode}</p>
                  </div>

                  {/* TO ADDRESS */}
                  <div className="py-[4mm] flex-1 flex flex-col justify-center">
                    <span className="text-[10px] bg-emerald-600 text-white font-black tracking-widest px-2 py-0.5 rounded self-start">RECIPIENT (TO)</span>
                    <p className="font-black text-gray-950 text-[15px] leading-none mt-2.5">{ord.name}</p>
                    <p className="text-gray-900 font-extrabold text-[12px] mt-1">📞 WhatsApp Number: {ord.phone}</p>
                    <p className="text-gray-800 font-bold text-[12px] leading-snug mt-1.5">{ord.address}</p>
                    <p className="font-black text-gray-950 text-[13px] mt-2 bg-gray-100 py-1 px-2 rounded inline-block self-start">📮 Area PIN Code: {ord.pincode}</p>
                  </div>

                  {/* LABEL FOOTER INFO */}
                  <div className="border-t-2 border-gray-300 pt-[3mm] flex justify-between items-center">
                    <div className="max-w-[70%]">
                      <p className="font-black text-gray-950 text-[10px] uppercase truncate">Product: {ord.productName}</p>
                      <p className="text-[9px] text-gray-500 font-semibold mt-0.5">Qty: {ord.quantity} • Order Reference: {ord.id}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded tracking-wide inline-block uppercase">CASH ON DELIVERY</span>
                      <p className="font-black text-emerald-600 text-[16px] leading-none mt-1">₹{ord.totalPrice}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pad print page with empty grid slots to maintain exactly 2x3 grid sizes */}
              {Array.from({ length: 6 - pageChunk.length }).map((_, idx) => (
                <div
                  key={`print-empty-${idx}`}
                  className="border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 text-[11px] text-gray-300 font-black uppercase tracking-widest"
                >
                  EMPTY MANIFEST SLOT
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
