import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { uploadImage } from "../features/post/PostApi";
import { fetchPostsAsync, selectPostUpdateStatus, updatePostAsync } from "../features/post/PostSlice";

function UpdateModal({ show, handleClose, posts, token }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const postUpdateStatus = useSelector(selectPostUpdateStatus);


  const [fileName, setFileName] = useState("");

  //initialize with the existing post details
  useEffect(() => {
    if (posts) {
      setTitle(posts.title || "");
      setBody(posts.body || "");
      setImagePreview(posts.photo || null);
      setFileName(posts.photo ? posts.photo : fileName);
    }
  }, [posts]);

  const handleImageUpload = async () => {
    try {
      if (!image) {
        toast.error("Please upload an image.");
        return null;
      }
      const url = await uploadImage(image);
      return url;
    } catch (error) {
      toast.error("Failed to upload image.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !body) {
      toast.error("All fields are required.");
      return;
    }

    try {
      let updatedPhotoUrl = posts.photo;

      // Upload new image if provided
      if (image && image !== posts.photo) {
        updatedPhotoUrl = await handleImageUpload();
      }

      const id = posts._id;

      if (updatedPhotoUrl) {
        const updatedPostDetails = {
          title,
          body,
          photo: updatedPhotoUrl,
        };
        // Dispatching updatePost
        const updatedPost = await dispatch(updatePostAsync({ postId: id, token, postDetails: updatedPostDetails }));

        if (updatedPost.payload) {
          toast.success("Post updated successfully!");
          handleClose();

          // Fetch updated posts after successful update
          if (updatePostAsync.fulfilled.match(updatedPost)) {
            await dispatch(fetchPostsAsync(token));
          }
        } else {
          toast.error("Failed to update post.");
        }
      }
    } catch (error) {
      toast.error("Failed to update post.");
    }
  };

// Handles file input change for image upload.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    setImage(file);
    setFileName(file.name)

     // Read the file as a data URL to display image preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Post</Modal.Title>
      </Modal.Header >
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Body</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <div className="">
              <div className="input-group mb-3">
                <input
                  type="file"
                  id="fileUpload"

                  className="form-control"
                  accept="image/*" // Restrict file input to image files
                  onChange={handleFileChange}

                  hidden // Hide the default input
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
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="btn_login_custom " variant="primary" type="submit">
            {postUpdateStatus === "pending" ? "Updating...." : "Update Post "}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateModal;
