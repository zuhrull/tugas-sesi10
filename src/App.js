import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import PostsList from './features/posts/PostList';

function App() {
  return (
    <div className="container">
      <h2 className="mb-8">CRUD React Redux</h2>
      <PostsList />
    </div>
  )
}
export default App;