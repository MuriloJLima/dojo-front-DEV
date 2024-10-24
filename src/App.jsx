import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./Home"



import './global.css'

export function App() {

 return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        {/* <Route path='/home' element={}/>
        <Route path='/aluno' element={}/>
        <Route path='/novoaluno' element={}/>
        <Route path='/editaraluno' element={}/>
        <Route path='/exportar' element={}/> */}
        <Route path='*' element={<h1>Not Found</h1>}/>
      </Routes>
    </BrowserRouter>
  )
}


