import React, { useState, useContext, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import { indigo } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentIcon from '@mui/icons-material/Comment';
import Moment from 'react-moment';

import Stack from '@mui/material/Stack';
import { FETCH_POST_QUERY, SUBMIT_COMMENT_MUTATION } from "../util/graphQL";
import { AuthContext } from "../context/auth";
import { useNavigate } from 'react-router-dom';
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import Popover from '../components/PopOver';

function SinglePost() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const { user } = useContext(AuthContext);

    const [comment, setComment] = useState('');
    const commentInputRef = useRef(null);

    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    });


    function deletePostCallback() {
        navigate("/");
    }

    let postMarkup = <p>Loading post...</p>;

    if (data) {
        const { getPost } = data;
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost;
        if (getPost) {
            postMarkup = (
                <>
                    <Card sx={{ minWidth: 275, m: 0.5, pt: 2, pl:2, pr:2 }} >
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
                            subheader={<Box
                                component="span"
                                sx={{ mx: '2px', transform: 'scale(0.8)' }}
                            >
                                <Moment fromNow>{createdAt}</Moment>
                            </Box>}
                        />
                        <CardContent sx={{ mt: -3 }}>
                            <Typography variant="h5" component="div" sx={{ mb: 3 }}>
                                {body}
                            </Typography>
                            <Stack direction="row" spacing={2} >
                                <LikeButton user={user} post={{ id, likes, likeCount }} />
                                <Button variant="outline" sx={{ border: indigo[300], color: indigo[300] }} startIcon={<CommentIcon />} href={`/posts/${id}`} >
                                    {commentCount}
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}

                            </Stack>
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: 275, m: 0.5, pt: 2, pl:2, pr:2 }} >
                        {user && (
                            <Box component="form"
                                sx={{
                                    '& .MuiTextField-root': { m: 1, width: '60ch' },
                                }}
                                noValidate
                                onSubmit={submitComment}
                                value={comment}
                            >
                                <Grid item xs={12} sx={{ minWidth: 575 }} className="page-title">
                                    <TextField
                                        multiline
                                        maxRows={2}
                                        sx={{ minWidth: 375 }}
                                        id="new-comment-body"
                                        label="comment.."
                                        name="body"
                                        variant="outlined"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <Button sx={{ m: 2 }} variant="contained" type="submit" disabled={comment.trim() === ''}>Submit</Button>
                                </Grid>
                            </Box>
                        )}
                    </Card>
                    {comments.map((comment) => (
                        <Card key={comment.id} sx={{ minWidth: 275, m: 0.5, pt: 2, pl:2, pr:2}}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: indigo[300] }} aria-label="recipe">
                                        {comment.username[0].toUpperCase()}
                                    </Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings">
                                        {user && user.username === comment.username && (
                                            <DeleteButton postId={id} commentId={comment.id} />
                                        )}
                                    </IconButton>
                                }
                                title={comment.username}
                                subheader={<Box
                                    component="span"
                                    sx={{ mx: '2px', transform: 'scale(0.8)' }}
                                >
                                    <Moment fromNow>{comment.createdAt}</Moment>
                                </Box>}
                            />

                            <CardContent sx={{ mt: -3 }}>
                                <Typography variant="h5" component="div" sx={{ mb: 3 }}>
                                    {comment.body}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </>
            )
        }
    }



    return postMarkup;
}

export default SinglePost
