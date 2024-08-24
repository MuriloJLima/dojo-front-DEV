import React, { useState } from "react";
import GlobalStyle from "./styles/global";
import styled from "styled-components";
import List from "./components/List.js";
import Formu from "./components/Formu.js";
import Aluno from "./components/Aluno.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useEffect } from "react";

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

const FloatingForm2 = styled.div`
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

const Overlay2 = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 500%;
  height: 500%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

function App() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState(null);

  const handleAddStudent = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleCloseAluno = () => {
    setSelectedAlunoId(null);

    console.log(selectedAlunoId)
  };

  const handleExportExcel = () => {
    toast.success("Exportar dados para Excel");
  };

  const handleAlunoSelect = (id) => {
    setSelectedAlunoId(id);
  };


  return (
    <>
      <Container>
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

      {selectedAlunoId !== null && (
        <>
          <Overlay2 onClick={handleCloseAluno} />
          <FloatingForm2>
            <Aluno id={selectedAlunoId} />
          </FloatingForm2>
        </>
      )}
      


      <ToastContainer autoClose={3000} />
      <GlobalStyle />
    </>
  );
}

export default App;
