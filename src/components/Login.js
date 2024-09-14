import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import config from '../config/config.json';

import GlobalStyle from "../styles/global.js";

// Usando o mesmo estilo do FormContainer
const LoginContainer = styled.div`
  width: 400px;
  max-height: 400px;
  padding: 20px; 
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 50px auto;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1.0rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 7px;
  font-size: 1rem;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ccc'};
  border-radius: 6px;
  transition: border-color 0.3s;
  margin-bottom: 15px;

  &:focus {
    border-color: ${props => props.error ? '#e74c3c' : '#007BFF'};
    outline: none;
  }
`;

const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 0.875rem;
  margin: 5px 0 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background-color: #007BFF;
  border: none;
  border-radius: 6px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Login = ({ onLogin }) => {
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [alunos, setAlunos] = useState([]);
  const [error, setError] = useState('');

  // Função para buscar todos os alunos
  const getAlunos = async () => {
    try {
      const response = await axios.get(`${config.urlRoot}/listarAlunos`);
      setAlunos(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  useEffect(() => {
    getAlunos();
  }, []);

  // Verifica as credenciais de matrícula e CPF
  const handleSubmit = (e) => {
    e.preventDefault();

    const alunoEncontrado = alunos.find(aluno => 
      aluno.matricula_aluno === matricula && aluno.email_aluno === email
    );

    if (alunoEncontrado) {
        if (alunoEncontrado.is_adm) {
            onLogin(alunoEncontrado);
            // Redirecionar ou armazenar token de autenticação aqui
          } else {
            setError("O usuário não é administrador");
          }
    } else {
      setError("Matrícula ou Email inválidos.");
    }
  };

  return (
    <LoginContainer>
      <h2>Login</h2>
      <LoginForm onSubmit={handleSubmit}>
        <Label>Email:</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          error={!!error}
        />
        <Label>Matrícula:</Label>
        <Input
          type="text"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          required
          error={!!error}
        />
        {error && <ErrorText>{error}</ErrorText>}
        <ButtonContainer>
          <Button type="submit">Entrar</Button>
        </ButtonContainer>
      </LoginForm>
      
    </LoginContainer>
    
  );
};

export default Login;
