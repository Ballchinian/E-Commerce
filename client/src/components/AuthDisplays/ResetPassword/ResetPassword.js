import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords must match")
    .required("Please confirm your password")
});

function PasswordReset() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    const { password } = values;
    try {
      const response = await fetch('http://localhost:4000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Password successfully reset! Redirecting...');
        setError('');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Reset failed');
        setMessage('');
      }
    } catch (err) {
      setError('Server error');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
          isSubmitting
        }) => (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              name="password"
              placeholder="New password"
              value={values.password}
              onChange={handleChange}
              style={{ display: 'block', width: '100%', margin: '10px 0' }}
            />
            {touched.password && errors.password && (
              <div style={{ color: 'red' }}>{errors.password}</div>
            )}

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={values.confirmPassword}
              onChange={handleChange}
              style={{ display: 'block', width: '100%', margin: '10px 0' }}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <div style={{ color: 'red' }}>{errors.confirmPassword}</div>
            )}

            <button type="submit" disabled={isSubmitting}>
              Reset Password
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default PasswordReset;
