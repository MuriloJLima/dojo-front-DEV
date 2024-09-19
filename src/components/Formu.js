import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import config from '../config/config.json';
import { toast, ToastContainer } from "react-toastify";
import InputMask from 'react-input-mask';

const FormContainer = styled.div`
  width: 600%;
  max-height: 570px;
  padding: 20px; 
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 700px) {
    flex-direction: column;
    margin-bottom: 15px;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 5px;

  &:not(:last-child) {
    @media (max-width: 600px) {
      margin-right: 0;
      margin-bottom: 15px;
    }
  }
`;

const Label = styled.label`
  font-size: 1.0rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 7px;
  font-size: 1rem;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ccc'};
  border-radius: 6px;
  transition: border-color 0.3s;

  &:focus {
    border-color: ${props => props.error ? '#e74c3c' : '#007BFF'};
    outline: none;
  }
`;

const Select = styled.select`
  padding: 7px;
  font-size: 1rem;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ccc'};
  border-radius: 6px;
  transition: border-color 0.3s;

  &:focus {
    border-color: ${props => props.error ? '#e74c3c' : '#007BFF'};
    outline: none;
  }
`;

const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 0.875rem;
  margin: 5px 0 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  width: 50%;
  padding: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background-color: #007BFF;
  border: none;
  border-radius: 6px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  label {
    margin-left: 8px;
    font-size: 14px;
    color: #333;  // Cor do texto harmoniosa
    cursor: pointer;
  }
`;

const StyledCheckbox = styled.input`
  position: relative;
  width: 18px;
  height: 18px;
  -webkit-appearance: none;
  appearance: none;
  border: 2px solid #007BFF;  // Cor de destaque para combinar com o projeto
  border-radius: 50%;  // Deixa a checkbox arredondada
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:checked {
    background-color: #007BFF;  // Cor de fundo quando selecionada
    border-color: #007BFF;
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }

  &:hover {
    border-color: #0056b3;  // Cor ao passar o mouse por cima
  }
`
const CustomHR = styled.hr`
  margin-top: 10px;
  margin-bottom: 10px;
  border: 0;
  height: 1px; /* Ajuste a espessura */
  background-color: #e0e0e0; /* Cor desejada */
`;

const SmallFormGroup = styled(FormGroup)`
  flex: 0 0 0%;
