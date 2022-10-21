function CommentCreate({ onKeyUp, postId }) {
  return (
    <div>
      <h5>Add Comment</h5>
      <input type="text" onKeyUp={(event) => onKeyUp(event, postId)} />
    </div>
  );
}

export default CommentCreate;
