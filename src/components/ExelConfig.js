import React, { useState, useEffect } from "react";
import styled from "styled-components";
import config from '../config/config.json';
import axios from "axios";
import * as XLSX from "xlsx";
import { BiBorderTop } from "react-icons/bi";

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
  align-items: center;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
`;

const FieldSelection = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  @media (max-width: 700px) {
    flex-direction: column;
    border-top: 1px solid #e0e0e0
  }
`;

const FieldGroup = styled.div`
  flex: 1;
  padding: 10px;
  @media (max-width: 700px) {
    border-top: 1px solid #e0e0e0
  }
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
  matri_dojo: "Matrícula do Dojo",
  nome_aluno: "Nome Completo",
  nasc_aluno: "Data de Nascimento",
  idade: "Idade",
  sexo_aluno: "Sexo",
  altura_aluno: "Altura",
  peso_aluno: "Peso",
  t_sanguineo: "Tipo Sanguíneo",
  tel_aluno: "Telefone do Atleta",
  email_aluno: "Email",
  endereco_aluno: "Endereço",
  nome_respons: "Nome do Responsável",
  tel_respons: "Telefone do Responsável",
  modalidades: "Modalidades Inscritas",
  matri_federacao_karate: "Matr. da federação - karate",
  data_insc_karate: "Data Inscrição - Karate",
  grad_aluno_karate: "Graduação - Karate",
  matri_federacao_muaythai: "Matr. da federação - Muay Thai",
  data_insc_muaythai: "Data Inscrição - Muay Thai",
  grad_aluno_muaythai: "Graduação - Muay Thai",
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
    matri_dojo: true, 
    nome_aluno: true,
    nasc_aluno: true,
    idade: true,
    modalidades: true,
    tel_aluno: true,
    email_aluno: true,
    endereco_aluno: true,
    nome_respons: true,
    tel_respons: true,
    sexo_aluno: true,
    altura_aluno: true,
    peso_aluno: true,
    t_sanguineo: true,
    matri_federacao_karate: true,
    data_insc_karate: true,
    grad_aluno_karate: true,
    matri_federacao_muaythai: true,
    data_insc_muaythai: true,
    grad_aluno_muaythai: true,

  });

  // Função para retornar as modalidades inscritas
  const getModalidadesInscritas = (modalidades) => {
    const inscricoes = [];
    if (modalidades.dados_karate.is_aluno) {
      inscricoes.push("Karate");
    }
    if (modalidades.dados_muaythai.is_aluno) {
      inscricoes.push("Muay Thai");
    }
    return inscricoes.length > 0 ? inscricoes.join(", ") : "Nenhuma";
  };

  // Função para calcular a idade já existente
  const calculateAge = (birthdate) => {
    const [year, month, day] = birthdate.split("-");
    const birthDateObj = new Date(year, month - 1, day);
    const ageDifMs = Date.now() - birthDateObj.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const [loading, setLoading] = useState(false);

  const getAlunos = async () => {
    const response = await axios.get(`${config.urlRoot}/listarAlunos`);
    const alunosComDadosTratados = response.data.data.map((aluno) => ({
      nome_aluno: aluno.dados_aluno.nome_aluno,
      nasc_aluno: formatDateToBrazilian(aluno.dados_aluno.nasc_aluno),
      idade: calculateAge(aluno.dados_aluno.nasc_aluno), // Calculo da idade
      sexo_aluno: formatSexoAluno(aluno.dados_aluno.sexo_aluno),
      altura_aluno: aluno.dados_aluno.altura_aluno,
      peso_aluno: aluno.dados_aluno.peso_aluno,
      t_sanguineo: aluno.dados_aluno.t_sanguineo,
      tel_aluno: aluno.dados_aluno.tel_aluno,
      email_aluno: aluno.dados_aluno.email_aluno,
      endereco_aluno: aluno.dados_aluno.endereco_aluno,
      nome_respons: aluno.dados_respons.nome_respons,
      tel_respons: aluno.dados_respons.tel_respons,
      matri_dojo: padIdAluno(aluno.dados_matricula.matri_dojo),
      data_insc_karate: aluno.dados_matricula.dados_modalidades.dados_karate.data_insc
        ? formatDateToBrazilian(aluno.dados_matricula.dados_modalidades.dados_karate.data_insc)
        : "",
      grad_aluno_karate: aluno.dados_matricula.dados_modalidades.dados_karate.grad_aluno,
      data_insc_muaythai: aluno.dados_matricula.dados_modalidades.dados_muaythai.data_insc
        ? formatDateToBrazilian(aluno.dados_matricula.dados_modalidades.dados_muaythai.data_insc)
        : "",
      grad_aluno_muaythai: aluno.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno,
      matri_federacao_karate: aluno.dados_matricula.dados_modalidades.dados_karate.matri_federacao,
      matri_federacao_muaythai: aluno.dados_matricula.dados_modalidades.dados_muaythai.matri_federacao,
      modalidades: getModalidadesInscritas(aluno.dados_matricula.dados_modalidades) // Modalidades inscritas
    }));
    setAlunos(alunosComDadosTratados);
  };

  useEffect(() => {
    getAlunos();
  }, []);

  const handleCheckboxChange = (field) => {
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
        updatedFields[field] = isChecked;
      });
      return updatedFields;
    });
  };

  const exportToExcel = () => {
    setLoading(true);
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
    XLSX.writeFile(workbook, "Atletas.xlsx");
    setLoading(false);
  };

  return (
    <Container>
      <Title>Exportar para Excel</Title>
      <CheckboxLabel style={{ marginLeft: '10px' }}>
        <input
          type="checkbox"
          checked={Object.values(selectedFields).every((field) => field)}
          onChange={handleSelectAllChange}
        />
        Selecionar todos os campos
      </CheckboxLabel>
      <Content>
        <FieldSelection>
          <FieldGroup>
            <FieldGroupTitle>Informações do Atleta</FieldGroupTitle>
            <CheckboxContainer>
              {["matri_dojo", "nome_aluno", "nasc_aluno", "idade", "modalidades"].map((field) => (
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
            <FieldGroupTitle>Informações adicionais</FieldGroupTitle>
            <CheckboxContainer>
              {["sexo_aluno", "altura_aluno", "peso_aluno", "t_sanguineo"].map((field) => (
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

      <Content>
      <FieldSelection style={{ borderTop: "1px solid #e0e0e0" }}>


          <FieldGroup>
            <FieldGroupTitle>Informações - Karate</FieldGroupTitle>
            <CheckboxContainer>
              {["matri_federacao_karate", "data_insc_karate", "grad_aluno_karate"].map((field) => (
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
            <FieldGroupTitle>Informações - Muay Thai</FieldGroupTitle>
            <CheckboxContainer>
              {["matri_federacao_muaythai", "data_insc_muaythai", "grad_aluno_muaythai"].map((field) => (
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
          Exportar para Excel
          {loading && <LoadingText>Exportando...</LoadingText>}
        </ExportButton>
      </ExportSection>
    </Container>
  );
};

export default ExcelEdit;