`;

const Formu = () => {

  const [aluno, setAluno] = useState({
    dados_aluno: {
      nome_aluno: "",
      nasc_aluno: "",
      sexo_aluno: "",
      altura_aluno: "",
      peso_aluno: "",
      t_sanguineo: "",
      tel_aluno: "",
      email_aluno: "",
      endereco_aluno: "",
    },
    dados_respons: {
      nome_respons: "",
      tel_respons: "",
    },
    dados_matricula: {
      matri_dojo: "",
      dados_modalidades: {
        dados_karate: {
          is_aluno: false,
          matri_federacao: "",
          data_insc: "",
          grad_aluno: "",
        },
        dados_muaythai: {
          is_aluno: false,
          matri_federacao: "",
          data_insc: "",
          grad_aluno: "",
        }
      }
    },
    is_adm: false
  });

  const [idade, setIdade] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [idError, setIdError] = useState("");

  const [modalidadeError, setModalidadeError] = useState('');

  const getAlunos = async () => {
    try {
      const response = await axios.get(`${config.urlRoot}/listarAlunos`);
      const alunosData = response.data.data;
      setAlunos(alunosData);

      const ids = alunosData.map(a => parseInt(a.dados_matricula.matri_dojo, 10)).filter(id => !isNaN(id));
      const maxId = Math.max(...ids, 0);
      const nextId = (maxId + 1).toString().padStart(4, '0');

      setAluno(prevState => ({
        ...prevState,
        dados_matricula: {
          ...prevState.dados_matricula,
          matri_dojo: nextId
        }
      }));


    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  useEffect(() => {
    getAlunos();
  }, []);

  useEffect(() => {
    if (aluno.dados_aluno.nasc_aluno) {
      const birthDate = new Date(aluno.dados_aluno.nasc_aluno);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      setIdade(age);
    }
  }, [aluno.dados_aluno.nasc_aluno]);

  // Função para atualizar um campo aninhado baseado no caminho do name
  const updateNestedState = (obj, path, value) => {
    const fields = path.split('.');
    return fields.reduce((acc, field, index) => {
      if (index === fields.length - 1) {
        acc[field] = value;  // Atualiza o campo no último nível
      } else {
        acc[field] = acc[field] || {};  // Garante que o nível intermediário exista
      }
      return acc[field];
    }, obj);
  };

  const handleCheckboxChange = async (e) => {
    const { name, checked } = e.target;  // Pega o nome do checkbox e se está checado

    setAluno(prevState => {
      const updatedAluno = { ...prevState };  // Cria uma cópia do estado anterior

      // Atualiza apenas os campos de karate.is_aluno ou muaythai.is_aluno
      if (name === "dados_karate.is_aluno") {
        updatedAluno.dados_matricula.dados_modalidades.dados_karate.is_aluno = checked;
      } else if (name === "dados_muaythai.is_aluno") {
        updatedAluno.dados_matricula.dados_modalidades.dados_muaythai.is_aluno = checked;
      }

      return updatedAluno;  // Retorna o novo estado atualizado
    });
  };


  const handleChange = async (e) => {
    const { name, value } = e.target;


    // Atualiza o estado do aluno de forma dinâmica para qualquer campo aninhado
    setAluno(prevState => {
      const updatedAluno = { ...prevState };  // Cria uma cópia do estado anterior
      updateNestedState(updatedAluno, name, value);  // Atualiza o campo aninhado

      return updatedAluno;  // Retorna o novo estado atualizado
    });

    if (name === "dados_matricula.matri_dojo") {
      const existingAluno = alunos.find(a => a.dados_matricula.matri_dojo === value);
      if (existingAluno) {
        setIdError("Esta matrícula já está em uso.");
      } else {
        setIdError("");
      }
    }


  };

  //captura a data de hoje para validação no campo de data
  const hoje = new Date().toISOString().split('T')[0];


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { dados_karate, dados_muaythai } = aluno.dados_matricula.dados_modalidades;

    if (!dados_karate.is_aluno && !dados_muaythai.is_aluno) {
      setModalidadeError('Por favor, selecione pelo menos uma modalidade.');
      return
    }

    setModalidadeError('')

    if (idError) {
      return; // Não permite o envio se houver erro
    }

    try {
      const response = await axios.post(`${config.urlRoot}/cadastrarAlunos`, aluno);
      toast.success(response.data.mensagemStatus);
      setAluno({
        dados_aluno: {
          nome_aluno: "",
          nasc_aluno: "",
          sexo_aluno: "",
          altura_aluno: "",
          peso_aluno: "",
          t_sanguineo: "",
          tel_aluno: "",
          email_aluno: "",
          endereco_aluno: "",
        },
        dados_respons: {
          nome_respons: "",
          tel_respons: "",
        },
        dados_matricula: {
          dados_modalidades: {
            dados_karate: {
              is_aluno: false,
              matri_federacao: "",
              data_insc: "",
              grad_aluno: "",
            },
            dados_muaythai: {
              is_aluno: false,
              matri_federacao: "",
              data_insc: "",
              grad_aluno: "",
            }
          }
        },
        is_adm: false
      });
      setIdade(null);
      getAlunos()
    } catch (error) {
      console.error("Erro ao cadastrar o aluno:", error);
      // Aqui você pode tratar o erro, como exibir uma mensagem para o usuário
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormRow>
          <SmallFormGroup>
            <Label>Matrícula:</Label>
            <Input
              type="text"
              name="dados_matricula.matri_dojo"
              value={aluno.dados_matricula.matri_dojo}
              onChange={handleChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              maxLength={4}
              required
              error={!!idError}
            />
            {idError && <ErrorText>{idError}</ErrorText>}
          </SmallFormGroup>
          <FormGroup>
            <Label>Nome Completo:</Label>
            <Input type="text" name="dados_aluno.nome_aluno" value={aluno.dados_aluno.nome_aluno} onChange={handleChange} required />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label>Data de Nascimento:</Label>
            <Input type="date" name="dados_aluno.nasc_aluno" value={aluno.dados_aluno.nasc_aluno} onChange={handleChange} max={hoje} required />
          </FormGroup>
          <FormGroup>
            <Label>Sexo:</Label>
            <Select name="dados_aluno.sexo_aluno" value={aluno.dados_aluno.sexo_aluno} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </Select>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label>Altura (cm):</Label>
            <Input type="text"
              name="dados_aluno.altura_aluno"
              value={aluno.dados_aluno.altura_aluno}
              onChange={handleChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              placeholder="ex: 150"
              maxLength={3} />
          </FormGroup>
          <FormGroup>
            <Label>Peso (kg):</Label>
            <Input type="text"
              name="dados_aluno.peso_aluno"
              value={aluno.dados_aluno.peso_aluno}
              onChange={handleChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              placeholder="ex: 50"
              maxLength={3} />
          </FormGroup>
          <FormGroup>
            <Label>Tipo Sanguíneo:</Label>
            <Select name="dados_aluno.t_sanguineo" value={aluno.dados_aluno.t_sanguineo} onChange={handleChange}>
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
        {idade !== null && idade < 18 ? (
          <>
            <FormGroup>
              <Label>Nome Completo do responsável:</Label>
              <Input type="text" name="dados_respons.nome_respons" value={aluno.dados_respons.nome_respons} onChange={handleChange} required />
            </FormGroup>
            <FormRow>
              <FormGroup>
                <Label>Telefone (responsável):</Label>
                <InputMask
                  mask="(99) 99999 9999"
                  value={aluno.dados_respons.tel_respons}
                  onChange={handleChange}
                >
                  {(inputProps) => <Input {...inputProps} type="tel" name="dados_respons.tel_respons" required />}
                </InputMask>
              </FormGroup>
              <FormGroup>
                <Label>Telefone (aluno):</Label>
                <InputMask
                  mask="(99) 99999 9999"
                  value={aluno.dados_aluno.tel_aluno}
                  onChange={handleChange}
                >
                  {(inputProps) => <Input {...inputProps} type="tel" name="dados_aluno.tel_aluno" />}
                </InputMask>
              </FormGroup>
            </FormRow>
            <FormGroup>
              <Label>Email:</Label>
              <Input type="email" name="dados_aluno.email_aluno" value={aluno.dados_aluno.email_aluno} onChange={handleChange} required />
            </FormGroup>
          </>
        ) : (
          <FormRow>
            <FormGroup>
              <Label>Telefone:</Label>
              <InputMask
                mask="(99) 99999 9999"
                value={aluno.dados_aluno.tel_aluno}
                onChange={handleChange}
              >
                {(inputProps) => <Input {...inputProps} type="tel" name="dados_aluno.tel_aluno" required />}
              </InputMask>
            </FormGroup>
            <FormGroup>
              <Label>Email:</Label>
              <Input type="email" name="dados_aluno.email_aluno" value={aluno.dados_aluno.email_aluno} onChange={handleChange} required />
            </FormGroup>
          </FormRow>
        )}
        <FormRow>
          <FormGroup>
            <Label>Endereço Completo:</Label>
            <Input
              type="text"
              name="dados_aluno.endereco_aluno"
              value={aluno.dados_aluno.endereco_aluno}
              onChange={handleChange}
              placeholder="ex: Rua das Flores, 123"
              required
            />
          </FormGroup>
          <SmallFormGroup>
            <Label>Administrador:</Label>
            <Select name="is_adm" value={aluno.is_adm} onChange={handleChange} required>
              <option value={false}>Não</option>
              <option value={true}>Sim</option>
            </Select>

          </SmallFormGroup>
        </FormRow>


        <FormGroup>
          <Label>Modalidades:</Label>

          <CheckboxContainer>
            <StyledCheckbox
              type="checkbox"
              name="dados_karate.is_aluno"
              onChange={handleCheckboxChange}
              checked={aluno.dados_matricula.dados_modalidades.dados_karate.is_aluno || false}
            />
            <Label>Karate</Label>
          </CheckboxContainer>

          {aluno.dados_matricula.dados_modalidades.dados_karate.is_aluno === true && (
            <>
              <FormRow>
                <FormGroup>
                  <Label>Data de Inscrição:</Label>
                  <Input type="date" name="dados_matricula.dados_modalidades.dados_karate.data_insc" value={aluno.dados_matricula.dados_modalidades.dados_karate.data_insc} onChange={handleChange} max={hoje} required />
                </FormGroup>
                <FormGroup>
                  <Label>Graduação:</Label>
                  <Select name="dados_matricula.dados_modalidades.dados_karate.grad_aluno" value={aluno.dados_matricula.dados_modalidades.dados_karate.grad_aluno} onChange={handleChange} required>
                    <option value="">Selecione</option>
                    <option value="Faixa-Branca">Faixa-Branca</option>
                    <option value="Faixa-Amarela">Faixa-Amarela</option>
                    <option value="Faixa-Vermelha">Faixa-Vermelha</option>
                    <option value="Faixa-Laranja">Faixa-Laranja</option>
                    <option value="Faixa-Verde">Faixa-Verde</option>
                    <option value="Faixa-Roxa">Faixa-Roxa</option>
                    <option value="Faixa-Marrom">Faixa-Marrom</option>
                    <option value="Faixa-Preta">Faixa-Preta</option>
                  </Select>
                </FormGroup>
                <SmallFormGroup>
                  <Label>Matrícula da federação:</Label>
                  <Input
                    type="text"
                    name="dados_matricula.dados_modalidades.dados_karate.matri_federacao"
                    value={aluno.dados_matricula.dados_modalidades.dados_karate.matri_federacao}
                    onChange={handleChange}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                  />

                </SmallFormGroup>
              </FormRow>

              <CustomHR />
            </>


          )}

          <CheckboxContainer>
            <StyledCheckbox
              type="checkbox"
              name="dados_muaythai.is_aluno"
              onChange={handleCheckboxChange}
              checked={aluno.dados_matricula.dados_modalidades.dados_muaythai.is_aluno || false}
            />
            <Label>Muay Thai</Label>
          </CheckboxContainer>

          {aluno.dados_matricula.dados_modalidades.dados_muaythai.is_aluno === true && (
            <>
              <FormRow>
                <FormGroup>
                  <Label>Data de Inscrição:</Label>
                  <Input type="date" name="dados_matricula.dados_modalidades.dados_muaythai.data_insc" value={aluno.dados_matricula.dados_modalidades.dados_muaythai.data_insc} onChange={handleChange} max={hoje} required />
                </FormGroup>
                <FormGroup>
                  <Label>Graduação:</Label>
                  <Select name="dados_matricula.dados_modalidades.dados_muaythai.grad_aluno" value={aluno.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno} onChange={handleChange} required>
                    <option value="">Selecione</option>
                    <option value="Branca">Branca</option>
                    <option value="Branca ponta Vermelha">Branca ponta Vermelha</option>
                    <option value="Vermelha">Vermelha</option>
                    <option value="Vermelha ponta Azul clara">Vermelha ponta Azul clara</option>
                    <option value="Azul clara">Azul clara</option>
                    <option value="Azul clara ponta Azul escura">Azul clara ponta Azul escura</option>
                    <option value="Azul escura">Azul escura</option>
                    <option value="Azul escura ponta Preta">Azul escura ponta Preta</option>
                    <option value="Preta">Preta</option>

                  </Select>
                </FormGroup>

                <SmallFormGroup>
                  <Label>Matrícula da federação:</Label>
                  <Input
                    type="text"
                    name="dados_matricula.dados_modalidades.dados_muaythai.matri_federacao"
                    value={aluno.dados_matricula.dados_modalidades.dados_muaythai.matri_federacao}
                    onChange={handleChange}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                  />

                </SmallFormGroup>
              </FormRow>
            </>
          )}
          {modalidadeError && <ErrorText>{modalidadeError}</ErrorText>}
        </FormGroup>



        <ButtonContainer>
          <Button type="submit" disabled={!!idError}>Cadastrar</Button>
        </ButtonContainer>
      </form>
      <ToastContainer
        style={{
          color: '#808080',
          position: 'fixed',
          right: '-400%',
          zIndex: 9999
        }}
        autoClose={3000}
      />
    </FormContainer>
  );
};

export default Formu;
