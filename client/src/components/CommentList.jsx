function CommentList({ comments }) {
  return (
    <div>
      <h5>Comments</h5>
      {Object.keys(comments)
        .slice(0)
        .reverse()
        .map((c) => {
          let { id, status, content } = comments[c];
          if (status === "pending") {
            content = <i>Waiting for Moderation</i>;
          } else if (status === "rejected") {
            content = <i>Rejected</i>;
          } else {
            content = <p>{comments[c].content}</p>;
          }
          return <div key={id}>{content}</div>;
        })}
    </div>
  );
}

export default CommentList;
