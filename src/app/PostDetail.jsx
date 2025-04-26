import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../client'
import LoadingSpinner from '../components/LoadingSpinner'
import Comment from '../components/Comment'
import { PawPrint, ThumbsUp } from 'lucide-react'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ Error fetching post:', error.message)
      } else {
        setPost(data)
      }
    } catch (err) {
      console.error('❌ Unexpected error fetching post:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('❌ Error fetching comments:', error.message)
      } else {
        setComments(data)
      }
    } catch (err) {
      console.error('❌ Unexpected error fetching comments:', err)
    }
  }

  const handleUpvote = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ upvotes: post.upvotes + 1 })
        .eq('id', id)

      if (error) {
        console.error('❌ Error upvoting:', error.message)
      } else {
        fetchPost()
      }
    } catch (err) {
      console.error('❌ Unexpected error upvoting:', err)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()

    try {
      const userId = getOrCreateUserId()

      const { error } = await supabase.from('comments').insert([
        {
          content: comment,
          post_id: id,
          user_id: userId
        }
      ])

      if (error) {
        console.error('❌ Error posting comment:', error.message)
      } else {
        setComment('')
        fetchComments()
      }
    } catch (err) {
      console.error('❌ Unexpected error posting comment:', err)
    }
  }

  const getOrCreateUserId = () => {
    let userId = localStorage.getItem('pet_forum_user_id')
    if (!userId) {
      userId = crypto.randomUUID()
      localStorage.setItem('pet_forum_user_id', userId)
    }
    return userId
  }

  const renderComments = (comments) => {
    const topLevelComments = comments.filter(c => !c.parent_id)

    return topLevelComments.map((c) => (
      <Comment
        key={c.id}
        comment={c}
        refreshComments={fetchComments}
        allReplies={comments} // pass full list for threading
      />
    ))
  }

  if (loading) return <LoadingSpinner />
  if (!post) return <p>Post not found.</p>

  return (
    <div className="post-detail-wrapper">
      <Link to="/" className="back-link">← Back to Home</Link>

      <div className="post-detail-card">
        <h1 className="post-detail-title">
          <PawPrint size={28} style={{ marginRight: '8px' }} />
          {post.title}
        </h1>

        <p className="post-meta">🕓 {new Date(post.created_at).toLocaleString()}</p>
        <p className="post-meta">
          <ThumbsUp size={18} style={{ marginRight: '5px' }} />
          {post.upvotes || 0} upvotes
        </p>

        {post.image_url && (
          <img src={post.image_url} alt="Post" className="post-detail-image" />
        )}

        <p className="post-detail-content">{post.content}</p>

        <div className="post-buttons">
          <button onClick={handleUpvote} className="upvote-btn">
            <ThumbsUp size={20} style={{ marginRight: '6px' }} />
            Upvote
          </button>

          <Link to={`/edit/${post.id}`}>
            <button className="edit-btn">✏️ Edit Post</button>
          </Link>
        </div>
      </div>

      {/* Comments */}
      <div className="comments-section">
        <h3>💬 Comments</h3>

        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first! 🎉</p>
        ) : (
          renderComments(comments)  // Renders full thread
        )}

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            placeholder="Leave a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="comment-textarea"
          ></textarea>
          <button type="submit" className="comment-submit-btn">
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostDetail
