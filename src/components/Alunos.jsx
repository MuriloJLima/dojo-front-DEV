import styles from './Alunos.module.css';
import noProfile from '../assets/noProfile.jpg';
import { useState, useEffect } from 'react';
import { MagnifyingGlass } from 'phosphor-react'
import { Link } from 'react-router-dom';
import { Newaluno } from './Newaluno';
import axios from 'axios'
import config from '../config/config.json';
// import { MensalidadeStatusUpdater } from './MensalidadeStatusUpdater';

export function Alunos({ setAlunoId, calculateAge, alunos, filterModalidade, getAlunoshome, setFilterModalidade, getModalidades, onExportExcel, onAddAluno }) {
    const [searchTerm, setSearchTerm] = useState('');

    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    // const closeModal = () => setShowModal(false);

    function closeModal() {
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





    const obterSituacaoMensalidade = (aluno) => {
        const { dados_matricula } = aluno;
        const { mensalidades } = dados_matricula.dados_modalidades;

        if (!mensalidades || mensalidades.length === 0) {
            return "regular"; // Sem mensalidades registradas
        }

        // Ordenar por data para obter a última
        const ultimaMensalidade = mensalidades
            .map(mensalidade => ({ ...mensalidade, data_vencimento: new Date(mensalidade.data_vencimento) }))
            .sort((a, b) => b.data_vencimento - a.data_vencimento)[0].data_vencimento;

        const dataAtual = new Date();
        const primeiroDiaDoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
        const decimoDiaDoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 10);

        // Calcular a diferença em meses entre a última data correspondente e o dia 10 do mês atual
        const diffAnos = dataAtual.getFullYear() - ultimaMensalidade.getFullYear();
        const diffMeses = (diffAnos * 12 + dataAtual.getMonth()) - ultimaMensalidade.getMonth();

        if (diffMeses > 1) {
            return `${diffMeses} mensalidades atrasadas`;
        }

        if (ultimaMensalidade < primeiroDiaDoMes) {
            if (dataAtual < decimoDiaDoMes) {
                return "pendente";
            } else {
                return "atrasada";
            }
        }

        return "regular";
    };


    const openProfille = (id)=>{
       setAlunoId(id)
    }


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
                        <th>Mensalidade</th>

                    </tr>
                </thead>
                <tbody>
                    {alunos
                        .filter(filtrarAlunosPorModalidade)
                        .filter(filtrarAlunosPorNome)
                        .map((item, i) => (
                            <tr key={i}>
                                <td>
                                    <button onClick={() => openProfille(item._id)}>


                                        {item.image_url ? (
                                            <img
                                                className={styles.avatar}
                                                src={`http://localhost:3001/${item.image_url}`}

                                            />
                                        ) : (
                                            <img
                                                className={styles.avatar}
                                                src={noProfile}

                                            /> 
                                        )}

                                        
                                    </button>

                                </td>
                                <td>{item.dados_matricula.matri_dojo}</td>
                                <td>{item.dados_aluno.nome_aluno}</td>
                                <td>{calculateAge(item.dados_aluno.nasc_aluno)} anos</td>
                                <td>{item.dados_respons.tel_respons || item.dados_aluno.tel_aluno}</td>
                                <td>{getModalidades(item.dados_matricula.dados_modalidades)}</td>
                                <td>{obterSituacaoMensalidade(item)}</td>

                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
