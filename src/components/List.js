import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit, FaSearch, FaSort } from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert'; // Importa o react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa o CSS do react-confirm-alert
import config from '../config/config.json';
import { toast, ToastContainer } from "react-toastify";

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
    &:nth-child(n+5):not(:last-child) {
      display: none;
    }
  }
  @media (max-width: 500px) {
    &:nth-child(n+4):not(:last-child) {
      display: none;
    }
  }
`;

export const Td = styled.td`
  text-align: center;
  padding: 15px 10px;
  border-bottom: 1px solid #e0e0e0;
  @media (max-width: 768px) {
    &:nth-child(n+5):not(:nth-last-child(2)):not(:last-child) {
      display: none;
    }
  }
  @media (max-width: 500px) {
    &:nth-child(n+4):not(:nth-last-child(2)):not(:last-child) {
      display: none;
    }
  }
`;


const List = ({ onAlunoSelect }) => {
  const [alunos, setAlunos] = useState([]);

  const getAlunos = async () => {
    const response = await axios.get(`${config.urlRoot}/listarAlunos`);
    // console.log(response.data.data);
    setAlunos(response.data.data);
  };

  useEffect(() => {
    getAlunos();
  }, []);

  

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

  const handleDelete = async (id) => {
    confirmAlert({
      message: 'Você tem certeza que deseja excluir este aluno?',
      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            await axios.delete(`${config.urlRoot}/excluirAlunos/${id}`);
            toast.success("Aluno deletado com sucesso!");

            setTimeout(() => {
              window.location.reload(); 
            }, 1000);
          }
        },
        {
          label: 'Não',
          onClick: () => {}
        }
      ]
    });
  };

  const handleAlunoClick = (id) => {
    onAlunoSelect(id);
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th style={{ color: '#808080' }}>Perfil</Th>
          <Th>Matrícula</Th>
          <Th>Nome Completo</Th>
          <Th>Idade</Th>
          <Th>Telefone</Th>
          <Th>Graduação</Th>
          <Th alignCenter width="5%">
            <FaSort style={{ paddingInline: "100%" }} />
          </Th>
        </Tr>
      </Thead>
      <tbody>
        {alunos.map((item, i) => (
          <Tr key={i}>
            <Td alignCenter width="5%">
              <FaSearch onClick={() => handleAlunoClick(`S:${item.id_aluno}`)} />
            </Td>
            <Td>{item.matricula_aluno}</Td>
            <Td>{item.nome_aluno}</Td>
            <Td>{calculateAge(item.nasc_aluno)}</Td>
            <Td>{item.tel_aluno}</Td>
            <Td>{item.grad_aluno}</Td>
            <Td alignCenter width="5%">
              <FaEdit onClick={() => handleAlunoClick(`E:${item.id_aluno}`)} />
            </Td>
            <Td alignCenter width="5%">
              <FaTrash onClick={() => handleDelete(item.id_aluno)} />
            </Td>
          </Tr>
        ))}
      </tbody>
      <ToastContainer
        style={{
          color: '#808080',
          position: 'fixed', // Fixa o container em relação à tela
          right: '-400%', // Distância da direita
          zIndex: 9999 // Garante que o toast fique acima de outros elementos
        }}
        autoClose={3000}
      />
  
    </Table>
  );
};

export default List;
