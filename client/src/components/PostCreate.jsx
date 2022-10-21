function PostCreate({ onKeyUp }) {
  return (
    <div>
      <h1>Create Post</h1>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" onKeyUp={onKeyUp} />
    </div>
  );
}

export default PostCreate;
