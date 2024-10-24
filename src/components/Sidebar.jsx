
import { PencilLine } from 'phosphor-react'

import { Avatar } from './Avatar'
import styles from './Sidebar.module.css'

export function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <img
                className={styles.cover}
                src="https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />



            <div className={styles.profile}>

                <Avatar src="https://github.com/muriloJLima.png" />

                <strong>Murilo Lima</strong>
                <span>0005</span>

            </div>

            <footer>
                <a href="#">
                    <PencilLine size={20}/>
                    Editar perfil
                </a>
            </footer>
        </aside>
    )
}