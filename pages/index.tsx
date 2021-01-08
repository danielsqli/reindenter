import Head from 'next/head';
import Navbar from 'react-bootstrap/Navbar';
import CodeForm from '../components/CodeForm';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Re-Indenter</title>
      </Head>
      <Navbar bg="dark" variant="dark" expand="lg" className="justify-content-center">
        <Navbar.Brand>Re-Indenter</Navbar.Brand>
      </Navbar>
      <CodeForm />
    </div>
  )
}
