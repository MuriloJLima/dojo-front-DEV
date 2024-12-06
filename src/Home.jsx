// Componente Pai
import { Alunos } from './components/Alunos';
import { Header } from './components/Header';
import { Infoprofile } from './components/Infoprofile';
import { Sidebar } from './components/Sidebar';
import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import config from './config/config.json';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { Routes, Route, useLocation } from 'react-router-dom';




export function Home({ onLogout }) {
    const [alunos, setAlunos] = useState([]);
    const [filterModalidade, setFilterModalidade] = useState("Todos"); // Corrigido para "Todos"
    const [aluno, setAluno] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const [alunoLogado, setAlunoLogado] = useState([])
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAluno(JSON.parse(token))
            setAlunoLogado(JSON.parse(token))
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const alunoLog = JSON.parse(token)
        if (alunoLog._id === aluno._id) {
           
                localStorage.setItem('token', JSON.stringify(aluno));
                setAlunoLogado(aluno)
                
         
        }
    }, [aluno]);



    const getAlunos = async () => {
        const response = await axios.get(`${config.urlRoot}/listarAlunos`);
        const sortedData = response.data.data.sort((a, b) => a.dados_matricula.matri_dojo - b.dados_matricula.matri_dojo);
        setAlunos(sortedData);
    };

    useEffect(() => {
        getAlunos();
    }, []);

    // Função de busca para obter dados do aluno com base no ID
    const fetchDataById = async (id) => {
        try {
            // Realiza a requisição GET com o parâmetro id
            const response = await axios.get(`${config.urlRoot}/dadosAluno`, {
                params: { id }
            });
            setAluno(response.data.data);



        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    // Função para navegação que também chama a função de busca após a URL ser atualizada
    async function handleIdUrl(id) {
        navigate(`/home?id=${id}`);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    

        // Chama a função de busca após a navegação
        fetchDataById(id);
    }

    // useEffect para buscar o ID da URL quando o componente é montado ou o ID da URL muda
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const idFromUrl = urlParams.get('id');

        // Se houver um ID na URL, chama a função de busca
        if (idFromUrl) {
            fetchDataById(idFromUrl);
        }
    }, [location.search]); // Observa mudanças na URL







    // Função para verificar as modalidades
    const getModalidades = (modalidades) => {
        const { dados_karate, dados_muaythai } = modalidades;
        let inscricoes = [];
        if (dados_karate.is_aluno) inscricoes.push("Karate");
        if (dados_muaythai.is_aluno) inscricoes.push("Muay Thai");
        return inscricoes.length > 0 ? inscricoes.join(", ") : "Nenhuma";
    };

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

    function onExportExcel() {
        console.log("aluno exportado")
    }

    function onAddAluno() {
        console.log("aluno adicionado")
    }


    const handleDelete = async (id) => {
        confirmAlert({
            message: 'Você tem certeza que deseja excluir este aluno?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        await axios.delete(`${config.urlRoot}/excluirAlunos/${id}`);


                        notify("Aluno excluído com sucesso!", "success")

                        setTimeout(() => {
                            navigate(`/`);
                        window.location.reload();
                        }, 1000);
                        
                    }
                },
                {
                    label: 'Não',
                    onClick: () => { }
                }
            ]
        });
    };

    

    const notify = (mensage, type) => {
        toast[type](mensage, {
            position: "top-center", // Define a posição no topo central
            autoClose: 1000,        // Fecha automaticamente após 1 segundo
            hideProgressBar: true,  // Oculta a barra de progresso
            closeOnClick: true,     // Fecha ao clicar
            pauseOnHover: false,    // Não pausa ao passar o mouse
            draggable: false,       // Notificação fixa, sem arrastar
        });

        console.log(mensage, type)

    };

      // Retornar o JSX
      return (
        <div>
            <Header 
            onLogout={onLogout} 
            aluno={alunoLogado}
            handleIdUrl={handleIdUrl}
            />
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <Sidebar
                        aluno={aluno}
                        handleIdUrl={handleIdUrl}
                        getAlunos={getAlunos}
                        handleDelete={handleDelete}
                        alunoLogado={alunoLogado}
                 
                     />
                    <main>
                        <Infoprofile aluno={aluno}
                            handleIdUrl={handleIdUrl} />
                    </main>
                </div>
                <Alunos
                    alunos={alunos}
                    filterModalidade={filterModalidade}
                    setFilterModalidade={setFilterModalidade}
                    getModalidades={getModalidades}
                    onAddAluno={onAddAluno}
                    onExportExcel={onExportExcel}
                    getAlunoshome={getAlunos}
                    calculateAge={calculateAge}
                    handleIdUrl={handleIdUrl}
                    notify={notify}
                    
                    
                // Passar a função
                />
            </div>

            <span className={styles.version}>Versão: 2.0.0</span>

            <ToastContainer
            />
        </div>
    );

    
}
