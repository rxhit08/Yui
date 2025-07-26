import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import avatar from "../assets/avatar.png";

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    email: '',
    password: '',
    gender: '',
    dateOfBirth: '',
    avatar: null,
    coverImage: null,
  });

  const [preview, setPreview] = useState({ avatar: null, coverImage: null });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const fetchDefaultImageBlob = async () => {
    const response = await fetch(avatar);
    const blob = await response.blob();
    return new File([blob], "default.png", { type: blob.type });
  };

  const handleBlur = (field) => {
    if (field !== 'coverImage' && !formData[field]) {
      setErrors((prev) => ({ ...prev, [field]: 'Required' }));
    } else {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const removeImage = (field) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    setPreview((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');

    const newErrors = {};
    for (const field in formData) {
      if (!['coverImage', 'avatar'].includes(field) && !formData[field]){
        newErrors[field] = 'Required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if(!formData.avatar){
      formData.avatar = await fetchDefaultImageBlob();
    }


    try {
      const form = new FormData();
      
      for (let key in formData) {
        if (formData[key]) form.append(key, formData[key]);
      }

      console.log(formData)

      await axios.post('http://localhost:8000/api/v1/users/register', form);
      setApiSuccess('Registration successful!');
      setFormData({
        name: '',
        userName: '',
        email: '',
        password: '',
        gender: '',
        dateOfBirth: '',
        avatar: null,
        coverImage: null,
      });
      setPreview({ avatar: null, coverImage: null });
    } catch (error) {
      setApiError(error.response?.data?.message || 'Something went wrong');
    }
  };

  const inputWrapper = 'mb-6 relative w-[70%]';
  const inputBase = (field) =>
    `w-full border-b-2 bg-transparent text-white py-2 pr-12 focus:outline-none ${
      errors[field] ? 'border-red-400' : 'border-white/40'
    } focus:border-red-400`;

  const renderInput = ({ label, name, type }) => (
    <div className={inputWrapper} key={name}>
      <label className="block mb-1 text-sm">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          onBlur={() => handleBlur(name)}
          className={inputBase(name)}
        />
        {errors[name] && (
          <span className="absolute right-0 top-2 text-xs text-red-400">{errors[name]}</span>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/greenbg.png')" }}
    >
      <div className="w-[99.9%] max-w-8xl h-[99%] rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl flex">
        <div className="w-1/2 flex flex-col justify-center items-end pr-8 pl-8">
          <div className="text-right max-w-[85%]">
            <h1 className="text-4xl font-bold text-red-500 mb-3">Start your journey with YUI</h1>
            <p className="text-xl text-white leading-snug">
              Sign up and explore a new kind of social space.
            </p>
          </div>
        </div>

        <div className="w-1/2 flex justify-start items-center pl-8 pr-8">
          <form onSubmit={handleSubmit} className="w-full max-w-3xl text-white">
            <div className="flex justify-center mb-6">
              <h2 className="text-4xl font-semibold text-white">REGISTER</h2>
            </div>

            {apiError && <p className="text-red-400 mb-4 text-center">{apiError}</p>}
            {apiSuccess && <p className="text-green-400 mb-4 text-center">{apiSuccess}</p>}

            <div className="flex gap-6">
              <div className="w-1/2">
                {renderInput({ label: 'Name', name: 'name', type: 'text' })}
                {renderInput({ label: 'Email', name: 'email', type: 'email' })}
                {renderInput({ label: 'Date of Birth', name: 'dateOfBirth', type: 'date' })}

                <div className={inputWrapper}>
                  <label className="block mb-1 text-sm">Avatar</label>
                  <div className="flex items-center gap-4">
                    <label className="px-4 py-2 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600 text-sm">
                      Choose Avatar
                      <input
                        type="file"
                        name="avatar"
                        onChange={handleChange}
                        onBlur={() => handleBlur('avatar')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {preview.avatar && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={preview.avatar}
                        alt="Avatar Preview"
                        className="h-12 w-12 rounded object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('avatar')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-1/2">
                {renderInput({ label: 'Username', name: 'userName', type: 'text' })}
                {renderInput({ label: 'Password', name: 'password', type: 'password' })}

                <div className={inputWrapper}>
                  <label className="block mb-1 text-sm">Cover Image (optional)</label>
                  <div className="flex items-center gap-4">
                    <label className="px-4 py-2 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600 text-sm">
                      Choose Cover
                      <input
                        type="file"
                        name="coverImage"
                        onChange={handleChange}
                        onBlur={() => handleBlur('coverImage')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {preview.coverImage && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={preview.coverImage}
                        alt="Cover Preview"
                        className="h-12 w-12 rounded object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('coverImage')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <div className={inputWrapper}>
                  <label className="block mb-1 text-sm">Gender</label>
                  <div className="flex gap-4">
                    {['male', 'female', 'other'].map((g) => (
                      <label key={g} className="flex items-center gap-2 text-sm capitalize">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={handleChange}
                          onBlur={() => handleBlur('gender')}
                          className="accent-red-500"
                        />
                        {g}
                      </label>
                    ))}
                    {errors.gender && <span className="text-xs text-red-400">{errors.gender}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-1/2 max-w-xs bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
              >
                Register
              </button>
            </div>

            <p className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-red-400 hover:underline font-medium">
                Login Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
