import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'


const articlesUrl = 'http://localhost:3000/api/articles'
const loginUrl = 'http://localhost:3000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)


  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    if (localStorage.token) setMessage('Goodbye!')
    localStorage.removeItem('token')
    redirectToLogin()
    //$ ✨ implement
    //$ If a token is in local storage it should be removed,
    //$ and a message saying "Goodbye!" should be set in its proper state.
    //$ In any case, we should redirect the browser back to the login screen,
    //$ using the helper above.
  }

  const login = async ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const { data } = await axios.post(
        'http://localhost:9000/api/login/', { username, password }
      )
      if (data.token) {
        localStorage.setItem('token', data.token)
        setMessage(data.message)
        redirectToArticles()
      }
      setSpinnerOn(false)
    } catch (err) {
      if (err?.response?.status == 401) {
        logout()
      }
    }
    //$ ✨ implement
    //$ We should flush the message state, turn on the spinner
    //$ and launch a request to the proper endpoint.
    //$ On success, we should set the token to local storage in a 'token' key,
    //$ put the server success message in its proper state, and redirect
    //$ to the Articles screen. Don't forget to turn off the spinner!
  }


  const getArticles = async () => {
    const token = localStorage.getItem('token')
    setMessage('')
    if (!token) {
      logout()
    } else {
      setSpinnerOn(true)
      try {
        const response = await axios.get(
          'http://localhost:9000/api/articles',
          { headers: { Authorization: token } }
        )
        setArticles(response.data.articles)
        setMessage(response.data.message)
      }
      catch (error) {
        if (error?.response?.status == 401) {
          logout()
        }
      }
      setSpinnerOn(false)
    }
    // ✨ implement
    //$ We should flush the message state, turn on the spinner
    //$ and launch an authenticated request to the proper endpoint.
    //$ On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    //$ If something goes wrong, check the status of the response:
    //$ if it's a 401 the token might have gone bad, and we should redirect to login.
    //$ Don't forget to turn off the spinner!
  }

  console.log(articles)


  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm />
              <Articles logout={logout} getArticles={getArticles} articles={articles}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )

}
