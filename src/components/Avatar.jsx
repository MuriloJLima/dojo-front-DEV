import styles from './Avatar.module.css'

export function Avatar({src}) {

    
    return (
        <img
            className={styles.avatarBorder}
            src={src}
        />
    )
}