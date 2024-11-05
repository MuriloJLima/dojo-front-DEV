import styles from './login.module.css'

import { useState, useEffect } from 'react';
import axios from 'axios';

import config from '../config/config.json';



export function Login({onLogin}) {

    

    const [alunos, setAlunos] = useState([]);

    const [senha, setSenha] = useState('');
    const [matricula, setMatricula] = useState('');



    const [error, setError] = useState('');
   

    const getAlunos = async () => {
        try {
            const response = await axios.get(`${config.urlRoot}/listarAlunos`);
            setAlunos(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
        }
    };

    useEffect(() => {
        getAlunos();
    }, []);



    const handleSubmit = (e) => {
        e.preventDefault();

        const alunoEncontrado = alunos.find(aluno =>
            aluno.dados_matricula.matri_dojo === matricula && aluno.senha_aluno == senha
        );

        if (alunoEncontrado) {
            if (alunoEncontrado.is_adm) {
                onLogin(alunoEncontrado);
                // Redirecionar ou armazenar token de autenticação aqui
            } else {
                setError("O usuário não é administrador");
            }
        } else {
            setError("Matrícula ou Email inválidos.");
        }
    };



    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <label>Matrícula:</label>
                <input
                    type="text"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    required
                    error={!!error}
                />
                <label>Senha:</label>
                <input
                    type="text"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                error={!!error}
                />
                {error && <p className={styles.errorText}>{error}</p>}
                <div className={styles.buttonContainer}>
                    <button type="submit">Entrar</button>
                </div>
            </form>

        </div>
    )
}