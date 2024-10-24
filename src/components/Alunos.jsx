// Componente Filho
import styles from './Alunos.module.css';
import noProfile from '../assets/noProfile.jpg';

export function Alunos({ alunos, filterModalidade, setFilterModalidade, getModalidades }) {
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

    return (
        <table className={styles.alunos}>
            <thead>
                <tr>
                    <th>Perfil</th>
                    <th>Matrícula</th>
                    <th>Nome Completo</th>
                    <th>Idade</th>
                    <th>Telefone</th>
                    <th>Modalidades</th>
                    <th>
                        <div className={styles.filterWrapper}>
                            <span>Filtrar</span>
                            <select
                                value={filterModalidade}
                                onChange={(e) => setFilterModalidade(e.target.value)} // Use a função recebida
                            >
                                <option value="Todos">Todos</option>
                                <option value="Karate">Karate</option>
                                <option value="Muay Thai">Muay Thai</option>
                                <option value="Karate e Muay Thai">Karate e Muay Thai</option>
                            </select>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {alunos.filter(filtrarAlunosPorModalidade).map((item, i) => (
                    <tr key={i}>
                        <td>
                            <img className={styles.avatar} src={noProfile} alt="cd-alcateia" />
                        </td>
                        <td>{item.dados_matricula.matri_dojo}</td>
                        <td>{item.dados_aluno.nome_aluno}</td>
                        <td>{item.dados_aluno.nasc_aluno}</td>
                        <td>{item.dados_respons.tel_respons || item.dados_aluno.tel_aluno}</td>
                        <td>{getModalidades(item.dados_matricula.dados_modalidades)}</td>
                        <td>
                            <td alignCenter width="5%">
                                {/* <FaEdit onClick={() => handleAlunoClick(`E:${item._id}`)} /> */}
                            </td>
                            <td alignCenter width="5%">
                                {/* <FaTrash onClick={() => handleDelete(item._id)} /> */}
                            </td>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
