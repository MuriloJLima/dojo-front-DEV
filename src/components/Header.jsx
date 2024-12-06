import styles from './Header.module.css'
import config from '../config/config.json';

import logo from '../assets/logo.png'
import noProfile from '../assets/noProfile.jpg';

export function Header({ onLogout, aluno, handleIdUrl, isLoggedIn }) {

    const openProfille = (id) => {
        handleIdUrl(id)

    }

    

    return (
        <header className={styles.header}>
          
                 <button className={styles.logout} onClick={onLogout} >Sair</button>
           
           
            <img src={logo} alt="cd-alcateia" />



            <button className={styles.profileContaier} onClick={() => openProfille(aluno._id)} >
                
                
            
                <div className={styles.profile} >

               

                    {aluno?.image_url ? (
                        <img
                            className={styles.avatar}
                            src={aluno?.image_url}

                        />
                    ) : (
                        <img
                            className={styles.avatar}
                            src={noProfile}

                        />
                    ) || <img
                        className={styles.avatar}
                        src={noProfile}

                    />}

                </div>

            </button>
        </header>

    )
}