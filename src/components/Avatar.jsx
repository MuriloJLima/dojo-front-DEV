import styles from './Avatar.module.css'

export function Avatar({src}) {

    
    return (
        <div className={styles.imageContainer}>
            <img
            className={styles.avatar}
            src={src}
        />
        </div>
        
    )
}