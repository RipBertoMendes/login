import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa'; 

function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();
      const user = users.find(u => u.cpf === cpf && u.senha === senha);

      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('Login bem-sucedido!');
        navigate('/perfil');
      } else {
        alert('CPF ou senha inválidos.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Ocorreu um erro ao tentar fazer login.');
    }
  };

  return (
    <div className="auth-container"> 
      <h1>LOGIN</h1> 
      <form onSubmit={handleLogin}>
        <div className="input-group"> 
          <FaUser className="icon" /> 
          <input 
            type="text" 
            placeholder="CPF" 
            value={cpf} 
            onChange={(e) => setCpf(e.target.value)} 
            maxLength="11" 
            required 
          />
        </div>
        
        <div className="input-group"> 
          <FaLock className="icon" /> 
          <input 
            type="password" 
            placeholder="Senha" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            maxLength="30" 
            required 
          />
        </div>
        
        <button type="submit">LOGIN</button>
      </form>
      <p>Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link></p>
    </div>
  );
}

export default Login;