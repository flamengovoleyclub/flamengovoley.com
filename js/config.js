/**
 * CONFIGURACIÓN CENTRAL — FLAMENGO VOLEIBOL
 * Bogotá, Colombia
 * 
 * Datos oficiales actualizados:
 * - Sede: Parque Carvajal (Calle 34 Sur # 69C - 60, Bogotá)
 * - Teléfono / WhatsApp: 3025145457
 * - Categorías: Masculino Menores y Femenino Infantil
 * - Planes: 12 sesiones ($75.000), 8 sesiones ($60.000), Inscripción con uniforme ($90.000)
 */

const DEFAULT_FLAMENGO_CONFIG = {
  general: {
    clubName: "Flamengo Voleibol",
    tagline: "Pasión por el voleibol. Compromiso con el equipo.",
    city: "Bogotá, Colombia",
    address: "Parque Carvajal — Calle 34 Sur # 69C - 60, Bogotá D.C.",
    locality: "Carvajal / Kennedy, Bogotá",
    whatsapp: "+573025145457",
    whatsappDisplay: "+57 302 514 5457",
    instagram: "https://www.instagram.com/flamengovoley/",
    instagramUser: "@flamengovoley",
    email: "contacto@flamengovoley.com",
    mapsUrl: "https://www.google.com/maps/dir/4.603904,-74.1376/Flamengo+voley,+Cl.+34+Sur+%2369C-60,+Bogot%C3%A1/@4.6082248,-74.1435085,16z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x8e3f9f0bd5f49319:0x283ce19a9d6d62dd!2m2!1d-74.138982!2d4.613895?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
    googleReviewUrl: "https://g.page/r/Cd1ibZ2a4TwoEAE/review",
    scheduleSummary: "Martes, Jueves y Sábados | Parque Carvajal",
    adminPin: "flamengo2026",
    registrationFee: "$90.000 COP (Incluye Uniforme Oficial)",
    showCoaches: false // Controla si se muestran los profesores y la sección de entrenadores
  },

  hero: {
    badge: "🏐 Club de Voleibol en Bogotá • Parque Carvajal",
    titlePrimary: "Encuentra tu lugar en la cancha.",
    subtitle: "Entrena, aprende, compite y crece junto a una comunidad que vive el voleibol por pasión.",
    ctaPrimaryText: "RESERVAR CLASE DE CORTESÍA",
    ctaSecondaryText: "CONOCE NUESTROS GRUPOS",
    trustItem1: "🏐 Parque Carvajal (Calle 34 Sur # 69C - 60)",
    trustItem2: "🔥 Categorías Masculina Menores y Femenina Infantil",
    trustItem3: "🏆 Planes desde $60.000 (Inscripción incluye uniforme)"
  },

  pillars: [
    {
      id: "pasion",
      title: "PASIÓN",
      icon: "flame",
      description: "Entrenamos porque amamos el voleibol. Vivimos cada punto, cada entrenamiento y cada partido con entrega total."
    },
    {
      id: "disciplina",
      title: "DISCIPLINA",
      icon: "target",
      description: "El progreso nace de la constancia. Formamos hábitos dentro y fuera de la cancha para superarnos día a día."
    },
    {
      id: "equipo",
      title: "EQUIPO",
      icon: "users",
      description: "Creemos que nadie crece solo. El compañerismo, la comunicación y el apoyo mutuo son la base de Flamengo."
    },
    {
      id: "integridad",
      title: "INTEGRIDAD",
      icon: "shield",
      description: "Queremos formar personas que representen nuestros valores con respeto, honestidad y juego limpio en todo momento."
    }
  ],

  groups: [
    {
      id: "masculino-menores",
      name: "MASCULINA MENORES",
      slug: "masculina-menores",
      tag: "Rama Masculina",
      description: "Entrenamiento formativo y competitivo enfocado en fundamentos técnicos, potencia, colocación, ataque, bloqueo y juego en equipo.",
      age: "Menores y Jóvenes",
      level: "Iniciación / Formativo / Competitivo",
      days: "Martes, Jueves y Sábados",
      hours: "Tarde / Noche (Sábados en la mañana)",
      location: "Parque Carvajal (Calle 34 Sur # 69C - 60, Bogotá)",
      price: "$75.000 (12 ses.) / $60.000 (8 ses.)",
      coach: "Didier / Eber",
      spots: "Cupos disponibles",
      featured: true
    },
    {
      id: "femenino-infantil",
      name: "FEMENINO INFANTIL",
      slug: "femenino-infantil",
      tag: "Rama Femenina",
      description: "Espacio especializado para niñas y jóvenes: desarrollo técnico de recepción, voleo, saque, coordinación motriz y trabajo en equipo.",
      age: "Infantil y Menores",
      level: "Iniciación y Formativo",
      days: "Martes, Jueves y Sábados",
      hours: "Tarde / Noche (Sábados en la mañana)",
      location: "Parque Carvajal (Calle 34 Sur # 69C - 60, Bogotá)",
      price: "$75.000 (12 ses.) / $60.000 (8 ses.)",
      coach: "Didier / Eber",
      spots: "Cupos disponibles",
      featured: true
    }
  ],

  plans: [
    {
      id: "plan-12",
      name: "Plan 12 Sesiones",
      frequency: "3 sesiones por semana",
      price: "$75.000 COP",
      period: "Mensual",
      badge: "Más Recomendado",
      features: [
        "12 entrenamientos dirigidos al mes",
        "Acompañamiento técnico de profesores",
        "Material deportivo y balones oficiales",
        "Preparación física y táctica",
        "Participación en fogueos"
      ]
    },
    {
      id: "plan-8",
      name: "Plan 8 Sesiones",
      frequency: "2 sesiones por semana",
      price: "$60.000 COP",
      period: "Mensual",
      badge: "Flexible",
      features: [
        "8 entrenamientos dirigidos al mes",
        "Acompañamiento técnico de profesores",
        "Material deportivo oficial",
        "Fundamentación técnica",
        "Horarios adaptables"
      ]
    },
    {
      id: "plan-inscripcion",
      name: "Inscripción Oficial",
      frequency: "Pago único de vinculación",
      price: "$90.000 COP",
      period: "Único pago",
      badge: "¡Incluye Uniforme!",
      features: [
        "Uniforme oficial de Flamengo Voleibol",
        "Ficha de registro deportivo",
        "Carné de jugador del club",
        "Habilitación para torneos y fogueos"
      ]
    }
  ],

  methodology: [
    {
      step: "01",
      title: "TÉCNICA",
      subtitle: "Fundamentos sólidos",
      description: "Saque, recepción baja, voleo (colocación), batida de ataque, bloqueo y defensa de campo.",
      items: ["Mecánica de golpeo y postura", "Control y dirección de balón", "Ataque y bloqueo", "Defensa baja y rodadas"]
    },
    {
      step: "02",
      title: "TÁCTICA",
      subtitle: "Comprensión del juego",
      description: "Rotaciones, sistemas de recepción (K1), contraataque (K2) y lectura de intenciones en la cancha.",
      items: ["Rotaciones y posiciones", "Fases K1 y K2 en cancha", "Coberturas de ataque", "Comunicación efectiva"]
    },
    {
      step: "03",
      title: "PREPARACIÓN FÍSICA",
      subtitle: "Capacidades atléticas",
      description: "Saltabilidad, agilidad lateral, velocidad de reacción, fuerza del tren inferior y prevención de lesiones.",
      items: ["Potencia de salto vertical", "Velocidad de reacción", "Coordinación psicomotriz", "Resistencia aeróbica"]
    },
    {
      step: "04",
      title: "COMPETENCIA",
      subtitle: "Fogueos y torneos",
      description: "Aplicación de lo aprendido en partidos de práctica, fogueos con otros clubes y competencias distritales en Bogotá.",
      items: ["Partidos de simulación", "Fogueos en Bogotá", "Torneos y festivales", "Análisis y retroalimentación"]
    }
  ],

  coaches: [
    {
      id: "didier",
      name: "Didier",
      role: "Entrenador Principal",
      specialty: "Táctica de Juego, Sistemas Competitivos y Técnica de Ataque / Bloqueo",
      bio: "Apasionado por la formación deportiva y la táctica moderna en voleibol. Enfocado en el desarrollo disciplinado de jugadores con valores.",
      formation: "Entrenador Deportivo con experiencia en dirección de equipos.",
      experience: "Formando jugadores en categorías menores y formativas en Bogotá.",
      photo: "coach-didier.jpg"
    },
    {
      id: "eber",
      name: "Eber",
      role: "Entrenador",
      specialty: "Fundamentación Técnica, Recepción, Defensa y Desarrollo Infantil",
      bio: "Dedicado a la enseñanza paso a paso de los fundamentos técnicos y el fortalecimiento de la confianza en cancha.",
      formation: "Formación en acondicionamiento físico y pedagogía del voleibol.",
      experience: "Experiencia en entrenamiento de categorías base e infantil.",
      photo: "coach-eber.jpg"
    }
  ],

  fixtures: {
    enabled: true,
    recentMatch: {
      status: "Finalizado",
      tournament: "Torneo Amistoso Bogotá Vóley",
      date: "Último fin de semana",
      teamHome: "Flamengo Voleibol",
      scoreHome: "2",
      teamAway: "Club Rival",
      scoreAway: "1",
      resultNote: "¡Gran entrega del equipo en Parque Carvajal!"
    },
    nextMatch: {
      status: "Próximo Encuentro",
      tournament: "Fogueo Distrital Bogotá",
      date: "Próximo Sábado — 3:00 PM",
      location: "Parque Carvajal (Calle 34 Sur # 69C - 60)",
      teamHome: "Flamengo Voleibol",
      teamAway: "Por definir",
      category: "Categorías Menores e Infantil"
    }
  },

  gallery: [
    {
      id: 1,
      category: "Entrenamientos",
      title: "Trabajo de recepción y voleo",
      desc: "Sesión técnica en Parque Carvajal.",
      img: "entrenamiento-recepcion.jpg"
    },
    {
      id: 2,
      category: "Partidos",
      title: "Fogueos y saques",
      desc: "Intensidad y sincronización en la cancha.",
      img: "partido-bloqueo.jpg"
    },
    {
      id: 3,
      category: "Comunidad",
      title: "Compañerismo y unión",
      desc: "El trabajo en equipo es el corazón de Flamengo.",
      img: "comunidad-equipo.jpg"
    },
    {
      id: 4,
      category: "Torneos",
      title: "Entrega y pasión deportiva",
      desc: "Viviendo la emoción de jugar voleibol en Bogotá.",
      img: "torneo-celebracion.jpg"
    }
  ],

  testimonials: [
    {
      id: 1,
      author: "Jugador Categoría Menores",
      role: "Rama Masculina",
      quote: "Los profes explican con paciencia y los entrenamientos en Parque Carvajal son muy dinámicos. He mejorado muchísimo mi saque y mi recepción.",
      verified: true
    },
    {
      id: 2,
      author: "Jugadora Categoría Infantil",
      role: "Rama Femenina",
      quote: "El ambiente en Flamengo es genial. Todas nos apoyamos y en cada entrenamiento aprendemos cosas nuevas.",
      verified: true
    },
    {
      id: 3,
      author: "Padre de Familia",
      role: "Familia Flamengo",
      quote: "Excelente formación y disciplina. La sede en Parque Carvajal es muy cómoda y los precios son súper accesibles.",
      verified: true
    }
  ],

  faq: [
    {
      q: "¿Necesito experiencia previa para entrar a Flamengo Voleibol?",
      a: "No, no necesitas experiencia previa. Enseñamos la técnica y fundamentos desde cero en nuestras categorías Masculina Menores y Femenino Infantil."
    },
    {
      q: "¿Dónde entrenan exactamente en Bogotá?",
      a: "Entrenamos en el Parque Carvajal, ubicado en la Calle 34 Sur # 69C - 60, Bogotá D.C. (Sector Carvajal / Kennedy)."
    },
    {
      q: "¿Puedo hacer una clase de cortesía / prueba?",
      a: "¡Sí, por supuesto! Puedes reservar tu clase de cortesía directamente haciendo clic en el botón de WhatsApp o completando el formulario en la web."
    },
    {
      q: "¿Cuánto cuestan los planes y la mensualidad?",
      a: "Tenemos dos planes mensuales muy accesibles: Plan 12 sesiones (3 por semana) por $75.000 COP y Plan 8 sesiones (2 por semana) por $60.000 COP."
    },
    {
      q: "¿Cuánto vale la inscripción y qué incluye?",
      a: "La inscripción tiene un costo de $90.000 COP e incluye el uniforme oficial del club y registro."
    },
    {
      q: "¿Qué categorías tienen disponibles?",
      a: "Actualmente contamos con dos categorías principales: Categoría Masculina Menores y Categoría Femenino Infantil."
    },
    {
      q: "¿Qué debo llevar a mi primera clase de cortesía?",
      a: "Ropa deportiva cómoda, tenis con buen agarre para cancha, hidratación personal (termo con agua) y muchas ganas de aprender y jugar."
    },
    {
      q: "¿Cómo me contacto directamente con el club?",
      a: "Puedes escribirnos directamente a nuestro WhatsApp oficial: +57 302 514 5457."
    }
  ]
};

if (typeof window !== "undefined") {
  window.DEFAULT_FLAMENGO_CONFIG = DEFAULT_FLAMENGO_CONFIG;
}
