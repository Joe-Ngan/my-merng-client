import React, { useContext } from 'react';
import {
  useQuery,
} from "@apollo/client";

import '../App.css';
import { AuthContext } from '../context/auth';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import PostCard from '../components/PostCard';
import PostForm from "../components/PostForm";


import { FETCH_POSTS_QUERY } from "../util/graphQL";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  console.log('hi');
  console.log(data);
  let posts = [];
  if(!loading){
    posts = data.getPosts;
    console.log(posts);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container item xs={12} spacing={0}>
          {user && <PostForm/>}
        <Grid item xs={12} sx={{ minWidth: 275, m:5 }} className="page-title">
          Recent Posts
        </Grid>
          {loading ? (<Item>loading...</Item> 
          ):(
            posts.map((post) => (
                <PostCard key={post.id} post={post}/>
            ))
          )}
      </Grid>
    </Box>
  )
}



export default Home;
