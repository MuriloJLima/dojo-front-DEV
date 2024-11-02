// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import config from '../config/config.json';
// import styles from './Newaluno.module.css'

// export function MensalidadeStatusUpdater({ alunoId, obterSituacaoMensalidade }) {
//     const [statusAtual, setStatusAtual] = useState(""); // Estado do status atual
//     const [novoStatus, setNovoStatus] = useState(""); // Estado para o novo status selecionado

//     // Função para buscar o status inicial e definir o estado do status atual
//     useEffect(() => {
//         async function fetchStatus() {
//             try {
//                 // Use a função para obter o status inicial
//                 const statusInicial = obterSituacaoMensalidade();
//                 setStatusAtual(statusInicial);
//             } catch (error) {
//                 console.error("Erro ao buscar o status inicial:", error);
//             }
//         }
//         fetchStatus();
//     }, [alunoId]);

//     // Função para atualizar o status no backend
//     async function handleStatusChange(event) {
//         const novoStatusSelecionado = event.target.value;
//         setNovoStatus(novoStatusSelecionado);

        
//         // const indiceParaEnvio = novoStatusSelecionado === "Regular" ? "$[]" : "-1";
//         const dataPagamentoParaEnvio = novoStatusSelecionado === "Regular" ? new Date().toISOString() : "";

//         try {
//             await axios.patch(`${config.urlRoot}/alterarStatusMensKarate/${alunoId}`, {
//                 indice: '$[]',
//                 novoStatus: novoStatusSelecionado,
//                 data_pagamento: dataPagamentoParaEnvio
//             });

//             // Atualiza o status atual para refletir a mudança no frontend
//             setStatusAtual(novoStatusSelecionado);
//             console.log(novoStatusSelecionado);
//         } catch (error) {
//             console.error("Erro ao atualizar o status:", error);
//         }

        
//         try {
//             await axios.patch(`${config.urlRoot}/alterarStatusMensMuayThai/${alunoId}`, {
//                 indice: '$[]',
//                 novoStatus: novoStatusSelecionado,
//                 data_pagamento: dataPagamentoParaEnvio
//             });

//             // Atualiza o status atual para refletir a mudança no frontend
//             setStatusAtual(novoStatusSelecionado);
//             console.log(novoStatusSelecionado);
//         } catch (error) {
//             console.error("Erro ao atualizar o status:", error);
        
//     }

//     return (
//         <td>
//             <div className={styles.filterWrapper}>
//                 <span>{statusAtual}</span>
//                 <select value={ novoStatus || statusAtual} onChange={handleStatusChange}>
//                     <option value="Regular">Regular</option>
//                     <option value="Pendente">Pendente</option>
//                     <option value="Atrasada">Atrasada</option>
//                 </select>
//             </div>
//         </td>
//     );
// }
