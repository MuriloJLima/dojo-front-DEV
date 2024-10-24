// Componente Pai
import { Alunos } from './components/Alunos';
import { Header } from './components/Header';
import { Infoprofile } from './components/Infoprofile';
import { Sidebar } from './components/Sidebar';
import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import config from './config/config.json';

export function Home() {
    const [alunos, setAlunos] = useState([]);
    const [filterModalidade, setFilterModalidade] = useState("Todos"); // Corrigido para "Todos"

    const getAlunos = async () => {
        const response = await axios.get(`${config.urlRoot}/listarAlunos`);
        const sortedData = response.data.data.sort((a, b) => a.dados_matricula.matri_dojo - b.dados_matricula.matri_dojo);
        setAlunos(sortedData);
    };

    useEffect(() => {
        getAlunos();
    }, []);

    // Função para verificar as modalidades
    const getModalidades = (modalidades) => {
        const { dados_karate, dados_muaythai } = modalidades;
        let inscricoes = [];
        if (dados_karate.is_aluno) inscricoes.push("Karate");
        if (dados_muaythai.is_aluno) inscricoes.push("Muay Thai");
        return inscricoes.length > 0 ? inscricoes.join(", ") : "Nenhuma";
    };

    // Retornar o JSX
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <Sidebar />
                    <main>
                        <Infoprofile />
                    </main>
                </div>
                <Alunos 
                    alunos={alunos} 
                    filterModalidade={filterModalidade} 
                    setFilterModalidade={setFilterModalidade}
                    getModalidades={getModalidades} // Passar a função
                />
            </div>
        </div>
    );
}
