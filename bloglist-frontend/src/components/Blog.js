import React, { useState } from 'react';

const Blog = ({ blog, handleLike, handleRemove, handleComment }) =>
{
  if (!blog)
    return null;
  else
  {
    const displayRemove = () => handleRemove === null ? { display: 'none' } : null;
    const commentsHelper = () =>
    {
      if (blog.comments.length === 0)
        return <div style={{ color: 'grey' }}>no comments</div>;
      else
      {
        const newArray = [];
        for (let index = 0; index < blog.comments.length; index++)
        {
          const comment = blog.comments[index];
          newArray.push({ index, comment });
        }
        return <ul>
          {newArray.map(cmt => <li key={cmt.index}>{cmt.comment}</li>)}
        </ul>;
      }
    };
    return (
      <div>
        <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
        <div className="blogLikes">likes {blog.likes}<button onClick={handleLike}>like</button></div>
        <div>added by {blog.user.name}</div>
        <div className="removeBlog" style={displayRemove()}><button onClick={handleRemove}>remove</button></div>
        <h3>comments</h3>
        <CommentForm handleComment={handleComment} />
        {commentsHelper()}
      </div>);
  }
};

const CommentForm = ({ handleComment }) =>
{
  const [comment, setComment] = useState('');
  const handleSubmit = (event) =>
  {
    event.preventDefault();
    handleComment(comment);
    setComment('');
  };

  return <form onSubmit={handleSubmit}>
    <input name='comment' value={comment} onChange={event => setComment(event.target.value)} />
    <button type='submit'>create comment</button>
  </form>;
};

export default Blog;
