'use client'
import Image from 'next/image'
import styles from './page.module.css'
import LockComponent from './components/Lock'

export default function Home() {
  return (
    <main className={styles.main}>
      <LockComponent/>
    </main>
  )
}
