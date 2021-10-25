import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { clearBlogForm, setAuthorAction, setTitleAction, setURLAction } from '../reducer/blogFormReducer';

const BlogForm = ({ createBlog }) =>
{
  const dispatch = useDispatch();
  const values = useSelector(state => state.blogform);

  const handler = (event) =>
  {
    event.preventDefault();
    createBlog(values);
    dispatch(clearBlogForm());
  };

  return (
    <div>
      <h3>create new blog</h3>
      <form onSubmit={handler}>
        <div>title: <input id="ttitle" type="text" name="title" value={values.title} onChange={event => dispatch(setTitleAction(event.target.value))} /></div>
        <div>author: <input id="tauthor" type="text" name="author" value={values.author} onChange={event => dispatch(setAuthorAction(event.target.value))} /></div>
        <div>url: <input id="turl" type="text" name="url" value={values.url} onChange={event => dispatch(setURLAction(event.target.value))} /></div>
        <div><input id="submitNewBlog" type="submit" value="create" /></div>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
};

export default BlogForm;
