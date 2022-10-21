import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

function PostList({ posts, commentInputHandler }) {
  return (
    <div>
      <h1>Post List</h1>
      {Object.keys(posts)
        .slice(0)
        .reverse()
        .map((p) => {
          let commentList;

          if (!posts[p].comments.length) {
            commentList = <p>Comment not found</p>;
          } else {
            commentList = <CommentList comments={posts[p].comments} />;
          }
          return (
            <div key={posts[p].id}>
              <p>{posts[p].title}</p>
              {commentList}
              <CommentCreate onKeyUp={commentInputHandler} postId={posts[p].id} />
            </div>
          );
        })}
    </div>
  );
}

export default PostList;
