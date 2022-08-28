import styles from '../styles/Footer.module.css'

const Footer = () => {
    return (
        <footer className="container mx-auto text-right my-4">
            <p className={styles.footerAttribution}>Built by <a href='https://www.linkedin.com/in/stavros-melidoniotis/' target='_blank' rel='noreferrer'>Stavros Melidoniotis</a></p>
        </footer>
    )
}

export default Footer