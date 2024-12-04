'use client';
import React, { useState, useEffect } from 'react';
import ProfilePicUploader from './ProfilePicUploader';
import useUserStore from '@/utils/store/userStore';

const AccountDetails = () => {
  const user = useUserStore((state) => state.user);
  const session = useUserStore((state) => state.session);
  const sessionId = session ? session.id : null;

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize local state with `user` data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setLocation(user.location || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const userId = user?._id;

    if (!userId) {
      setError('User not found. Please log in again.');
      return;
    }

    if (!sessionId) {
      setError('Session not found. Please log in again.');
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT;

    try {
      const response = await fetch(`${baseUrl}/user/updateUser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({ name, location, phone, email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="contact_form" onSubmit={handleSubmit}>
      <div className="dp_user_thumb_content">
        <ProfilePicUploader />
      </div>

      <div className="row">
        <div className="col-lg-7">
          <div className="row">
            <div className="col-sm-6">
              <div className="mb20">
                <input
                  className="form-control form_control"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="col-sm-6">
              <div className="mb20">
                <input
                  className="form-control form_control"
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="col-sm-6">
              <div className="mb20">
                <input
                  className="form-control form_control"
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="col-sm-6">
              <div className="mb20">
                <input
                  className="form-control form_control"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="new_propertyform_btn">
                <button type="submit" className="btn btn-thm ad_flor_btn">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
    </form>
  );
};

export default AccountDetails;
