export async function blogLoader() {
  // Artículos hardcodeados
  const articles = [
    {
      id: 1,
      title: "Tendencias de Pastelería 2025",
      category: "Tendencias",
      date: "04-09-2025",
      description: "Descubre las tendencias que están revolucionando la pastelería este año: colores, ingredientes y técnicas innovadoras.",
      image: "assets/hero-pasteleria.jpg",
      slug: "tendencias-pasteleria-2025"
    },
    {
      id: 2,
      title: "Caso curioso #1: El pan que se convirtió en pastel",
      category: "Historias",
      date: "31-08-2025",
      description: "¿Sabías que un simple error puede crear una nueva receta? Descubre cómo un pan se transformó en pastel por accidente.",
      image: "assets/hero-pasteleria.jpg",
      slug: "pan-convertido-en-pastel"
    },
    {
      id: 3,
      title: "Receta de Brownie Sin Gluten",
      category: "Recetas",
      date: "14-08-2025",
      description: "Aprende a preparar un brownie delicioso y apto para todos, sin gluten y con mucho sabor.",
      image: "assets/Brownie Sin Gluten.jpg",
      slug: "brownie-sin-gluten"
    }
  ]

  return { articles }
}
