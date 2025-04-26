import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../client'
import { PawPrint, UserRound } from 'lucide-react'

const ProfileDropdown = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('pet_forum_user_id')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Error fetching profile:', error)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setVisible(true)
      }, 150) // smoother fade-in
    }
  }, [loading])

  if (loading) return null

  return (
    <div
      className={`profile-dropdown ${visible ? 'fade-in' : ''}`}
      style={{
        display: visible ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'white',
        border: '1px solid #ddd',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        position: 'absolute',
        right: '20px',
        top: '70px',
        minWidth: '220px',
        zIndex: 999,
      }}
    >
      <img
        src={profile?.image_url || "https://place-puppy.com/80x80"}
        alt="Profile"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '10px'
        }}
      />
      <p style={{
        fontWeight: '600',
        fontSize: '1.1rem',
        color: '#2a70c2',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <PawPrint size={18} />
        {profile?.pet_name || "🐾 Pet Lover"}
      </p>

      {/* View Profile button */}
      <Link to="/profile" style={{
        background: '#f0f7ff',
        color: '#2a70c2',
        padding: '8px 14px',
        marginBottom: '8px',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: '500',
        textDecoration: 'none',
        border: '1px solid #2a70c2',
        transition: 'background 0.3s, color 0.3s'
      }}>
        <UserRound size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
        View Profile
      </Link>

      {/* Edit Profile button */}
      <Link to="/profile/edit" style={{
        fontSize: '0.9rem',
        color: '#1a5ab8',
        textDecoration: 'none',
        padding: '8px 14px',
        borderRadius: '20px',
        border: '1px solid #1a5ab8',
        fontWeight: '500',
        transition: 'background 0.3s, color 0.3s'
      }}>
        ✏️ Edit Profile
      </Link>
    </div>
  )
}

export default ProfileDropdown
