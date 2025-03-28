
import { PencilLine, Trash } from 'phosphor-react'

import { Avatar } from './Avatar'
import styles from './Sidebar.module.css'
import noProfile from '../assets/noProfile.jpg';
import config from '../config/config.json';

import { useState, useEffect } from 'react';
import { Editaluno } from './Editaluno';

export function Sidebar({ aluno, handleIdUrl, getAlunos, handleDelete,  }) {

    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    // const closeModal = () => setShowModal(false);

    function closeModal() {

        setShowModal(false)
    }


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
                        src={aluno?.image_url}

                    />
                ) : (
                    <Avatar
                        className={styles.avatar}
                        src={noProfile}

                    />
                ) || <Avatar
                    className={styles.avatar}
                    src={noProfile}

                />}

                <strong>{aluno?.dados_aluno?.nome_aluno}</strong>
                <span>{aluno?.dados_matricula?.matri_dojo || "000"}</span>

            </div>

            <footer>
                <button className={styles.buttonEdit} onClick={openModal} type='button'>
                    <PencilLine size={20} />
                    Editar
                </button>
                {showModal &&
                    <Editaluno
                        onClose={closeModal}
                        aluno={aluno}
                        handleIdUrl={handleIdUrl}
                        getAlunosList={getAlunos}
                       
                   
                    />}
                <button className={styles.buttonEdit} onClick={() => handleDelete(aluno._id)} type='button'>
                    <Trash size={20} />
                    Excluir
                </button>
            </footer>
        </aside>
    )
}