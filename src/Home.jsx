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
import { Routes, Route, useLocation } from 'react-router-dom';



export function Home({ onLogout }) {
    const [alunos, setAlunos] = useState([]);
    const [filterModalidade, setFilterModalidade] = useState("Todos"); // Corrigido para "Todos"
    const [aluno, setAluno] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          setAluno(JSON.parse(token))
        }
      }, []);

    const getAlunos = async () => {
        const response = await axios.get(`${config.urlRoot}/listarAlunos`);
        const sortedData = response.data.data.sort((a, b) => a.dados_matricula.matri_dojo - b.dados_matricula.matri_dojo);
        setAlunos(sortedData);
    };

    useEffect(() => {
        getAlunos();
    }, []);

    async function handleIdUrl(id) {

        navigate(`/home?id=${id}`);
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Adiciona um efeito de rolagem suave
            });

      
            try {
                // Realiza a requisição GET com os query parameters
                const response = await axios.get(`${config.urlRoot}/dadosAluno`, {
                    params: { id }
                });
    
                setAluno(response.data.data)
    
            
                
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        
    };

   

    


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



    // Retornar o JSX
    return (
        <div>
            <Header onLogout={onLogout}/>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <Sidebar aluno={aluno}/>
                    <main>
                        <Infoprofile aluno={aluno} />
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
                // Passar a função
                />
            </div>
        </div>
    );
}
