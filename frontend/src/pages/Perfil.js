import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// no topo do componente Perfil.js
function Perfil() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // <-- NOVO ESTADO
  const navigate = useNavigate();

  // ...

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      alert("Você precisa estar logado para ver esta página.");
      navigate('/');
    }
  }, [navigate]);

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return 'N/A';
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

    const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); 
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  const handleEditClick = () => {
    setEditedUser({
      ...user,
      fotoPerfilUrl: user.fotoPerfilUrl || ''
    });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

const handleSaveClick = async () => {
  if (!editedUser.nome.trim() || !editedUser.cpf.trim() || !editedUser.dataNascimento.trim()) {
    alert('Os campos Nome, CPF e Data de Nascimento são obrigatórios.');
    return;
  }

  const formData = new FormData();

  formData.append('nome', editedUser.nome);
  formData.append('cpf', editedUser.cpf);
  formData.append('email', editedUser.email);
  formData.append('dataNascimento', editedUser.dataNascimento);
  formData.append('genero', editedUser.genero);

  if (selectedFile) {
    formData.append('fotoPerfil', selectedFile);
  }

  try {
    const response = await fetch(`http://localhost:3001/users/${user.id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Falha ao salvar as alterações.');
    }

    const updatedUser = await response.json();
    setUser(updatedUser);
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    
    setIsEditing(false);
    setSelectedFile(null);
    alert('Perfil atualizado com sucesso!');

  } catch (error) {
    console.error('Erro ao salvar:', error);
    alert('Ocorreu um erro ao salvar as alterações.');
  }
};

  if (!user) {
    return (
      <div className="profile-container">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Seu Perfil</h1>

      {isEditing ? (

        <>
          <input 
            type="file" 
            name="fotoPerfil" 
            onChange={handleFileChange}
          />
          <p><strong>Nome:</strong> <input type="text" name="nome" value={editedUser.nome} onChange={handleInputChange} /></p>
          <p><strong>CPF:</strong> <input type="text" name="cpf" value={editedUser.cpf} onChange={handleInputChange} /></p>
          <p><strong>Email:</strong> <input type="email" name="email" value={editedUser.email} onChange={handleInputChange} /></p>
          <p><strong>Data de Nascimento:</strong> <input type="date" name="dataNascimento" value={editedUser.dataNascimento} onChange={handleInputChange} /></p>
          <p><strong>Gênero:</strong>
            <select name="genero" value={editedUser.genero} onChange={handleInputChange}>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
              <option value="Prefiro não informar">Prefiro não informar</option>
            </select>
          </p>
          <p><strong>Idade:</strong> {calcularIdade(user.dataNascimento)} anos </p>
        </>
      ) : (

        <>
          <div className="profile-picture-container">
            <img
              src={user.fotoPerfilUrl ? `http://localhost:3001/uploads/${user.fotoPerfilUrl}` : 'https://via.placeholder.com/150/8a2be2/ffffff?text=Perfil'}
              alt="Foto de Perfil"
              className="profile-picture"
            />
          </div>
          <p><strong>Nome:</strong> {user.nome}</p>
          <p><strong>CPF:</strong> {user.cpf}</p>
          <p><strong>Email:</strong> {user.email || 'Não informado'}</p>
          <p><strong>Data de Nascimento:</strong> {new Date(user.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
          <p><strong>Idade:</strong> {calcularIdade(user.dataNascimento)} anos</p>
          <p><strong>Gênero:</strong> {user.genero || 'Não informado'}</p>
        </>
      )}

      <div className="button-group">
        {isEditing ? (
          <>
            <button onClick={handleSaveClick}>Salvar</button>
            <button onClick={handleCancelClick} className="cancel-button">Cancelar</button>
          </>
        ) : (
          <>
            <button onClick={handleEditClick}>Editar</button>
            <button onClick={handleLogout}>Sair</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Perfil;