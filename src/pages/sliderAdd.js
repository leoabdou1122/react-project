import React, { useState } from 'react';
import axios from 'axios';

const ImageUploadForm = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      alert('Please select an image to upload');
      return;
    }

    setIsLoading(true); // Show loading indicator

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('title', title);

    try {
      const response = await axios.post('http://localhost:3002/slider/uploadSlider', formData, { withCredentials: true });
      console.log('Image upload response:', response.data);
      alert('Image uploaded successfully!');
      setSelectedImage(null);
      setTitle('');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsLoading(false); // Hide loading indicator after success or failure
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleImageChange} disabled={isLoading} name="image_url"/>
      <input type="text" value={title} onChange={handleTitleChange} placeholder="Enter Image Title" disabled={isLoading} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload Image'}
      </button>
    </form>
  );
};

export default ImageUploadForm;
