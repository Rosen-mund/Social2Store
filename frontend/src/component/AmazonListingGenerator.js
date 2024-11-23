import React, { useState, useEffect } from 'react';
import EditableListing from './EditableListing';
import axios from 'axios';

const AmazonListingGenerator = () => {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('');
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateListing = async () => {
    if (!content || !platform) {
      alert('Please provide content and platform!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-listing', {
        content,
        platform,
      });
      setListing(response.data);
    } catch (error) {
      console.error('Error generating listing:', error);
      alert('Failed to generate the listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listing && listing.images && listing.images.length > 0) {
      alert(`Images processed successfully! Found ${listing.images.length} images.`);
    }
  }, [listing]);

  const handleUploadListing = async () => {
    if (!listing || images.length === 0) {
      alert('Please provide a listing and at least one image!');
      return;
    }

    const formData = new FormData();
    formData.append('listing', JSON.stringify(listing));
    images.forEach((image) => formData.append('images', image));

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/upload-to-amazon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus(response.data.message);
    } catch (error) {
      console.error('Error uploading listing:', error);
      alert('Failed to upload the listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    setImages(Array.from(event.target.files));
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Amazon Listing Generator</h1>
      <p className="text-center text-gray-600 mb-8">
        Generate product listings from your social media posts and upload them effortlessly to Amazon.
      </p>

      {/* Form Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <textarea
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Paste social media content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <select
          className="w-full p-3 border rounded-lg mb-4"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="">Select Platform</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="Twitter">Twitter</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="YouTube">YouTube</option> {/* Added YouTube here */}
        </select>
        <button
          onClick={handleGenerateListing}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Listing'}
        </button>
      </div>

      {/* Generated Listing Section */}
      {listing && (
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Generated Listing</h2>
          <EditableListing listing={listing} setListing={setListing} />
          <div className="mt-4">
            <label className="block text-lg font-medium mb-2">Upload Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full p-2 border rounded-lg mb-4"
            />
            {images.length > 0 && (
              <p className="text-sm text-gray-600 mb-4">
                {images.length} image(s) selected.
              </p>
            )}
            <button
              onClick={handleUploadListing}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload to Amazon'}
            </button>
          </div>
        </div>
      )}

      {/* Status Message */}
      {uploadStatus && (
        <div className="mt-6 bg-green-100 text-green-700 rounded-lg p-4 text-center">
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default AmazonListingGenerator;
