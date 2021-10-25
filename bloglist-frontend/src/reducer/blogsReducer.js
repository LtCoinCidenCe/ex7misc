const blogsReducer = (state = [], action) =>
{
  switch (action.type)
  {
    case 'NEW':
      return [...state, action.data].sort((a, b) => b.likes - a.likes);
    case 'INIT':
      return [...action.data].sort((a, b) => b.likes - a.likes);
    default:
      return state;
  }
};

export const createAction = (blog) =>
{
  return {
    type: 'NEW',
    data: blog
  }
}

export const initAction = (data) =>
{
  return {
    type: 'INIT',
    data: data
  }
}

export default blogsReducer;