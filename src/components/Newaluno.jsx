import axios from "axios";
import { useState, useEffect } from "react";
import styles from './Newaluno.module.css'
import config from '../config/config.json';
import { toast, ToastContainer } from "react-toastify";
import InputMask from 'react-input-mask';
import { PlusCircle } from "phosphor-react";

export function Newaluno({ onClose }) {

    //objeto contendo a estrutura do aluno a ser cadastrado
    const [formData, setFormData] = useState({
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
            mensalidades: [],
            dados_modalidades: {
                dados_karate: {
                    is_aluno: false,
                    matri_federacao: "",
                    data_insc: "",
                    grad_aluno: [],
                    competicoes: []
                },
                dados_muaythai: {
                    is_aluno: false,
                    matri_federacao: "",
                    data_insc: "",
                    grad_aluno: [],
                    competicoes: []
                }
            }
        },
        desc_aluno: "Atleta dedicado - CT Alcateia",
        senha_aluno: "",
        is_adm: false
    });


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

            const ids = alunosData.map(a => parseInt(a.dados_matricula.matri_dojo, 10)).filter(id => !isNaN(id));
            const maxId = Math.max(...ids, 0);
            const nextId = (maxId + 1).toString().padStart(4, '0');

            setFormData(prevState => ({
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
            const existingAluno = alunos.find(a => a.dados_matricula.matri_dojo === value);
            if (existingAluno) {
                setIdError("Esta matrícula já está em uso.");
            } else {
                setIdError("");
            }
        }

    };


    // Função para lidar com o upload da imagem
    const handleImageChange = (e) => {
        setImagem(e.target.files[0]);
    };


    //const com arrays de faixas de karate e muay thai
    const karateFaixas = [
        { graduacao: "Faixa-Branca", data_graduacao: "" },
        { graduacao: "Faixa-Amarela", data_graduacao: "" },
        { graduacao: "Faixa-Vermelha", data_graduacao: "" },
        { graduacao: "Faixa-Laranja", data_graduacao: "" },
        { graduacao: "Faixa-Verde", data_graduacao: "" },
        { graduacao: "Faixa-Roxa", data_graduacao: "" },
        { graduacao: "Faixa-Marrom", data_graduacao: "" },
        { graduacao: "Faixa-Preta", data_graduacao: "" }
    ];

    const muayThaiFaixas = [
        { graduacao: "Branca", data_graduacao: "" },
        { graduacao: "Branca ponta Vermelha", data_graduacao: "" },
        { graduacao: "Vermelha", data_graduacao: "" },
        { graduacao: "Vermelha ponta Azul clara", data_graduacao: "" },
        { graduacao: "Azul clara", data_graduacao: "" },
        { graduacao: "Azul clara ponta Azul escura", data_graduacao: "" },
        { graduacao: "Azul escura", data_graduacao: "" },
        { graduacao: "Azul escura ponta Preta", data_graduacao: "" },
        { graduacao: "Preta", data_graduacao: "" }
    ];

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
                                nivel: newCompetitionMuayThai.nivel,
                                localidade: newCompetitionMuayThai.localidade,
                                ano: newCompetitionMuayThai.ano,
                                disputa: newCompetitionMuayThai.disputa,
                                colocacao: newCompetitionMuayThai.colocacao
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

    //inserindo as faixas de karatê e muay thai no objeto
    const handleKarateChange = (event) => {
        const selectedGraduacao = event.target.value;
        const selectedIndex = karateFaixas.findIndex(faixa => faixa.graduacao === selectedGraduacao);

        const inferiorGraduacoes = karateFaixas.slice(0, selectedIndex + 1).map(faixa => ({ graduacao: faixa.graduacao, data_graduacao: "" }));

        setFormData(prevFormData => ({
            ...prevFormData,
            dados_matricula: {
                ...prevFormData.dados_matricula,
                dados_modalidades: {
                    ...prevFormData.dados_matricula.dados_modalidades,
                    dados_karate: {
                        ...prevFormData.dados_matricula.dados_modalidades.dados_karate,
                        grad_aluno: inferiorGraduacoes
                    }
                }
            }
        }));
    };

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
            const response = await axios.post(`${config.urlRoot}/cadastrarAlunos`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(response.data.mensagemStatus);
            setFormData({
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
                    mensalidades: [],
                    dados_modalidades: {
                        dados_karate: {
                            is_aluno: false,
                            matri_federacao: "",
                            data_insc: "",
                            grad_aluno: [],
                            competicoes: []
                        },
                        dados_muaythai: {
                            is_aluno: false,
                            matri_federacao: "",
                            data_insc: "",
                            grad_aluno: [],
                            competicoes: []
                        }
                    }
                },
                desc_aluno: "Atleta dedicado - CT Alcateia",
                senha_aluno: "",
                is_adm: false,
            });
            setIdade(null);
            setImagem(null)
            document.querySelector('input[name="imagem"]').value = '';
            getAlunos()
            setActiveTab('informacoes')
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
                                    checked={formData.dados_matricula.dados_modalidades.dados_karate.is_aluno || false}
                                />
                                <h2>Karate</h2>
                            </div>
                            {formData.dados_matricula.dados_modalidades.dados_karate.is_aluno && (
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
                                        <div className={styles.formGroup}>
                                            <label htmlFor="karateSelect">Selecione uma graduação:</label>
                                            <select id="karateSelect" onChange={handleKarateChange} defaultValue="">
                                                <option value="" disabled>Escolha uma Faixa</option>
                                                {karateFaixas.map((faixa, index) => (
                                                    <option key={index} value={faixa.graduacao}>{faixa.graduacao}</option>
                                                ))}
                                            </select>
                                        </div>

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

                                    {formData.dados_matricula.dados_modalidades.dados_karate.competicoes?.length > 0 && (

                                        <div className={styles.compettionContainer}>
                                            {formData.dados_matricula.dados_modalidades.dados_karate.competicoes.slice()
                                                .reverse().map((comp, index) => (
                                                    <p key={index}> {comp.colocacao} - Competição {comp.nivel} ({comp.localidade},  {comp.ano}) - {comp.disputa} </p>
                                                ))}
                                        </div>

                                    )}


                                </>
                            )}
                            <div className={styles.checkboxContainer}>
                                <input
                                    type="checkbox"
                                    name="dados_muaythai.is_aluno"
                                    onChange={handleCheckboxChange}
                                    checked={formData.dados_matricula.dados_modalidades.dados_muaythai.is_aluno || false}
                                />
                               <h2>Muay Thai</h2>
                            </div>
                            {formData.dados_matricula.dados_modalidades.dados_muaythai.is_aluno && (
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
                                        <div className={styles.formGroup}>
                                            <label htmlFor="muayThaiSelect">Selecione uma graduação:</label>
                                            <select id="muayThaiSelect" onChange={handleMuayThaiChange} defaultValue="">
                                                <option value="" disabled>Escolha uma Faixa</option>
                                                {muayThaiFaixas.map((faixa, index) => (
                                                    <option key={index} value={faixa.graduacao}>{faixa.graduacao}</option>
                                                ))}
                                            </select>
                                        </div>
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

                                        <div className={styles.AddButton}>
                                            <label><br /></label>
                                            <button type="button" onClick={() => handleAddCompetitionMuayThai()}>
                                                <PlusCircle size={20} /> Adicionar
                                            </button>
                                        </div>


                                    </div>

                                    {formData.dados_matricula.dados_modalidades.dados_muaythai.competicoes?.length > 0 && (

                                        <div className={styles.compettionContainer}>
                                            {formData.dados_matricula.dados_modalidades.dados_muaythai.competicoes.slice()
                                                .reverse().map((comp, index) => (
                                                    <p key={index}> {comp.colocacao} - Competição {comp.nivel} ({comp.localidade},  {comp.ano}) - {comp.disputa} </p>
                                                ))}
                                        </div>

                                    )}
                                </>
                            )}
                            {modalidadeError && <p>{modalidadeError}</p>}
                            <div className={styles.buttonContainer}>
                                <button type="submit" disabled={!continuarClicked}>
                                    Cadastrar
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
};
