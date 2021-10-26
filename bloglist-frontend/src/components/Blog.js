import React from 'react';

const Blog = ({ blog, handleLike, handleRemove }) =>
{
  if (!blog)
    return null;
  else
  {
    const displayRemove = () => handleRemove === null ? { display: 'none' } : null;
    return (
      <div>
        <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
        <div className="blogLikes">likes {blog.likes}<button onClick={handleLike}>like</button></div>
        <div>added by {blog.author}</div>
        <div className="removeBlog" style={displayRemove()}><button onClick={handleRemove}>remove</button></div>
      </div>);
  }
  // const [showDetail, setShowDetail] = useState(false);
  //
  // if (showDetail === false)
  //   return (
  //     <div style={blogStyle}>
  //       {blog.title} {blog.author} <button className="blogViewButton" onClick={() => setShowDetail(!showDetail)}>view</button>
  //     </div>
  //   );
  // else
  //   return (
  //     <div style={blogStyle}>
  //       <div>{blog.title}<button onClick={() => setShowDetail(!showDetail)}>hide</button></div>
  //       <div>{blog.url}</div>
  //       <div className="blogLikes">likes {blog.likes}<button onClick={handleLike}>like</button></div>
  //       <div>{blog.author}</div>
  //       <div className="removeBlog" style={displayRemove()}><button onClick={handleRemove}>remove</button></div>
  //     </div>
  //   );
};

export default Blog;
