import Button from "./Button";

export default function Hero() {
  return (
    <div className="max-w-[1000px] mx-auto text-center flex flex-col items-center px-12 sm:px-4 md:px:0 my-0 md:my-16">
      <h1 className="py-8">Explorez le <span className="text-tertiary font-light">Web</span> sous toutes ses <span className="underline underline-offset-8 decoration-tertiary">facettes</span></h1>
      <p className="text-[18px] leading-[1.6] max-w-[834px] mx-auto">Le monde du web évolue constamment, et nous sommes là pour vous guider à travers ses tendances, technologies et meilleures pratiques. Que vous soyez développeur, designer ou passionné du digital, notre blog vous offre du contenu de qualité pour rester à la pointe.</p>
        <div className="flex flex-col sm:flex-row justify-center mt-8 gap-4">
          <Button to="/blog" className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-tertiary hover:border-tertiary transition-colors">
            Découvrir les articles
          </Button>
          <Button to="/newsletter" className="bg-primary border-white text-white px-6 py-3 rounded-lg hover:bg-secondary hover:border-secondary transition-colors">
            S'abonner à la newsletter
          </Button>
        </div>
      <img src="/images/Desktop-hero.webp" alt="Shapes" className="hidden sm:block md:block w-[1100px] h-auto mx-auto my-20" />  
    </div>
  )
}
