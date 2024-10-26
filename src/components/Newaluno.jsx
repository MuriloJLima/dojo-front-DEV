import axios from "axios";
import { useState, useEffect } from "react";
import styles from './Newaluno.module.css'
import config from '../config/config.json';
import { toast, ToastContainer } from "react-toastify";
import InputMask from 'react-input-mask';

export function Newaluno({ onClose }) {

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
        <div className={styles.overlay}>
            <div className={styles.modal}>


                <form onSubmit={handleSubmit}>
                    <button onClick={onClose} className={styles.closeButton}>X</button>
                    <div className={styles.formRow}>
                        <div className={styles.smalldiv}>
                            <label>Matrícula:</label>
                            <input
                                type="text"
                                name="dados_matricula.matri_dojo"
                                value={aluno.dados_matricula.matri_dojo}
                                onChange={handleChange}
                                oninput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }}
                                maxLength={4}
                                required
                                error={!!idError}
                            />
                            {idError && <p>{idError}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Nome Completo:</label>
                            <input type="text" name="dados_aluno.nome_aluno" value={aluno.dados_aluno.nome_aluno} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Data de Nascimento:</label>
                            <input type="date" name="dados_aluno.nasc_aluno" value={aluno.dados_aluno.nasc_aluno} onChange={handleChange} max={hoje} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Sexo:</label>
                            <select name="dados_aluno.sexo_aluno" value={aluno.dados_aluno.sexo_aluno} onChange={handleChange} required>
                                <option value="">Selecione</option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                                <option value="O">Outro</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Altura (cm):</label>
                            <input type="text"
                                name="dados_aluno.altura_aluno"
                                value={aluno.dados_aluno.altura_aluno}
                                onChange={handleChange}
                                oninput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }}
                                placeholder="ex: 150"
                                maxLength={3} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Peso (kg):</label>
                            <input type="text"
                                name="dados_aluno.peso_aluno"
                                value={aluno.dados_aluno.peso_aluno}
                                onChange={handleChange}
                                oninput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }}
                                placeholder="ex: 50"
                                maxLength={3} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Tipo Sanguíneo:</label>
                            <select name="dados_aluno.t_sanguineo" value={aluno.dados_aluno.t_sanguineo} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                    </div>
                    {idade !== null && idade < 18 ? (
                        <>
                            <div className={styles.formGroup}>
                                <label>Nome Completo do responsável:</label>
                                <input type="text" name="dados_respons.nome_respons" value={aluno.dados_respons.nome_respons} onChange={handleChange} required />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Telefone (responsável):</label>
                                    <InputMask
                                        mask="(99) 99999 9999"
                                        value={aluno.dados_respons.tel_respons}
                                        onChange={handleChange}
                                    >
                                        {(inputProps) => <input {...inputProps} type="tel" name="dados_respons.tel_respons" required />}
                                    </InputMask>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Telefone (aluno):</label>
                                    <InputMask
                                        mask="(99) 99999 9999"
                                        value={aluno.dados_aluno.tel_aluno}
                                        onChange={handleChange}
                                    >
                                        {(inputProps) => <input {...inputProps} type="tel" name="dados_aluno.tel_aluno" />}
                                    </InputMask>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email:</label>
                                <input type="email" name="dados_aluno.email_aluno" value={aluno.dados_aluno.email_aluno} onChange={handleChange} required />
                            </div>
                        </>
                    ) : (
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Telefone:</label>
                                <InputMask
                                    mask="(99) 99999 9999"
                                    value={aluno.dados_aluno.tel_aluno}
                                    onChange={handleChange}
                                >
                                    {(inputProps) => <input {...inputProps} type="tel" name="dados_aluno.tel_aluno" required />}
                                </InputMask>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email:</label>
                                <input type="email" name="dados_aluno.email_aluno" value={aluno.dados_aluno.email_aluno} onChange={handleChange} required />
                            </div>
                        </div>
                    )}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Endereço Completo:</label>
                            <input
                                type="text"
                                name="dados_aluno.endereco_aluno"
                                value={aluno.dados_aluno.endereco_aluno}
                                onChange={handleChange}
                                placeholder="ex: Rua das Flores, 123"
                                required
                            />
                        </div>
                        <div className={styles.smalldiv}>
                            <label>Administrador:</label>
                            <select name="is_adm" value={aluno.is_adm} onChange={handleChange} required>
                                <option value={false}>Não</option>
                                <option value={true}>Sim</option>
                            </select>

                        </div>
                    </div>


                    <div className={styles.formGroup}>
                        <label>Modalidades:</label>

                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                name="dados_karate.is_aluno"
                                onChange={handleCheckboxChange}
                                checked={aluno.dados_matricula.dados_modalidades.dados_karate.is_aluno || false}
                            />
                            <label>Karate</label>
                        </div>

                        {aluno.dados_matricula.dados_modalidades.dados_karate.is_aluno === true && (
                            <>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Data de Inscrição:</label>
                                        <input type="date" name="dados_matricula.dados_modalidades.dados_karate.data_insc" value={aluno.dados_matricula.dados_modalidades.dados_karate.data_insc} onChange={handleChange} max={hoje} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Graduação:</label>
                                        <select name="dados_matricula.dados_modalidades.dados_karate.grad_aluno" value={aluno.dados_matricula.dados_modalidades.dados_karate.grad_aluno} onChange={handleChange} required>
                                            <option value="">Selecione</option>
                                            <option value="Faixa-Branca">Faixa-Branca</option>
                                            <option value="Faixa-Amarela">Faixa-Amarela</option>
                                            <option value="Faixa-Vermelha">Faixa-Vermelha</option>
                                            <option value="Faixa-Laranja">Faixa-Laranja</option>
                                            <option value="Faixa-Verde">Faixa-Verde</option>
                                            <option value="Faixa-Roxa">Faixa-Roxa</option>
                                            <option value="Faixa-Marrom">Faixa-Marrom</option>
                                            <option value="Faixa-Preta">Faixa-Preta</option>
                                        </select>
                                    </div>
                                    <div className={styles.smalldiv}>
                                        <label>Matrícula da federação:</label>
                                        <input
                                            type="text"
                                            name="dados_matricula.dados_modalidades.dados_karate.matri_federacao"
                                            value={aluno.dados_matricula.dados_modalidades.dados_karate.matri_federacao}
                                            onChange={handleChange}
                                            oninput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            }}
                                        />

                                    </div>
                                    <span></span>
                                </div>


                            </>


                        )}

                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                name="dados_muaythai.is_aluno"
                                onChange={handleCheckboxChange}
                                checked={aluno.dados_matricula.dados_modalidades.dados_muaythai.is_aluno || false}
                            />
                            <label>Muay Thai</label>
                        </div>

                        {aluno.dados_matricula.dados_modalidades.dados_muaythai.is_aluno === true && (
                            <>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Data de Inscrição:</label>
                                        <input type="date" name="dados_matricula.dados_modalidades.dados_muaythai.data_insc" value={aluno.dados_matricula.dados_modalidades.dados_muaythai.data_insc} onChange={handleChange} max={hoje} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Graduação:</label>
                                        <select name="dados_matricula.dados_modalidades.dados_muaythai.grad_aluno" value={aluno.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno} onChange={handleChange} required>
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

                                        </select>
                                    </div>

                                    <div className={styles.smalldiv}>
                                        <label>Matrícula da federação:</label>
                                        <input
                                            type="text"
                                            name="dados_matricula.dados_modalidades.dados_muaythai.matri_federacao"
                                            value={aluno.dados_matricula.dados_modalidades.dados_muaythai.matri_federacao}
                                            onChange={handleChange}
                                            oninput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            }}
                                        />

                                    </div>
                                </div>
                            </>
                        )}
                        {modalidadeError && <p>{modalidadeError}</p>}
                    </div>



                    <div className={styles.buttonContainer}>
                    <button type="submit" disabled={!!idError}>Cadastrar</button>
                </div>
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

                
            </div>
        </div>
    );
};
