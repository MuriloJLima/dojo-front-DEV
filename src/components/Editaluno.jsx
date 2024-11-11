import styles from './Editaluno.module.css'

import axios from "axios";
import { useState, useEffect } from "react";
import config from '../config/config.json';
import { toast, ToastContainer } from "react-toastify";
import InputMask from 'react-input-mask';

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
        titulo: "",
        premiacao: ""
    });

    const [newCompetitionMuayThai, setNewCompetitionMuayThai] = useState({
        titulo: "",
        premiacao: ""
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
                            { titulo: newCompetitionKarate.titulo, premiacao: newCompetitionKarate.premiacao }
                        ]
                    }
                }
            }
        }));
        // Limpar os campos de nova competição
        setNewCompetitionKarate({ titulo: "", premiacao: "" });
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
                            { titulo: newCompetitionMuayThai.titulo, premiacao: newCompetitionMuayThai.premiacao }
                        ]
                    }
                }
            }
        }));
        // Limpar os campos de nova competição
        setNewCompetitionMuayThai({ titulo: "", premiacao: "" });
    };

    //inserindo as faixas de karatê e muay thai no objeto


    const handleMuayThaiChange = (event) => {
        const selectedGraduacao = event.target.value;
        const selectedIndex = muayThaiFaixas.findIndex(faixa => faixa.graduacao === selectedGraduacao);

        const inferiorGraduacoes = muayThaiFaixas.slice(0, selectedIndex + 1).map(faixa => ({ graduacao: faixa.graduacao, data_graduacao: "" }));

        setFormData(prevFormData => ({
            ...prevFormData,
            dados_matricula: {
                ...prevFormData.dados_matricula,
                dados_modalidades: {
                    ...prevFormData.dados_matricula.dados_modalidades,
                    dados_muaythai: {
                        ...prevFormData.dados_matricula.dados_modalidades.dados_muaythai,
                        grad_aluno: inferiorGraduacoes // Salva todas as graduações inferiores
                    }
                }
            }
        }));
    };


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
                                <label>Karate</label>
                            </div>
                            {aluno.dados_matricula.dados_modalidades.dados_karate.is_aluno && (
                                <>
                                    <div className={styles.formRow}>
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


                                    </div>
                                    <div>
                                        <h3>Graduações - Karate</h3>
                                        {/* Inputs para adicionar nova graduação */}
                                        <input
                                            type="text"
                                            name="graduacao"
                                            value={newKarateFaixa.graduacao}
                                            onChange={handleKaratefaixaChange}
                                            placeholder="Graduação"
                                        />
                                        <input
                                            type="date"
                                            name="data_graduacao"
                                            value={newKarateFaixa.data_graduacao}
                                            onChange={handleKaratefaixaChange}
                                            placeholder="Data da graduação"
                                        />
                                        <button type="button" onClick={() => handleAddGraduacaoKarate()}>
                                            Adicionar Graduação
                                        </button>

                                        {/* Listagem de graduações existentes com inputs para edição */}
                                        <ul>
                                            {formData.dados_matricula.dados_modalidades.dados_karate.grad_aluno
                                                .slice()
                                                .reverse()
                                                .map((grad, index) => {
                                                    const reverseIndex = formData.dados_matricula.dados_modalidades.dados_karate.grad_aluno.length - 1 - index;
                                                    return (
                                                        <li key={index}>
                                                            <input
                                                                type="text"
                                                                name={`graduacao-${reverseIndex}`}
                                                                value={grad.graduacao}
                                                                onChange={(e) => handleEditGraduacaoKarate(reverseIndex, 'graduacao', e.target.value)}
                                                                placeholder="Graduação"
                                                            />
                                                            <input
                                                                type="date"
                                                                name={`data_graduacao-${reverseIndex}`}
                                                                value={grad.data_graduacao}
                                                                onChange={(e) => handleEditGraduacaoKarate(reverseIndex, 'data_graduacao', e.target.value)}
                                                                placeholder="Data da graduação"
                                                            />
                                                             <button type="button" onClick={() => handleRemoveGraduacaoKarate(reverseIndex)}>
                                                                Remover
                                                            </button>
                                                        </li>
                                                    )
                                                })}
                                        </ul>
                                    </div>


                                    <div>
                                        <h3>Competições - Karate</h3>
                                        <input
                                            type="text"
                                            name="titulo"
                                            value={newCompetitionKarate.titulo}
                                            onChange={handleCompetitionKarateChange}
                                            placeholder="Título da Competição"
                                        />
                                        <input
                                            type="text"
                                            name="premiacao"
                                            value={newCompetitionKarate.premiacao}
                                            onChange={handleCompetitionKarateChange}
                                            placeholder="Premiações"
                                        />
                                        <button type="button" onClick={() => handleAddCompetitionKarate()}>
                                            Adicionar Competição
                                        </button>

                                        <ul>
                                            {formData.dados_matricula.dados_modalidades.dados_karate.competicoes
                                                .slice()
                                                .reverse()
                                                .map((comp, index) => {
                                                    const reverseIndex = formData.dados_matricula.dados_modalidades.dados_karate.competicoes.length - 1 - index;
                                                    return (
                                                        <li key={index}>
                                                            <input
                                                                type="text"
                                                                name={`titulo-${reverseIndex}`}
                                                                value={comp.titulo}
                                                                // onChange={(e) => handleEditGraduacaoKarate(reverseIndex, 'graduacao', e.target.value)}
                                                                placeholder="Nome da competição"
                                                            />
                                                            <input
                                                                type="text"
                                                                name={`premiacao-${reverseIndex}`}
                                                                value={comp.premiacao}
                                                                // onChange={(e) => handleEditGraduacaoKarate(reverseIndex, 'data_graduacao', e.target.value)}
                                                                placeholder="Colocação"
                                                            />
                                                             <button type="button" 
                                                            //  onClick={() => handleRemoveGraduacaoKarate(reverseIndex)}
                                                             >
                                                                Remover
                                                            </button>
                                                        </li>
                                                    )
                                                })}
                                        </ul>
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
                                    <div className={styles.formRow}>
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

                                    </div>
                                    <div>
                                        <h3>Graduações - Muay Thai</h3>
                                        {/* Inputs para adicionar nova graduação */}
                                        <input
                                            type="text"
                                            name="graduacao"
                                            value={newMuayThaiFaixa.graduacao}
                                            onChange={handleMuayThaifaixaChange}
                                            placeholder="Graduação"
                                        />
                                        <input
                                            type="date"
                                            name="data_graduacao"
                                            value={newMuayThaiFaixa.data_graduacao}
                                            onChange={handleMuayThaifaixaChange}
                                            placeholder="Data da graduação"
                                        />
                                        <button type="button" onClick={() => handleAddGraduacaoMuayThai()}>
                                            Adicionar Graduação
                                        </button>

                                        {/* Listagem de graduações existentes com inputs para edição */}
                                        <ul>
                                            {formData.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno
                                                .slice()
                                                .reverse()
                                                .map((grad, index) => {
                                                    const reverseIndex = formData.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno.length - 1 - index;
                                                    return (
                                                        <li key={index}>
                                                            <input
                                                                type="text"
                                                                name={`graduacao-${reverseIndex}`}
                                                                value={grad.graduacao}
                                                                onChange={(e) => handleEditGraduacaoMuayThai(reverseIndex, 'graduacao', e.target.value)}
                                                                placeholder="Graduação"
                                                            />
                                                            <input
                                                                type="date"
                                                                name={`data_graduacao-${reverseIndex}`}
                                                                value={grad.data_graduacao}
                                                                onChange={(e) => handleEditGraduacaoMuayThai(reverseIndex, 'data_graduacao', e.target.value)}
                                                                placeholder="Data da graduação"
                                                            />
                                                            <button type="button" onClick={() => handleRemoveGraduacaoMuayThai(reverseIndex)}>
                                                                Remover
                                                            </button>
                                                        </li>
                                                    )
                                                })}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3>Competições - Muay Thai</h3>
                                        <input
                                            type="text"
                                            name="titulo"
                                            value={newCompetitionMuayThai.titulo}
                                            onChange={handleCompetitionMuayThaiChange}
                                            placeholder="Título da Competição"
                                        />
                                        <input
                                            type="text"
                                            name="premiacao"
                                            value={newCompetitionMuayThai.premiacao}
                                            onChange={handleCompetitionMuayThaiChange}
                                            placeholder="Premiações"
                                        />
                                        <button type="button" onClick={() => handleAddCompetitionMuayThai()}>
                                            Adicionar Competição
                                        </button>
                                        <ul>
                                            {formData.dados_matricula.dados_modalidades.dados_muaythai.competicoes.map((comp, index) => (
                                                <li key={index}>{comp.titulo} - {comp.premiacao}</li>
                                            ))}
                                        </ul>
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