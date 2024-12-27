import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
    createPost, 
    getPosts, 
    likePost, 
    unlikePost, 
    makeComment, 
    deletePost ,
    updatePost
} from "./PostApi";

const initialState = {
    status: "idle",
    posts: [],
    selectedPost: null,
    postAddStatus: "idle",
    postFetchStatus: "idle",
    errors: null,
    successMessage: null
};

// Async Thunks
export const createPostAsync = createAsyncThunk("posts/createPostAsync", async ({ postDetails, token }) => {
    const newPost = await createPost(postDetails, token);
    return newPost;
});

export const fetchPostsAsync = createAsyncThunk("posts/fetchPostsAsync", async (token) => {
    const posts = await getPosts(token);
    return posts;
});

export const likePostAsync = createAsyncThunk("posts/likePostAsync", async ({ postId, token }) => {
    const updatedPost = await likePost(postId, token);
    return updatedPost;
});

export const unlikePostAsync = createAsyncThunk("posts/unlikePostAsync", async ({ postId, token }) => {
    const updatedPost = await unlikePost(postId, token);
    return updatedPost;
});

export const makeCommentAsync = createAsyncThunk("posts/makeCommentAsync", async ({ text, postId, token }) => {
    const updatedPost = await makeComment(text, postId, token);
    return updatedPost;
});

export const deletePostAsync = createAsyncThunk("posts/deletePostAsync", async ({ postId, token }) => {
    const deletedPost = await deletePost(postId, token);
    return deletedPost;
});

export const updatePostAsync = createAsyncThunk("posts/updatePostAsync", async ({ postId,token, postDetails }) => {
    const updatedPost = await updatePost(postId,token, postDetails);
    return updatedPost;
});

// Slice
const postSlice = createSlice({
    name: "postSlice",
    initialState,
    reducers: {
        clearPostErrors: (state) => {
            state.errors = null;
        },
        clearPostSuccessMessage: (state) => {
            state.successMessage = null;
        },
        resetPostStatus: (state) => {
            state.status = "idle";
        },
        clearSelectedPost: (state) => {
            state.selectedPost = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Post
            .addCase(createPostAsync.pending, (state) => {
                state.postAddStatus = "pending";
            })
            .addCase(createPostAsync.fulfilled, (state, action) => {
                state.postAddStatus = "fulfilled";
                state.posts.push(action.payload);
            })
            .addCase(createPostAsync.rejected, (state, action) => {
                state.postAddStatus = "rejected";
                state.errors = action.error.message;
            })

            // Fetch Posts
            .addCase(fetchPostsAsync.pending, (state) => {
                state.postFetchStatus = "pending";
            })
            .addCase(fetchPostsAsync.fulfilled, (state, action) => {
                state.postFetchStatus = "fulfilled";
                state.posts = action.payload;
                state.successMessage = null;
            })
            .addCase(fetchPostsAsync.rejected, (state, action) => {
                state.postFetchStatus = "rejected";
                state.errors = action.error;
            })

            // Like Post
            .addCase(likePostAsync.pending, (state) => {
                state.status = "pending";
            })
            .addCase(likePostAsync.fulfilled, (state, action) => {
                state.status = "fulfilled";
                const index = state.posts.findIndex((post) => post._id === action.payload._id);
                if (index !== -1) state.posts[index] = action.payload;
            })
            .addCase(likePostAsync.rejected, (state, action) => {
                state.status = "rejected";
                state.errors = action.error;
            })

            // Unlike Post
            .addCase(unlikePostAsync.pending, (state) => {
                state.status = "pending";
            })
            .addCase(unlikePostAsync.fulfilled, (state, action) => {
                state.status = "fulfilled";
                const index = state.posts.findIndex((post) => post._id === action.payload._id);
                if (index !== -1) state.posts[index] = action.payload;
            })
            .addCase(unlikePostAsync.rejected, (state, action) => {
                state.status = "rejected";
                state.errors = action.error;
            })

            // Add Comment
            .addCase(makeCommentAsync.pending, (state) => {
                state.status = "pending";
            })
            .addCase(makeCommentAsync.fulfilled, (state, action) => {
                state.status = "fulfilled";
                const index = state.posts.findIndex((post) => post._id === action.payload._id);
                if (index !== -1) state.posts[index] = action.payload;
            })
            .addCase(makeCommentAsync.rejected, (state, action) => {
                state.status = "rejected";
                state.errors = action.error;
            })

            // Delete Post
            .addCase(deletePostAsync.pending, (state) => {
                state.status = "pending";
            })
            .addCase(deletePostAsync.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.posts = state.posts.filter((post) => post._id !== action.payload._id);
                state.successMessage = "Post deleted successfully.";
            })
            .addCase(deletePostAsync.rejected, (state, action) => {
                state.status = "rejected";
                state.errors = action.error;
            })

            .addCase(updatePostAsync.pending, (state) => {
                state.postUpdateStatus = "pending";
            })
            .addCase(updatePostAsync.fulfilled, (state, action) => {
                state.postUpdateStatus = "fulfilled";
                const index = state.posts.findIndex((post) => post._id === action.payload._id);
                if (index !== -1) state.posts[index] = action.payload; 
                
              })
            .addCase(updatePostAsync.rejected, (state, action) => {
                state.postUpdateStatus = "rejected";
                state.errors = action.error;
            });
    }
});

// Exporting Selectors
export const selectPostStatus = (state) => state.postSlice.status;
export const selectPosts = (state) => state.postSlice.posts;
export const selectSelectedPost = (state) => state.postSlice.selectedPost;
export const selectPostErrors = (state) => state.postSlice.errors;
export const selectPostSuccessMessage = (state) => state.postSlice.successMessage;
export const selectPostAddStatus = (state) => state.postSlice.postAddStatus;
export const selectPostUpdateStatus = (state) => state.postSlice.postUpdateStatus;

export const selectPostFetchStatus = (state) => state.postSlice.postFetchStatus;

// Exporting Actions
export const { clearPostErrors, clearPostSuccessMessage, resetPostStatus, clearSelectedPost } = postSlice.actions;

export default postSlice.reducer;
