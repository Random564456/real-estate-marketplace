import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useRef } from "react";
import { app } from "../firebase";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [ file, setFile ] = useState(undefined);
  const [ filePercentage, setFilePercentage ] = useState(0);
  const [ fileUploadError, setFileUploadError ] = useState(false);
  const [ formData, setFormData ] = useState({});

  console.log(filePercentage)
  console.log(fileUploadError)
  console.log(formData);
  
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePercentage(progress.toFixed(2));
    },
    (error) => {
      setFileUploadError(true);
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL) => 
        setFormData({...formData, avatar: downloadURL})
      );
      
    })
  };


  const handleChange = (e) => {};
  // firebase storage
  // allow read; 
  // allow write: if 
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches("image/*");

  return (
    <div className="max-w-lg mx-auto text-center">
      <h1 className="text-3xl font-bold m-10">Profile</h1>
      <form className="flex flex-col">
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
        <img
          onClick={() => fileRef.current.click()}
          className="h-[100px] w-[100px] rounded-full mx-auto mb-10"
          src={currentUser.avatar}
        />
        <input
          type="text"
          value={currentUser?.username}
          onChange={handleChange}
          className="p-2 mb-3 rounded-lg"
        />
        <input
          type="text"
          value={currentUser?.email}
          onChange={handleChange}
          className="p-2 mb-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Password"
          onChange={handleChange}
          className="p-2 mb-3 rounded-lg"
        />
        <button className="uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled: opacity-80 mb-3">
          update
        </button>
      </form>
      <div className="flex justify-between">
        <button className="text-red-700 font-semibold text-md">Sign Out</button>
        <button className="text-red-700 font-semibold text-md">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
