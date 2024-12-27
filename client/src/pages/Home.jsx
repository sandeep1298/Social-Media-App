import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsAsync, likePostAsync, unlikePostAsync, makeCommentAsync, deletePostAsync, selectPostSuccessMessage, selectPostFetchStatus } from '../features/post/PostSlice';
import { selectPosts } from '../features/post/PostSlice';
import { selectUserInfo } from '../features/auth/AuthSlice';
import toast from 'react-hot-toast';
import { Loader } from '../utils/Loader';
import UpdateModal from '../components/UpdateModal';
import { Tooltip } from 'react-tooltip';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const dispatch = useDispatch();

  // Retrieve posts and user information from Redux store
  const posts = useSelector(selectPosts);

  const userInfo = useSelector(selectUserInfo);

  const status = useSelector(selectPostFetchStatus);

  const token = userInfo?.token;
  const user_id = userInfo?._id;

// State to manage comment input texts for each post
  const [commentTexts, setCommentTexts] = useState({});

  // State to manage the visibility of the update modal
  const [show, setShow] = useState(false);


  const handleCommentChange = (postId, text) => {
    setCommentTexts((prevState) => ({
      ...prevState,
      [postId]: text,
    }));
  };

  const navigate = useNavigate();

  //Redirect to login if user is not authenticated
  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
  }, [userInfo, navigate]);

//Fetching all the posts
  useEffect(() => {
    if (token) {
      dispatch(fetchPostsAsync(token))
    }
  }, [dispatch, token]);


//Handles liking a post.
  const handleLike = (postId) => {
    if (token) {
      dispatch(likePostAsync({ postId, token }));
    }
  };

  //Handles unliking a post.
  const handleUnlike = (postId) => {
    if (token) {
      dispatch(unlikePostAsync({ postId, token }));
    }
  };

  // Handles changes in the comment text for a specific post.
  const handleComment = (postId) => {
    const text = commentTexts[postId];
    if (text && token) {
      dispatch(makeCommentAsync({ text, postId, token }));
      setCommentTexts((prevState) => ({
        ...prevState,
        [postId]: "",
      }));
    }
  };

  const successMessage = useSelector(selectPostSuccessMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);


  //Handles deleting a post.
  const handleDelete = async (postId) => {
    if (token) {
      try {
        const result = await dispatch(deletePostAsync({ postId, token }));
        if (deletePostAsync.fulfilled.match(result)) {
          await dispatch(fetchPostsAsync(token));
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  // Show loader while fetching posts
  if (status === "pending") {
    return <Loader />
  }


  return (

    <div className="container mt-lg-5 mb-5 pt-lg-4 flex-center d-flex flex-column spacing_small">
      {
        posts && posts.length === 0 ?
          <div>
            <h2 className='text-center'>No Posts Found</h2>
          </div>
          :
          posts && posts.length > 0 && posts.map(item => (
            <div className="card mt-lg-5 mb-lg-5 spacing_align " key={item._id}
              data-aos="fade-up" data-aos-offset="500" data-aos-easing="ease-in-out"
            >
              <h4 className="card-header font-weight-bold text-center bg-warning-blue text-capitalize ">
                Posted By - {item?.postedBy?.name}
                {item?.postedBy?._id === user_id &&
                  <>
                    <i className="far fa-trash-alt ml-3 float-right hovericons delete_icon "
                      data-tooltip-id='delete'
                      data-tooltip-content="delete"
                      onClick={() => handleDelete(item._id)}></i>
                    <Tooltip className='tooltip_custom' id="delete" place='top' />
                    <i className="fas fa-pen float-right hovericons  edit_icons"
                      data-tooltip-id='edit'
                      data-tooltip-content="edit"
                      onClick={() => setShow(`${item._id}`)}></i>
                    <Tooltip className='tooltip_custom' id="edit" place='top' />
                  </>
                }
              </h4>
              <div className="card-body ">
                <div className='min_height'>
                  <LazyLoadImage src={item.photo} width="100%" height="100%" effect='blur' className='img_alignment' alt={item?.title} />
                </div>
                <div className="mt-3">
                  {item?.likes?.includes(user_id) ?
                    <i className="fas fa-heart heart_icon  text-danger"></i>
                    :
                    <i className="far heart_icon  fa-heart"></i>}
                  {item?.likes?.includes(user_id)
                    ?
                    <>
                      <Tooltip className='tooltip_custom' id="Dislike" place='top' />
                      <i className="far fa-thumbs-down thumbs_icon fa-2x pl-2 hovericons"
                        data-tooltip-id='Dislike'
                        data-tooltip-content="Dislike"
                        onClick={() => handleUnlike(item._id)}></i>
                    </>
                    :
                    <>
                      <i className="far fa-thumbs-up fa-2x pl-2 thumbs_icon hovericons"
                        data-tooltip-id='Like'
                        data-tooltip-content="Like"
                        onClick={() => handleLike(item._id)}></i>
                      <Tooltip className='tooltip_custom' id="Like" place='top' />
                    </>
                  }
                  <h5>{item?.likes?.length} {item?.likes?.length <= 1 ? "like" : "likes"} </h5>
                  <h5>{item?.title}</h5>
                  <p>{item?.body}</p>
                  {item?.comments?.map(record => (
                    <h5  className='mt-3' key={record._id}><b >{record?.postedBy?.name}</b> {record?.text}</h5>
                  ))}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleComment(item._id);
                  }}>
                    <div className="d-flex align-items-center mt-2">
                      <textarea
                        placeholder="Add a Comment"
                        className="form-control text_area"
                        value={commentTexts[item._id] || ""}
                        onChange={(e) => handleCommentChange(item._id, e.target.value)}
                        style={{
                          flex: 1,
                          resize: "none",
                          height: "40px"
                        }}
                      />
                      <button
                        type="submit"
                        className="btn btn-link p-0 ms-2"
                        disabled={!commentTexts[item._id]}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: commentTexts[item._id] ? "pointer" : "not-allowed",
                        }}
                      >
                        <i className="fas  fa-paper-plane" style={{ color: commentTexts[item._id] ? "#007bff" : "#ccc", 'fontSize': '20px' }}></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              {show === `${item._id}` &&
                <UpdateModal key={item._id} show={show} handleClose={() => setShow(false)} posts={item} token={token} />
              }
            </div>

          ))}
    </div>

  );
}
