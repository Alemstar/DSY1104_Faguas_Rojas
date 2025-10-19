import { useLoaderData } from "react-router"
import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import Featured from "../../components/home/Featured";
import History from "../../components/history/History";

export default function Home(){
    const { message, products } = useLoaderData();
    return (
        <>
            <Hero message={message} />
            <Categories />
            <Featured products={products} />
            <History />       
        </>
    )
}