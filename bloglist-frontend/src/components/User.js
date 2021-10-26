import React from 'react';
import { useHistory } from 'react-router-dom';

const User = ({ user }) =>
{
  const history = useHistory();
  if (user)
  {
    const html = <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
      </ul>
      <button type="button" onClick={() => history.push('/users')}>back</button>
    </div>;
    return html;
  }
  else
    return null;
};

export default User;
