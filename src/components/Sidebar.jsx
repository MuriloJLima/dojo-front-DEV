
import { PencilLine } from 'phosphor-react'

import { Avatar } from './Avatar'
import styles from './Sidebar.module.css'
import noProfile from '../assets/noProfile.jpg';

export function Sidebar({ aluno }) {
    return (
        <aside className={styles.sidebar}>
            <img
                className={styles.cover}
                src="https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />



            <div className={styles.profile}>

                {aluno?.image_url ? (
                    <Avatar
                        className={styles.avatar}
                        src={`http://localhost:3001/${aluno.image_url}`}

                    />
                ) : (
                    <Avatar
                        className={styles.avatar}
                        src={noProfile}

                    />
                )}

                <strong>{aluno.dados_aluno?.nome_aluno}</strong>
                <span>{aluno.dados_matricula?.matri_dojo}</span>

            </div>

            <footer>
                <a href="#">
                    <PencilLine size={20} />
                    Editar perfil
                </a>
            </footer>
        </aside>
    )
}