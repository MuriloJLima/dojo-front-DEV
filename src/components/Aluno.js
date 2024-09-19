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

const ProfileTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #007BFF;
  text-align: center;
  margin-bottom: 20px;
`;

const ProfileSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 5px;
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
    if (aluno.dados_aluno?.nasc_aluno) {
      const birthDate = new Date(aluno.dados_aluno.nasc_aluno);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      setIdade(age);
    }
  }, [aluno.dados_aluno]);

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

  const getModalidades = () => {
    const modalidades = aluno.dados_matricula?.dados_modalidades || {};
    const inscricoes = [];

    if (modalidades.dados_karate?.is_aluno) inscricoes.push("Karate");
    if (modalidades.dados_muaythai?.is_aluno) inscricoes.push("Muay Thai");

    return inscricoes.length ? inscricoes.join(", ") : "Nenhuma";
  };

  return (
    <ProfileContainer>
      <ProfileTitle>Perfil do Atleta</ProfileTitle>

      <ProfileSection>

        <ProfileRow>
          <ProfileGroup>
            <Label>Nome completo:</Label>
            <Info>{aluno.dados_aluno?.nome_aluno || "N/A"}</Info>

          </ProfileGroup>
          <ProfileGroup>
            <Label>Matrícula:</Label>
            <Info>{aluno.dados_matricula?.matri_dojo || "N/A"}</Info>

          </ProfileGroup>
        </ProfileRow>
      </ProfileSection>
      {/* Seção de Dados Pessoais */}
      <ProfileSection>
        <SectionTitle>Dados Pessoais</SectionTitle>
        <ProfileRow>
          <ProfileGroup>
            <Label>Data de Nascimento:</Label>
            <Info>{aluno.dados_aluno?.nasc_aluno ? new Date(aluno.dados_aluno.nasc_aluno).toLocaleDateString() : "N/A"}</Info>
          </ProfileGroup>
          <ProfileGroup>
            <Label>Idade:</Label>
            <Info>{idade !== null ? `${idade} anos` : "N/A"}</Info>
          </ProfileGroup>
        </ProfileRow>
        <ProfileRow>
          <ProfileGroup>
            <Label>Sexo:</Label>
            <Info>{getSexoRepresentativo(aluno.dados_aluno?.sexo_aluno)}</Info>
          </ProfileGroup>
          <ProfileGroup>
            <Label>Tipo Sanguíneo:</Label>
            <Info>{aluno.dados_aluno?.t_sanguineo || "--"}</Info>
          </ProfileGroup>
        </ProfileRow>
        <ProfileRow>
          <ProfileGroup>
            <Label>Altura (cm):</Label>
            <Info>{aluno.dados_aluno?.altura_aluno || "--"}</Info>
          </ProfileGroup>
          <ProfileGroup>
            <Label>Peso (kg):</Label>
            <Info>{aluno.dados_aluno?.peso_aluno || "--"}</Info>
          </ProfileGroup>
        </ProfileRow>
      </ProfileSection>

      {/* Seção de Contato */}
      <ProfileSection>
        <SectionTitle>Contato</SectionTitle>
        <ProfileRow>
          <ProfileGroup>
            <Label>Telefone (Aluno):</Label>
            <Info>{aluno.dados_aluno?.tel_aluno || "N/A"}</Info>
          </ProfileGroup>
          <ProfileGroup>
            <Label>Email:</Label>
            <Info>{aluno.dados_aluno?.email_aluno || "N/A"}</Info>
          </ProfileGroup>
        </ProfileRow>
        <ProfileRow>
          <ProfileGroup>
            <Label>Endereço:</Label>
            <Info>{aluno.dados_aluno?.endereco_aluno || "N/A"}</Info>
          </ProfileGroup>
        </ProfileRow>
      </ProfileSection>

      {/* Seção de Dados do Responsável */}
      {idade !== null && idade < 18 && (
        <ProfileSection>
          <SectionTitle>Dados do Responsável</SectionTitle>
          <ProfileRow>
            <ProfileGroup>
              <Label>Nome do Responsável:</Label>
              <Info>{aluno.dados_respons?.nome_respons || "N/A"}</Info>
            </ProfileGroup>
            <ProfileGroup>
              <Label>Telefone (Responsável):</Label>
              <Info>{aluno.dados_respons?.tel_respons || "N/A"}</Info>
            </ProfileGroup>
          </ProfileRow>
        </ProfileSection>
      )}

      {aluno.dados_matricula?.dados_modalidades.dados_karate.is_aluno === true && (
        <ProfileSection>
        <SectionTitle>Modalidade: Karatê</SectionTitle>
        <ProfileRow>
          <ProfileGroup>
            <Label>Matrícula (Federação):</Label>
            <Info>{aluno.dados_matricula.dados_modalidades.dados_karate.matri_federacao || "--"}</Info>
          </ProfileGroup>
          <ProfileGroup>
            <Label>Data de Inscrição:</Label>
            <Info>{aluno.dados_matricula.dados_modalidades.dados_karate.data_insc ? new Date(aluno.dados_matricula.dados_modalidades.dados_karate.data_insc).toLocaleDateString() : "N/A"}</Info>
          </ProfileGroup>
          <ProfileGroup>
            <Label>Graduação:</Label>
            <Info>{aluno.dados_matricula.dados_modalidades.dados_karate.grad_aluno || "N/A"}</Info>
          </ProfileGroup>

        </ProfileRow>
      </ProfileSection>
      )}
      
      {aluno.dados_matricula?.dados_modalidades.dados_muaythai.is_aluno === true && (
        <ProfileSection>
        <SectionTitle>Modalidade: Muay Thai</SectionTitle>
        <ProfileRow>
          <ProfileGroup>
            <Label>Matrícula (Federação):</Label>
            <Info>{aluno.dados_matricula.dados_modalidades.dados_muaythai.matri_federacao || "--"}</Info>
          </ProfileGroup>
          <ProfileGroup>
            <Label>Data de Inscrição:</Label>
            <Info>{aluno.dados_matricula.dados_modalidades.dados_muaythai.data_insc ? new Date(aluno.dados_matricula.dados_modalidades.dados_muaythai.data_insc).toLocaleDateString() : "N/A"}</Info>
          </ProfileGroup>
          <ProfileGroup>
            <Label>Graduação:</Label>
            <Info>{aluno.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno || "N/A"}</Info>
          </ProfileGroup>

        </ProfileRow>
      </ProfileSection>
      )}
      
    </ProfileContainer>
  );
};

export default Aluno;
