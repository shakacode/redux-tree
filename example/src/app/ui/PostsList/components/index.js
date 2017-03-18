import React from 'react';

import './index.css';

const PostsList = ({
  posts,
  isManaging,
  toggleMode,
  deletePost,
}) => (
  <div className="wrapper">
    <div className="toggler">
      <button className="md green" onClick={toggleMode}>
        {isManaging ? 'View posts' : 'Manage posts'}
      </button>
    </div>
    {posts.map(({ post, isProcessing }) => (
      <div key={post.id} className="post">
        {post.title}
        {
          isManaging &&
          <div className="controls">
            {
              isProcessing
              ?
                <button className="sm red processing">
                  Delete
                  <span className="dots">...</span>
                </button>
              :
                <button
                  className="sm red"
                  onClick={() => deletePost(post.id)}
                >
                  Delete
                </button>
            }
          </div>
        }
      </div>
    ))}
  </div>
);

export default PostsList;
