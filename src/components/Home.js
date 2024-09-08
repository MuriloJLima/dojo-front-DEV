import React, { useState } from "react";
import GlobalStyle from "../styles/global.js";
import styled from "styled-components";

import List from "./List.js";
import Formu from "./Formu.js";
import Aluno from "./Aluno.js";
import EdicaoAluno from "./EdicaoAluno.js";
import ExcelEdit from "./ExelConfig.js";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// import config from './config/config.json';

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2``;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const FloatingForm = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 500%;
  height: 500%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;


function Home({ onLogout }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchAlunoId, setSearchAlunoId] = useState(null);
  const [editAlunoId, setEditAlunoId] = useState(null);

  const [isExcelVisible, setIsExcelVisible] = useState(false);

  const handleAddStudent = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    window.location.reload()
  };

  const handleCloseAluno = () => {
    setSearchAlunoId(null);
    setEditAlunoId(null);
  };

  const handleCloseEditAluno = () => {
    setSearchAlunoId(null);
    setEditAlunoId(null);
    window.location.reload()
  };

  const handleCloseExcel = () => {
    setIsExcelVisible(false)
  };

  const handleExportExcel = () => {
    setIsExcelVisible(true)
  };

  const handleAlunoSelect = (id) => {
    // Verifica se o id começa com "S:"
    if (id.startsWith("S:")) {
      const idAluno = id.slice(2)

      setSearchAlunoId(idAluno)
    }
    // Verifica se o id começa com "E:"
    else if (id.startsWith("E:")) {
      const idAluno = id.slice(2)

      setEditAlunoId(idAluno)
    } else {
      console.log("Formato de ID desconhecido.");
    }
  };


  return (
    <>
      <Container>
      <button onClick={onLogout}>Logout</button>
        <Title>Alunos</Title>
        <ButtonGroup>
          <Button onClick={handleAddStudent}>Cadastrar Aluno</Button>
          <Button onClick={handleExportExcel}>Exportar em Excel</Button>
        </ButtonGroup>
        <List onAlunoSelect={handleAlunoSelect} />
      </Container>

      {isFormVisible && (
        <>
          <Overlay onClick={handleCloseForm} />
          <FloatingForm>
            <Formu />
          </FloatingForm>
        </>
      )}

      {searchAlunoId && (
        <>
          <Overlay onClick={handleCloseAluno} />
          <FloatingForm>
            <Aluno id={searchAlunoId} />
          </FloatingForm>
        </>
      )}

      {editAlunoId && (
        <>
          <Overlay onClick={handleCloseEditAluno} />
          <FloatingForm>
            <EdicaoAluno id={editAlunoId} />
          </FloatingForm>
        </>
      )}

      {isExcelVisible && (
        <>
          <Overlay onClick={handleCloseExcel} />
          <FloatingForm>
            <ExcelEdit />
          </FloatingForm>
        </>
      )}

      <ToastContainer autoClose={3000} />
      <GlobalStyle />
    </>
  );
}

export default Home;
