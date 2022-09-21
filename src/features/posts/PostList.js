import React, { useState } from 'react'
import {
  useGetPostsQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from '../api/apiSlice'


function PostsList() {
  const [addNewPost, response] = useAddNewPostMutation()
  const [deletePost] = useDeletePostMutation()
  const [inputField, setInputField] = useState({
    id: '',
    name: '',
    address: '',
  })
  const inputsHandler = (e) => {
    setInputField((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()
  const setPostData = (data) => {
    setInputField({
      id: data.id,
      name: data.name,
      address: data.address,
    })
  }
  const onEditData = () => {
    updatePost({
      id: inputField.id,
      name: inputField.name,
      address: inputField.address,
    })
    setInputField(() => ({
      id: '',
      name: '',
      address: '',
    }))
  }
  const onSubmit = (e) => {
    e.preventDefault()
    const { name, address } = e.target.elements
    setInputField((inputField) => ({
      ...inputField,
      [e.target.name]: e.target.value,
    }))
    let formData = {
      name: name.value,
      address: address.value,
    }
    addNewPost(formData)
      .unwrap()
      .then(() => {
        setInputField(() => ({
          id: '',
          name: '',
          address: '',
        }))
      })
      .then((error) => {
        console.log(error)
      })
  }
  const {
    data: posts,
    isLoading: isGetLoading,
    isSuccess: isGetSuccess,
    isError: isGetError,
    error: getError,
  } = useGetPostsQuery({ refetchOnMountOrArgChange: true })
  let postContent
  if (isGetLoading) {
    postContent = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  } else if (isGetSuccess) {
    postContent = posts.map((item) => {
      return (
        <div className="col-lg-12 mb-3" key={item.id}>
          <div className="card alert alert-secondary">
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <p className="card-text">{item.address}</p>
              <button
                onClick={() => deletePost(item.id)}
                className="btn btn-outline-danger me-2"
              >
                Remove
              </button>
              <button
                onClick={() => setPostData(item)}
                className="btn btn-outline-primary"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )
    })
  } else if (isGetError) {
    postContent = (
      <div className="alert alert-danger" role="alert">
        {getError}
      </div>
    )
  }
  return (
    <div className="row">
      <div className="col-lg-6 offset-md-*">
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <strong>Enter Name</strong>
            </label>
            <input
              value={inputField.name}
              type="text"
              className="form-control"
              name="name"
              id="name"
              onChange={inputsHandler}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <strong>Enter Address</strong>
            </label>
            <textarea
              value={inputField.address}
              className="form-control"
              rows="3"
              name="address"
              id="address"
              onChange={inputsHandler}
            ></textarea>
          </div>
          <button className="btn btn-danger me-2" type="submit">
            Submit
          </button>
          <button
            onClick={onEditData}
            className="btn btn-primary"
            type="button"
          >
            Update
          </button>
        </form>
      </div>
      <div className="col-lg-6">
        <div className="row">{postContent}</div>
      </div>
    </div>
  )
}
export default PostsList;