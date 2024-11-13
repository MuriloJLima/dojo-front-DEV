import styles from './Editaluno.module.css'

import axios from "axios";
import { useState, useEffect } from "react";
import config from '../config/config.json';
import { toast, ToastContainer } from "react-toastify";
import InputMask from 'react-input-mask';
import { PlusCircle, Trash } from 'phosphor-react';

export function Editaluno({ onClose, aluno, handleIdUrl, getAlunosList }) {
    //objeto contendo a estrutura do aluno a ser cadastrado
    const [formData, setFormData] = useState({
        ...aluno
    });

    const ultimaGraduacaoKarate = aluno.dados_matricula.dados_modalidades.dados_karate.grad_aluno;
    const graduacaoPadraoKarate = ultimaGraduacaoKarate.length > 0 ? ultimaGraduacaoKarate[ultimaGraduacaoKarate.length - 1].graduacao : "";

    const ultimaGraduacaoMuayThai = aluno.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno || ''
    const graduacaoPadraoMuayThai = ultimaGraduacaoMuayThai.length > 0 ? ultimaGraduacaoMuayThai[ultimaGraduacaoMuayThai.length - 1].graduacao : "";

    const alunoId = aluno.dados_matricula.matri_dojo

    //objeto que armazena a imagem
    const [imagem, setImagem] = useState(null);


    //estados gerais para funções de idade > 18, alunos para veridicação de matrícula e estados de erro
    const [idade, setIdade] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const [idError, setIdError] = useState("");
    const [modalidadeError, setModalidadeError] = useState('');

    const [activeTab, setActiveTab] = useState('informacoes')

    const [continuarClicked, setContinuarClicked] = useState(false);

    const handleContinuar = () => {
        setContinuarClicked(true);
        setActiveTab('modalidades');
    };

    //busca os alunos no bd para verificar no numero de matricula
    const getAlunos = async () => {
        try {
            const response = await axios.get(`${config.urlRoot}/listarAlunos`);
            const alunosData = response.data.data;
            setAlunos(alunosData);




        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
        }
    };

    useEffect(() => {
        getAlunos();
    }, []);

    //verificar idade
    useEffect(() => {
        if (formData.dados_aluno.nasc_aluno) {
            const birthDate = new Date(formData.dados_aluno.nasc_aluno);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            setIdade(age);
        }
    }, [formData.dados_aluno.nasc_aluno]);

    //captura a data de hoje para validação no campo de data
    const hoje = new Date().toISOString().split('T')[0];

    //gerenciamento do checkbox das modalidades
    const handleCheckboxChange = async (e) => {
        const { name, checked } = e.target;  // Pega o nome do checkbox e se está checado

        setFormData(prevState => {
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

    //atualização simultanea dos valores no objeto formData
    const handleChange = (e) => {
        const { name, value } = e.target;
        const [field, subfield, subsubfield, key] = name.split('.');

        // Atribuir os valores aos campos no estado
        setFormData((prevFormData) => {
            if (subsubfield && key) {
                return {
                    ...prevFormData,
                    [field]: {
                        ...prevFormData[field],
                        [subfield]: {
                            ...prevFormData[field][subfield],
                            [subsubfield]: {
                                ...prevFormData[field][subfield][subsubfield],
                                [key]: value,
                            },
                        },
                    },
                };
            } else if (subfield) {
                return {
                    ...prevFormData,
                    [field]: {
                        ...prevFormData[field],
                        [subfield]: value,
                    },
                };
            }
            return {
                ...prevFormData,
                [field]: value,
            };
        });

        //verifica se ja existe aluno com aquela matrícula
        if (name === "dados_matricula.matri_dojo") {
            const existingAluno = alunos.find(a => a.dados_matricula.matri_dojo === value)?.dados_matricula.matri_dojo;

            if (existingAluno !== alunoId) {
                if (existingAluno) {
                    setIdError("Esta matrícula já está em uso.");
                } else {
                    setIdError("");
                }

            }
        }

    };


    // Função para lidar com o upload da imagem
    const handleImageChange = (e) => {

        const file = e.target.files[0]

        console.log(file)

        if (file.name && file.size > 0) {
            setImagem(e.target.files[0]);
        }


    };


    //const com arrays de faixas de karate e muay thai
    const [newKarateFaixa, setNewKarateFaixa] = useState(
        {
            graduacao: "",
            data_graduacao: ""
        },
    )


    const [newMuayThaiFaixa, setNewMuayThaiFaixa] = useState(
        {
            graduacao: "",
            data_graduacao: ""
        },
    )


    const handleKaratefaixaChange = (e) => {
        const { name, value } = e.target;
        setNewKarateFaixa((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMuayThaifaixaChange = (e) => {
        const { name, value } = e.target;
        setNewMuayThaiFaixa((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleAddGraduacaoKarate = () => {
        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                dados_modalidades: {
                    ...prevData.dados_matricula.dados_modalidades,
                    dados_karate: {
                        ...prevData.dados_matricula.dados_modalidades.dados_karate,
                        grad_aluno: [
                            ...prevData.dados_matricula.dados_modalidades.dados_karate.grad_aluno,
                            { graduacao: newKarateFaixa.graduacao, data_graduacao: newKarateFaixa.data_graduacao }
                        ]
                    }
                }
            }
        }));
        // Limpar os campos de nova competição
        setNewKarateFaixa({
            graduacao: "",
            data_graduacao: ""
        });
    };

    const handleAddGraduacaoMuayThai = () => {
        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                dados_modalidades: {
                    ...prevData.dados_matricula.dados_modalidades,
                    dados_muaythai: {
                        ...prevData.dados_matricula.dados_modalidades.dados_muaythai,
                        grad_aluno: [
                            ...prevData.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno,
                            { graduacao: newMuayThaiFaixa.graduacao, data_graduacao: newMuayThaiFaixa.data_graduacao }
                        ]
                    }
                }
            }
        }));
        // Limpar os campos de nova competição
        setNewMuayThaiFaixa({
            graduacao: "",
            data_graduacao: ""
        });
    };

    const handleEditGraduacaoKarate = (index, field, value) => {
        // Faz uma cópia profunda do array grad_aluno para garantir que não haja referências mistas
        const updatedGraduacoes = formData.dados_matricula.dados_modalidades.dados_karate.grad_aluno.map((grad, i) => ({
            ...grad, // clona o objeto de cada graduação
        }));

        // Atualiza o campo específico da graduação selecionada
        updatedGraduacoes[index] = {
            ...updatedGraduacoes[index],
            [field]: value,
        };

        // Atualiza o estado do formData com a nova lista de graduações
        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                dados_modalidades: {
                    ...prevData.dados_matricula.dados_modalidades,
                    dados_karate: {
                        ...prevData.dados_matricula.dados_modalidades.dados_karate,
                        grad_aluno: updatedGraduacoes,
                    },
                },
            },
        }));
    };

    const handleEditGraduacaoMuayThai = (index, field, value) => {
        // Faz uma cópia profunda do array grad_aluno para garantir que não haja referências mistas
        const updatedGraduacoes = formData.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno.map((grad, i) => ({
            ...grad, // clona o objeto de cada graduação
        }));

        // Atualiza o campo específico da graduação selecionada
        updatedGraduacoes[index] = {
            ...updatedGraduacoes[index],
            [field]: value,
        };

        // Atualiza o estado do formData com a nova lista de graduações
        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                dados_modalidades: {
                    ...prevData.dados_matricula.dados_modalidades,
                    dados_muaythai: {
                        ...prevData.dados_matricula.dados_modalidades.dados_muaythai,
                        grad_aluno: updatedGraduacoes,
                    },
                },
            },
        }));
    };

    // Função para remover uma graduação com base no índice
    const handleRemoveGraduacaoKarate = (index) => {
        const updatedGraduacoes = formData.dados_matricula.dados_modalidades.dados_karate.grad_aluno.filter((_, i) => i !== index);

        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                dados_modalidades: {
                    ...prevData.dados_matricula.dados_modalidades,
                    dados_karate: {
                        ...prevData.dados_matricula.dados_modalidades.dados_karate,
                        grad_aluno: updatedGraduacoes,
                    },
                },
            },
        }));
    };

    // Função para remover uma graduação com base no índice
    const handleRemoveGraduacaoMuayThai = (index) => {
        const updatedGraduacoes = formData.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno.filter((_, i) => i !== index);

        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                dados_modalidades: {
                    ...prevData.dados_matricula.dados_modalidades,
                    dados_muaythai: {
                        ...prevData.dados_matricula.dados_modalidades.dados_muaythai,
                        grad_aluno: updatedGraduacoes,
                    },
                },
            },
        }));
    };



    const [newCompetitionKarate, setNewCompetitionKarate] = useState({
        nivel: "",
        localidade: "",
        ano: "",
        disputa: "",
        colocacao: ""
    });

    const [newCompetitionMuayThai, setNewCompetitionMuayThai] = useState({
        nivel: "",
        localidade: "",
        ano: "",
        disputa: "",
        colocacao: ""
    });

    const handleCompetitionKarateChange = (e) => {
        const { name, value } = e.target;
        setNewCompetitionKarate((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    const handleCompetitionMuayThaiChange = (e) => {
        const { name, value } = e.target;
        setNewCompetitionMuayThai((prev) => ({
            ...prev,
            [name]: value
        }));


    };



    const handleAddCompetitionKarate = () => {
        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                dados_modalidades: {
                    ...prevData.dados_matricula.dados_modalidades,
                    dados_karate: {
                        ...prevData.dados_matricula.dados_modalidades.dados_karate,
                        competicoes: [
                            ...prevData.dados_matricula.dados_modalidades.dados_karate.competicoes,
                            {
                                nivel: newCompetitionKarate.nivel,
                                localidade: newCompetitionKarate.localidade,
                                ano: newCompetitionKarate.ano,
                                disputa: newCompetitionKarate.disputa,
                                colocacao: newCompetitionKarate.colocacao
                            }
                        ]
                    }
                }
            }
        }));
        // Limpar os campos de nova competição
        setNewCompetitionKarate({
            nivel: "",
            localidade: "",
            ano: "",
            disputa: "",
            colocacao: ""
        });
    };

    const handleAddCompetitionMuayThai = () => {
        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                dados_modalidades: {
                    ...prevData.dados_matricula.dados_modalidades,
                    dados_muaythai: {
                        ...prevData.dados_matricula.dados_modalidades.dados_muaythai,
                        competicoes: [
                            ...prevData.dados_matricula.dados_modalidades.dados_muaythai.competicoes,
                            {
                                nivel: newCompetitionKarate.nivel,
                                localidade: newCompetitionKarate.localidade,
                                ano: newCompetitionKarate.ano,
                                disputa: newCompetitionKarate.disputa,
                                colocacao: newCompetitionKarate.colocacao
                            }
                        ]
                    }
                }
            }
        }));
        // Limpar os campos de nova competição
        setNewCompetitionMuayThai({
            nivel: "",
            localidade: "",
            ano: "",
            disputa: "",
            colocacao: ""
        });
    };


    const handleEditCompetitionKarate = (index, field, value) => {
        // Faz uma cópia profunda do array grad_aluno para garantir que não haja referências mistas
        const updatedCompeticoes = formData.dados_matricula.dados_modalidades.dados_karate.competicoes.map((grad, i) => ({
            ...grad, // clona o objeto de cada graduação
        }));

        // Atualiza o campo específico da graduação selecionada
        updatedCompeticoes[index] = {
            ...updatedCompeticoes[index],
            [field]: value,
        };

        // Atualiza o estado do formData com a nova lista de graduações
        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                dados_modalidades: {
                    ...prevData.dados_matricula.dados_modalidades,
                    dados_karate: {
                        ...prevData.dados_matricula.dados_modalidades.dados_karate,
                        competicoes: updatedCompeticoes,
                    },
                },
            },
        }));
    };

    const handleEditCompetitionMuayThai = (index, field, value) => {
        // Faz uma cópia profunda do array grad_aluno para garantir que não haja referências mistas
        const updatedCompeticoes = formData.dados_matricula.dados_modalidades.dados_muaythai.competicoes.map((grad, i) => ({
            ...grad, // clona o objeto de cada graduação
        }));

        // Atualiza o campo específico da graduação selecionada
        updatedCompeticoes[index] = {
            ...updatedCompeticoes[index],
            [field]: value,
        };

        // Atualiza o estado do formData com a nova lista de graduações
        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                dados_modalidades: {
                    ...prevData.dados_matricula.dados_modalidades,
                    dados_muaythai: {
                        ...prevData.dados_matricula.dados_modalidades.dados_muaythai,
                        competicoes: updatedCompeticoes,
                    },
                },
            },
        }));
    };


    const handleRemoveCompetitionKarate = (index) => {
        const updatedCompeticoes = formData.dados_matricula.dados_modalidades.dados_karate.competicoes.filter((_, i) => i !== index);

        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                dados_modalidades: {
                    ...prevData.dados_matricula.dados_modalidades,
                    dados_karate: {
                        ...prevData.dados_matricula.dados_modalidades.dados_karate,
                        competicoes: updatedCompeticoes,
                    },
                },
            },
        }));

    }
    
    
    const handleRemoveCompetitionMuayThai = (index) => {
        const updatedCompeticoes = formData.dados_matricula.dados_modalidades.dados_muaythai.competicoes.filter((_, i) => i !== index);

        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                dados_modalidades: {
                    ...prevData.dados_matricula.dados_modalidades,
                    dados_muaythai: {
                        ...prevData.dados_matricula.dados_modalidades.dados_muaythai,
                        competicoes: updatedCompeticoes,
                    },
                },
            },
        }));

    }


    


    //envio das informações
    const handleSubmit = async (e) => {
        e.preventDefault();


        //verificar se o usuário selecionou alguma modalidade
        const { dados_karate, dados_muaythai } = formData.dados_matricula.dados_modalidades;

        if (!dados_karate.is_aluno && !dados_muaythai.is_aluno) {
            setModalidadeError('Por favor, selecione pelo menos uma modalidade.');
            return
        }

        setModalidadeError('')


        if (idError) {
            return; // Não permite o envio se houver erro
        }

        //transforma os dados no formato de form
        const form = new FormData();
        form.append('imagem', imagem);

        // Adiciona objetos diretamente ao FormData
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, JSON.stringify(value));
        });


        //encaminha os dados para a rota e volta os valores para o padrão
        try {
            const response = await axios.put(`${config.urlRoot}/alterarAlunos`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(response.data.mensagemStatus);
            handleIdUrl(aluno._id)
            onClose()
            getAlunosList()

            console.log(response.data.mensagemStatus)


        } catch (error) {
            console.error("Erro ao cadastrar o aluno:", error);
            // Aqui você pode tratar o erro, como exibir uma mensagem para o usuário
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                {/* Header com abas */}
                <div className={styles.tabHeader}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'informacoes' && styles.activeTab}`}
                        onClick={() => setActiveTab('informacoes')}
                    >
                        Informações Gerais
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'modalidades' && styles.activeTab}`}
                        onClick={() => setActiveTab('modalidades')}
                    >
                        Modalidades
                    </button>
                </div>



                <form onSubmit={handleSubmit}>
                    <button onClick={onClose} className={styles.closeButton}>X</button>

                    {/* Conteúdo da aba "Informações Pessoais" */}
                    {activeTab === 'informacoes' && (
                        <>
                            <div className={styles.formRow}>
                                <div>
                                    <input type="file" name="imagem" onChange={handleImageChange} />
                                </div>
                                <div className={styles.smalldiv}>
                                    <label>Matrícula:</label>
                                    <input
                                        type="text"
                                        name="dados_matricula.matri_dojo"
                                        value={formData.dados_matricula.matri_dojo}
                                        onChange={handleChange}
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }}
                                        maxLength={4}
                                        required

                                    />
                                    {idError && <p>{idError}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Nome Completo:</label>
                                    <input type="text" name="dados_aluno.nome_aluno" value={formData.dados_aluno.nome_aluno} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Data de Nascimento:</label>
                                    <input type="date" name="dados_aluno.nasc_aluno" value={formData.dados_aluno.nasc_aluno} onChange={handleChange} max={hoje} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Sexo:</label>
                                    <select name="dados_aluno.sexo_aluno" value={formData.dados_aluno.sexo_aluno} onChange={handleChange} required>
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
                                        value={formData.dados_aluno.altura_aluno}
                                        onChange={handleChange}
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }}
                                        placeholder="ex: 150"
                                        maxLength={3} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Peso (kg):</label>
                                    <input type="text"
                                        name="dados_aluno.peso_aluno"
                                        value={formData.dados_aluno.peso_aluno}
                                        onChange={handleChange}
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }}
                                        placeholder="ex: 50"
                                        maxLength={3} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tipo Sanguíneo:</label>
                                    <select name="dados_aluno.t_sanguineo" value={formData.dados_aluno.t_sanguineo} onChange={handleChange}>
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
                                        <input type="text" name="dados_respons.nome_respons" value={formData.dados_respons.nome_respons} onChange={handleChange} required />
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Telefone (responsável):</label>
                                            <InputMask
                                                mask="(99) 99999 9999"
                                                value={formData.dados_respons.tel_respons}
                                                onChange={handleChange}
                                            >
                                                {(inputProps) => <input {...inputProps} type="tel" name="dados_respons.tel_respons" required />}
                                            </InputMask>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Telefone (aluno):</label>
                                            <InputMask
                                                mask="(99) 99999 9999"
                                                value={formData.dados_aluno.tel_aluno}
                                                onChange={handleChange}
                                            >
                                                {(inputProps) => <input {...inputProps} type="tel" name="dados_aluno.tel_aluno" />}
                                            </InputMask>
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email:</label>
                                        <input type="email" name="dados_aluno.email_aluno" value={formData.dados_aluno.email_aluno} onChange={handleChange} required />
                                    </div>
                                </>
                            ) : (
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Telefone:</label>
                                        <InputMask
                                            mask="(99) 99999 9999"
                                            value={formData.dados_aluno.tel_aluno}
                                            onChange={handleChange}
                                        >
                                            {(inputProps) => <input {...inputProps} type="tel" name="dados_aluno.tel_aluno" required />}
                                        </InputMask>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email:</label>
                                        <input type="email" name="dados_aluno.email_aluno" value={formData.dados_aluno.email_aluno} onChange={handleChange} required />
                                    </div>
                                </div>
                            )}
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Endereço Completo:</label>
                                    <input
                                        type="text"
                                        name="dados_aluno.endereco_aluno"
                                        value={formData.dados_aluno.endereco_aluno}
                                        onChange={handleChange}
                                        placeholder="ex: Rua das Flores, 123"
                                        required
                                    />


                                </div>

                                <div className={styles.smalldiv}>
                                    <label>Administrador:</label>
                                    <select name="is_adm" value={formData.is_adm} onChange={handleChange} required>
                                        <option value={false}>Não</option>
                                        <option value={true}>Sim</option>
                                    </select>

                                </div>

                                <div className={styles.smalldiv}>
                                    <label>Senha de acesso:</label>
                                    <input
                                        type="text"
                                        name="senha_aluno"
                                        value={formData.senha_aluno}
                                        onChange={handleChange}
                                        placeholder="1234"
                                        maxLength={4}
                                        required
                                    />

                                </div>



                            </div>
                            <div className={styles.buttonContainer}>
                                <button type="submit" onClick={handleContinuar}>
                                    Continuar
                                </button>
                            </div>
                        </>
                    )}


                    {/* Conteúdo da aba "Modalidades" */}
                    {activeTab === 'modalidades' && (
                        <div className={styles.formGroup}>
                            <label>Modalidades:</label>
                            <div className={styles.checkboxContainer}>
                                <input
                                    type="checkbox"
                                    name="dados_karate.is_aluno"
                                    onChange={handleCheckboxChange}
                                    checked={aluno.dados_matricula.dados_modalidades.dados_karate.is_aluno || false}
                                />
                                <label><h3>Karate</h3></label>
                            </div>
                            {aluno.dados_matricula.dados_modalidades.dados_karate.is_aluno && (
                                <>

                                    <div className={styles.formGroup}>
                                        <label>Data de Inscrição:</label>
                                        <input
                                            type="date"
                                            name="dados_matricula.dados_modalidades.dados_karate.data_insc"
                                            value={formData.dados_matricula.dados_modalidades.dados_karate.data_insc}
                                            onChange={handleChange}
                                            max={hoje}
                                            required
                                        />
                                    </div>


                                    <h4>Adicionar Graduações:</h4>
                                    <div className={styles.formRow}>

                                        <div className={styles.formGroup}>
                                            <label>Graduação:</label>
                                            <select name="graduacao" value={newKarateFaixa.graduacao} onChange={handleKaratefaixaChange}>
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


                                        <div className={styles.formGroup}>
                                            <label>Data da graduação:</label>
                                            <input
                                                type="date"
                                                name="data_graduacao"
                                                value={newKarateFaixa.data_graduacao}
                                                onChange={handleKaratefaixaChange}
                                                placeholder="Data da graduação"
                                            />
                                        </div>

                                        <div >
                                            <label><br /></label>
                                            <button type="button" onClick={() => handleAddGraduacaoKarate()}>
                                                <PlusCircle size={20} /> Adicionar
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.listContainer}>
                                        {/* Listagem de graduações existentes com inputs para edição */}

                                        {formData.dados_matricula.dados_modalidades.dados_karate.grad_aluno
                                            .slice()
                                            .reverse()
                                            .map((grad, index) => {
                                                const reverseIndex = formData.dados_matricula.dados_modalidades.dados_karate.grad_aluno.length - 1 - index;
                                                return (
                                                    <div className={styles.formRow} key={index}>

                                                        <div className={styles.formGroup}>



                                                            <select name={`graduacao-${reverseIndex}`}
                                                                value={grad.graduacao}
                                                                onChange={(e) => handleEditGraduacaoKarate(reverseIndex, 'graduacao', e.target.value)}
                                                            >
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

                                                        <div className={styles.formGroup}>

                                                            <input
                                                                type="date"
                                                                name={`data_graduacao-${reverseIndex}`}
                                                                value={grad.data_graduacao}
                                                                onChange={(e) => handleEditGraduacaoKarate(reverseIndex, 'data_graduacao', e.target.value)}
                                                                placeholder="Data da graduação"
                                                            />
                                                        </div>

                                                        <button type="button" onClick={() => handleRemoveGraduacaoKarate(reverseIndex)}>
                                                            <Trash size={20} />Remover
                                                        </button>
                                                    </div>
                                                )
                                            })}

                                    </div>



                                    <h4>Adicionar Competições</h4>
                                    <div className={styles.formRow}>

                                        <div className={styles.formGroup}>
                                            <label>Nível:</label>
                                            <select name="nivel" value={newCompetitionKarate.nivel} onChange={handleCompetitionKarateChange}>
                                                <option value="">Selecione: </option>
                                                <option value="Municipal">Municipal</option>
                                                <option value="Regional">Regional</option>
                                                <option value="Estadual">Estadual</option>
                                                <option value="Nacional">Nacional</option>
                                                <option value="Internacional">Internacional</option>
                                                <option value="Mundial">Mundial</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Localidade:</label>
                                            <input
                                                type="text"
                                                name="localidade"
                                                value={newCompetitionKarate.localidade}
                                                onChange={handleCompetitionKarateChange}
                                                placeholder="Cidade-UF"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Ano da competição:</label>
                                            <input
                                                type="date"
                                                name="ano"
                                                value={newCompetitionKarate.ano}
                                                onChange={handleCompetitionKarateChange}
                                                placeholder="xxxx"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Disputa:</label>
                                            <select name="disputa" value={newCompetitionKarate.disputa} onChange={handleCompetitionKarateChange}>
                                                <option value="">Selecione</option>
                                                <option value="Kata individual">Kata individual</option>
                                                <option value="Kumite individual">Kumite individual</option>
                                                <option value="Kata em equipe">Kata em equipe</option>
                                                <option value="Kumite em equipe">Kumite em equipe</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Colocação:</label>
                                            <select name="colocacao" value={newCompetitionKarate.colocacao} onChange={handleCompetitionKarateChange}>
                                                <option value="">Selecione</option>
                                                <option value="1º lugar">1º lugar</option>
                                                <option value="2º lugar">2º lugar</option>
                                                <option value="3º lugar">3º lugar</option>
                                            </select>
                                        </div>

                                        <div >
                                            <label><br /></label>
                                            <button type="button" onClick={() => handleAddCompetitionKarate()}>
                                                <PlusCircle size={20} /> Adicionar
                                            </button>
                                        </div>


                                    </div>

                                    <div className={styles.listContainer}>
                                        {/* Listagem de competições existentes com inputs para edição */}

                                        {formData.dados_matricula.dados_modalidades.dados_karate.competicoes
                                            .slice()
                                            .reverse()
                                            .map((comp, index) => {
                                                const reverseIndex = formData.dados_matricula.dados_modalidades.dados_karate.competicoes.length - 1 - index;
                                                return (
                                                    <div className={styles.formRow} key={index}>

                                                        <div className={styles.formGroup}>

                                                            <select name={`nivel-${reverseIndex}`} value={comp.nivel}
                                                                onChange={(e) => handleEditCompetitionKarate(reverseIndex, 'nivel', e.target.value)}
                                                            >
                                                                <option value="">Selecione: </option>
                                                                <option value="Municipal">Municipal</option>
                                                                <option value="Regional">Regional</option>
                                                                <option value="Estadual">Estadual</option>
                                                                <option value="Nacional">Nacional</option>
                                                                <option value="Internacional">Internacional</option>
                                                                <option value="Mundial">Mundial</option>
                                                            </select>
                                                        </div>

                                                        <div className={styles.formGroup}>

                                                            <input
                                                                type="text"
                                                                name={`localidade-${reverseIndex}`}
                                                                value={comp.localidade}
                                                                onChange={(e) => handleEditCompetitionKarate(reverseIndex, 'localidade', e.target.value)}
                                                                placeholder="Cidade-UF"
                                                            />
                                                        </div>

                                                        <div className={styles.formGroup}>

                                                            <input
                                                                type="date"
                                                                name={`ano-${reverseIndex}`}
                                                                value={comp.ano}
                                                                onChange={(e) => handleEditCompetitionKarate(reverseIndex, 'ano', e.target.value)}
                                                                placeholder="xxxx"
                                                            />
                                                        </div>
                                                        <div className={styles.formGroup}>
                                                            <select name={`disputa-${reverseIndex}`} value={comp.disputa}
                                                                onChange={(e) => handleEditCompetitionKarate(reverseIndex, 'disputa', e.target.value)}
                                                            >
                                                                <option value="">Selecione</option>
                                                                <option value="Kata individual">Kata individual</option>
                                                                <option value="Kumite individual">Kumite individual</option>
                                                                <option value="Kata em equipe">Kata em equipe</option>
                                                                <option value="Kumite em equipe">Kumite em equipe</option>
                                                            </select>
                                                        </div>
                                                        <div className={styles.formGroup}>
                                                            <select name={`colocacao-${reverseIndex}`} value={comp.colocacao}
                                                                onChange={(e) => handleEditCompetitionKarate(reverseIndex, 'colocacao', e.target.value)}
                                                            >
                                                                <option value="">Selecione</option>
                                                                <option value="1º lugar">1º lugar</option>
                                                                <option value="2º lugar">2º lugar</option>
                                                                <option value="3º lugar">3º lugar</option>
                                                            </select>
                                                        </div>


                                                        <button type="button" onClick={() => handleRemoveCompetitionKarate(reverseIndex)}>
                                                            <Trash size={20} />Remover
                                                        </button>
                                                    </div>
                                                )
                                            })}

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
                            {aluno.dados_matricula.dados_modalidades.dados_muaythai.is_aluno && (
                                <>

                                    <div className={styles.formGroup}>
                                        <label>Data de Inscrição:</label>
                                        <input
                                            type="date"
                                            name="dados_matricula.dados_modalidades.dados_muaythai.data_insc"
                                            value={formData.dados_matricula.dados_modalidades.dados_muaythai.data_insc}
                                            onChange={handleChange}
                                            max={hoje}
                                            required
                                        />
                                    </div>



                                    <h4>Adicionar Graduações:</h4>
                                    <div className={styles.formRow}>

                                        <div className={styles.formGroup}>
                                            <label>Graduação:</label>
                                            <select name="graduacao" value={newMuayThaiFaixa.graduacao} onChange={handleMuayThaifaixaChange}>
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


                                        <div className={styles.formGroup}>
                                            <label>Data da graduação:</label>
                                            <input
                                                type="date"
                                                name="data_graduacao"
                                                value={newMuayThaiFaixa.data_graduacao}
                                                onChange={handleMuayThaifaixaChange}
                                                placeholder="Data da graduação"
                                            />
                                        </div>

                                        <div >
                                            <label><br /></label>
                                            <button type="button" onClick={() => handleAddGraduacaoMuayThai()}>
                                                <PlusCircle size={20} /> Adicionar
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.listContainer}>
                                        {/* Listagem de graduações existentes com inputs para edição */}

                                        {formData.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno
                                            .slice()
                                            .reverse()
                                            .map((grad, index) => {
                                                const reverseIndex = formData.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno.length - 1 - index;
                                                return (
                                                    <div className={styles.formRow} key={index}>

                                                        <div className={styles.formGroup}>



                                                            <select name={`graduacao-${reverseIndex}`}
                                                                value={grad.graduacao}
                                                                onChange={(e) => handleEditGraduacaoMuayThai(reverseIndex, 'graduacao', e.target.value)}
                                                            >
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

                                                        <div className={styles.formGroup}>

                                                            <input
                                                                type="date"
                                                                name={`data_graduacao-${reverseIndex}`}
                                                                value={grad.data_graduacao}
                                                                onChange={(e) => handleEditGraduacaoMuayThai(reverseIndex, 'data_graduacao', e.target.value)}
                                                                placeholder="Data da graduação"
                                                            />
                                                        </div>

                                                        <button type="button" onClick={() => handleRemoveGraduacaoMuayThai(reverseIndex)}>
                                                            <Trash size={20} />Remover
                                                        </button>
                                                    </div>
                                                )
                                            })}

                                    </div>

                                    <h4>Adicionar Competições</h4>
                                    <div className={styles.formRow}>

                                        <div className={styles.formGroup}>
                                            <label>Nível:</label>
                                            <select name="nivel" value={newCompetitionMuayThai.nivel} onChange={handleCompetitionMuayThaiChange}>
                                                <option value="">Selecione: </option>
                                                <option value="Municipal">Municipal</option>
                                                <option value="Regional">Regional</option>
                                                <option value="Estadual">Estadual</option>
                                                <option value="Nacional">Nacional</option>
                                                <option value="Internacional">Internacional</option>
                                                <option value="Mundial">Mundial</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Localidade:</label>
                                            <input
                                                type="text"
                                                name="localidade"
                                                value={newCompetitionMuayThai.localidade}
                                                onChange={handleCompetitionMuayThaiChange}
                                                placeholder="Cidade-UF"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Ano da competição:</label>
                                            <input
                                                type="date"
                                                name="ano"
                                                value={newCompetitionMuayThai.ano}
                                                onChange={handleCompetitionMuayThaiChange}
                                                placeholder="xxxx"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Disputa:</label>
                                            <input
                                                type="text"
                                                name="disputa"
                                                value={newCompetitionMuayThai.disputa}
                                                onChange={handleCompetitionMuayThaiChange}
                                                placeholder="Tipo de disputa"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Colocação:</label>
                                            <select name="colocacao" value={newCompetitionMuayThai.colocacao} onChange={handleCompetitionMuayThaiChange}>
                                                <option value="">Selecione</option>
                                                <option value="1º lugar">1º lugar</option>
                                                <option value="2º lugar">2º lugar</option>
                                                <option value="3º lugar">3º lugar</option>
                                            </select>
                                        </div>

                                        <div >
                                            <label><br /></label>
                                            <button type="button" onClick={() => handleAddCompetitionMuayThai()}>
                                                <PlusCircle size={20} /> Adicionar
                                            </button>
                                        </div>


                                    </div>

                                    <div className={styles.listContainer}>
                                        {/* Listagem de competições existentes com inputs para edição */}

                                        {formData.dados_matricula.dados_modalidades.dados_muaythai.competicoes
                                            .slice()
                                            .reverse()
                                            .map((comp, index) => {
                                                const reverseIndex = formData.dados_matricula.dados_modalidades.dados_muaythai.competicoes.length - 1 - index;
                                                return (
                                                    <div className={styles.formRow} key={index}>

                                                        <div className={styles.formGroup}>

                                                            <select name={`nivel-${reverseIndex}`} value={comp.nivel}
                                                            onChange={(e) => handleEditCompetitionMuayThai(reverseIndex, 'nivel', e.target.value)}
                                                            >
                                                                <option value="">Selecione: </option>
                                                                <option value="Municipal">Municipal</option>
                                                                <option value="Regional">Regional</option>
                                                                <option value="Estadual">Estadual</option>
                                                                <option value="Nacional">Nacional</option>
                                                                <option value="Internacional">Internacional</option>
                                                                <option value="Mundial">Mundial</option>
                                                            </select>
                                                        </div>

                                                        <div className={styles.formGroup}>

                                                            <input
                                                                type="text"
                                                                name={`localidade-${reverseIndex}`}
                                                                value={comp.localidade}
                                                                onChange={(e) => handleEditCompetitionMuayThai(reverseIndex, 'localidade', e.target.value)}
                                                                placeholder="Cidade-UF"
                                                            />
                                                        </div>

                                                        <div className={styles.formGroup}>

                                                            <input
                                                                type="date"
                                                                name={`ano-${reverseIndex}`}
                                                                value={comp.ano}
                                                                onChange={(e) => handleEditCompetitionMuayThai(reverseIndex, 'ano', e.target.value)}
                                                                placeholder="xxxx"
                                                            />
                                                        </div>
                                                        <div className={styles.formGroup}>
                                                            <input
                                                                type="text"
                                                                name={`disputa-${reverseIndex}`}
                                                                value={comp.disputa}
                                                                onChange={(e) => handleEditCompetitionMuayThai(reverseIndex, 'disputa', e.target.value)}
                                                                placeholder="Tipo de disputa"
                                                            />
                                                        </div>
                                                        <div className={styles.formGroup}>
                                                            <select name={`colocacao-${reverseIndex}`} value={comp.colocacao}
                                                            onChange={(e) => handleEditCompetitionMuayThai(reverseIndex, 'colocacao', e.target.value)}
                                                            >
                                                                <option value="">Selecione</option>
                                                                <option value="1º lugar">1º lugar</option>
                                                                <option value="2º lugar">2º lugar</option>
                                                                <option value="3º lugar">3º lugar</option>
                                                            </select>
                                                        </div>


                                                        <button type="button" onClick={() => handleRemoveCompetitionMuayThai(reverseIndex)}>
                                                            <Trash size={20} />Remover
                                                        </button>
                                                    </div>
                                                )
                                            })}

                                    </div>
                                </>
                            )}
                            {modalidadeError && <p>{modalidadeError}</p>}
                            <div className={styles.buttonContainer}>
                                <button type="submit" >
                                    Editar
                                </button>
                            </div>
                        </div>
                    )}




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
}