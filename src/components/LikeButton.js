import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Button from '@mui/material/Button';


import { LIKE_POST_MUTATION } from "../util/graphQL";
import { useMutation } from '@apollo/client';

function likePost() {
    console.log('Like Post');
}

function LikeButton({ user, post:{id, likeCount, likes}}) {
    const [liked, setLiked] = useState(false);

    useEffect(()=>{
        if(user && likes.find(like => like.username === user.username)){
            setLiked(true)
        } else {
            setLiked(false)
        }
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId : id }
    });

    const style = (user && liked)? 'contained':'outline';

    return (
        <Button variant={style} startIcon={<FavoriteBorderIcon />} onClick={likePost}>
            {likeCount}
        </Button>
    )
}



export default LikeButton
