import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../client'
import PostForm from '../components/PostForm'
import LoadingSpinner from '../components/LoadingSpinner'
import { PawPrint } from 'lucide-react'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
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

  const handleUpdate = async (formData) => {
    const localUserId = localStorage.getItem('pet_forum_user_id')
    const isOwner =
      post.user_id === localUserId || formData.secretKey === post.secret_key

    if (!isOwner) {
      alert('🚫 Only the original paw-thor can edit this story! 🐾✨')
      return
    }

    const { error } = await supabase
      .from('posts')
      .update({
        title: formData.title,
        content: formData.content,
        image_url: formData.imageUrl,
        flag: formData.flag,
        pet_type: formData.petType,
        secret_key: formData.secretKey,
        last_updated: new Date()
      })
      .eq('id', id)

    if (error) {
      console.error('❌ Update failed:', error.message)
      alert(`Oh no! Couldn’t save: ${error.message} 😔`)
    } else {
      alert('Your paw-some story has been updated! 🎉')
      navigate(`/post/${id}`)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!post) return <p>🐾 Story not found. Maybe it ran off to chase squirrels?</p>

  return (
    <div className="edit-post-page">
      <h1 className="edit-title">
        <PawPrint size={28} style={{ marginRight: '10px' }} />
        Let's polish your paw story! 📝
      </h1>

      <PostForm
        onSubmit={handleUpdate}
        initialData={{
          title: post.title,
          content: post.content,
          imageUrl: post.image_url,
          flag: post.flag,
          petType: post.pet_type,
          secretKey: post.secret_key
        }}
      />
    </div>
  )
}

export default EditPost
