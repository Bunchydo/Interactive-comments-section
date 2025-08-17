import { useState } from "react";
import "./comment-container.css";
// Comment component handles both top-level comments and replies
function Comment({
  comment,
  level = 0,
  replyingTo,
  setReplyingTo,
  addReply,
  editingCommentId,
  setEditingCommentId,
  onUpdateComment,
  onDeleteComment,
}) {
  const [likeNumber, setLikeNumber] = useState(comment.score);
  const [userVote, setUserVote] = useState(null);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState("");

  const handleIncreaseLike = () => {
    if (userVote === "like") return;
    setLikeNumber((prev) => prev + 1);
    setUserVote("like");
  };

  const handleDecreaseLike = () => {
    if (userVote === "dislike") return;
    setLikeNumber((prev) => Math.max(prev - 1, 0));
    setUserVote("dislike");
  };

  const handleReplyClick = () => {
    if (editingCommentId) return;
    setReplyingTo(replyingTo === comment.id ? null : comment.id);
  };

  const handleEditClick = () => {
    setEditingCommentId(comment.id);
  };

  const handleUpdateClick = () => {
    if (editedContent.trim()) {
      onUpdateComment(comment.id, editedContent);
      setEditingCommentId(null);
    }
  };

  const handleSendReply = () => {
    if (replyContent.trim()) {
      addReply(comment.id, replyContent);
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const isLiked = userVote === "like";
  const isDisliked = userVote === "dislike";
  const isReplying = replyingTo === comment.id;
  const isEditing = editingCommentId === comment.id;
  const isCurrentUser = comment.author === "You";

  return (
    <div
      className="comment-wrapper"
      style={{ marginLeft: level > 0 ? "30px" : "0" }}
    >
      <div className="comment-box">
        <div className="holding-div-mobile">
          <div className="likes-section">
            <img
              className={`plus ${isLiked ? "disabled" : ""}`}
              src="../public/images/icon-plus.svg"
              alt="plus"
              onClick={handleIncreaseLike}
            />
            <div className="like-number">{likeNumber}</div>
            <img
              className={`minus ${isDisliked ? "disabled" : ""}`}
              src="../public/images/icon-minus.svg"
              alt="minus"
              onClick={handleDecreaseLike}
            />
          </div>
          <div className="profile-info-right profile-info-right-mobile">
              {isCurrentUser && !isEditing ? (
                <>
                  <div
                    className="delete-button"
                    onClick={() => onDeleteComment(comment.id)}
                  >
                    <img src="../public/images/icon-delete.svg" alt="delete" />
                    Delete
                  </div>
                  <div className="edit-button" onClick={handleEditClick}>
                    <img src="../public/images/icon-edit.svg" alt="edit" />
                    Edit
                  </div>
                </>
              ) : isCurrentUser && isEditing ? null : (
                <div onClick={handleReplyClick}>
                  <img src="../public/images/icon-reply.svg" alt="reply" />
                  Reply
                </div>
              )}
            </div>
        </div>
        <div className="comments-section">
          <div className="profile-info">
            <div className="profile-info-left">
              <img
                className="profile-picture"
                src="../public/images/avatars/image-amyrobson.png"
                alt="profile"
              />
              <div className="profile-name">{comment.author}</div>
              {isCurrentUser && <span className="you-tag">you</span>}
              <div className="data-released">{comment.date}</div>
            </div>
            <div className="profile-info-right profile-info-right-desktop  ">
              {isCurrentUser && !isEditing ? (
                <>
                  <div
                    className="delete-button"
                    onClick={() => onDeleteComment(comment.id)}
                  >
                    <img src="../public/images/icon-delete.svg" alt="delete" />
                    Delete
                  </div>
                  <div className="edit-button" onClick={handleEditClick}>
                    <img src="../public/images/icon-edit.svg" alt="edit" />
                    Edit
                  </div>
                </>
              ) : isCurrentUser && isEditing ? null : (
                <div className="reply-desktop" onClick={handleReplyClick}>
                  <img src="../public/images/icon-reply.svg" alt="reply" />
                  Reply
                </div>
              )}
            </div>
          </div>
          <br />
          {isEditing ? (
            <>
              <textarea
                className="comment-textarea"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <button
                className="send-button update-button"
                onClick={handleUpdateClick}
              >
                UPDATE
              </button>
            </>
          ) : (
            <div className="comment-data">{comment.content}</div>
          )}
        </div>
      </div>

      {isReplying && (
        <div className="comment-form-container reply-form">
          <img
            src="../public/images/avatars/image-amyrobson.png"
            className="profile-picture"
            alt="User"
          />
          <textarea
            className="comment-textarea"
            placeholder="Add a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button className="send-button" onClick={handleSendReply}>
            REPLY
          </button>
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              level={level + 1}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              addReply={addReply}
              editingCommentId={editingCommentId}
              setEditingCommentId={setEditingCommentId}
              onUpdateComment={onUpdateComment}
              onDeleteComment={onDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// CommentContainer holds the state and renders all top-level comments
export default function CommentContainer() {
  const initialComments = [
    {
      id: "1",
      author: "amyrobson",
      content:
        "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
      date: "2025-08-12",
      score: 0,
      replies: [],
    },
    {
      id: "2",
      author: "maxblagun",
      content:
        "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
      date: "2025-08-12",
      score: 12,
      replies: [
        {
          id: "1-1",
          author: "ramsesmiron",
          content:
            "@maxblagun If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
          date: "1 week ago",
          score: 5,
          replies: [],
        },
        {
          id: "1-1-1",
          author: "You",
          content:
            "@ramsesmiron I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/ framework. But the fundamentals are what stay constant.",
          date: "2 days ago",
          score: 3,
          replies: [],
        },
      ],
    },
  ];

  const [comments, setComments] = useState(initialComments);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleAddComment = () => {
    if (newCommentContent.trim()) {
      const newComment = {
        id: Date.now().toString(),
        author: "You",
        content: newCommentContent,
        date: new Date().toISOString().slice(0, 10),
        score: 0,
        replies: [],
      };
      setComments((prevComments) => [...prevComments, newComment]);
      setNewCommentContent("");
    }
  };

  const addReply = (parentId, replyContent) => {
    const newReply = {
      id: Date.now().toString(),
      author: "You",
      content: replyContent,
      date: new Date().toISOString().slice(0, 10),
      score: 0,
      replies: [],
    };

    const addReplyRecursive = (commentsList) => {
      return commentsList.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
        return {
          ...comment,
          replies: addReplyRecursive(comment.replies),
        };
      });
    };

    setComments((prevComments) => addReplyRecursive(prevComments));
  };

  const findAndUpdateComment = (commentsArray, idToFind, newContent) => {
    return commentsArray.map((comment) => {
      if (comment.id === idToFind) {
        return { ...comment, content: newContent };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: findAndUpdateComment(comment.replies, idToFind, newContent),
        };
      }
      return comment;
    });
  };

  const findAndDeleteComment = (commentsArray, idToFind) => {
    return commentsArray.filter((comment) => {
      if (comment.id === idToFind) {
        return false;
      }
      if (comment.replies && comment.replies.length > 0) {
        comment.replies = findAndDeleteComment(comment.replies, idToFind);
      }
      return true;
    });
  };

  const handleUpdateComment = (id, newContent) => {
    setComments((prevComments) =>
      findAndUpdateComment(prevComments, id, newContent)
    );
  };

  const handleDeleteComment = (id) => {
    setCommentToDelete(id);
  };

  const confirmDelete = () => {
    setComments((prevComments) =>
      findAndDeleteComment(prevComments, commentToDelete)
    );
    setCommentToDelete(null);
  };

  const cancelDelete = () => {
    setCommentToDelete(null);
  };

  return (
    <>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          addReply={addReply}
          editingCommentId={editingCommentId}
          setEditingCommentId={setEditingCommentId}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
        />
      ))}

      <div className="comment-form-container">
        <img
          src="../public/images/avatars/image-amyrobson.png"
          className="profile-picture"
          alt="User"
        />
        <textarea
          className="comment-textarea"
          placeholder="Add a comment..."
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
        />
        <button className="send-button" onClick={handleAddComment}>
          SEND
        </button>
      </div>

      {commentToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete comment</h2>
            <p>
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone.
            </p>
            <div className="modal-buttons">
              <button className="modal-button cancel" onClick={cancelDelete}>
                NO, CANCEL
              </button>
              <button className="modal-button delete" onClick={confirmDelete}>
                YES, DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
