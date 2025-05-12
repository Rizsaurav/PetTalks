// src/app/PostDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../client'
import LoadingSpinner from '../components/LoadingSpinner'
import Comment from '../components/Comment'
import { PawPrint, ThumbsUp, Trash2 } from 'lucide-react'

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

      if (error) console.error('❌ Error fetching post:', error.message)
      else setPost(data)
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

      if (error) console.error('❌ Error fetching comments:', error.message)
      else setComments(data || [])
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post? 🐾 This cannot be undone!')
    if (!confirmDelete) return

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Error deleting post:', error.message)
        alert('Failed to delete post. Please try again.')
      } else {
        alert('Post deleted successfully! 🗑️')
        navigate('/')
      }
    } catch (err) {
      console.error('❌ Unexpected error deleting post:', err)
      alert('Unexpected error deleting post.')
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
          user_id: userId,
        }
      ])

      if (error) {
        console.error('❌ Error posting comment:', error.message)
        alert('Failed to post comment.')
      } else {
        setComment('')
        fetchComments()
      }
    } catch (err) {
      console.error('❌ Unexpected error posting comment:', err)
      alert('Unexpected error posting comment.')
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

  const renderCommentsThread = () => {
    const topLevel = comments.filter(c => !c.parent_id)
    return topLevel.map(c => (
      <Comment
        key={c.id}
        comment={c}
        refreshComments={fetchComments}
        allReplies={comments}
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
          <PawPrint size={28} className="inline-icon" />
          {post.title}
        </h1>

        <p className="post-meta">🕓 {new Date(post.created_at).toLocaleString()}</p>
        <p className="post-meta">
          <ThumbsUp size={18} className="inline-icon" /> {post.upvotes || 0} upvotes
        </p>

        {post.image_url && (
          <img src={post.image_url} alt="Post" className="post-detail-image" />
        )}

        <p className="post-detail-content">{post.content}</p>

        <div className="post-buttons">
          <button onClick={handleUpvote} className="upvote-btn">
            <ThumbsUp size={20} className="inline-icon" />
            Upvote
          </button>

          <Link to={`/edit/${post.id}`}>
            <button className="edit-btn">✏️ Edit Post</button>
          </Link>

          <button onClick={handleDelete} className="delete-btn">
            <Trash2 size={20} className="inline-icon" />
            Delete
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>💬 Comments</h3>

        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to bark! 🐶</p>
        ) : (
          renderCommentsThread()
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
