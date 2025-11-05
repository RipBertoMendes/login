import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.5.248:3001';

function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const users = await response.json();
      const user = users.find(u => u.cpf === cpf && u.senha === senha);

      if (user) {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
        Alert.alert('Sucesso', 'Login bem-sucedido!');
        navigation.replace('Perfil'); 
      } else {
        Alert.alert('Erro', 'CPF ou senha inválidos.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>USER LOGIN</Text>
      
      <TextInput
        style={styles.input}
        placeholder="CPF"
        placeholderTextColor="#b0b0b0"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="number-pad"
        maxLength={11}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#b0b0b0"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry 
        maxLength={30}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#1a0f28',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffb6c1',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'uppercase',
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
  button: {
    backgroundColor: '#ffb6c1',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#1a0f28',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#ffb6c1',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default LoginScreen;