import { axiosi } from "../../config/axios.js";

// Upload image to Cloudinary

export const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "sandeep-insta");

    try {
        const res = await axiosi.post(
            "https://api.cloudinary.com/v1_1/sandeep1298/image/upload",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: false, // Set to true if required by Cloudinary
            }
        );
        return res.data.url;
    } catch (error) {
        const message = error.response?.data?.error?.message || "Failed to upload image";
        throw new Error(message);
    }
};

// Create a post
export const createPost = async (postDetails, token) => {
    try {
        const res = await axiosi.post("posts/createpost", postDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        throw error.response?.data?.error || "Failed to create post";
    }
};

export const updatePost = async (id , token, postDetails) => {
    try {
        const res = await axiosi.put(`posts/updatepost/${id}`, postDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        throw error.response?.data?.error || "Failed to update post";
    }
};


export const getPosts=async(token)=>{
    try {
        const res=await axiosi.get("posts/allpost" ,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return res.data.posts
    } catch (error) {
        throw error.response?.data?.error
    }
}

export const likePost = async (postId, token) => {
    try {
        const res = await axiosi.put("posts/like", { postId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data; // Return the updated post
    } catch (error) {
        throw error.response?.data?.error || "Failed to like post";
    }
};

// Unlike a post
export const unlikePost = async (postId, token) => {
    try {
        const res = await axiosi.put("posts/unlike", { postId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data; // Return the updated post
    } catch (error) {
        throw error.response?.data?.error || "Failed to unlike post";
    }
};

// Add a comment to a post
export const makeComment = async (text, postId, token) => {
    try {
        const res = await axiosi.put("posts/comment", { postId, text }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data; // Return the updated post
    } catch (error) {
        throw error.response?.data?.error || "Failed to add comment";
    }
};



// Delete a post
export const deletePost = async (postId, token) => {
    try {
        const res = await axiosi.delete(`posts/deletepost/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data; // Return the deleted post's ID or result
    } catch (error) {
        throw error.response?.data?.error || "Failed to delete post";
    }
};
