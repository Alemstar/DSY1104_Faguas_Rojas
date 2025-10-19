export async function blogDetailLoader({ params }) {
  const { slug } = params

  // Artículos completos hardcodeados
  const articles = {
    "tendencias-pasteleria-2025": {
      id: 1,
      title: "Tendencias de Pastelería 2025",
      category: "Tendencias",
      date: "04-09-2025",
      author: "Catalina Faguas",
      image: "assets/hero-pasteleria.jpg",
      description: "Decoración de pasteles con ingredientes naturales",
      slug: "tendencias-pasteleria-2025",
      content: {
        ingredients: [
          "Frutas frescas",
          "Flores comestibles",
          "Glaseado de colores",
          "Bizcocho esponjoso"
        ],
        steps: [
          "Las frutas frescas y flores comestibles son protagonistas en la decoración.",
          "El glaseado de colores vibrantes da vida a los pasteles modernos.",
          "La técnica de bizcocho esponjoso permite creaciones más ligeras y sabrosas."
        ]
      }
    },
    "pan-convertido-en-pastel": {
      id: 2,
      title: "Caso curioso #1: El pan que se convirtió en pastel",
      category: "Historias",
      date: "31-08-2025",
      author: "Catalina Faguas",
      image: "assets/hero-pasteleria.jpg",
      description: "Una historia sobre creatividad y error en la cocina",
      slug: "pan-convertido-en-pastel",
      content: {
        ingredients: [
          "Masa de pan dulce",
          "Azúcar adicional",
          "Mantequilla",
          "Esencia de vainilla"
        ],
        steps: [
          "Todo comenzó con un error en las proporciones de azúcar.",
          "La masa más dulce resultó en una textura diferente.",
          "El resultado fue un híbrido delicioso entre pan y pastel.",
          "Ahora es una de nuestras recetas más solicitadas."
        ]
      }
    },
    "brownie-sin-gluten": {
      id: 3,
      title: "Receta de Brownie Sin Gluten",
      category: "Recetas",
      date: "14-08-2025",
      author: "Catalina Faguas",
      image: "assets/Brownie Sin Gluten.jpg",
      description: "Aprende a preparar un brownie delicioso y apto para todos, sin gluten y con mucho sabor.",
      slug: "brownie-sin-gluten",
      content: {
        ingredients: [
          "200g de chocolate sin gluten",
          "150g de mantequilla",
          "3 huevos",
          "150g de azúcar",
          "100g de harina sin gluten",
          "1 cucharadita de esencia de vainilla",
          "Una pizca de sal"
        ],
        steps: [
          "Precalienta el horno a 180°C y prepara un molde cuadrado.",
          "Derrite el chocolate con la mantequilla a baño maría.",
          "Bate los huevos con el azúcar hasta obtener una mezcla espumosa.",
          "Incorpora el chocolate derretido a los huevos batidos.",
          "Agrega la harina sin gluten, la vainilla y la sal, mezclando suavemente.",
          "Vierte la mezcla en el molde y hornea por 25-30 minutos.",
          "Deja enfriar antes de cortar en cuadrados."
        ]
      }
    }
  }

  const article = articles[slug]

  if (!article) {
    throw new Response("Artículo no encontrado", { status: 404 })
  }

  return { article }
}
