import React from 'react'
import styles from './BackButton.module.css'
import ArrowRight from '../Icons/ArrowRight'
import { useRouter } from 'next/router'

function BackButton() {
  const router = useRouter()

  const onClickHandler = () => {
    if(globalThis?.sessionStorage.prevInStudios){ 
      router.back()
    } else {
      router.push('/')
    }
  }
  
  return (
    <div onClick={onClickHandler} className={styles.arrowright}>
      <ArrowRight />
    </div>
  )
}

export default BackButton
