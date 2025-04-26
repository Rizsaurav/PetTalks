import { useEffect, useState } from 'react'
import { supabase } from '../../client'
import { PawPrint, Bone, Smile, PlaneTakeoff } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProfilePage = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('pet_forum_user_id')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error.message)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [])

  if (loading) return <p>Loading profile...</p>
  if (!profile) return <p>No profile found.</p>

  return (
    <div className="profile-page-wrapper">
      <h1 className="page-title">🐾 My Pet Profile</h1>

      <div className="profile-card">
        {profile.image_url && (
          <img
            src={profile.image_url}
            alt="Profile"
            className="profile-image-large"
          />
        )}
        <h2 className="pet-name">
          <PawPrint size={22} style={{ marginRight: '6px' }} />
          {profile.pet_name || 'Unnamed Pet'}
        </h2>

        <div className="profile-info">
          <p><strong>About:</strong> {profile.bio || 'No bio provided.'}</p>

          <div className="profile-facts">
            <p><Bone size={18} style={{ marginRight: '6px' }} /> <strong>Favorite Snack:</strong> {profile.favorite_snack || 'N/A'}</p>
            <p><Smile size={18} style={{ marginRight: '6px' }} /> <strong>Silliest Habit:</strong> {profile.silliest_habit || 'N/A'}</p>
            <p><PlaneTakeoff size={18} style={{ marginRight: '6px' }} /> <strong>Dream Adventure:</strong> {profile.dream_adventure || 'N/A'}</p>
          </div>
        </div>

        <Link to="/profile/edit" className="edit-profile-btn">
          ✏️ Edit Profile
        </Link>
      </div>
    </div>
  )
}

export default ProfilePage
