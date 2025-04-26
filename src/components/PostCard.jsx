import { Link } from 'react-router-dom'
import { ArrowUpCircle, MessageCircle } from 'lucide-react'

const PostCard = ({ post }) => {
  return (
    <Link to={`/post/${post.id}`} className="post-card-link">
      <div className="post-card">
        {post.image_url && (
          <img src={post.image_url} alt="Post" className="post-image" />
        )}

        <div className="post-content">
          <h3 className="post-title">{post.title}</h3>

          <p className="post-meta">
            🕓 {new Date(post.created_at).toLocaleString()}
          </p>

          <div className="post-footer">
            <div className="vote-info">
              <ArrowUpCircle size={18} style={{ marginRight: '6px' }} />
              <span>{post.upvotes || 0} upvotes</span>
            </div>

            <div className="comment-info" style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
              <MessageCircle size={18} style={{ marginRight: '6px' }} />
              {post.comment_count > 0 ? (
                <span>{post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}</span>
              ) : (
                <span className="no-comments">💬 Be the first to bark!</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
