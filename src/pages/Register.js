import * as React from 'react';
import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import {
    useMutation,
    gql
} from "@apollo/client";

import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";

export default function Register(props) {
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    
    const { onChange, onSubmit, values }= useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: { register: userData}}) {
            context.login(userData)
            navigate("/");
        },
        onError(err) {
            console.log(err.graphQLErrors);
            setErrors(err&&err.graphQLErrors[0]?err.graphQLErrors[0].extensions.errors:{});
        },
        variables: values
    })

    

    function registerUser(){
        addUser();
    }

    return (
        <div>
            <Box
                className={`form-container ${loading ? 'loading' : ''}`}
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '60ch' },
                }}
                noValidate
                onSubmit={onSubmit}
            >
                <TextField
                    required
                    id="username"
                    label="Username"
                    name="username"
                    variant="standard"
                    value={values.username}
                    error={errors.username? true: false}
                    onChange={onChange}
                />
                <br />
                <TextField
                    required
                    id="email"
                    label="Email"
                    name="email"
                    variant="standard"
                    value={values.email}
                    error={errors.email? true: false}
                    onChange={onChange}
                />
                <br />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    variant="standard"
                    value={values.password}
                    error={errors.password? true: false}
                    onChange={onChange}
                />
                <br />
                <TextField
                    id="confirmPassword"
                    label="ConfirmPassword"
                    type="password"
                    name="confirmPassword"
                    autoComplete="current-password"
                    variant="standard"
                    value={values.confirmPassword}
                    error={errors.confirmPassword? true: false}
                    onChange={onChange}
                />
                <Button type="submit" variant="contained">Sign up</Button>
                <br/>
                {Object.keys(errors).length > 0 && (
                    <Stack sx={{ width: '60ch' }} spacing={1}>
                        {Object.values(errors).map(value => (
                            <Alert severity="error" key={value}>{value}</Alert>
                        ))}
                    </Stack>
                )}
            </Box>
        </div>
    );
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ){
    register(
        registerInput:{
            username: $username
            email: $email
            password: $password
            confirmPassword: $confirmPassword
        }
    ){
        id
        email
        token
        username
        createdAt
    }
}
`