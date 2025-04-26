import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Home, PlusCircle, Search, UserRound } from 'lucide-react'
import ProfileDropdown from './ProfileDropdown'

const Navbar = ({ search, setSearch }) => {
  const [showProfile, setShowProfile] = useState(false)

  const toggleProfile = () => setShowProfile(!showProfile)

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-link">
          <Home size={20} style={{ marginRight: '6px' }} />
          PetTalks
        </Link>
        <Link to="/create" className="nav-link">
          <PlusCircle size={20} style={{ marginRight: '6px' }} />
          Create
        </Link>
      </div>

      <div className="navbar-center">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar"
          />
        </div>
      </div>

      <div className="navbar-right">
        <UserRound 
          size={28} 
          className="profile-icon" 
          onClick={toggleProfile} 
          style={{ cursor: 'pointer' }}
        />
        {showProfile && <ProfileDropdown />}
      </div>
    </nav>
  )
}

export default Navbar
