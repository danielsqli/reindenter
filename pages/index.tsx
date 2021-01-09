import Head from 'next/head';
import Navbar from 'react-bootstrap/Navbar';
import CodeForm from '../components/CodeForm';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Re-Indenter</title>
      </Head>
      <Navbar bg="dark" variant="dark" expand="lg" className="justify-content-center">
        <Navbar.Brand style={{marginLeft: "auto", marginRight: "auto"}}>Re-Indenter</Navbar.Brand>
        <Button style-={{position: "absolute", marginRight: "0.5rem"}} href="https://github.com/danielsqli/reindenter">
          Github
        </Button>
      </Navbar>
      <CodeForm />
    </div>
  )
}
