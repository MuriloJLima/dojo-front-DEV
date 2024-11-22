import { AlunoCompleto } from './AlunoCompleto';
import styles from './Infoprofile.module.css'
import { useState, useEffect } from 'react';

export function Infoprofile({ aluno, handleIdUrl }) {

  const [showModal, setShowModal] = useState(false);

  const [idade, setIdade] = useState(null);

  const openModal = () => setShowModal(true);

  function closeModal() {

    setShowModal(false)
  }

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

  const obterUltimaGraduacao = (gradList) => {
    return gradList.length > 0 ? gradList[gradList.length - 1].graduacao : 'Sem graduação';
  };

  const karateGrad = aluno?.dados_matricula?.dados_modalidades.dados_karate.grad_aluno;
  const muaythaiGrad = aluno?.dados_matricula?.dados_modalidades.dados_muaythai.grad_aluno;

  return (
    <div className={styles.infoprofile}>
      {/* Título centralizado */}
      <h1 className={styles.title}>Perfil do atleta</h1>

      {/* Descrição do Atleta */}
      <p className={styles.description}>
        {aluno?.desc_aluno || "--"}
      </p>

      {/* Informações principais */}
      <div className={styles.infoSection}>
        <div>
          <label>Idade: </label>
          <span>{idade !== null ? `${idade} anos` : "--"}</span>
        </div>
        <div>
          <label>Tipo Sanguíneo: </label>
          <span> {aluno?.dados_aluno?.t_sanguineo || "--"}</span>
        </div>
        <div>
          <label>Altura: </label>
          <span>{`${aluno?.dados_aluno?.altura_aluno}Cm` || "--"}</span>
        </div>
        <div>
          <label>Peso: </label>
          <span>{`${aluno?.dados_aluno?.peso_aluno}Kg` || "--"}</span>
        </div>
      </div>


      <div className={styles.modalidades}>
        {aluno?.dados_matricula?.dados_modalidades.dados_karate.is_aluno === true && (
          <>
            {/* Histórico do Karatê */}
            <div className={styles.history}>
              <h2>Histórico - Karate</h2>
              <p>{`Graduação: ${obterUltimaGraduacao(karateGrad) || "--"}`}</p>

              <div className={styles.compettionContainer}>
                {aluno.dados_matricula.dados_modalidades.dados_karate.competicoes
                  .sort((a, b) => {
                    const ordem = ['Mundial', 'Internacional', 'Nacional', 'Estadual', 'Regional', 'Municipal'];
                    return ordem.indexOf(a.nivel) - ordem.indexOf(b.nivel);

                    
                  })
                  .slice(0, 5) // Limita o array aos primeiros 5 itens
                  .map((comp, index) => (
                    <p key={index}>
                      {comp.colocacao} - Competição {comp.nivel} ({comp.localidade}, {comp.ano}) - {comp.disputa}
                    </p>
                  ))}
              </div>

            </div>
          </>
        )}


        {aluno?.dados_matricula?.dados_modalidades.dados_muaythai.is_aluno === true && (
          <>
            {/* Histórico do Muay Thai */}
            <div className={styles.history}>
              <h2>Histórico - Muay Thai</h2>
              <p>{`Graduação: ${obterUltimaGraduacao(muaythaiGrad) || "--"}`}</p>

              <div className={styles.compettionContainer}>
                {aluno.dados_matricula.dados_modalidades.dados_muaythai.competicoes
                 .sort((a, b) => {
                  const ordem = ['Mundial', 'Internacional', 'Nacional', 'Estadual', 'Regional', 'Municipal'];
                  return ordem.indexOf(a.nivel) - ordem.indexOf(b.nivel);
                })
                .slice(0, 5) // Limita o array aos primeiros 5 itens
                  .map((comp, index) => (
                    <p key={index}> {comp.colocacao} - Competição {comp.nivel} ({comp.localidade},  {comp.ano}) - {comp.disputa} </p>
                  ))}
              </div>
            </div>
          </>
        )}





      </div>



      <div className={styles.buttonContainer}>
        <button onClick={openModal} className={styles.infoButton}>
          Perfil completo
        </button>
        {showModal &&
          <AlunoCompleto
            onClose={closeModal}
            aluno={aluno}
            handleIdUrl={handleIdUrl}
            idade={idade}
          />}
      </div>
    </div>
  )
}
