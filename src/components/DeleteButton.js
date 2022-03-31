import React, { useState } from 'react'
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Zoom from '@mui/material/Zoom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { red } from '@mui/material/colors';
import { DELETE_POST_MUTATION } from "../util/graphQL";
import { useMutation } from '@apollo/client';
import { FETCH_POSTS_QUERY, DELETE_COMMENT_MUTATION } from "../util/graphQL";

function DeleteButton({ postId, commentId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const handleClose = () => {
        setConfirmOpen(false);
    };

    const mutation = commentId? DELETE_COMMENT_MUTATION: DELETE_POST_MUTATION;
    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy) {
            // setConfirmOpen(false);
            if(!commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                if (data) {
                    let newData = [...data.getPosts];
                    newData.splice(newData.findIndex(e => e.id === postId), 1);
                    proxy.writeQuery({
                        query: FETCH_POSTS_QUERY, data: {
                            ...data,
                            getPosts: {
                                newData,
                            },
                        }
                    });
                    console.log('leave with post data');
                }
            }
            if (callback) {
                console.log('leave');
                callback();
            }
        },
        variables: {
            postId,
            commentId
        }
    });

    // const Transition = React.forwardRef(function Transition(props, ref) {
    //     return <Slide direction="up" ref={ref} {...props} />;
    // });
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
            <Button
                variant="outline"
                style={{ maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '35px', color: red[300] }}
                onClick={() => setConfirmOpen(true)}>
                <DeleteOutlinedIcon />
            </Button>
            
            <Modal
                open={confirmOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Deleting the post?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, md: 2 }}>
                        Please confirm that you want to delete the post.
                        Your deletion would be irrevocable.
                    </Typography>
                    <Button sx={{ mt: 2, mr: 7, color: '#DC143C' }} onClick={deletePostOrComment}>Sure, please</Button>
                    <Button sx={{ mt: 2, ml: 7 }} onClick={() =>
                        setConfirmOpen(false)}>Think again</Button>
                </Box>
            </Modal>
        </>
    )
}

export default DeleteButton
