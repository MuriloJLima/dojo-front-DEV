import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit, FaSearch, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import config from '../config/config.json';
import Aluno from "./Aluno";

const Table = styled.table`
  width: 100%;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
`;



export const Thead = styled.thead``;

export const Tr = styled.tr`
  border-bottom: 1px solid #e0e0e0;
`;

export const Th = styled.th`
  text-align: center;
  padding: 15px 10px;
  @media (max-width: 768px) {
    &:nth-child(n+4) {
      display: none;
    }
  }
  @media (max-width: 500px) {
    &:nth-child(n+3) {
      display: none;
    }
  }
`;

export const Td = styled.td`
  text-align: center;
  padding: 15px 10px;
  border-bottom: 1px solid #e0e0e0;
  @media (max-width: 768px) {
    &:nth-child(n+4) {
      display: none;
    }
  }
  @media (max-width: 500px) {
    &:nth-child(n+3) {
      display: none;
    }
  }
`;

const List = ({ onAlunoSelect }) => {
  const [alunos, setAlunos] = useState([]);
  const [selectedAlunoId, setSelectedAlunoId] = useState(null);

  const getAlunos = async () => {
    const response = await axios.get(`${config.urlRoot}/listarAlunos`);
    console.log(response.data.data);
    setAlunos(response.data.data);
  };

  useEffect(() => {
    getAlunos();
  }, []);

  useEffect(() => {
    if (selectedAlunoId !== null) {
      onAlunoSelect(selectedAlunoId);
    }
  }, [selectedAlunoId, onAlunoSelect]);

  const formatId = (id) => {
    return id.toString().padStart(4, '0');
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  };

  const handleDelete = (id) => {
    console.log("aluno deletado", id);
  };

  const handleAlunoClick = (id) => {
    console.log("aluno listado", id);
    setSelectedAlunoId(id); // Atualiza o estado com o id do aluno selecionado
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th style={{ color: '#808080' }}>Perfil</Th>
          <Th>Matrícula</Th>
          <Th>Nome</Th>
          <Th>Idade</Th>
          <Th>Telefone</Th>
          <Th>Graduação</Th>
          <Th alignCenter width="5%">
            <FaFilter style={{ paddingInline: "100%" }} />
          </Th>
        </Tr>
      </Thead>
      <tbody>
        {alunos.map((item, i) => (
          <Tr key={i}>
            <Td alignCenter width="5%">
              <FaSearch onClick={() => handleAlunoClick(item.id_aluno)} />
            </Td>
            <Td>{formatId(item.id_aluno)}</Td>
            <Td>{item.nome_aluno}</Td>
            <Td>{calculateAge(item.nasc_aluno)}</Td>
            <Td>{item.tel_aluno}</Td>
            <Td>{item.grad_aluno}</Td>
            <Td alignCenter width="5%">
              <FaEdit />
            </Td>
            <Td alignCenter width="5%">
              <FaTrash onClick={() => handleDelete(item.id_aluno)} />
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
};

export default List;
