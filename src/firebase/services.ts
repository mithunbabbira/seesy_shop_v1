import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import { 
  signInWithEmailAndPassword,
  signOut,
  User
} from "firebase/auth";
import { db, auth } from "./config";

// Types
export interface Category {
  id?: string;
  name: string;
  imageUrl: string; // URL from external image hosting service (e.g., Postimg)
  createdAt: Date;
}

export interface Item {
  id?: string;
  categoryId: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  imageUrl: string; // URL from external image hosting service (e.g., Postimg)
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication Services
export const loginAdmin = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutAdmin = async (): Promise<void> => {
  await signOut(auth);
};

// Category Services
export const getCategories = async (): Promise<Category[]> => {
  const categoriesRef = collection(db, "categories");
  const snapshot = await getDocs(categoriesRef);
  const categories = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Category));
  
  // Sort categories by createdAt in JavaScript (most recent first)
  return categories.sort((a, b) => {
    const aTime = a.createdAt instanceof Date ? a.createdAt : 
      (a.createdAt as any)?.seconds ? new Date((a.createdAt as any).seconds * 1000) : new Date();
    const bTime = b.createdAt instanceof Date ? b.createdAt : 
      (b.createdAt as any)?.seconds ? new Date((b.createdAt as any).seconds * 1000) : new Date();
    return bTime.getTime() - aTime.getTime();
  });
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const docRef = doc(db, "categories", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Category;
  }
  return null;
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  const categoriesRef = collection(db, "categories");
  const docRef = await addDoc(categoriesRef, {
    ...category,
    createdAt: new Date()
  });
  return docRef.id;
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<void> => {
  const docRef = doc(db, "categories", id);
  await updateDoc(docRef, category);
};

export const deleteCategory = async (id: string): Promise<void> => {
  const docRef = doc(db, "categories", id);
  await deleteDoc(docRef);
};

// Item Services
export const getItemsByCategory = async (categoryId: string): Promise<Item[]> => {
  const itemsRef = collection(db, "items");
  const q = query(
    itemsRef, 
    where("categoryId", "==", categoryId)
    // Removed orderBy to avoid requiring composite index
    // Items will be sorted in JavaScript instead
  );
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Item));
  
  // Sort items by createdAt in JavaScript (most recent first)
  return items.sort((a, b) => {
    const aTime = a.createdAt instanceof Date ? a.createdAt : 
      (a.createdAt as any)?.seconds ? new Date((a.createdAt as any).seconds * 1000) : new Date();
    const bTime = b.createdAt instanceof Date ? b.createdAt : 
      (b.createdAt as any)?.seconds ? new Date((b.createdAt as any).seconds * 1000) : new Date();
    return bTime.getTime() - aTime.getTime();
  });
};

export const addItem = async (item: Omit<Item, 'id'>): Promise<string> => {
  const itemsRef = collection(db, "items");
  const now = new Date();
  const docRef = await addDoc(itemsRef, {
    ...item,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

export const updateItem = async (id: string, item: Partial<Item>): Promise<void> => {
  const docRef = doc(db, "items", id);
  await updateDoc(docRef, {
    ...item,
    updatedAt: new Date()
  });
};

export const deleteItem = async (id: string): Promise<void> => {
  const docRef = doc(db, "items", id);
  await deleteDoc(docRef);
};

// Utility function to validate image URL
export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(urlObj.pathname) || 
           url.includes('postimg') || 
           url.includes('imgur') || 
           url.includes('cloudinary');
  } catch {
    return false;
  }
};
