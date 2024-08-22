import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import config from '../config/config.json'
import { toast, ToastContainer } from "react-toastify";

const FormContainer = styled.div`
  width: 600%;
  max-height: 570px;
  padding: 20px; 
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 700px) {
    flex-direction: column;
    margin-bottom: 15px;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 5px;

  &:not(:last-child) {
    @media (max-width: 600px) {
      margin-right: 0;
      margin-bottom: 15px;
    }
  }
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
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007BFF;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 7px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007BFF;
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  width: 50%;
  padding: 8px;
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

const Formu = () => {

  const initialAlunoState = {
    nome_aluno: "", nasc_aluno: "", sexo_aluno: "",
    altura_aluno: "", peso_aluno: "", t_sanguineo: "",
    tel_aluno: "", email_aluno: "", endereco_aluno: "",
    data_insc: "", grad_aluno: "", nome_respons: "", tel_respons: ""
  };

  const [aluno, setAluno] = useState(initialAlunoState);

  const [idade, setIdade] = useState(null);

  useEffect(() => {
    if (aluno.nasc_aluno) {
      const birthDate = new Date(aluno.nasc_aluno);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      setIdade(age);
    }
  }, [aluno.nasc_aluno]);


  // useEffect(() => {
  //   toast.success("Aluno cadastrado com sucesso");

  // });

  const handleChange = (e) => setAluno({ ...aluno, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.urlRoot}/cadastrarAlunos`, aluno);

      toast.success("Aluno cadastrado com sucesso");

      setAluno(initialAlunoState);
      setIdade(null);
    } catch (error) {
      console.error("Erro ao cadastrar o aluno:", error);
      // Aqui você pode tratar o erro, como exibir uma mensagem para o usuário
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nome Completo:</Label>
          <Input type="text" name="nome_aluno" value={aluno.nome_aluno} onChange={handleChange} required />
        </FormGroup>
        <FormRow>
          <FormGroup>
            <Label>Data de Nascimento:</Label>
            <Input type="date" name="nasc_aluno" value={aluno.nasc_aluno} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Sexo:</Label>
            <Select name="sexo_aluno" value={aluno.sexo_aluno} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </Select>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label>Altura (cm):</Label>
            <Input type="number" name="altura_aluno" value={aluno.altura_aluno} onChange={handleChange} placeholder="ex: 150" required />
          </FormGroup>
          <FormGroup>
            <Label>Peso (kg):</Label>
            <Input type="number" name="peso_aluno" value={aluno.peso_aluno} onChange={handleChange} placeholder="ex: 50" required />
          </FormGroup>
          <FormGroup>
            <Label>Tipo Sanguíneo:</Label>
            <Select name="t_sanguineo" value={aluno.t_sanguineo} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </Select>
          </FormGroup>
        </FormRow>
        {idade !== null && idade <= 18 ? (
          <>
            <FormGroup>
              <Label>Nome Completo do responsonsável:</Label>
              <Input type="text" name="nome_respons" value={aluno.nome_respons} onChange={handleChange} required />
            </FormGroup>
            <FormRow>
              <FormGroup>
                <Label>Telefone (responsonsável):</Label>
                <Input type="tel" name="tel_respons" value={aluno.tel_respons} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Telefone (Aluno):</Label>
                <Input type="tel" name="tel_aluno" value={aluno.tel_aluno} onChange={handleChange} required />
              </FormGroup>
            </FormRow>
            <FormGroup>
              <Label>Email:</Label>
              <Input type="email" name="email_aluno" value={aluno.email_aluno} onChange={handleChange} required />
            </FormGroup>
          </>
        ) : (
          <FormRow>
            <FormGroup>
              <Label>Telefone:</Label>
              <Input type="tel" name="tel_aluno" value={aluno.tel_aluno} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Email:</Label>
              <Input type="email" name="email_aluno" value={aluno.email_aluno} onChange={handleChange} required />
            </FormGroup>
          </FormRow>
        )}

        <FormGroup>
          <Label>Endereço Completo:</Label>
          <Input
            type="text"
            name="endereco_aluno"
            value={aluno.endereco_aluno}
            onChange={handleChange}
            placeholder="ex: Rua das Flores, 123"
            required
          />
        </FormGroup>
        <FormRow>
          <FormGroup>
            <Label>Data de Inscrição:</Label>
            <Input type="date" name="data_insc" value={aluno.data_insc} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Graduação:</Label>
            <Select name="grad_aluno" value={aluno.grad_aluno} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="Faixa-Branca">Faixa-Branca</option>
              <option value="Faixa-Amarela">Faixa-Amarela</option>
              <option value="Faixa-Vermelha">Faixa-Vermelha</option>
              <option value="Faixa-Laranja">Faixa-Laranja</option>
              <option value="Faixa-Verde">Faixa-Verde</option>
              <option value="Faixa-Roxa">Faixa-Roxa</option>
              <option value="Faixa-Marrom">Faixa-Marrom</option>
              <option value="Faixa-Preta">Faixa-Preta</option>
            </Select>
          </FormGroup>
        </FormRow>
        <ButtonContainer>
          <Button type="submit">Cadastrar</Button>
        </ButtonContainer>
      </form>
      <ToastContainer
        style={{
          color: '#808080',
          position: 'fixed', // Fixa o container em relação à tela
          right: '-400%', // Distância da direita
          zIndex: 9999 // Garante que o toast fique acima de outros elementos
        }}
        autoClose={3000}
      />
    </FormContainer>
  );
};

export default Formu;
