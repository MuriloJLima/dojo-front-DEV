import React, { useState } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  width: 90vw; max-width: 900px; margin: 5vh auto;
  padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px;
  background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormRow = styled.div`
  display: flex; justify-content: space-between;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  flex: 1; display: flex; flex-direction: column;
  &:not(:last-child) { margin-right: 20px; }
`;

const Label = styled.label`
  font-size: 1.2rem; font-weight: 600;
  color: #333; margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 12px; font-size: 1rem; border: 1px solid #ccc;
  border-radius: 6px; transition: border-color 0.3s;
  &:focus { border-color: #007BFF; outline: none; }
`;

const Select = styled.select`
  padding: 12px; font-size: 1rem; border: 1px solid #ccc;
  border-radius: 6px; transition: border-color 0.3s;
  &:focus { border-color: #007BFF; outline: none; }
`;

const Button = styled.button`
  width: 100%; padding: 15px;
  font-size: 1.2rem; font-weight: 600;
  color: #fff; background-color: #007BFF;
  border: none; border-radius: 6px; cursor: pointer;
  transition: background-color 0.3s;
  &:hover { background-color: #0056b3; }
`;

const Form = () => {
  const [student, setStudent] = useState({
    nome_aluno: "", nasc_aluno: "", sexo_aluno: "",
    altura_aluno: "", peso_aluno: "", t_sanguineo: "",
    tel_aluno: "", email_aluno: "", endereco_aluno: "",
    data_insc: "", grad_aluno: ""
  });

  const handleChange = (e) =>
    setStudent({ ...student, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Data:", student);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nome Completo:</Label>
          <Input type="text" name="nome_aluno" value={student.nome_aluno} onChange={handleChange} required />
        </FormGroup>
        <FormRow>
          <FormGroup>
            <Label>Data de Nascimento:</Label>
            <Input type="date" name="nasc_aluno" value={student.nasc_aluno} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Sexo:</Label>
            <Select name="sexo_aluno" value={student.sexo_aluno} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </Select>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label>Altura (cm):</Label>
            <Input type="number" name="altura_aluno" value={student.altura_aluno} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Peso (kg):</Label>
            <Input type="number" name="peso_aluno" value={student.peso_aluno} onChange={handleChange} required />
          </FormGroup>
          <FormGroup >
            <Label>Tipo Sanguíneo:</Label>
            <Select name="t_sanguineo" value={student.t_sanguineo} onChange={handleChange} required>
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
        <FormRow>
          <FormGroup style={{ maxWidth: '35%' }}>
            <Label>Telefone:</Label>
            <Input type="tel" name="tel_aluno" value={student.tel_aluno} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Email:</Label>
            <Input type="email" name="email_aluno" value={student.email_aluno} onChange={handleChange} required />
          </FormGroup>
        </FormRow>
        <FormGroup>
          <Label>Endereço Completo:</Label>
          <Input type="text" name="endereco_aluno" value={student.endereco_aluno} onChange={handleChange} required />
        </FormGroup>
        <FormRow>
          <FormGroup>
            <Label>Data de Inscrição:</Label>
            <Input type="date" name="data_insc" value={student.data_insc} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Graduação:</Label>
            <Input type="text" name="grad_aluno" value={student.grad_aluno} onChange={handleChange} required />
          </FormGroup>
        </FormRow>
        <Button type="submit">Enviar</Button>
      </form>
    </FormContainer>
  );
};

export default Form;
