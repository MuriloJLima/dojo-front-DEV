import React, { useState, useEffect } from "react";
import styled from "styled-components";
import config from '../config/config.json';
import axios from "axios";

const Container = styled.div`
  width: 600%; /* Ajuste de largura para não ultrapassar 100% */
  max-height: 570px;
  padding: 20px; 
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #007BFF;
  text-align: center;
  margin-bottom: 20px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
`;

const FieldList = styled.div`
  margin-top: 20px;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 8px;
`;

// Mapeamento de campos para títulos amigáveis
const fieldTitles = {
  id_aluno: "ID do Aluno",
  nome_aluno: "Nome do Aluno",
  nasc_aluno: "Data de Nascimento",
  idade: "Idade",
  sexo_aluno: "Sexo",
  t_sanguineo: "Tipo Sanguíneo",
  altura_aluno: "Altura",
  peso_aluno: "Peso",
  nome_respons: "Nome do Responsável",
  tel_respons: "Telefone do Responsável",
  tel_aluno: "Telefone do Aluno",
  email_aluno: "Email",
  endereco_aluno: "Endereço",
  data_insc: "Data de Inscrição",
  grad_aluno: "Graduação",
};

const ExcelEdit = () => {
  const [alunos, setAlunos] = useState([]);
  const [selectedFields, setSelectedFields] = useState({
    id_aluno: true,  // Campo obrigatório, marcado por padrão
    nome_aluno: true,
    nasc_aluno: true,
    idade: true,
    sexo_aluno: true,
    t_sanguineo: true,
    altura_aluno: true,
    peso_aluno: true,
    nome_respons: true,
    tel_respons: true,
    tel_aluno: true,
    email_aluno: true,
    endereco_aluno: true,
    data_insc: true,
    grad_aluno: true,
  });

  const getAlunos = async () => {
    const response = await axios.get(`${config.urlRoot}/listarAlunos`);
    setAlunos(response.data.data);
  };

  useEffect(() => {
    getAlunos();
  }, []);

  const handleCheckboxChange = (field) => {
    if (field === "id_aluno") return;

    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectedFields((prev) => {
      const updatedFields = { ...prev };
      Object.keys(updatedFields).forEach((field) => {
        if (field !== "id_aluno") {
          updatedFields[field] = isChecked;
        }
      });
      return updatedFields;
    });
  };

  const filteredAlunos = alunos.map((aluno) => {
    const filtered = {};
    Object.keys(selectedFields).forEach((field) => {
      if (selectedFields[field]) {
        filtered[field] = aluno[field];
      }
    });
    return filtered;
  });

  return (
    <Container>
      <Title>Exportar para excel</Title>
      <CheckboxLabel>
        <input
          type="checkbox"
          checked={Object.values(selectedFields).every(Boolean)}
          onChange={handleSelectAllChange}
        />
        Selecionar Todos
      </CheckboxLabel>
      <CheckboxContainer>
        {Object.keys(selectedFields).map((field) => (
          <CheckboxLabel key={field}>
            <input
              type="checkbox"
              checked={selectedFields[field]}
              onChange={() => handleCheckboxChange(field)}
              disabled={field === "id_aluno"} // Desabilitar checkbox para id_aluno
            />
            {fieldTitles[field]}
          </CheckboxLabel>
        ))}
      </CheckboxContainer>
      <FieldList>
        {filteredAlunos.map((aluno, index) => (
          <div key={index}>
            <p><strong>Aluno {index + 1}:</strong></p>
            {Object.entries(aluno).map(([key, value]) => (
              <p key={key}>
                <strong>{fieldTitles[key]}:</strong> {value}
              </p>
            ))}
            <hr />
          </div>
        ))}
      </FieldList>
    </Container>
  );
};

export default ExcelEdit;
