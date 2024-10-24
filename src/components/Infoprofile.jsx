import styles from './Infoprofile.module.css'

export function Infoprofile() {
  return (
    <div className={styles.infoprofile}>
      {/* Título centralizado */}
      <h1 className={styles.title}>Perfil do Administrador</h1>
      
      {/* Descrição do Atleta */}
      <p className={styles.description}>
        Atleta dedicado com experiência em múltiplas modalidades, incluindo Karatê e Muay Thai.
      </p>

      {/* Informações principais */}
      <div className={styles.infoSection}>
        <div>
          <label>Idade:</label>
          <span>24 anos</span>
        </div>
        <div>
          <label>Tipo Sanguíneo:</label>
          <span>O+</span>
        </div>
        <div>
          <label>Altura:</label>
          <span>180 cm</span>
        </div>
        <div>
          <label>Peso:</label>
          <span>75 kg</span>
        </div>
      </div>

      {/* Histórico do Karatê */}
      <div className={styles.history}>
        <h2>Histórico do Karatê</h2>
        <p>Atlta feixa roxa com participação em 3 campeonatos, 1º lugar no Campeonato Regional</p>
      </div>

      {/* Histórico do Muay Thai */}
      <div className={styles.history}>
        <h2>Histórico do Muay Thai</h2>
        <p>Alteta faixa azul com participação em 2 campeonatos, 2º lugar no Campeonato Nacional</p>
      </div>
    </div>
  )
}
