import React, { useState, useEffect } from "react";
import styled from "styled-components";
import config from '../config/config.json';
import axios from "axios";
import * as XLSX from "xlsx";

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
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #007bff;
  margin-left: 10px
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const FieldSelection = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  @media (max-width: 700px) {
    flex-direction: column;
  }
  
`;

const FieldGroup = styled.div`
  flex: 1;
  padding: 10px;
`;

const FieldGroupTitle = styled.h3`
  font-size: 1.2rem;
  color: #343a40;
  margin-bottom: 10px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: #495057;
`;

const ExportSection = styled.div`
  text-align: center;
`;

const ExportButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 40px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const LoadingText = styled.span`
  display: inline-block;
  margin-left: 10px;
  font-size: 1rem;
  color: #fff;
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
  // const [alunos, setAlunos] = useState([]);
  // const [selectedFields, setSelectedFields] = useState({
  //   matricula_aluno: true,
  //   nome_aluno: true,
  //   nasc_aluno: true,
  //   idade: true,
  //   sexo_aluno: true,
  //   t_sanguineo: true,
  //   altura_aluno: true,
  //   peso_aluno: true,
  //   nome_respons: true,
  //   tel_respons: true,
  //   tel_aluno: true,
  //   email_aluno: true,
  //   endereco_aluno: true,
  //   data_insc: true,
  //   grad_aluno: true,
  // });

  // const [loading, setLoading] = useState(false);

  // const getAlunos = async () => {
  //   const response = await axios.get(`${config.urlRoot}/listarAlunos`);
  //   const alunosComDadosTratados = response.data.data.map((aluno) => ({
  //     ...aluno,
  //     matricula_aluno: padIdAluno(aluno.matricula_aluno),
  //     nasc_aluno: formatDateToBrazilian(aluno.nasc_aluno),
  //     data_insc: formatDateToBrazilian(aluno.data_insc),
  //     idade: calculateAge(aluno.nasc_aluno),
  //     sexo_aluno: formatSexoAluno(aluno.sexo_aluno),
  //   }));
  //   setAlunos(alunosComDadosTratados);
  // };

  // useEffect(() => {
  //   getAlunos();
  // }, []);

  // const handleCheckboxChange = (field) => {
  //   if (field === "matricula_aluno") return;

  //   setSelectedFields((prev) => ({
  //     ...prev,
  //     [field]: !prev[field],
  //   }));
  // };

  // const handleSelectAllChange = (e) => {
  //   const isChecked = e.target.checked;
  //   setSelectedFields((prev) => {
  //     const updatedFields = { ...prev };
  //     Object.keys(updatedFields).forEach((field) => {
  //       if (field !== "matricula_aluno") {
  //         updatedFields[field] = isChecked;
  //       }
  //     });
  //     return updatedFields;
  //   });
  // };

  // const exportToExcel = () => {
  //   setLoading(true);
  //   const filteredAlunos = alunos.map((aluno) => {
  //     const filtered = {};
  //     Object.keys(selectedFields).forEach((field) => {
  //       if (selectedFields[field]) {
  //         filtered[fieldTitles[field]] = aluno[field];
  //       }
  //     });
  //     return filtered;
  //   });

  //   const worksheet = XLSX.utils.json_to_sheet(filteredAlunos);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Alunos");
  //   XLSX.writeFile(workbook, "Alunos.xlsx");
  //   setLoading(false);
  // };

  return (
    <Container>
      <Title>Em manutenção</Title>
      {/* <Title>Exportar para Excel</Title>
      <CheckboxLabel style={{ marginLeft: '10px' }}>
              <input
                type="checkbox"
                checked={Object.values(selectedFields).every(Boolean)}
                onChange={handleSelectAllChange}
              />
              Selecionar Todos
            </CheckboxLabel>
      <Content>
        
        <FieldSelection>
        
          <FieldGroup>
           

            <FieldGroupTitle>Informações Pessoais</FieldGroupTitle>
            <CheckboxContainer>
              {["matricula_aluno", "nome_aluno", "nasc_aluno", "idade", "sexo_aluno"].map((field) => (
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
          </FieldGroup>

          <FieldGroup>
            <FieldGroupTitle>Contato</FieldGroupTitle>
            <CheckboxContainer>
              {["tel_aluno", "email_aluno", "endereco_aluno", "nome_respons", "tel_respons"].map((field) => (
                <CheckboxLabel key={field}>
                  <input
                    type="checkbox"
                    checked={selectedFields[field]}
                    onChange={() => handleCheckboxChange(field)}
                  />
                  {fieldTitles[field]}
                </CheckboxLabel>
              ))}
            </CheckboxContainer>
          </FieldGroup>
     
          <FieldGroup>
            <FieldGroupTitle>Outras Informações</FieldGroupTitle>
            <CheckboxContainer>
              {["t_sanguineo", "altura_aluno", "peso_aluno", "data_insc", "grad_aluno"].map((field) => (
                <CheckboxLabel key={field}>
                  <input
                    type="checkbox"
                    checked={selectedFields[field]}
                    onChange={() => handleCheckboxChange(field)}
                  />
                  {fieldTitles[field]}
                </CheckboxLabel>
              ))}
            </CheckboxContainer>
          </FieldGroup>
        </FieldSelection>
      </Content>

      <ExportSection>
        <ExportButton onClick={exportToExcel} disabled={loading}>
          {loading ? "Exportando..." : "Exportar para Excel"}
          {loading && <LoadingText>Processando...</LoadingText>}
        </ExportButton>
      </ExportSection> */}
    </Container>
  );
};

export default ExcelEdit;
