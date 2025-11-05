import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';


const API_URL = 'http://192.168.5.248:3001';

function CadastroScreen({ navigation }) {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '', 
    senha: '',
    genero: '',
    email: ''
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.cpf || !formData.dataNascimento || !formData.senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }
    
    try {
      await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar cadastrar.');
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        
        <TextInput style={styles.input} placeholder="Nome Completo*" placeholderTextColor="#b0b0b0" value={formData.nome} onChangeText={(v) => handleChange('nome', v)} maxLength={100} />
        <TextInput style={styles.input} placeholder="CPF*" placeholderTextColor="#b0b0b0" value={formData.cpf} onChangeText={(v) => handleChange('cpf', v)} keyboardType="number-pad" maxLength={11} />
        <TextInput style={styles.input} placeholder="Data de Nascimento (AAAA-MM-DD)*" placeholderTextColor="#b0b0b0" value={formData.dataNascimento} onChangeText={(v) => handleChange('dataNascimento', v)} />
        <TextInput style={styles.input} placeholder="Senha*" placeholderTextColor="#b0b0b0" value={formData.senha} onChangeText={(v) => handleChange('senha', v)} secureTextEntry maxLength={30} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#b0b0b0" value={formData.email} onChangeText={(v) => handleChange('email', v)} keyboardType="email-address" maxLength={100} />
        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.genero}
            style={styles.picker}
            onValueChange={(itemValue) => handleChange('genero', itemValue)}
            dropdownIconColor="#ffb6c1"
          >
            <Picker.Item label="Selecione o Gênero" value="" />
            <Picker.Item label="Masculino" value="Masculino" />
            <Picker.Item label="Feminino" value="Feminino" />
            <Picker.Item label="Outro" value="Outro" />
            <Picker.Item label="Prefiro não informar" value="Prefiro não informar" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Já tem uma conta? Faça Login</Text>
        </TouchableOpacity>
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
    marginBottom: 40,
  },
});

export default CadastroScreen;