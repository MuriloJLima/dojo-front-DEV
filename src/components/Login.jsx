import styles from './Login.module.css'

import { useState, useEffect } from 'react';
import axios from 'axios';

import config from '../config/config.json';
import logo from '../assets/logo.png'



export function Login({ onLogin, isLoggedIn }) {



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
        <div>
            <header className={styles.header}>




                <img src={logo} alt="cd-alcateia" />


            </header>
        
          
            <div className={styles.loginContainer}>
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <h2>Login - Painel do administrador</h2>
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
        </div>

    )
}