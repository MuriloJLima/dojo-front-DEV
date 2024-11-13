import styles from './AlunoCompleto.module.css'
import { useState, useEffect } from 'react';

export function AlunoCompleto({ aluno, onClose, idade }) {


    const [activeTab, setActiveTab] = useState('informacoes')

 



    const getSexoRepresentativo = (sexo) => {
        switch (sexo) {
            case 'M':
                return 'Masculino';
            case 'F':
                return 'Feminino';
            case 'O':
                return 'Outro';
            default:
                return '--';
        }
    };


    const obterUltimaGraduacao = (gradList) => {
        return gradList.length > 0 ? gradList[gradList.length - 1].graduacao : 'Sem graduação';
    };

    const karateGrad = aluno?.dados_matricula?.dados_modalidades.dados_karate.grad_aluno;
    const muaythaiGrad = aluno?.dados_matricula?.dados_modalidades.dados_muaythai.grad_aluno;

  




    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeButton}>X</button>
                <h1>Perfil do Atleta</h1>

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

                {activeTab === 'informacoes' && (
                    <>
                        <div className={styles.profileSection}>

                            <div className={styles.profileHeader}>
                                <div className={styles.profileGroup}>
                                    <label>Nome completo:</label>
                                    <span>{aluno?.dados_aluno?.nome_aluno || "--"}</span>

                                </div>
                                <div className={styles.profileGroup}>
                                    <label>Matrícula:</label>
                                    <span>{aluno?.dados_matricula?.matri_dojo || "--"}</span>

                                </div>
                            </div>
                        </div>
                        {/* Seção de Dados Pessoais */}
                        <div className={styles.profileSection}>
                            <h3>Dados Pessoais</h3>
                            <div className={styles.profileRow}>
                                <div className={styles.profileGroup}>
                                    <label>Data de Nascimento:</label>
                                    <span>
                                        {aluno?.dados_aluno?.nasc_aluno
                                            ? new Date(aluno?.dados_aluno?.nasc_aluno).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                                            : "--"}
                                    </span>
                                </div>
                                <div className={styles.profileGroup}>
                                    <label>Idade:</label>
                                    <span>{idade !== null ? `${idade} anos` : "--"}</span>
                                </div>
                            </div>
                            <div className={styles.profileRow}>
                                <div className={styles.profileGroup}>
                                    <label>Sexo:</label>
                                    <span>{getSexoRepresentativo(aluno?.dados_aluno?.sexo_aluno)}</span>
                                </div>
                                <div className={styles.profileGroup}>
                                    <label>Tipo Sanguíneo:</label>
                                    <span>{aluno?.dados_aluno?.t_sanguineo || "--"}</span>
                                </div>
                            </div>
                            <div className={styles.profileRow}>
                                <div className={styles.profileGroup}>
                                    <label>Altura (cm):</label>
                                    <span>{aluno?.dados_aluno?.altura_aluno || "--"}</span>
                                </div>
                                <div className={styles.profileGroup}>
                                    <label>Peso (kg):</label>
                                    <span>{aluno?.dados_aluno?.peso_aluno || "--"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Seção de Contato */}
                        <div className={styles.profileSection}>
                            <h3>Contato</h3>
                            <div className={styles.profileRow}>
                                <div className={styles.profileGroup}>
                                    <label>Telefone (Aluno):</label>
                                    <span>{aluno?.dados_aluno?.tel_aluno || "--"}</span>
                                </div>
                                <div className={styles.profileGroup}>
                                    <label>Email:</label>
                                    <span>{aluno?.dados_aluno?.email_aluno || "--"}</span>
                                </div>
                            </div>
                            <div className={styles.profileRow}>
                                <div className={styles.profileGroup}>
                                    <label>Endereço:</label>
                                    <span>{aluno?.dados_aluno?.endereco_aluno || "--"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Seção de Dados do Responsável */}
                        {idade !== null && idade < 18 && (
                            <div className={styles.profileSection}>
                                <h3>Dados do Responsável</h3>
                                <div className={styles.profileRow}>
                                    <div className={styles.profileGroup}>
                                        <label>Nome do Responsável:</label>
                                        <span>{aluno?.dados_respons?.nome_respons || "--"}</span>
                                    </div>
                                    <div className={styles.profileGroup}>
                                        <label>Telefone (Responsável):</label>
                                        <span>{aluno?.dados_respons?.tel_respons || "--"}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'modalidades' && (
                    <>
                        {aluno?.dados_matricula?.dados_modalidades.dados_karate.is_aluno === true && (
                            <div className={styles.profileSection}>
                                <h3>Modalidade: Karatê</h3>
                                <div className={styles.profileRow}>
                                    <div className={styles.profileGroup}>
                                        <label>Matrícula (Federação):</label>
                                        <span>{aluno?.dados_matricula.dados_modalidades.dados_karate.matri_federacao || "--"}</span>
                                    </div>
                                    <div className={styles.profileGroup}>
                                        <label>Data de Inscrição:</label>
                                        <span>
                                            {aluno?.dados_matricula.dados_modalidades.dados_karate.data_insc
                                                ? new Date(aluno?.dados_matricula.dados_modalidades.dados_karate.data_insc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                                                : "--"}
                                        </span>
                                    </div>
                                    <div className={styles.profileGroup}>
                                        <label>Graduação:</label>
                                        <span>{obterUltimaGraduacao(karateGrad) || "--"}</span>
                                    </div>

                                </div>

                                {aluno.dados_matricula.dados_modalidades.dados_karate.competicoes.length > 0 && (
                                    <div>
                                        <h2>Competições - Karatê</h2>

                                        <ul>
                                            {aluno?.dados_matricula?.dados_modalidades.dados_karate.competicoes.map((comp, index) => (
                                                <li key={index}>{comp.titulo} - {comp.premiacao}</li>
                                            ))}
                                        </ul>

                                    </div>
                                )}

                                {aluno.dados_matricula.dados_modalidades.dados_karate.grad_aluno.length > 0 && (
                                    <div>
                                        <h2>Histórico de graduação</h2>

                                        <ul>
                                            {aluno?.dados_matricula?.dados_modalidades.dados_karate.grad_aluno
                                                .slice() // cria uma cópia do array
                                                .reverse() // inverte a ordem do array
                                                .map((grad, index) => (
                                                    <li key={index}>{grad.graduacao} - {grad.data_graduacao}</li>
                                                ))}
                                        </ul>


                                    </div>
                                )}

                            </div>
                        )}

                        {aluno?.dados_matricula?.dados_modalidades.dados_muaythai.is_aluno === true && (
                            <div className={styles.profileSection}>
                                <h3>Modalidade: Muay Thai</h3>
                                <div className={styles.profileRow}>
                                    <div className={styles.profileGroup}>
                                        <label>Matrícula (Federação):</label>
                                        <span>{aluno?.dados_matricula.dados_modalidades.dados_muaythai.matri_federacao || "--"}</span>
                                    </div>
                                    <div className={styles.profileGroup}>
                                        <label>Data de Inscrição:</label>
                                        <span>
                                            {aluno?.dados_matricula.dados_modalidades.dados_muaythai.data_insc
                                                ? new Date(aluno?.dados_matricula.dados_modalidades.dados_muaythai.data_insc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                                                : "--"}
                                        </span>
                                    </div>
                                    <div className={styles.profileGroup}>
                                        <label>Graduação:</label>
                                        <span>{obterUltimaGraduacao(muaythaiGrad) || "--"}</span>
                                    </div>

                                </div>

                                {aluno.dados_matricula.dados_modalidades.dados_muaythai.competicoes.length > 0 && (
                                    <div>
                                        <h2>Competições - Karatê</h2>

                                        <ul>
                                            {aluno?.dados_matricula?.dados_modalidades.dados_muaythai.competicoes.map((comp, index) => (
                                                <li key={index}>{comp.titulo} - {comp.premiacao}</li>
                                            ))}
                                        </ul>

                                    </div>
                                )}

                                {aluno.dados_matricula.dados_modalidades.dados_muaythai.grad_aluno.length > 0 && (
                                    <div>
                                        <h2>Histórico de graduação</h2>

                                        <ul>
                                            {aluno?.dados_matricula?.dados_modalidades.dados_muaythai.grad_aluno
                                                .slice() // cria uma cópia do array
                                                .reverse() // inverte a ordem do array
                                                .map((grad, index) => (
                                                    <li key={index}>{grad.graduacao} - {grad.data_graduacao}</li>
                                                ))}
                                        </ul>


                                    </div>
                                )}

                            </div>
                        )}
                    </>
                )}




            </div>

        </div>

    )
}