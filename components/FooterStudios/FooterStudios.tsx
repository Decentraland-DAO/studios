import React from 'react'
import Link from 'next/link'

import styles from './FooterStudios.module.css'
import Instagram from '../Icons/Instagram'
import Linkedin from '../Icons/Linkedin'
import Twitter from '../Icons/Twitter'
import { Container } from 'decentraland-ui/dist/components/Container/Container'



export default function FooterStudios () {

    return <div className={styles.superContainer}>
        <Container >
            <div className={styles.container}>
                <div className={styles.leftPanel}>
                    <div className={styles.studiosLogo} />
                    <div className={styles.links}>
                        <Link className={styles.link} href="/jobs">Jobs</Link>
                        <Link className={styles.link} href="/studios">Studios</Link>
                        <Link className={styles.link} href="/projects">Projects</Link>
                        <Link className={styles.link} href="/resources">Resources</Link>
                        <a className={`button_primary--inverted ${styles.joinLink}`} href="https://dclstudios.typeform.com/to/NfzmbzXi" rel="noreferrer" target="_blank">JOIN OUR REGISTRY</a>
                    </div>
                </div>
                <div className={styles.rightPanel}>
                    <div className={styles.textlight}>
                        An independent team supported by <a href="https://dao.decentraland.org/" target="_blank" rel="noreferrer">Decentraland&apos;s DAO</a> maintains this project.
                    </div>
                    <div className={styles.textSocial}>
                        Follow Decentraland Studios
                    </div>
                    <div className={styles.linksSocial}>
                        <a href="https://twitter.com/dcl_studios" rel="noreferrer" target="_blank"><Twitter /></a>
                        <a href="https://www.instagram.com/decentraland_studios/" rel="noreferrer" target="_blank"><Instagram /></a>
                        <a href="https://www.linkedin.com/company/decentraland-studios/" rel="noreferrer" target="_blank"><Linkedin /></a>
                    </div>
                </div>
            </div>
        </Container>
    </div>

}