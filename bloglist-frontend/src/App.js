import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch, Link } from 'react-router-dom';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import User from './components/User';
import { createAction, deleteAction, initblogsAction, likeAction } from './reducer/blogsReducer';
import { logininfoInit, setPasswordAction, setUsernameAction } from './reducer/logininfoReducer';
import { setNotificationAction } from './reducer/notificationReducer';
import { setTimerAction } from './reducer/timerReducer';
import { clearUserAction, setUserAction } from './reducer/userReducer';
import blogService from './services/blogs';
import loginService from './services/login';
import userService from './services/users';

const App = () =>
{
  const dispatch = useDispatch();
  const message = useSelector(state => state.notification);
  const mTime = useSelector(state => state.timer);
  const blogs = useSelector(state => state.blogs);
  const { username, password } = useSelector(state => state.logininfo);
  const user = useSelector(state => state.user);
  // blog.title url author likes user{}
  // user.username user.name user.token

  const [allUsers, setallUsers] = useState([]);
  const userMatch = useRouteMatch('/users/:id');
  const userPage = userMatch ? allUsers.find(jsk => jsk.id === userMatch.params.id) : null;

  const blogCreator = useRef();

  useEffect(() =>
  {
    // 5.9 add sort
    blogService.getAll().then(downloadedblogs =>
      dispatch(initblogsAction(downloadedblogs))
    );
    userService.getAll().then(users => setallUsers(users));
  }, []);

  useEffect(() =>
  {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON)
    {
      const u = JSON.parse(loggedUserJSON);
      dispatch(setUserAction(u));
      blogService.setToken(u.token);
    }
  }, []);

  const handleLogout = () =>
  {
    dispatch(clearUserAction());
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
      dispatch(setUserAction(kirjaudu));
      blogService.setToken(kirjaudu.token);
      dispatch(logininfoInit());
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
      const data = await blogService.update(oldBlog.id, newblog);
      dispatch(likeAction(data));
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
        dispatch(deleteAction(id)); // deleting does not require sorting

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

  const etusivu = () => (
    <div>
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

  const kayttajiensivu = () =>
  {
    return (
      <div>
        <h2>Users</h2>
        <table>
          <tbody>
            <tr><th> </th><th>blogs created</th></tr>
            {allUsers.map(kayttaja => <tr key={kayttaja.username}>
              <td><Link to={`/users/${kayttaja.id}`}>{kayttaja.name}</Link></td><td>{kayttaja.blogs.length}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    );
  };

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
              onChange={(event) => dispatch(setUsernameAction(event.target.value))}
            />
          </div>
          <div>password
            <input type="text"
              id="loginpassword"
              value={password}
              name="Password"
              onChange={(event) => dispatch(setPasswordAction(event.target.value))}
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

        <Switch>
          <Route exact path="/">
            {etusivu()}
          </Route>
          <Route path="/users/:id">
            <User user={userPage} />
          </Route>
          <Route path="/users">
            {kayttajiensivu()}
          </Route>
        </Switch>
      </div>
    );
};

export default App;
