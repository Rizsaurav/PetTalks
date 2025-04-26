import { useState } from 'react'
import { MessageSquareReply } from 'lucide-react'
import ReplyBox from './ReplyBox'

const Comment = ({ comment, refreshComments, allReplies }) => {
  const { content, created_at, user_id, image_url, gif_url, id, post_id } = comment

  const [showReplyBox, setShowReplyBox] = useState(false)

  const formatTime = (timestamp) => {
    if (!timestamp) return 'just now'
    const date = new Date(timestamp)
    return isNaN(date) ? 'just now' : date.toLocaleString()
  }

  const displayName = user_id ? user_id.slice(0, 8) : 'anonymous'

  // Find replies for this comment
  const replies = allReplies?.filter(reply => reply.parent_id === id) || []

  return (
    <div className="comment-card">
      <div className="comment-content-wrapper">
        {/* Main comment text */}
        <p className="comment-content">{content}</p>

        {/* If image is attached */}
        {image_url && (
          <img
            src={image_url}
            alt="Attached"
            className="comment-image"
            style={{ marginTop: '10px', borderRadius: '8px', maxWidth: '100%' }}
          />
        )}

        {/* If gif is attached */}
        {gif_url && (
          <img
            src={gif_url}
            alt="GIF"
            className="comment-gif"
            style={{ marginTop: '10px', borderRadius: '8px', maxWidth: '100%' }}
          />
        )}
      </div>

      {/* Meta info and reply button */}
      <div className="comment-meta">
        <small>👤 {displayName} · 🕓 {formatTime(created_at)}</small>

        <button className="reply-btn" onClick={() => setShowReplyBox(!showReplyBox)}>
          <MessageSquareReply size={16} style={{ marginRight: '4px' }} />
          Reply
        </button>
      </div>

      {/* Reply input box */}
      {showReplyBox && (
        <div className="reply-box-wrapper">
          <ReplyBox
            parentId={id}
            postId={post_id}
            refreshComments={refreshComments}
            onReplyPosted={() => setShowReplyBox(false)} // Close after sending
          />
        </div>
      )}

      {/* Render Replies recursively */}
      {replies.length > 0 && (
        <div className="replies-wrapper">
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              refreshComments={refreshComments}
              allReplies={allReplies}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Comment
