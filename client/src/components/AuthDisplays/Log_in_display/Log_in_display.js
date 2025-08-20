import React from "react";
import './Log_in_display.css';
import facebookLogo from './facebook_logo.png';
import googleLogo from './google_logo.png'; 
import { GoogleLogin } from '@react-oauth/google';
import { Button, Card, Form} from 'react-bootstrap';
import { API_BASE_URL } from '../../../config.js';
//Handles form state, validation and submission
import { Formik } from 'formik';
//Schema validator
import * as Yup from 'yup';

import { Link, useNavigate } from 'react-router-dom';

//Email must be a valid format. Password is non-empty
const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required")
});

function LogInDisplay() {
    //Allows the user to be redirected to another url for security and conviniance 
    const navigate = useNavigate();

    
    const handleLogin = async (values, { setSubmitting, setErrors }) => {
        const { email, password } = values;

        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (data.success) {
                //Successful login, allows token to be taken as authentication and returns userid and email for global use. 
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', JSON.stringify(email));
                //Private channel which is passed only with global token. 
                navigate('/shopping');


                
            } else {
                console.log('Login failed:', data.message);
                setErrors({ email: 'Incorrect email or password' });
                
            }
        } catch (err) {
            console.error('Request failed:', err);
            setErrors({ email: 'Server error, try again later' });

        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordReset = async () => {
        const email = prompt("Enter your email to receive a reset link:");

        if (!email) return;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/password-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (response.ok) {
            alert('Password reset email has been sent.');
            } else {
            alert(data.message || 'Failed to send reset email.');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            alert('Server error. Please try again later.');
        }
    };


    function handleFacebookLogin() {
        if (!window.FB) {
            console.error("Facebook SDK not loaded yet.");
            return;
        }
        window.FB.login(function (response) {
            if (response.authResponse) {
            const accessToken = response.authResponse.accessToken;

           
            fetch(`${API_BASE_URL}/auth/facebook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken }),
            })
                .then(res => res.json())
                .then(data => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', JSON.stringify(data.user.email));
                navigate('/shopping');
                });
            } else {
            console.error('Facebook login failed');
            }
        }, { scope: 'email' });
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
        const response = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: credentialResponse.credential }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', JSON.stringify(data.user.email));
            navigate('/shopping');
        } else {
            console.error('Google login failed:', data.message);
        }
        } catch (err) {
        console.error('Google login error:', err);
        }
    };

    return (
            <Card>
                <Card.Body id="login_banner">
                    <Card.Header>E-Commerce Login</Card.Header>

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={loginSchema}
                        onSubmit={handleLogin}
                        >
                        {({
                            handleSubmit,   
                            handleChange,
                            values,
                            touched,
                            errors,
                            isSubmitting
                        }) => (

                            <Form noValidate onSubmit={handleSubmit}>
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

                                <Button type="submit" id="login_button" disabled={isSubmitting}>
                                    Login
                                </Button>
                            </Form>
                        )}
                    </Formik>



                    <Button type="button" id="password_reset" variant="outline-primary" onClick={handlePasswordReset}>
                        Password Reset
                    </Button>

                    <div id="new_account">
                        <Link to="/register">
                            <Button type="button"  variant="success">
                                Create a new account
                            </Button>
                        </Link>
                    </div>
                    

                    
                    
                    <Card.Body id="auth">
                        <Button type="button" variant="outline-light" onClick={handleFacebookLogin}>
                            <img src={facebookLogo} alt="The facebook logo"></img>
                            <p>Continue with facebook</p>
                        </Button>


                            
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.error('Google login failed')}
                    />
                    <img src={googleLogo} alt="The google logo"></img>
                    <p>Continue with Google</p>

                        
                    </Card.Body>

                </Card.Body>
            </Card>
    );
};


export default LogInDisplay;