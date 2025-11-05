import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'http://192.168.5.248:3001';

const placeholderImg = 'https://via.placeholder.com/150/8a2be2/ffffff?text=Perfil';

function PerfilScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); 

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('loggedInUser');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        navigation.replace('Login'); 
      }
    };
    loadUser();
  }, []);

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

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedInUser');
    navigation.replace('Login');
  };

  const handleEditClick = () => {
    setEditedUser({ ...user, fotoPerfilUrl: user.fotoPerfilUrl || '' });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setSelectedImage(null); 
  };

  const handleInputChange = (name, value) => {
    setEditedUser({ ...editedUser, [name]: value });
  };


  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]); 
    }
  };

  const handleSaveClick = async () => {
    if (!editedUser.nome.trim() || !editedUser.cpf.trim() || !editedUser.dataNascimento.trim()) {
      Alert.alert('Erro', 'Nome, CPF e Data de Nascimento são obrigatórios.');
      return;
    }

    const formData = new FormData();

    Object.keys(editedUser).forEach(key => {
      if (key !== 'fotoPerfilUrl' && key !== 'id') {
        formData.append(key, editedUser[key]);
      }
    });

    if (selectedImage) {
      const filename = selectedImage.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('fotoPerfil', {
        uri: selectedImage.uri,
        name: filename,
        type: type,
      });
    }

    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        body: formData,
        headers: {
        },
      });

      if (!response.ok) throw new Error('Falha ao salvar');

      const updatedUser = await response.json();
      
      setUser(updatedUser);
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      
      setIsEditing(false);
      setSelectedImage(null);
      Alert.alert('Sucesso', 'Perfil atualizado!');

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar.');
    }
  };

  if (!user) {
    return <View style={styles.container}><Text style={styles.infoText}>Carregando...</Text></View>;
  }


  let profileImageUrl = placeholderImg;
  if (selectedImage) {
    profileImageUrl = selectedImage.uri; 
  } else if (user.fotoPerfilUrl) {
    profileImageUrl = `${API_URL}/uploads/${user.fotoPerfilUrl}`; 
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil do Usuário</Text>

        {isEditing ? (
          <>
            <Image source={{ uri: profileImageUrl }} style={styles.profilePicture} />
            <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
              <Text style={styles.buttonText}>Trocar Foto</Text>
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder="Nome" value={editedUser.nome} onChangeText={(v) => handleInputChange('nome', v)} maxLength={100} />
            <TextInput style={styles.input} placeholder="CPF" value={editedUser.cpf} onChangeText={(v) => handleInputChange('cpf', v)} maxLength={11} keyboardType="number-pad" />
            <TextInput style={styles.input} placeholder="Email" value={editedUser.email} onChangeText={(v) => handleInputChange('email', v)} maxLength={100} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Data Nasc. (AAAA-MM-DD)" value={editedUser.dataNascimento} onChangeText={(v) => handleInputChange('dataNascimento', v)} />
            <View style={styles.pickerContainer}>
              <Picker selectedValue={editedUser.genero} style={styles.picker} onValueChange={(v) => handleInputChange('genero', v)} dropdownIconColor="#ffb6c1">
                <Picker.Item label="Masculino" value="Masculino" />
                <Picker.Item label="Feminino" value="Feminino" />
                <Picker.Item label="Outro" value="Outro" />
                <Picker.Item label="Prefiro não informar" value="Prefiro não informar" />
              </Picker>
            </View>
            <Text style={styles.infoText}>Idade: {calcularIdade(user.dataNascimento)} anos (calculado)</Text>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={[styles.button, styles.flexButton]} onPress={handleSaveClick}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.flexButton, styles.cancelButton]} onPress={handleCancelClick}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (

          <>
            <Image source={{ uri: profileImageUrl }} style={styles.profilePicture} />
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Nome:</Text> {user.nome}</Text>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>CPF:</Text> {user.cpf}</Text>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Email:</Text> {user.email || 'Não informado'}</Text>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Data de Nasc.:</Text> {user.dataNascimento}</Text>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Idade:</Text> {calcularIdade(user.dataNascimento)} anos</Text>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Gênero:</Text> {user.genero || 'Não informado'}</Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={[styles.button, styles.flexButton, styles.editButton]} onPress={handleEditClick}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.flexButton]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#1a0f28',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffb6c1',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#ffb6c1',
    borderWidth: 3,
    alignSelf: 'center',
    marginBottom: 30,
  },
  infoText: {
    fontSize: 18,
    color: '#e0e0e0',
    marginBottom: 10,
    lineHeight: 24,
  },
  infoLabel: {
    color: '#ffb6c1',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    color: '#e0e0e0',
    height: 50,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },
  flexButton: {
    flex: 1, 
  },
  button: {
    backgroundColor: '#ffb6c1',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1a0f28',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#8a2be2', 
  },
  cancelButton: {
    backgroundColor: '#555', 
  },
  imageButton: {
    backgroundColor: '#8a2be2',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
  }
});

export default PerfilScreen;