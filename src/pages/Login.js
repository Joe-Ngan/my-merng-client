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

export default function Login(props) {
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    
    const { onChange, onSubmit, values }= useForm(loginUserCallback, {
        username: '',
        password: ''
    });
    
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data: {login : userData}}) {
            console.log(userData);
            context.login(userData);
            navigate("/");
        },
        onError(err) {
            console.log(err.graphQLErrors);
            setErrors(err&&err.graphQLErrors[0]?err.graphQLErrors[0].extensions.errors:{});
        },
        variables: values
    })

    function loginUserCallback(){
        loginUser();
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
                <Button type="submit" variant="contained">Login</Button>
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

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ){
    login(
        username: $username
        password: $password
    ){
        id
        email
        token
        username
        createdAt
    }
}
`