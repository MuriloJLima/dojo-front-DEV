import styles from './Alunos.module.css';
import noProfile from '../assets/noProfile.jpg';
import { useState, useEffect } from 'react';
import { MagnifyingGlass } from 'phosphor-react'
import { Link } from 'react-router-dom';
import { Newaluno } from './Newaluno';

export function Alunos({calculateAge, alunos, filterModalidade, getAlunoshome, setFilterModalidade, getModalidades, onExportExcel, onAddAluno }) {
    const [searchTerm, setSearchTerm] = useState('');

    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    // const closeModal = () => setShowModal(false);

    function closeModal(){
        getAlunoshome()
        setShowModal(false)
    }

    // Função para filtrar alunos
    const filtrarAlunosPorModalidade = (aluno) => {
        const modalidades = getModalidades(aluno.dados_matricula.dados_modalidades);
        switch (filterModalidade) {
            case "Karate":
                return modalidades.includes("Karate");
            case "Muay Thai":
                return modalidades.includes("Muay Thai");
            case "Karate e Muay Thai":
                return modalidades.includes("Karate") && modalidades.includes("Muay Thai");
            default:
                return true; // Exibe todos os alunos
        }
    };

    // Filtrar alunos pelo nome de acordo com o termo de pesquisa
    const filtrarAlunosPorNome = (aluno) => {
        return aluno.dados_aluno.nome_aluno.toLowerCase().includes(searchTerm.toLowerCase());
    };

    return (
        <div className={styles.alunosContainer}>
            <div className={styles.header}>

                <div className={styles.searchContainer}>
                    <MagnifyingGlass className={styles.icon} />
                    <input
                        type="text"
                        placeholder="Pesquisar aluno por nome"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />

                </div>
                <div className={styles.filterWrapper}>
                    <span>Filtrar</span>
                    <select
                        value={filterModalidade}
                        onChange={(e) => setFilterModalidade(e.target.value)}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Karate">Karate</option>
                        <option value="Muay Thai">Muay Thai</option>
                        <option value="Karate e Muay Thai">Karate e Muay Thai</option>
                    </select>

                </div>

                <div>
                    <button onClick={openModal} className={styles.addButton}>
                        Inserir Aluno
                    </button>
                    {showModal && <Newaluno onClose={closeModal} />}
                </div>
                <button onClick={onExportExcel} className={styles.exportButton}>
                    Exportar para Excel
                </button>


            </div>
            <table className={styles.alunos}>
                <thead>
                    <tr>
                        <th>Perfil</th>
                        <th>Matrícula</th>
                        <th>Nome Completo</th>
                        <th>Idade</th>
                        <th>Telefone</th>
                        <th>Modalidades</th>

                    </tr>
                </thead>
                <tbody>
                    {alunos
                        .filter(filtrarAlunosPorModalidade)
                        .filter(filtrarAlunosPorNome)
                        .map((item, i) => (
                            <tr key={i}>
                                <td>
                                    <img className={styles.avatar} src={noProfile} alt="cd-alcateia" />
                                </td>
                                <td>{item.dados_matricula.matri_dojo}</td>
                                <td>{item.dados_aluno.nome_aluno}</td>
                                <td>{calculateAge(item.dados_aluno.nasc_aluno)} anos</td>
                                <td>{item.dados_respons.tel_respons || item.dados_aluno.tel_aluno}</td>
                                <td>{getModalidades(item.dados_matricula.dados_modalidades)}</td>

                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
