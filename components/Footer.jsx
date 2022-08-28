import styles from '../styles/Footer.module.css'

const Footer = () => {
    return (
        <footer className="container mx-auto text-right my-4">
            <p className={styles.footerAttribution}>Built by Stavros Melidoniotis</p>
        </footer>
    )
}

export default Footer