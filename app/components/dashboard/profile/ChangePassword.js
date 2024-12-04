"use client"
import React, { useState } from 'react';
import useUserStore from "@/utils/store/userStore";

const ChangePassword = () => {
  const user = useUserStore((state) => state.user);
  const session = useUserStore((state) => state.session.id);
  console.log('user ' + JSON.stringify(user));
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const userId = user?._id;

    if (!userId) {
      setError('User not found. Please log in again.');
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT;
    console.log("Session" + JSON.stringify(session))

    try {
      const response = await fetch(`${baseUrl}/user/changePassword/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session}`, // Added session to the header
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
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
    <form onSubmit={handleSubmit}>
      <div className="col-sm-6 col-lg-7">
        <div className="mb20">
          <input
            name="oldPassword"
            className="form-control form_control"
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
      </div>
      {/* End .col-6 */}

      <div className="col-sm-6 col-lg-7">
        <div className="mb20">
          <input
            name="newPassword"
            className="form-control form_control"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
      </div>
      {/* End .col-6 */}

      <div className="col-sm-6 col-lg-7">
        <div className="mb20">
          <input
            name="confirmNewPassword"
            className="form-control form_control mb20"
            type="password"
            placeholder="Re-enter New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-thm ad_flor_btn">
            Save
          </button>
        </div>
      </div>
      {/* End .col-6 */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
    </form>
  );
};

export default ChangePassword;
