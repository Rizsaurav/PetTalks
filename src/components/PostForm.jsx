import { useState, useEffect } from 'react'

const PostForm = ({ onSubmit, initialData = {} }) => {
  const [formState, setFormState] = useState({
    title: '',
    content: '',
    imageFile: null,
    imageUrl: '',
    flag: 'Question',
    petType: 'Dog',
    secretKey: '',
  })

  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (initialData) {
      setFormState((prev) => ({
        ...prev,
        title: initialData.title || '',
        content: initialData.content || '',
        imageFile: null,  // never prefill file
        imageUrl: initialData.imageUrl || '',
        flag: initialData.flag || 'Question',
        petType: initialData.petType || 'Dog',
        secretKey: initialData.secretKey || '',
      }))
      if (initialData.imageUrl) {
        setPreviewUrl(initialData.imageUrl)
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('❌ Please upload a valid image file!')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ Image too large! Max 5MB allowed.')
        return
      }
      setFormState((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: '',
      }))
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Decide final image source:
    const finalImageUrl = formState.imageUrl || null
    const finalImageFile = formState.imageFile || null

    onSubmit({
      title: formState.title,
      content: formState.content,
      flag: formState.flag,
      petType: formState.petType,
      secretKey: formState.secretKey,
      imageUrl: finalImageUrl,
      imageFile: finalImageFile
    })
  }

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2>{initialData?.title ? 'Edit Post ✏️' : 'Create a New Post 🐾'}</h2>

      <input
        type="text"
        name="title"
        placeholder="Post Title"
        value={formState.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="content"
        placeholder="Write your post content..."
        value={formState.content}
        onChange={handleChange}
        rows="4"
        required
      ></textarea>

      <div className="form-group">
        <label>Upload an Image 📸:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div className="form-group">
        <label>Or Enter External Image URL:</label>
        <input
          type="text"
          name="imageUrl"
          placeholder="External Image URL"
          value={formState.imageUrl}
          onChange={handleChange}
        />
      </div>

      {previewUrl && (
        <div style={{ marginTop: '10px' }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: '180px', borderRadius: '10px', objectFit: 'cover' }}
          />
        </div>
      )}

      <div className="form-group">
        <label>Post Type:</label>
        <select
          name="flag"
          value={formState.flag}
          onChange={handleChange}
        >
          <option value="Question">Question</option>
          <option value="Opinion">Opinion</option>
          <option value="Advice">Advice</option>
          <option value="Story">Story</option>
          <option value="Announcement">Announcement</option>
        </select>
      </div>

      <div className="form-group">
        <label>Pet Type:</label>
        <select
          name="petType"
          value={formState.petType}
          onChange={handleChange}
        >
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Reptile">Reptile</option>
          <option value="Fish">Fish</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <input
        type="password"
        name="secretKey"
        placeholder="Secret Key (optional)"
        value={formState.secretKey}
        onChange={handleChange}
      />

      <button type="submit" style={{ marginTop: '20px' }}>
        {initialData?.title ? 'Save Changes' : 'Create Post'}
      </button>
    </form>
  )
}

export default PostForm
