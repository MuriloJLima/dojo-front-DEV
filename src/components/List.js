import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit, FaSearch, FaFilter } from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert'; // Importa o react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa o CSS do react-confirm-alert
import config from '../config/config.json';
import { toast, ToastContainer } from "react-toastify";

import Aluno from "./Aluno";

const Table = styled.table`
  width: 120%;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
  @media (max-width: 968px) {
     width: 90%;
    }
  }
`;

export const Thead = styled.thead``;

export const Tr = styled.tr`
  border-bottom: 1px solid #e0e0e0;
`;

export const Th = styled.th`
  text-align: center;
  padding: 15px 10px;
   @media (max-width: 768px) {
    &:nth-child(n+5):not(:nth-last-child(2)):not(:last-child) {
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
  padding: 10px 10px;
  
  @media (max-width: 768px) {
    &:nth-child(n+5):not(:nth-last-child(2)):not(:last-child) {
      display: none;
    }
  }
  @media (max-width: 500px) {
    &:nth-child(n+4):not(:last-child) {
      display: none;
    }
  }
`;

const FilterWrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const FilterLabel = styled.span`
  color: #808080;

  cursor: pointer; /* Faz com que o cursor indique que é clicável */
`;

const FilterSelect = styled.select`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0; /* Deixa o select invisível */
  cursor: pointer; /* Mantém o cursor como pointer */
`;



const List = ({ onAlunoSelect }) => {
  const [alunos, setAlunos] = useState([]);
  const [filterModalidade, setFilterModalidade] = useState("todos");
 

  const getAlunos = async () => {
    const response = await axios.get(`${config.urlRoot}/listarAlunos`);
    // Ordenar os dados pelo campo matri_dojo
    const sortedData = response.data.data.sort((a, b) => a.dados_matricula.matri_dojo - b.dados_matricula.matri_dojo);
    setAlunos(sortedData);
  };
  
  useEffect(() => {
    getAlunos();
  }, []);
  

  
  // calcula a idade do aluno
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

  //função para deletar o aluno através do id
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

  // Função para verificar as modalidades
  const getModalidades = (modalidades) => {
    const { dados_karate, dados_muaythai } = modalidades;
    let inscricoes = [];

    if (dados_karate.is_aluno) inscricoes.push("Karate");
    if (dados_muaythai.is_aluno) inscricoes.push("Muay Thai");

    return inscricoes.length > 0 ? inscricoes.join(", ") : "Nenhuma";
  };

  // Função para filtrar alunos com base na modalidade
  const filtrarAlunosPorModalidade = (aluno) => {
    const modalidades = getModalidades(aluno.dados_matricula.dados_modalidades);
    switch (filterModalidade) {
      case "Karate":
        return modalidades.includes("Karate");
      case "Muay Thai":
        return modalidades.includes("Muay Thai");
      case "Karate e Muay Thai":
        return modalidades.includes("Karate") && modalidades.includes("Muay Thai");
      default:
        return true; // Exibe todos os alunos
    }
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
          <Th>Modalidades</Th> 

         
            <Th style={{ color: '#808080', cursor: 'pointer' }}>
              <FilterWrapper>
                 <FilterLabel>Filtrar</FilterLabel>
                 <FilterSelect
                   value={filterModalidade}
                   onChange={(e) => setFilterModalidade(e.target.value)}
                 >
                   <option value="Todos">Todos</option>
                   <option value="Karate">Karate</option>
                   <option value="Muay Thai">Muay Thai</option>
                   <option value="Karate e Muay Thai">Karate e Muay Thai</option>
                 </FilterSelect>
               </FilterWrapper>
            </Th>
        </Tr>
        
      </Thead>
      
      <tbody>
      {alunos.filter(filtrarAlunosPorModalidade).map((item, i) => (
            <Tr key={i}>
              <Td alignCenter width="5%">
                <FaSearch onClick={() => handleAlunoClick(`S:${item._id}`)} />
              </Td>
              <Td>{item.dados_matricula.matri_dojo}</Td>
              <Td>{item.dados_aluno.nome_aluno}</Td>
              <Td>{calculateAge(item.dados_aluno.nasc_aluno)}</Td>
              <Td>{item.dados_respons.tel_respons || item.dados_aluno.tel_aluno}</Td>
              <Td>{getModalidades(item.dados_matricula.dados_modalidades)}</Td>
              <Td>
                <Td alignCenter width="5%">
                  <FaEdit onClick={() => handleAlunoClick(`E:${item._id}`)} />
                </Td>
                <Td alignCenter width="5%">
                  <FaTrash onClick={() => handleDelete(item._id)} />
                </Td>
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
