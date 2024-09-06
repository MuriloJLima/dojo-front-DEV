import React, { useState, useEffect } from "react";
import styled from "styled-components";
import config from '../config/config.json';
import axios from "axios";

const ProfileContainer = styled.div`
  width: 600%;
  max-height: 570px;
  padding: 20px; 
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const ProfileRow = styled.div`
   display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const ProfileGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 3px;

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
  color: #555;
  margin-bottom: 2px;
  display: block;
`;

const Info = styled.span`
  font-size: 1rem;
  color: #333;
  display: block;
  margin-bottom: 12px;
`;

const ProfileTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #007BFF;
  text-align: center;
  margin-bottom: 20px;
`;

const Aluno = ({ id }) => {
  const [aluno, setAluno] = useState({});
  const [idade, setIdade] = useState(null);

  const getAluno = async () => {
    try {
      const response = await axios.get(`${config.urlRoot}/listarAlunoPK/${id}`);
      setAluno(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar aluno:", error);
    }
  };

  useEffect(() => {
    getAluno();
  }, []);

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

  const getSexoRepresentativo = (sexo) => {
    switch (sexo) {
      case 'M':
        return 'Masculino';
      case 'F':
        return 'Feminino';
      case 'O':
        return 'Outro';
      default:
        return 'N/A';
    }
  };

  return (
    <ProfileContainer>
      <ProfileTitle>Perfil do Aluno</ProfileTitle>
      <ProfileRow>
      <ProfileGroup>
        <Label>Matrícula:</Label>
        <Info>{aluno.matricula_aluno || "N/A"}</Info>
      </ProfileGroup>
      <ProfileGroup>
        <Label>Nome Completo:</Label>
        <Info>{aluno.nome_aluno || "N/A"}</Info>
      </ProfileGroup>
      </ProfileRow> 
      <ProfileRow>
        <ProfileGroup>
          <Label>Data de Nascimento:</Label>
          <Info>{aluno.nasc_aluno ? new Date(aluno.nasc_aluno).toLocaleDateString() : "N/A"}</Info>
        </ProfileGroup>
        <ProfileGroup>
          <Label>Idade:</Label>
          <Info>{idade !== null ? `${idade} anos` : "N/A"}</Info>
        </ProfileGroup>
      </ProfileRow>
      <ProfileRow>
        <ProfileGroup>
          <Label>Sexo:</Label>
          <Info>{getSexoRepresentativo(aluno.sexo_aluno)}</Info>
        </ProfileGroup>
        <ProfileGroup>
          <Label>Tipo Sanguíneo:</Label>
          <Info>{aluno.t_sanguineo || "N/A"}</Info>
        </ProfileGroup>
      </ProfileRow>
      <ProfileRow>
        <ProfileGroup>
          <Label>Altura (cm):</Label>
          <Info>{aluno.altura_aluno || "N/A"}</Info>
        </ProfileGroup>
        <ProfileGroup>
          <Label>Peso (kg):</Label>
          <Info>{aluno.peso_aluno || "N/A"}</Info>
        </ProfileGroup>
      </ProfileRow>
      {/* <ProfileRow>
          <ProfileGroup>
            <Label>Telefone:</Label>
            <Info>{aluno.tel_aluno || aluno.tel_resp || "N/A"}</Info>
          </ProfileGroup>
          <ProfileGroup>
            <Label>Email:</Label>
            <Info>{aluno.email_aluno || "N/A"}</Info>
          </ProfileGroup>
        </ProfileRow> */}
      {idade !== null && idade < 18 ? (
        <>
          <ProfileGroup>
            <Label>Nome do Responsável:</Label>
            <Info>{aluno.nome_respons || "N/A"}</Info>
          </ProfileGroup>
          <ProfileRow>
            <ProfileGroup>
              <Label>Telefone (responsonsável):</Label>
              <Info>{aluno.tel_respons || "N/A"}</Info>
            </ProfileGroup>
            <ProfileGroup>
              <Label>Telefone (aluno):</Label>
              <Info>{aluno.tel_aluno || "N/A"}</Info>
            </ProfileGroup>
          </ProfileRow>
          <ProfileRow>
        <ProfileGroup>
          <Label>Email:</Label>
          <Info>{aluno.email_aluno || "N/A"}</Info>
        </ProfileGroup>
        <ProfileGroup>
          <Label>Endereço:</Label>
          <Info>{aluno.endereco_aluno || "N/A"}</Info>
        </ProfileGroup>
      </ProfileRow>

        </>
      ) : (
        <>
        <ProfileRow>
          <ProfileGroup>
            <Label>Telefone:</Label>
            <Info>{aluno.tel_aluno || aluno.tel_resp || "N/A"}</Info>
          </ProfileGroup>
          <ProfileGroup>
            <Label>Email:</Label>
            <Info>{aluno.email_aluno || "N/A"}</Info>
          </ProfileGroup>
        </ProfileRow>
        <ProfileGroup>
          <Label>Endereço:</Label>
          <Info>{aluno.endereco_aluno || "N/A"}</Info>
        </ProfileGroup>
        </>
        
      )}
      
      <ProfileRow>
        <ProfileGroup>
          <Label>Data de Inscrição:</Label>
          <Info>{aluno.data_insc ? new Date(aluno.data_insc).toLocaleDateString() : "N/A"}</Info>
        </ProfileGroup>
        <ProfileGroup>
          <Label>Graduação:</Label>
          <Info>{aluno.grad_aluno || "N/A"}</Info>
        </ProfileGroup>
      </ProfileRow>
    </ProfileContainer>
  );
};

export default Aluno;
