import styles from './Header.module.css'


import logo from '../assets/logo.png'

export function Header({ onLogout }) {
    return(
        <header className={styles.header}>
            <button onClick={onLogout} >sair</button>
            <img src={logo} alt="cd-alcateia" />
        </header>
        
    )
}