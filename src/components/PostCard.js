import * as React from 'react';
import { useContext } from "react";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import { indigo, red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import Popover from '../components/PopOver';

import Stack from '@mui/material/Stack';
import Grow from '@mui/material/Grow';


import Moment from 'react-moment';
import { AuthContext } from '../context/auth';
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
export default function PostCard({
    post: { body, createdAt, id, username, likeCount, commentCount, likes }
}) {
    const { user } = useContext(AuthContext);
    console.log("hi" + user);

    const time = (
        <Box
            component="span"
            sx={{ mx: '2px', transform: 'scale(0.8)' }}
        >
            <Moment fromNow>{createdAt}</Moment>
        </Box>

    );


    return (
        <Grow direction="up" in mountOnEnter unmountOnExit>
            <div>
                <Card sx={{ minWidth: 275, m: 0.5 }} >
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: indigo[300] }} aria-label="recipe">
                                {username[0].toUpperCase()}
                            </Avatar>
                        }
                        action={
                            <Popover text="More functions are under development🤔" item={<IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>} />
                        }
                        title={username}
                        subheader={time}
                    />
                    <CardContent sx={{ mt: -3 }}>
                        <Typography variant="h5" component="div" sx={{ mb: 3 }}>
                            {body}
                        </Typography>
                        <Stack direction="row" spacing={2} >
                            <Popover text="Like the post❤️" item={<LikeButton user={user} post={{ id, likes, likeCount }} />}/>
                            <Popover text="Comment the post🎤" item={
                            <Button variant="outline" sx={{ border: indigo[300], color: indigo[300] }} startIcon={<CommentIcon />} href={`/posts/${id}`} >
                                {commentCount}
                            </Button>}/>
                            {user && user.username === username && (
                                <Popover text="Delete the post📦" item={<DeleteButton postId={id} />}/>
                                
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </div>
        </Grow>
    );
}
