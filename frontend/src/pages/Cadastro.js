import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaIdCard, FaCalendarAlt, FaLock, FaEnvelope, FaVenusMars } from 'react-icons/fa';

function Cadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    senha: '',
    genero: '',
    email: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.cpf || !formData.dataNascimento || !formData.senha) {
      alert("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    try {
      await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      alert('Cadastro realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Ocorreu um erro ao tentar cadastrar.');
    }
  };

  return (
    <div className="auth-container">
      <h1>Página de Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <FaUser className="icon" />
          <input type="text" name="nome" placeholder="Nome Completo*" value={formData.nome} onChange={handleChange} maxLength="100" required />
        </div>

        <div className="input-group">
          <FaIdCard className="icon" />
          <input type="text" name="cpf" placeholder="CPF*" value={formData.cpf} onChange={handleChange} maxLength="11" required />
        </div>
        
        <div className="input-group">
          <FaCalendarAlt className="icon" />
          <input type="date" name="dataNascimento" placeholder="Data de Nascimento*" value={formData.dataNascimento} onChange={handleChange} required />
        </div>
        
        <div className="input-group">
          <FaLock className="icon" />
          <input type="password" name="senha" placeholder="Senha*" value={formData.senha} onChange={handleChange} maxLength="30" required />
        </div>
        
        <div className="input-group">
          <FaEnvelope className="icon" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} maxLength="50" />
        </div>
        
        <div className="input-group">
          <FaVenusMars className="icon" />
          <select name="genero" value={formData.genero} onChange={handleChange}>
            <option value="">Selecione o Gênero</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não informar">Prefiro não informar</option>
          </select>
        </div>

        <button type="submit">Cadastrar</button>
      </form>
      <p>Já tem uma conta? <Link to="/">Faça Login</Link></p>
    </div>
  );
}

export default Cadastro;