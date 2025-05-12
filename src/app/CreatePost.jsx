import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../client'
import PostForm from '../components/PostForm'
import LoadingSpinner from '../components/LoadingSpinner'

const CreatePost = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleCreate = async (formData) => {
    setLoading(true)

    try {
      const userId = getOrCreateUserId()
      let finalImageUrl = null

      if (formData.imageFile) {
        const fileExt = formData.imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `${userId}/${fileName}`

        const { error: uploadError } = await supabase
          .storage
          .from('posts')  // ✅ posts bucket
          .upload(filePath, formData.imageFile, {
            cacheControl: '3600',
            upsert: true,
          })

        if (uploadError) {
          console.error('❌ Error uploading image:', uploadError.message)
          alert('Failed to upload image. Try again.')
          setLoading(false)
          return
        }

        const { data: { publicUrl } } = supabase
          .storage
          .from('posts')
          .getPublicUrl(filePath)

        finalImageUrl = publicUrl
      } else if (formData.imageUrl.trim() !== '') {
        finalImageUrl = formData.imageUrl.trim()
      }

      // ✅ Insert post with correct image_url
      const { error: insertError } = await supabase
        .from('posts')
        .insert([{
          title: formData.title,
          content: formData.content,
          image_url: finalImageUrl,
          flag: formData.flag,
          pet_type: formData.petType,
          secret_key: formData.secretKey,
          user_id: userId,
        }])

      if (insertError) {
        console.error('❌ Error creating post:', insertError.message)
        alert('Failed to create post. Please try again.')
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
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

  return (
    <div className="create-post-page">
      {loading ? <LoadingSpinner /> : <PostForm onSubmit={handleCreate} />}
    </div>
  )
}

export default CreatePost
