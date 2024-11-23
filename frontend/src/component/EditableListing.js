import React from 'react';

const EditableListing = ({ listing, setListing }) => {
  const handleChange = (field, value) => {
    setListing({ ...listing, [field]: value });
  };

  return (
    <div className="space-y-4">
      <input 
        value={listing.title} 
        onChange={(e) => handleChange('title', e.target.value)} 
        className="w-full p-3 border-2 border-gray-200 rounded-xl" 
        placeholder="Title"
      />
      <textarea 
        value={listing.description} 
        onChange={(e) => handleChange('description', e.target.value)} 
        rows={4} 
        className="w-full p-3 border-2 border-gray-200 rounded-xl" 
        placeholder="Description"
      />
      <input 
        value={listing.price} 
        onChange={(e) => handleChange('price', e.target.value)} 
        type="number" 
        className="w-full p-3 border-2 border-gray-200 rounded-xl" 
        placeholder="Price"
      />
    </div>
  );
};

export default EditableListing;
