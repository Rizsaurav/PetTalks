import { useState } from 'react'
import { supabase } from '../../client'

const ProfileEdit = () => {
  const [petName, setPetName] = useState('')
  const [bio, setBio] = useState('')
  const [favoriteSnack, setFavoriteSnack] = useState('')
  const [silliestHabit, setSilliestHabit] = useState('')
  const [dreamAdventure, setDreamAdventure] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    const userId = getOrCreateUserId()
    let imageUrl = null

    try {
      // ✅ Upload image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const filePath = `${userId}/${Date.now()}.${fileExt}`

        console.log('Uploading to bucket: profile-pictures, filePath:', filePath)

        const { data, error: uploadError } = await supabase
          .storage
          .from('profile-pictures')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: true,
          })

        if (uploadError) {
          console.error('❌ Error uploading image:', uploadError)
          alert('Failed to upload image. Check your bucket permissions.')
          setLoading(false)
          return
        }

        // ✅ After upload, get public URL
        const { data: publicUrlData } = supabase
          .storage
          .from('profile-pictures')
          .getPublicUrl(filePath)

        imageUrl = publicUrlData.publicUrl
        console.log('✅ Uploaded Image URL:', imageUrl)
      }

      // ✅ Upsert (insert/update) profile info
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          pet_name: petName,
          bio,
          favorite_snack: favoriteSnack,
          silliest_habit: silliestHabit,
          dream_adventure: dreamAdventure,
          image_url: imageUrl
        })

      if (updateError) {
        console.error('❌ Error saving profile:', updateError.message)
        alert('Failed to save profile.')
      } else {
        alert('✅ Profile updated successfully!')
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err)
      alert('Unexpected error saving profile.')
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
    <div className="profile-edit-page">
      <h2>Edit Your Pet Profile 🐾</h2>

      <form onSubmit={handleSave} className="profile-edit-form">
        <div className="form-group">
          <label>Pet Name:</label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Enter your pet's name"
            required
          />
        </div>

        <div className="form-group">
          <label>About (Bio):</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us something about your pet..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Favorite Snack 🍖:</label>
          <input
            type="text"
            value={favoriteSnack}
            onChange={(e) => setFavoriteSnack(e.target.value)}
            placeholder="Cheese, carrots, socks...?"
          />
        </div>

        <div className="form-group">
          <label>Silliest Habit 🐒:</label>
          <input
            type="text"
            value={silliestHabit}
            onChange={(e) => setSilliestHabit(e.target.value)}
            placeholder="Spins in circles before bed? Steals shoes?"
          />
        </div>

        <div className="form-group">
          <label>Dream Adventure ✈️:</label>
          <input
            type="text"
            value={dreamAdventure}
            onChange={(e) => setDreamAdventure(e.target.value)}
            placeholder="Trip to Paris? Backyard squirrel chase?"
          />
        </div>

        <div className="form-group">
          <label>Upload Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Profile Preview"
              style={{ width: '120px', height: '120px', borderRadius: '50%', marginTop: '10px' }}
            />
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}

export default ProfileEdit
