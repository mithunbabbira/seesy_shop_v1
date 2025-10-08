import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { uploadImageToStorage } from '../utils/imageUpload';

const StorageTest: React.FC = () => {
  const { currentUser } = useAuth();
  const [uploadResult, setUploadResult] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleTestUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('User authentication status:', {
      isAuthenticated: !!currentUser,
      userId: currentUser?.uid,
      email: currentUser?.email
    });

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    try {
      setIsUploading(true);
      setError('');
      setUploadResult('');

      const url = await uploadImageToStorage(
        file,
        'test',
        (progress) => console.log('Upload progress:', progress)
      );

      setUploadResult(url);
      console.log('Upload successful:', url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Firebase Storage Test</h2>
      
      <div className="mb-4">
        <p className="text-sm">
          <strong>Auth Status:</strong> {currentUser ? `Logged in as ${currentUser.email}` : 'Not authenticated'}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Image Upload
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleTestUpload}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
      </div>

      {isUploading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-600">Uploading... Check console for details</p>
        </div>
      )}

      {uploadResult && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600 font-medium">Upload successful!</p>
          <p className="text-xs text-gray-600 break-all mt-1">{uploadResult}</p>
          <img src={uploadResult} alt="Uploaded test" className="mt-2 max-w-full h-32 object-cover rounded" />
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600 font-medium">Upload failed:</p>
          <p className="text-xs text-red-600 mt-1">{error}</p>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>Check the browser console for detailed logs.</p>
        <p>Make sure you're logged in as an admin and Firebase Storage rules allow uploads.</p>
      </div>
    </div>
  );
};

export default StorageTest;