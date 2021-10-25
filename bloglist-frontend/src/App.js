import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { createAction, initAction } from './reducer/blogsReducer';
import { setNotificationAction } from './reducer/notificationReducer';
import { setTimerAction } from './reducer/timerReducer';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () =>
{
  const dispatch = useDispatch();
  const message = useSelector(state => state.notification);
  const mTime = useSelector(state => state.timer);
  const blogs = useSelector(state => state.blogs);

  // const [blogs, setBlogs] = useState([]); // blog.title url author likes user{}

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // user.username user.name user.token

  const blogCreator = useRef();

  useEffect(() =>
  {
    // 5.9 add sort
    blogService.getAll().then(downloadedblogs =>
      dispatch(initAction(downloadedblogs))
    );
  }, []);

  useEffect(() =>
  {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON)
    {
      const u = JSON.parse(loggedUserJSON);
      setUser(u);
      blogService.setToken(u.token);
    }
  }, []);

  const handleLogout = () =>
  {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem('loggedUser');
  };

  const handleLogin = async (event) =>
  {
    event.preventDefault();

    try
    {
      console.log('logging in with: ', username, password);
      const kirjaudu = await loginService.login({ username, password });
      setUser(kirjaudu);
      blogService.setToken(kirjaudu.token);
      setUsername('');
      setPassword('');
      // preserve token
      window.localStorage.setItem('loggedUser', JSON.stringify(kirjaudu));
    }
    catch (exception)
    {
      clearTimeout(mTime);
      dispatch(setNotificationAction(`e:${exception.response.data.error}`));
      setTimerAction((setTimeout(() => { dispatch(setNotificationAction('')); }, 5000)));
    }
  };

  const createBlog = async (blog) =>
  {
    try
    {
      let response = await blogService.create(blog);
      const userInformation = { username: user.username, name: user.name };
      // manually fix something
      response.user = userInformation;

      dispatch(createAction(response)); // 5.9 add sort
      blogCreator.current.toggleVisibility();
      clearTimeout(mTime);
      dispatch(setNotificationAction(`s:a new blog "${response.title}" is added`));
      dispatch(setTimerAction(setTimeout(() => { dispatch(setNotificationAction('')); }, 5000)));
    }
    catch (exception)
    {
      console.log('exception', exception.response);
      clearTimeout(mTime);
      dispatch(setNotificationAction(`e:${exception.response.data.error}`));
      dispatch(setTimerAction(setTimeout(() => { dispatch(setNotificationAction('')); }, 5000)));
    }
  };

  const plusLike = async (id) =>
  {
    // changed backend PUT route to apply 'populate'
    const oldBlog = blogs.find(blog => blog.id === id);
    let newblog = { ...oldBlog };
    delete newblog.id;
    newblog.user = oldBlog.user.id;
    newblog.likes += 1;

    try
    {
      // const data = await blogService.update(oldBlog.id, newblog);

      // setBlogs(blogs.map(blog => blog.id !== oldBlog.id ? blog : data)
      //   .sort((a, b) => b.likes - a.likes));
    }
    catch (exception)
    {
      console.log(exception);
      clearTimeout(mTime);
      dispatch(setNotificationAction(`e:${exception.response}`));
      dispatch(setTimerAction(setTimeout(() => { dispatch(setNotificationAction('')); }, 5000)));
    }
  };

  const removeBlog = async (id) =>
  {
    const blog = blogs.find(blog => blog.id === id);
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`))
    {
      try
      {
        await blogService.remove(id);
        // setBlogs(blogs.filter(blog => blog.id !== id)); // deleting does not require sorting

        clearTimeout(mTime);
        dispatch(setNotificationAction(`s:Removed ${blog.title}`));
        dispatch(setTimerAction(setTimeout(() => { dispatch(setNotificationAction('')); }, 5000)));
      }
      catch (exception)
      {
        console.log(exception);
        clearTimeout(mTime);
        dispatch(setNotificationAction('e:error'));
        dispatch(setTimerAction(setTimeout(() => { dispatch(setNotificationAction('')); }, 5000)));
      }
    }
  };

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogCreator}>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  );

  if (user === null)
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>username
            <input type="text"
              id="loginusername"
              value={username}
              name="Username"
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>password
            <input type="text"
              id="loginpassword"
              value={password}
              name="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button id="loginButton" type="submit">login</button>
        </form>
      </div>
    );
  else
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={message} />
        <p><span>{user.name} logged in</span><button onClick={handleLogout}>logout</button></p>

        {blogForm()}
        {blogs.map(blog =>
          <Blog key={blog.id}
            blog={blog}
            handleLike={() => plusLike(blog.id)}
            handleRemove={blog.user.username === user.username ? () => removeBlog(blog.id) : null}
          />
        )}
      </div>
    );
};

export default App;
