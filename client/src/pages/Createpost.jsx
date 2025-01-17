import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPostAsync, selectPostAddStatus } from '../features/post/PostSlice';
import { uploadImage } from '../features/post/PostApi';
import { selectUserInfo } from '../features/auth/AuthSlice';


export default function CreatePost() {
    const navigate = useNavigate();

    // Redux hooks for dispatching actions and selecting state
    const dispatch = useDispatch();
    const postAddStatus = useSelector(selectPostAddStatus); // Fetching post submission status
    const userInfo = useSelector(selectUserInfo); // Fetching user information


    const token = userInfo?.token

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [fileName, setFileName] = useState("");

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }
    }, [userInfo, navigate]);

    // Handles image upload to the server.
    const handleImageUpload = async () => {
        try {
            if (!image) {
                toast.error("Please upload an image.");
                return null;
            }
            const url = await uploadImage(image);
            return url;
        } catch (error) {
            toast.error(error);
            return null;
        }
    };

    //Handles form submission for creating a post.
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !body || !image) {
            toast.error("All fields are required.");
            return;
        }

        try {
            const imageUrl = await handleImageUpload(); // Upload the image and get the URL
            if (imageUrl) {
                const postDetails = { title, body, photo: imageUrl };
                await dispatch(createPostAsync({ postDetails, token })); // Dispatch action to create the post
                toast.success("Post created successfully!");

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (err) {
            toast.error("Failed to create post.");
        }
    };

    // Handles the file input change event for image selection.
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file.");
            return;
        }

        setImage(file);
        setFileName(file.name);

        // Generate a preview of the selected image
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };


    return (
        <>
            <div className='icon_padding'>
                <NavLink to='/'>
                    <i className="fas back_arrow fa-chevron-left"></i>
                </NavLink>
            </div>
            <div className="container  mb-5 pb-5  pt-5 margin_align  flex-center">
                <div className="card">
                    <h1 className="text-center card-header text-white secondary-color instagram">Create Your Post!</h1>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="md-form">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Title"
                                    required
                                />
                            </div>
                            <div className="md-form">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Description"
                                    required
                                />
                            </div>
                            <div className="">
                                <div className="input-group mb-3">
                                    <input
                                        type="file"
                                        id="fileUpload"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        hidden
                                    />
                                    <label htmlFor="fileUpload" className="btn btn-md btn_login_custom btn-secondary">
                                        Upload File
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control mt-2"
                                        value={fileName}
                                        placeholder="No file chosen"
                                        readOnly
                                    />
                                </div>

                                {imagePreview && (
                                    <div className="mt-3 text-center">
                                        <h6 className='font-weight-bold'>
                                            Image  Preview
                                        </h6>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="img-thumbnail"

                                        />
                                    </div>
                                )}
                            </div>
                            <div className="text-center mt-3">
                                <button
                                    type="submit"
                                    className="btn btn-indigo btn_login_custom font-weight-bold"
                                    disabled={postAddStatus === "pending"}
                                >
                                    {postAddStatus === "pending" ? "Posting..." : "POST"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
