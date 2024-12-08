'use client';

import React, { useState } from "react";
import { Camera } from 'lucide-react';
import { motion } from "framer-motion";
import useUserStore from "@/utils/store/userStore";

const ProfilePicUploader = () => {
  const user = useUserStore((state) => state.user);
  console.log('user ' + JSON.stringify(user));
  
  const session = useUserStore((state) => state.session.id);
  const defaultImage = "/images/blog/unknown.webp";
  const [selectedImage, setSelectedImage] = useState(user.profilePictureUrl || defaultImage);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
      console.log('calling');
      
      handleUpload(selectedFile);
    } else {
      setSelectedImage(defaultImage);
      setFile(null);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image1", file);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT;
      if (!user || !user._id) {
        throw new Error("User ID is undefined");
      }
      const response = await fetch(`${baseUrl}/user/changeProfilePicture/${user._id}`, {
        method: "PUT",
        headers: {
          
          'Authorization': `Bearer ${session}`, // Added session to the header
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      console.log(data.message); // Handle success message
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      className="relative w-40 h-40 rounded-full overflow-hidden mb-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.img
        src={selectedImage}
        alt="Profile"
        className="w-full h-full object-cover"
        initial={{ filter: "blur(5px)" }}
        animate={{ filter: "blur(0px)" }}
        transition={{ duration: 0.3 }}
      />
      <motion.label
        htmlFor="image1"
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer group"
        whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <input
          type="file"
          name="image1"
          id="image1"
          accept=".gif, .jpg, .jpeg, .png"
          onChange={handleImageChange}
          className="hidden"
        />
        <motion.div
          className="text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isUploading ? (
            <motion.div
              className="w-8 h-8 border-4 border-t-4 border-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Camera className="w-8 h-8" />
          )}
        </motion.div>
      </motion.label>
    </motion.div>
  );
};
export default ProfilePicUploader;
