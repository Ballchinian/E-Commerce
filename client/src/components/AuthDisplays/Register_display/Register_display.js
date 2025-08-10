import React from "react";
import './Register_display.css'; 
import { Button, Card, Form } from 'react-bootstrap';
import { API_BASE_URL } from '../../../config.js';

//Handles form state, validation and submission
import { Formik } from 'formik';
//Schema validator
import * as Yup from 'yup';

import { useNavigate } from 'react-router-dom';

// Validation schema
const registerSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords must match")
    .required("Please confirm your password")
});

function RegisterDisplay() {
  const navigate = useNavigate();
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        const { firstName, lastName, email, password } = values;

    
        try {
            
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password })
            });

            const data = await response.json();
            
            if (data.success) {
                navigate('/login');
                
            } else {
                console.log('Register failed:', data);

                if (data.message === 'duplicate key value violates unique constraint "users_email_idx"') {
                  setErrors({ email: "There is already a user with that email"});
                }

                
            }
        } catch (err) {
            console.error('Request failed:', err);
            //Just sets the firstName input as the target for error message
            setErrors({ firstName: 'Server error, try again later' });

        } finally {
          //Stop loading state, resets form
            setSubmitting(false);
        }
    };

  return (
    <Card>
      <Card.Body id="register_body">
        <Card.Header>Create an Account</Card.Header>
        
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >

          {/*handleChange updates form state when user types, touched is what fields uer has interacted with */}
          {({
            handleSubmit,
            handleChange,
            values,
            touched,
            errors
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="formFirstName">
                {/*isInvalid -> if user interacted with firstname and it fails the validation, it is invalid, show error message with errors.firstName*/}
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={values.firstName}
                  onChange={handleChange}
                  
                  isInvalid={touched.firstName && !!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formLastName">
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={values.lastName}
                  onChange={handleChange}
                  isInvalid={touched.lastName && !!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={touched.password && !!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formConfirmPassword">
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" id="login_button">
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
}

export default RegisterDisplay;
