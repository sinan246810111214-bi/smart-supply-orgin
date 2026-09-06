import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { Product } from "../types";

// Fixed Order interface
export interface Order {
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with Database ID if specified
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Diagnostic/Error handling according to instructions
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on load
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error: any) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration or network status.");
    }
  }
}

testConnection();

// --- Firestore Products CRUD Helpers ---
export async function getProductsFromFirestore(): Promise<Product[]> {
  const path = "products";
  try {
    const q = query(collection(db, path));
    const snapshot = await getDocs(q);
    const products: Product[] = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, "products", product.id), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- Firestore Orders CRUD Helpers ---
export async function getOrdersFromFirestore(): Promise<Order[]> {
  const path = "orders";
  try {
    const q = query(collection(db, path));
    const snapshot = await getDocs(q);
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveOrderToFirestore(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, "orders", order.id), order);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await deleteDoc(doc(db, "orders", orderId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Realtime listeners
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  const path = "orders";
  const q = query(collection(db, path));
  return onSnapshot(q, (snapshot) => {
    const ordersList: Order[] = [];
    snapshot.forEach((doc) => {
      ordersList.push({ id: doc.id, ...doc.data() } as Order);
    });
    // Sort by timestamp or parse string to sort newest first
    ordersList.sort((a, b) => b.id.localeCompare(a.id));
    callback(ordersList);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export function subscribeToProducts(callback: (products: Product[]) => void) {
  const path = "products";
  const q = query(collection(db, path));
  return onSnapshot(q, (snapshot) => {
    const productsList: Product[] = [];
    snapshot.forEach((doc) => {
      productsList.push({ id: doc.id, ...doc.data() } as Product);
    });
    callback(productsList);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

