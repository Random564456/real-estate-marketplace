import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRef } from "react";
import { app } from "../firebase";
import { updateUserSuccess, updateUserFailure, updateUserStart, deleteUserStart, deleteUserSuccess, deleteUserFailure } from "../redux/user/userSlice";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const dispatch = useDispatch();


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

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleClick = async (e) => {
    if (e.target.id === "delete") {
      dispatch(deleteUserStart);

      try {
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });

        const data = res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }

        dispatch(deleteUserSuccess());
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <h1 className="text-3xl font-bold m-10">Profile</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          className="h-[100px] w-[100px] rounded-full mx-auto mb-2"
          src={formData.avatar || currentUser.avatar}
        />
        <p className="text-sm self-center mb-10">
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span>{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span>Image Succesfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser?.username}
          onChange={handleChange}
          className="p-2 mb-3 rounded-lg"
        />
        <input
          type="text"
          id="email"
          placeholder="Email"
          defaultValue={currentUser?.email}
          onChange={handleChange}
          className="p-2 mb-3 rounded-lg"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
          className="p-2 mb-3 rounded-lg"
        />
        <button disabled={loading} type="submit" className="uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled: opacity-80 mb-3">
          {loading ? "Loading" : "Update"}
        </button>
      </form>
      <div className="flex justify-between">
        <button className="text-red-700 font-semibold text-md">Sign Out</button>
        <button type="button" id="delete" onClick={handleClick} className="text-red-700 font-semibold text-md">
          Delete Account
        </button>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully' : ''}</p>
    </div>
  );
};

export default Profile;
