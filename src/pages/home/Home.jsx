import { useLoaderData } from "react-router"
import Button from 'react-bootstrap/Button';
import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";

export default function Home(){
    const { message } = useLoaderData();
    return (
        <>
            <Hero message={message} />
            <Categories />
        </>
    )
}