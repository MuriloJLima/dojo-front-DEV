import styles from './infoMensalidade.module.css'

import { useState, useEffect } from 'react';

import config from '../config/config.json';
import axios from "axios";
import { PlusCircle, Trash } from 'phosphor-react';

export function InforMensalidade({ aluno, onClose, getAlunoshome }) {

    const [newPagamento, setNewPagamento] = useState({
        data_vencimento: "",
        valor: "",
        data_pagamento: ""
    });

    const handlePagamentoChange = (e) => {
        const { name, value } = e.target;
        setNewPagamento((prev) => ({
            ...prev,
            [name]: value
        }));


    };

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

    const handleAddMensalidade = async () => {
        try {
            const response = await axios.put(`${config.urlRoot}/novoPagamento/${aluno._id}`, newPagamento);

            console.log(response)
            newPagamentoValue()
            getAlunoshome()

        }
        catch (error) {
            console.error("Erro ao cadastrar o aluno:", error);
            // Aqui você pode tratar o erro, como exibir uma mensagem para o usuário
        }

    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
            <button onClick={onClose} className={styles.closeButton}>X</button>
                <h1>Nova mensalidade</h1>
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

                    <div className={styles.formGroup}>
                        <label>Valor do pagamento:</label>
                        <input
                            type="text"
                            name="valor"
                            value={newPagamento.valor}
                            onChange={handlePagamentoChange}
                            placeholder="Valor"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Data do pagamento:</label>
                        <input
                            type="date"
                            name="data_pagamento"
                            value={newPagamento.data_pagamento}
                            onChange={handlePagamentoChange}
                            placeholder="Data - Pagamento"
                        />
                    </div>


                    <div >
                        <label><br /></label>
                        <button type="button" onClick={() => handleAddMensalidade()}>
                            <PlusCircle size={20} /> Adicionar
                        </button>

                    </div>





                </div>

                <div className={styles.mensalidades}>
                    {aluno.dados_matricula.mensalidades?.length > 0 ? (
                        <div>
                            <h2>Mensalidades pagas</h2>
                            {aluno.dados_matricula.mensalidades.slice().reverse()
                                // .map((mensalidade, index) => (
                                //     <div key={index} className="competicaoItem">
                                //         <p><strong>Data de vencimento:</strong> {mensalidade.data_vencimento}</p>
                                //         <p><strong>Valor do pagamento:</strong> {mensalidade.valor}</p>
                                //         <p><strong>Data de pagamento:</strong> {mensalidade.data_pagamento}</p>
                                //         {/* <p><strong>Premiações:</strong> {competicao.premiacoes}</p> */}
                                //     </div>
                                // ))}
                                .map((mensalidade, index) => {
                                    const reverseIndex = aluno.dados_matricula.mensalidades.length - 1 - index;
                                    return (
                                        <div className={styles.formRow} key={index}>

                                            <div className={styles.formGroup}>

                                                <input
                                                    type="date"
                                                    name={`data_vencimento-${reverseIndex}`}
                                                    value={mensalidade.data_vencimento}
                                                // onChange={(e) => handleEditGraduacaoKarate(reverseIndex, 'data_graduacao', e.target.value)}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>

                                                <input
                                                    type="number"
                                                    name={`valor-${reverseIndex}`}
                                                    value={mensalidade.valor}
                                                // onChange={(e) => handleEditGraduacaoKarate(reverseIndex, 'data_graduacao', e.target.value)}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>

                                                <input
                                                    type="date"
                                                    name={`data_pagamento-${reverseIndex}`}
                                                    value={mensalidade.data_pagamento}
                                                // onChange={(e) => handleEditGraduacaoKarate(reverseIndex, 'data_graduacao', e.target.value)}
                                                />
                                            </div>

                                            <button type="button" 
                                            // onClick={() => handleRemoveGraduacaoKarate(reverseIndex)}
                                            >
                                                <Trash size={20} />Remover
                                            </button>
                                        </div>
                                    )
                                })}
                        </div>
                    ) : (
                        <p>O aluno ainda não efetuou o pagamento de nenhuma mensalidade</p>
                    )}
                </div>
            </div>
        </div>

    )
}