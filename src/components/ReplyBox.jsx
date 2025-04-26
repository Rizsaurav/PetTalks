import { useRef, useState } from 'react'
import { supabase } from '../../client'
import { ImagePlus } from 'lucide-react'

const ReplyBox = ({ parentId, postId, refreshComments, onReplyPosted }) => {
  const [content, setContent] = useState('')
  const [gifUrl, setGifUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null) // ✅ Reference to the file input

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    if (!content.trim() && !gifUrl && !fileInputRef.current?.files[0]) {
      alert('🐾 Please write something or add an attachment!')
      return
    }
  
    setLoading(true)
  
    const userId = localStorage.getItem('pet_forum_user_id') || crypto.randomUUID()
    let imageUrl = null
  
    const file = fileInputRef.current?.files[0]
    if (file) {
      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}/${Date.now()}.${fileExt}`
  
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('profile-pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })
  
      if (uploadError) {
        console.error('❌ Upload error:', uploadError.message)
        alert('Failed to upload image. Please try again.')
        setLoading(false)
        return
      }
  
      // ✅ ONLY if upload succeeds, get public URL
      const { publicUrl } = supabase
        .storage
        .from('profile-pictures')
        .getPublicUrl(filePath)
  
      imageUrl = publicUrl
    }
  
    try {
      const { error } = await supabase.from('comments').insert([
        {
          content: content.trim(),
          post_id: postId,
          parent_id: parentId,
          user_id: userId,
          gif_url: gifUrl.trim() || null,
          image_url: imageUrl || null,
        }
      ])
  
      if (error) {
        console.error('❌ Insert error:', error.message)
        alert('Failed to post reply.')
      } else {
        setContent('')
        setGifUrl('')
        if (fileInputRef.current) fileInputRef.current.value = ''
        if (refreshComments) refreshComments()
        if (onReplyPosted) onReplyPosted()
      }
    } catch (err) {
      console.error('❌ Unexpected reply error:', err)
      alert('Unexpected error.')
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <form onSubmit={handleSubmit} className="reply-box">
      <textarea
        id="reply-content"
        name="reply-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reply... 🐾"
        rows={2}
        disabled={loading}
        required={!gifUrl}
      ></textarea>

      <div className="reply-actions">
        <label htmlFor="reply-image" className="upload-icon" title="Upload Image">
          <ImagePlus size={20} />
        </label>
        <input
          type="file"
          id="reply-image"
          name="reply-image"
          accept="image/*"
          ref={fileInputRef} // ✅ use ref, no value prop
          style={{ display: 'none' }}
          disabled={loading}
        />

        <input
          id="reply-gif-url"
          name="reply-gif-url"
          type="text"
          value={gifUrl}
          onChange={(e) => setGifUrl(e.target.value)}
          placeholder="Paste GIF URL"
          className="gif-url-input"
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Reply'}
        </button>
      </div>
    </form>
  )
}

export default ReplyBox
