import React, { useState, useEffect } from "react";
import styled from "styled-components";
import config from '../config/config.json';
import axios from "axios"; // Certifique-se de que o axios está importado
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

const SmallFormGroup = styled(FormGroup)`
  flex: 0 0 0%;
`;

const EdicaoAluno = ({ id }) => {
  const [aluno, setAluno] = useState({});

  const [alunos, setAlunos] = useState([]);
  const [idError, setIdError] = useState("");



  const getAluno = async () => {
    try {
      const response = await axios.get(`${config.urlRoot}/listarAlunoPK/${id}`);
      setAluno(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar aluno:", error);
    }
  };

  const getAlunos = async () => {
    try {
      const response = await axios.get(`${config.urlRoot}/listarAlunos`);
      const alunosData = response.data.data;
      setAlunos(alunosData);

    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  useEffect(() => {
    getAluno();
    getAlunos();
  }, []);


 

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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setAluno({ ...aluno, [name]: value });

    if (name === "matricula_aluno") {
      const existingAluno = alunos.find(a => a.matricula_aluno === value);
      if (existingAluno) {
        setIdError("Esta matrícula já está em uso.");
      } else {
        setIdError("");
      }
    }
  };
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (idError) {
      return; // Não permite o envio se houver erro
    }

    try {
      const response = await axios.put(`${config.urlRoot}/alterarAlunos`, aluno);
      toast.success("Aluno editado com sucesso!");

      setTimeout(() => {
        window.location.reload(); // Recarrega a página após 3 segundos
      }, 1500);
    } catch (error) {
      console.error("Erro ao editar aluno:", error);
      // Adicione aqui qualquer ação adicional, como exibir uma mensagem de erro
    }
  };
  

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormRow>
        <SmallFormGroup>
            <Label>Matrícula:</Label>
            <Input
              type="text"
              name="matricula_aluno"
              value={aluno.matricula_aluno}
              onChange={handleChange}
              maxLength={4}
              required
              error={!!idError}
            />
            {idError && <ErrorText>{idError}</ErrorText>}
          </SmallFormGroup>
        <FormGroup>
          <Label>Nome Completo:</Label>
          <Input type="text" name="nome_aluno" value={aluno.nome_aluno || ""} onChange={handleChange} required />
        </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label>Data de Nascimento:</Label>
            <Input type="date" name="nasc_aluno" value={aluno.nasc_aluno || ""} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Sexo:</Label>
            <Select name="sexo_aluno" value={aluno.sexo_aluno || ""} onChange={handleChange} required>
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
            <Input type="number" name="altura_aluno" value={aluno.altura_aluno || ""} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Peso (kg):</Label>
            <Input type="number" name="peso_aluno" value={aluno.peso_aluno || ""} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Tipo Sanguíneo:</Label>
            <Select name="t_sanguineo" value={aluno.t_sanguineo || ""} onChange={handleChange} required>
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
        {idade !== null && idade < 18 ? (
          <>
            <FormGroup>
              <Label>Nome Completo do Responsável:</Label>
              <Input type="text" name="nome_respons" value={aluno.nome_respons || ""} onChange={handleChange} required />
            </FormGroup>
            <FormRow>
              <FormGroup>
                <Label>Telefone (Responsável):</Label>
                <Input type="tel" name="tel_respons" value={aluno.tel_respons || ""} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Telefone (Aluno):</Label>
                <Input type="tel" name="tel_aluno" value={aluno.tel_aluno || ""} onChange={handleChange} required />
              </FormGroup>
            </FormRow>
            <FormGroup>
              <Label>Email:</Label>
              <Input type="email" name="email_aluno" value={aluno.email_aluno || ""} onChange={handleChange} required />
            </FormGroup>
          </>
        ) : (
          <FormRow>
            <FormGroup>
              <Label>Telefone:</Label>
              <Input type="tel" name="tel_aluno" value={aluno.tel_aluno || ""} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Email:</Label>
              <Input type="email" name="email_aluno" value={aluno.email_aluno || ""} onChange={handleChange} required />
            </FormGroup>
          </FormRow>
        )}
        
        <FormGroup>
          <Label>Endereço Completo:</Label>
          <Input type="text" name="endereco_aluno" value={aluno.endereco_aluno || ""} onChange={handleChange} required />
        </FormGroup>
        <FormRow>
          <FormGroup>
            <Label>Data de Inscrição:</Label>
            <Input type="date" name="data_insc" value={aluno.data_insc || ""} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Graduação:</Label>
            <Select name="grad_aluno" value={aluno.grad_aluno || ""} onChange={handleChange} required>
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
          <SmallFormGroup>
            <Label>Administrador:</Label>
            <Select name="is_adm" value={aluno.is_adm} onChange={handleChange} required>
              <option value={false}>Não</option>
              <option value={true}>Sim</option>
            </Select>

          </SmallFormGroup>
        </FormRow>
        <ButtonContainer>
          <Button type="submit">Editar</Button>
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

export default EdicaoAluno;
