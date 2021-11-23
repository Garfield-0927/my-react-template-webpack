// src/app.tsx
import React from 'react'
import './App.less'
import HelloWorld from '@comp/HelloWorld/HelloWorld'

const App:React.FC<any> = () => {
  return (
    <div className='app'>
      <HelloWorld />
    </div>
  )
}

export default App