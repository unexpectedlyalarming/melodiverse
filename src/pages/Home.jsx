import AudioPlayer from '../components/AudioPlayer'
import Container from '../components/Container'
import NavBar from '../components/Nav'
import React from 'react'
import '../index.css'




export default function Home() {


  return (
    <>
    <NavBar/>
    <Container>
    <h2>Page</h2>
    <AudioPlayer />
      </Container>
      
    </>
  )
}