import './App.css'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Historico from './pages/Historico/Historico'
import TodosPatrimonios from './pages/TodosPatrimonios/TodosPatrimonios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>

        <Route path='/dashboard' element={<Dashboard/>}/>

        <Route path='/todos-patrimonios' element={<TodosPatrimonios/>}/>

        <Route path='/historico' element={<Historico/>}/>

        <Route path='/ativos' element={<TodosPatrimonios statusFiltro='ativo' tituloPagina='Patrimônios Ativos'/>}/>

        <Route path='/inativos' element={<TodosPatrimonios statusFiltro='inativo' tituloPagina='Patrimônios Inativos'/>}/>

        <Route path='/manutencao' element={<TodosPatrimonios statusFiltro='manutencao' tituloPagina='Patrimônios em Manutenção'/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
