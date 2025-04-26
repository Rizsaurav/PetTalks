// src/app/Home.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../client'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'
import { PawPrint } from 'lucide-react'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('created_at')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [sortBy, search])

  const fetchPosts = async () => {
    setLoading(true)
    setError('')

    let query = supabase
      .from('posts')
      .select('id, title, content, image_url, created_at, upvotes, comment_count')
      .order(sortBy, { ascending: false })

    if (search.trim() !== '') {
      query = query.ilike('title', `%${search.trim()}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Error fetching posts:', error.message)
      setPosts([])
      setError('Something went wrong. Please try again later. 🐾')
    } else {
      setPosts(data || [])
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-amber-50 bg-opacity-80 relative overflow-hidden">
      {/* Paw print background decorations */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <PawPrint
            key={i}
            className="absolute text-amber-800"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              width: `${Math.random() * 30 + 20}px`,
              height: `${Math.random() * 30 + 20}px`,
            }}
          />
        ))}
      </div>

      <Navbar search={search} setSearch={setSearch} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-amber-800 mb-8">
          🐾 Welcome to PetTalks
        </h1>

        {/* Sort buttons */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            className={`px-5 py-2 rounded-full font-medium ${sortBy === 'created_at' ? 'bg-amber-400 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
            onClick={() => setSortBy('created_at')}
          >
            🕓 Newest
          </button>
          <button
            className={`px-5 py-2 rounded-full font-medium ${sortBy === 'upvotes' ? 'bg-amber-400 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
            onClick={() => setSortBy('upvotes')}
          >
            ⬆️ Most Loved
          </button>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-center text-amber-700">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-amber-700">
            No paw stories found! 🐾 Start a new adventure by creating a post!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
