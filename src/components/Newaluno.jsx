import axios from "axios";
import { useState, useEffect } from "react";
import styles from './Newaluno.module.css'
import config from '../config/config.json';
import { toast, ToastContainer } from "react-toastify";
import InputMask from 'react-input-mask';

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
                    grad_aluno: []
                },
                dados_muaythai: {
                    is_aluno: false,
                    matri_federacao: "",
                    data_insc: "",
                    grad_aluno: []
                }
            }
        },
        is_adm: false
    });


    //objeto que armazena a imagem
    const [imagem, setImagem] = useState(null);


    //estados gerais para funções de idade > 18, alunos para veridicação de matrícula e estados de erro
    const [idade, setIdade] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const [idError, setIdError] = useState("");
    const [modalidadeError, setModalidadeError] = useState('');

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
                    dados_modalidades: {
                        mensalidades: [],
                        dados_karate: {
                            is_aluno: false,
                            matri_federacao: "",
                            data_insc: "",
                            grad_aluno: []
                        },
                        dados_muaythai: {
                            is_aluno: false,
                            matri_federacao: "",
                            data_insc: "",
                            grad_aluno: []
                        }
                    }
                },
                is_adm: false,
            });
            setIdade(null);
            setImagem(null)
            document.querySelector('input[name="imagem"]').value = '';
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


                    <div className={styles.formGroup}>
                        <label>Modalidades:</label>

                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                name="dados_karate.is_aluno"
                                onChange={handleCheckboxChange}
                                checked={formData.dados_matricula.dados_modalidades.dados_karate.is_aluno || false}
                            />
                            <label>Karate</label>
                        </div>

                        {formData.dados_matricula.dados_modalidades.dados_karate.is_aluno === true && (
                            <>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Data de Inscrição:</label>
                                        <input type="date" name="dados_matricula.dados_modalidades.dados_karate.data_insc" value={formData.dados_matricula.dados_modalidades.dados_karate.data_insc} onChange={handleChange} max={hoje} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="karateSelect">Selecione uma graduação:</label>
                                        <select id="karateSelect" onChange={handleKarateChange} defaultValue="">
                                            <option value="" disabled>Escolha uma Faixa</option>
                                            {karateFaixas.map((faixa, index) => (
                                                <option key={index} value={faixa.graduacao}>
                                                    {faixa.graduacao}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.smalldiv}>
                                        <label>Matrícula da federação:</label>
                                        <input
                                            type="text"
                                            name="dados_matricula.dados_modalidades.dados_karate.matri_federacao"
                                            value={formData.dados_matricula.dados_modalidades.dados_karate.matri_federacao}
                                            onChange={handleChange}
                                            onInput={(e) => {
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
                                checked={formData.dados_matricula.dados_modalidades.dados_muaythai.is_aluno || false}
                            />
                            <label>Muay Thai</label>
                        </div>

                        {formData.dados_matricula.dados_modalidades.dados_muaythai.is_aluno === true && (
                            <>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Data de Inscrição:</label>
                                        <input type="date" name="dados_matricula.dados_modalidades.dados_muaythai.data_insc" value={formData.dados_matricula.dados_modalidades.dados_muaythai.data_insc} onChange={handleChange} max={hoje} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="muayThaiSelect">Selecione uma graduação:</label>
                                        <select id="muayThaiSelect" onChange={handleMuayThaiChange} defaultValue="">
                                            <option value="" disabled>Escolha uma Faixa</option>
                                            {muayThaiFaixas.map((faixa, index) => (
                                                <option key={index} value={faixa.graduacao}>
                                                    {faixa.graduacao}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className={styles.smalldiv}>
                                        <label>Matrícula da federação:</label>
                                        <input
                                            type="text"
                                            name="dados_matricula.dados_modalidades.dados_muaythai.matri_federacao"
                                            value={formData.dados_matricula.dados_modalidades.dados_muaythai.matri_federacao}
                                            onChange={handleChange}
                                            onInput={(e) => {
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
