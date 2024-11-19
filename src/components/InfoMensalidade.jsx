import styles from './infoMensalidade.module.css'

import { useState, useEffect } from 'react';

import config from '../config/config.json';
import axios from "axios";
import { PlusCircle, Trash } from 'phosphor-react';

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function InfoMensalidade({ formData, onClose, getAlunoshome, setFormData }) {

    

   
    const notify = (mensage, type) => {
        toast[type](mensage, {
            position: "top-center", // Define a posição no topo central
            autoClose: 1000,        // Fecha automaticamente após 1 segundo
            hideProgressBar: true,  // Oculta a barra de progresso
            closeOnClick: true,     // Fecha ao clicar
            pauseOnHover: false,    // Não pausa ao passar o mouse
            draggable: false,       // Notificação fixa, sem arrastar
        });

    };
    

    

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

    const handleAddMensalidade = () => {
        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                mensalidades: [
                    ...prevData.dados_matricula.mensalidades,
                    {
                        data_vencimento: newPagamento.data_vencimento,
                        valor: newPagamento.valor,
                        data_pagamento: newPagamento.data_pagamento
                    }
                ]
            }
        }));
        // Limpar os campos de nova competição
        setNewPagamento({
            data_vencimento: "",
            valor: "",
            data_pagamento: ""
        });
    };

    const handleEditMensalidade = (index, field, value) => {
        // Faz uma cópia profunda do array grad_aluno para garantir que não haja referências mistas
        const updatedMensalidades = formData.dados_matricula.mensalidades.map((mens, i) => ({
            ...mens, // clona o objeto de cada graduação
        }));

        // Atualiza o campo específico da graduação selecionada
        updatedMensalidades[index] = {
            ...updatedMensalidades[index],
            [field]: value,
        };

        // Atualiza o estado do formData com a nova lista de graduações
        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                mensalidades: updatedMensalidades,
            },
        }));
    };

    const handleRemoveMensalidade = (index) => {
        const updatedMensalidades = formData.dados_matricula.mensalidades.filter((_, i) => i !== index);

        setFormData(prevData => ({
            ...prevData,
            dados_matricula: {
                ...prevData.dados_matricula,
                mensalidades: updatedMensalidades,
            },
        }));

    }

    const newPagamentoValue = () => {

        const today = new Date();

        // Formatar data_vencimento para o dia 10 do mês atual
        const dataVencimento = new Date(today.getFullYear(), today.getMonth(), 10);
        const dataVencimentoFormatted = `${dataVencimento.getFullYear()}-${String(dataVencimento.getMonth() + 1).padStart(2, '0')}-${String(dataVencimento.getDate()).padStart(2, '0')}`;

        // Formatar data_pagamento para a data de hoje
        const dataPagamentoFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        if (formData.dados_matricula?.dados_modalidades.dados_karate.is_aluno && formData.dados_matricula?.dados_modalidades.dados_muaythai.is_aluno) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();



        const form = new FormData();

        // Adiciona objetos diretamente ao FormData
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, JSON.stringify(value));
        });


        //encaminha os dados para a rota e volta os valores para o padrão
        try {
            const response = await axios.put(`${config.urlRoot}/alterarAlunos`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
           

            notify("Mensalidade adicionada!", "success")

            setTimeout(() => {
                getAlunoshome()
                onClose()
            }, 1000);
           


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
                        {formData.dados_matricula.mensalidades?.length > 0 ? (
                            <div>
                                <h2>Mensalidades pagas</h2>
                                {formData.dados_matricula.mensalidades.slice().reverse()
                                    .map((mensalidade, index) => {
                                        const reverseIndex = formData.dados_matricula.mensalidades.length - 1 - index;
                                        return (
                                            <div className={styles.formRow} key={index}>

                                                <div className={styles.formGroup}>

                                                    <input
                                                        type="date"
                                                        name={`data_vencimento-${reverseIndex}`}
                                                        value={mensalidade.data_vencimento}
                                                        onChange={(e) => handleEditMensalidade(reverseIndex, 'data_vencimento', e.target.value)}
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>

                                                    <input
                                                        type="number"
                                                        name={`valor-${reverseIndex}`}
                                                        value={mensalidade.valor}
                                                        onChange={(e) => handleEditMensalidade(reverseIndex, 'valor', e.target.value)}
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>

                                                    <input
                                                        type="date"
                                                        name={`data_pagamento-${reverseIndex}`}
                                                        value={mensalidade.data_pagamento}
                                                        onChange={(e) => handleEditMensalidade(reverseIndex, 'data_pagamento', e.target.value)}
                                                    />
                                                </div>

                                                <button type="button"
                                                    onClick={() => handleRemoveMensalidade(reverseIndex)}
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
                    <div className={styles.buttonContainer}>
                        <button type="submit" >
                            Concluído
                        </button>
                    </div>

                    <ToastContainer
   
              
            />
                </form>
            </div>
        </div>

    )
}