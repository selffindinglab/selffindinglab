import Hero from './components/Hero';
import BookList from './components/BookList';
import Philosophy from './components/Philosophy';
import Footer from './components/Footer';

export default function Home() {
    return (
        <main className="pt-20">
            <Hero />
            <BookList />
            <Philosophy />
            <section
                id="news"
                className="py-20 text-center"
            >
                <h2 className="text-3xl font-bold mb-4">소식</h2>
                <p className="text-gray-600">현재 준비 중입니다.</p>
            </section>
            <Footer />
        </main>
    );
}
