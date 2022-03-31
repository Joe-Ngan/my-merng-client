import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import {
    useMutation,
} from "@apollo/client";

import { CREATE_POST_MUTATION, FETCH_POSTS_QUERY } from "../util/graphQL";
import { useForm } from '../util/hooks';

function PostForm() {

    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: '',
    })
    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            let newData = [...data.getPosts];
            newData = [result.data.createPost, ...newData];
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    ...data,
                    getPosts: {
                        newData,
                    },
                },
            });
            values.body = '';
            console.log('hi');
        }
    })

    function createPostCallback() {
        createPost()
    }

    return (
        <Box component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '60ch' },
            }}
            noValidate
            onSubmit={onSubmit}
            value={values.body}
        >
            <Grid item xs={12} sx={{ minWidth: 575 }} className="page-title">
                <TextField
                    multiline
                    maxRows={2}
                    sx={{ minWidth: 575 }}
                    id="new-post-body"
                    label="Share what you want to share"
                    name="body"
                    variant="outlined"
                    value={values.body}
                    error={error ? true : false}
                    onChange={onChange}
                />
                <Button sx={{ m: 2 }} variant="contained" type="submit">Create post</Button>
            </Grid>
            {error && (
                <Stack sx={{ width: '70rem', pl: 1 }} spacing={1}>
                    <Alert severity="error">{error.graphQLErrors[0].message}</Alert>
                </Stack>
            )}
        </Box>
    )
}



export default PostForm
