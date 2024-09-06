import React, { useState, useEffect } from "react";
import styled from "styled-components";
import config from '../config/config.json';
import axios from "axios";
import * as XLSX from "xlsx";  // Importa a biblioteca xlsx

const Container = styled.div`
  width: 600%;
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

const ExportButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  
  &:hover {
    background-color: #218838;
  }
`;

const fieldTitles = {
  matricula_aluno: "Matrícula",
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

const padIdAluno = (id) => {
  return id.toString().padStart(4, '0');
};

const formatDateToBrazilian = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const calculateAge = (birthdate) => {
  const [year, month, day] = birthdate.split("-");
  const birthDateObj = new Date(year, month - 1, day);
  const ageDifMs = Date.now() - birthDateObj.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const formatSexoAluno = (sexo) => {
  switch (sexo) {
    case "M":
      return "Masculino";
    case "F":
      return "Feminino";
    case "O":
      return "Outro";
    default:
      return sexo;
  }
};

const ExcelEdit = () => {
  const [alunos, setAlunos] = useState([]);
  const [selectedFields, setSelectedFields] = useState({
    matricula_aluno: true,
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
    const alunosComDadosTratados = response.data.data.map((aluno) => ({
      ...aluno,
      matricula_aluno: padIdAluno(aluno.matricula_aluno),
      nasc_aluno: formatDateToBrazilian(aluno.nasc_aluno),
      data_insc: formatDateToBrazilian(aluno.data_insc),
      idade: calculateAge(aluno.nasc_aluno),
      sexo_aluno: formatSexoAluno(aluno.sexo_aluno),
    }));
    setAlunos(alunosComDadosTratados);
  };

  useEffect(() => {
    getAlunos();
  }, []);

  const handleCheckboxChange = (field) => {
    if (field === "matricula_aluno") return;

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
        if (field !== "matricula_aluno") {
          updatedFields[field] = isChecked;
        }
      });
      return updatedFields;
    });
  };

  const exportToExcel = () => {
    const filteredAlunos = alunos.map((aluno) => {
      const filtered = {};
      Object.keys(selectedFields).forEach((field) => {
        if (selectedFields[field]) {
          filtered[fieldTitles[field]] = aluno[field];
        }
      });
      return filtered;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredAlunos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Alunos");
    XLSX.writeFile(workbook, "Alunos.xlsx");
  };

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
              disabled={field === "matricula_aluno"}
            />
            {fieldTitles[field]}
          </CheckboxLabel>
        ))}
      </CheckboxContainer>
      <ExportButton onClick={exportToExcel}>
        Exportar para Excel
      </ExportButton>
    </Container>
  );
};

export default ExcelEdit;
