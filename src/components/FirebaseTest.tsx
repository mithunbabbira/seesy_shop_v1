import React, { useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing Firebase connection...');
    
    try {
      // Test basic Firestore connection
      const categoriesRef = collection(db, 'categories');
      const snapshot = await getDocs(categoriesRef);
      
      setStatus(`✅ Connected! Found ${snapshot.size} categories in database`);
      
      if (snapshot.size === 0) {
        setStatus(prev => prev + '\n\n📝 Database is empty. Click "Add Sample Data" to populate it.');
      } else {
        const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStatus(prev => prev + '\n\n📋 Categories found:\n' + 
          categories.map((cat: any) => `- ${cat.name || 'Unnamed category'}`).join('\n')
        );
      }
      
    } catch (error: any) {
      console.error('Firebase test error:', error);
      setStatus(`❌ Connection failed: ${error?.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const addSampleData = async () => {
    setLoading(true);
    setStatus('Adding sample data...');
    
    try {
      const categoriesRef = collection(db, 'categories');
      const itemsRef = collection(db, 'items');
      
      // Add sample category
      const categoryData = {
        name: 'Légumes verts',
        imageUrl: 'https://i.postimg.cc/q7XW3mzS/vegetables.jpg',
        createdAt: new Date()
      };
      
      const categoryDoc = await addDoc(categoriesRef, categoryData);
      setStatus('✅ Sample category added!\n');
      
      // Add sample items
      const sampleItems = [
        {
          categoryId: categoryDoc.id,
          name: 'Carottes bio',
          description: 'Carottes fraîches cultivées localement',
          price: 2.50,
          priceUnit: 'Euro / 1.5 kg',
          sku: 'CAR001',
          imageUrl: 'https://i.postimg.cc/0N8K3zR8/carrots.jpg',
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          categoryId: categoryDoc.id,
          name: 'Brocolis bio',
          description: 'Brocolis frais et croquants',
          price: 3.20,
          priceUnit: 'Euro / 500g',
          sku: 'BRO002',
          imageUrl: 'https://i.postimg.cc/MTJBqKTJ/broccoli.jpg',
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      for (const item of sampleItems) {
        await addDoc(itemsRef, item);
      }
      
      setStatus(prev => prev + `✅ Added ${sampleItems.length} sample items!\n\n🎉 Sample data ready! You can now test the app.`);
      
    } catch (error: any) {
      console.error('Error adding sample data:', error);
      setStatus(`❌ Failed to add sample data: ${error?.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🧪 Firebase Connection Test</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Firebase Connection'}
        </button>
        
        <button
          onClick={addSampleData}
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Sample Data'}
        </button>
      </div>
      
      {status && (
        <div className="bg-gray-100 p-4 rounded border">
          <h3 className="font-semibold mb-2">Status:</h3>
          <pre className="whitespace-pre-wrap text-sm">{status}</pre>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">📋 Instructions:</h3>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. First, click "Test Firebase Connection" to verify your setup</li>
          <li>2. If connected but no data exists, click "Add Sample Data"</li>
          <li>3. Once data is added, go back to the main app to see categories</li>
          <li>4. You can add more categories and items via the admin dashboard</li>
        </ol>
      </div>
    </div>
  );
};

export default FirebaseTest;