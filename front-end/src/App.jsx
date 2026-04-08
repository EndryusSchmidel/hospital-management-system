import './App.css'
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Historico from './pages/Historico/Historico'
import TodosPatrimonios from './pages/TodosPatrimonios/TodosPatrimonios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import { useAuthMonitor } from './components/UseAuthComponents/UseAuthComponents'

function App() {
  useAuthMonitor();

  return (
    <ThemeProvider>
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
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" // 'colored' fica ótimo para sistemas hospitalares (verde/vermelho nítidos)
        />
      </BrowserRouter>
      <Footer/>
    </ThemeProvider>
  )
}

export default App
