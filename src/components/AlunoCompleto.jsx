import styles from './AlunoCompleto.module.css'
import { useState, useEffect } from 'react';

import config from '../config/config.json';
import axios from "axios";

export function AlunoCompleto({ aluno, onClose, handleIdUrl }) {
    const [idade, setIdade] = useState(null);

    const [activeTab, setActiveTab] = useState('informacoes')

    const [newPagamento, setNewPagamento] = useState({
        data_vencimento: "",
        valor: "",
        data_pagamento: ""
    });

    const openProfille = (id)=>{
        handleIdUrl(id)
     }

    const newPagamentoValue = () => {

        const today = new Date();

        // Formatar data_vencimento para o dia 10 do mês atual
        const dataVencimento = new Date(today.getFullYear(), today.getMonth(), 10);
        const dataVencimentoFormatted = `${dataVencimento.getFullYear()}-${String(dataVencimento.getMonth() + 1).padStart(2, '0')}-${String(dataVencimento.getDate()).padStart(2, '0')}`;

        // Formatar data_pagamento para a data de hoje
        const dataPagamentoFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        if (aluno?.dados_matricula?.dados_modalidades.dados_karate.is_aluno && aluno?.dados_matricula?.dados_modalidades.dados_muaythai.is_aluno) {
            setNewPagamento({
                data_vencimento: dataVencimentoFormatted,
                valor: "200",
                data_pagamento: dataPagamentoFormatted
            })
        } else {
            setNewPagamento({
                data_vencimento: dataVencimentoFormatted,
                valor: "100",
                data_pagamento: dataPagamentoFormatted
            })
        }
    }

    useEffect(() => {
        newPagamentoValue()
    }, [])

    useEffect(() => {
        if (aluno?.dados_aluno?.nasc_aluno) {
            const birthDate = new Date(aluno?.dados_aluno?.nasc_aluno);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            setIdade(age);
        }
    }, [aluno?.dados_aluno]);


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

    const handleAddMensalidade = async () => {
        try {
            const response = await axios.put(`${config.urlRoot}/novoPagamento/${aluno._id}`, newPagamento);

            console.log(response)
            newPagamentoValue()
            openProfille(aluno._id)
        }
        catch (error) {
            console.error("Erro ao cadastrar o aluno:", error);
            // Aqui você pode tratar o erro, como exibir uma mensagem para o usuário
        }

    }

    const handlePagamentoChange = (e) => {
        const { name, value } = e.target;
        setNewPagamento((prev) => ({
            ...prev,
            [name]: value
        }));


    };


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
                    <button
                        className={`${styles.tabButton} ${activeTab === 'mensalidades' && styles.activeTab}`}
                        onClick={() => setActiveTab('mensalidades')}
                    >
                        Mensalidades
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
                                <div>
                                    {aluno.dados_matricula.dados_modalidades.dados_karate.competicoes.length > 0 && (
                                        <div>
                                            <h2>Competições - Karatê</h2>
                                            {aluno.dados_matricula.dados_modalidades.dados_karate.competicoes.map((competicao, index) => (
                                                <div key={index} className="competicaoItem">
                                                    <p><strong>Título:</strong> {competicao.titulo}</p>
                                                    <p><strong>Premiações:</strong> {competicao.premiacao}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
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
                                <div>
                                    {aluno.dados_matricula.dados_modalidades.dados_muaythai.competicoes.length > 0 && (
                                        <div>
                                            <h2>Competições - Karatê</h2>
                                            {aluno.dados_matricula.dados_modalidades.dados_muaythai.competicoes.map((competicao, index) => (
                                                <div key={index} className="competicaoItem">
                                                    <p><strong>Título:</strong> {competicao.titulo}</p>
                                                    <p><strong>Premiações:</strong> {competicao.premiacoes}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'mensalidades' && (
                    <>

                        <h3>Nova mensalidade</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Data do vencimento:</label>
                                <input
                                    type="date"
                                    name="data_vencimento"
                                    value={newPagamento.data_vencimento}
                                    onChange={handlePagamentoChange}
                                    placeholder="Data - vencimento"
                                />
                            </div>

                            <div>
                                <label>Valor do pagamento:</label>
                                <input
                                    type="text"
                                    name="valor"
                                    value={newPagamento.valor}
                                    onChange={handlePagamentoChange}
                                    placeholder="Valor"
                                />
                            </div>
                            <div>
                                <label>Data do pagamento:</label>
                                <input
                                    type="date"
                                    name="data_pagamento"
                                    value={newPagamento.data_pagamento}
                                    onChange={handlePagamentoChange}
                                    placeholder="Data - Pagamento"
                                />
                            </div>


                            <button type="button" onClick={() => handleAddMensalidade()}>
                                Adicionar pagamento
                            </button>





                        </div>

                        <div className={styles.mensalidades}>
                            {aluno.dados_matricula.dados_modalidades.mensalidades?.length > 0 ? (
                                <div>
                                    <h2>Mensalidades pagas</h2>
                                    {aluno.dados_matricula.dados_modalidades.mensalidades.map((mensalidade, index) => (
                                        <div key={index} className="competicaoItem">
                                            <p><strong>Data de vencimento:</strong> {mensalidade.data_vencimento}</p>
                                            <p><strong>Valor do pagamento:</strong> {mensalidade.valor}</p>
                                            <p><strong>Data de pagamento:</strong> {mensalidade.data_pagamento}</p>
                                            {/* <p><strong>Premiações:</strong> {competicao.premiacoes}</p> */}
                                        </div>
                                    ))}
                                </div>
                            ) :(
                                <p>O aluno ainda não efetuou o pagamento de nenhuma mensalidade</p>
                            )}
                        </div>

                    </>
                )}





            </div>

        </div>

    )
}