// src/app/features/servicios/data/servicios.data.ts

export type FAQ = { question: string; answer: string };

export type ServiceLandingData = {
  slug: string;

  // SEO
  seoTitle: string;
  seoDescription: string;

  // UI
  breadcrumb: string;
  title: string;
  subtitle: string;
  description: string;

  // Sections
  symptomsTitle?: string;
  symptoms: string[];

  treatmentsTitle?: string;
  treatments: string[];

  warningText: string;
  faqs: FAQ[];

  // Para cards en /servicios
  cardTitle: string;
  cardDescription: string;
  cardIcon: 'activity' | 'brain';
};

export const SERVICIOS: ServiceLandingData[] = [
  {
    slug: 'hernia-de-disco',
    seoTitle: 'Tratamiento de Hernia de Disco | Dr. Julián Carrillo Neurocirujano',
    seoDescription:
      'Especialista en tratamiento de hernia de disco cervical y lumbar. Opciones quirúrgicas y no quirúrgicas. Agenda tu consulta en Ciudad Juárez.',
    breadcrumb: 'Hernia de Disco',
    title: 'Tratamiento de Hernia de Disco',
    subtitle: 'Opciones especializadas para aliviar el dolor y restaurar tu movilidad',
    description:
      'Una hernia de disco puede causar dolor severo, entumecimiento y limitar tus actividades diarias. Ofrezco evaluación completa y opciones de tratamiento tanto conservadoras como quirúrgicas, adaptadas a la severidad de tu caso y tus necesidades específicas.',
    symptomsTitle: 'Síntomas comunes',
    symptoms: [
      'Dolor intenso en espalda baja o cuello',
      'Dolor que se irradia hacia piernas (ciática) o brazos',
      'Hormigueo o entumecimiento en extremidades',
      'Debilidad muscular en piernas o brazos',
      'Dificultad para estar sentado o de pie por periodos prolongados',
    ],
    treatmentsTitle: 'Opciones de tratamiento',
    treatments: [
      'Evaluación con resonancia magnética',
      'Tratamiento conservador inicial (medicamentos, fisioterapia)',
      'Bloqueos epidurales para control del dolor',
      'Cirugía mínimamente invasiva (microdiscectomía)',
      'Discectomía endoscópica',
      'Fusión vertebral en casos específicos',
    ],
    warningText:
      'Si experimentas pérdida súbita de fuerza en piernas, entumecimiento en la zona genital o pérdida de control de esfínteres, acude a urgencias inmediatamente. Estos pueden ser signos de síndrome de cauda equina, una emergencia neuroquirúrgica.',
    faqs: [
      {
        question: '¿Qué es una hernia de disco?',
        answer:
          'Una hernia de disco ocurre cuando el material interno del disco intervertebral se desplaza y puede comprimir nervios cercanos, causando dolor, entumecimiento o debilidad.',
      },
      {
        question: '¿Cuáles son los síntomas de una hernia de disco?',
        answer:
          'Dolor en espalda o cuello, dolor irradiado a brazos o piernas, hormigueo, entumecimiento y, en casos severos, debilidad muscular.',
      },
      {
        question: '¿Siempre se necesita cirugía?',
        answer:
          'No. Muchas hernias responden a manejo conservador. La cirugía se considera cuando hay déficit neurológico, dolor incapacitante o falla del tratamiento conservador.',
      },
      {
        question: '¿Cuánto dura la recuperación después de cirugía?',
        answer:
          'Depende del procedimiento. Técnicas mínimamente invasivas suelen permitir retorno a actividades ligeras en 2–4 semanas; recuperación completa 6 semanas a 3 meses.',
      },
    ],
    cardTitle: 'Hernia de Disco',
    cardDescription: 'Evaluación y tratamiento especializado para hernias discales cervicales y lumbares.',
    cardIcon: 'activity',
  },

  {
    slug: 'ciatica',
    seoTitle: 'Tratamiento de Ciática | Dr. Julián Carrillo - Alivio del Dolor del Nervio Ciático',
    seoDescription:
      'Especialista en diagnóstico y tratamiento de ciática. Opciones para aliviar el dolor del nervio ciático. Consulta en Ciudad Juárez.',
    breadcrumb: 'Ciática',
    title: 'Tratamiento de Ciática',
    subtitle: 'Alivio efectivo del dolor del nervio ciático',
    description:
      'El dolor ciático puede ser debilitante y afectar significativamente tu calidad de vida. Realizo una evaluación completa para identificar la causa exacta de tu ciática y ofrezco un plan de tratamiento personalizado.',
    symptomsTitle: 'Síntomas comunes',
    symptoms: [
      'Dolor agudo que se irradia desde la espalda baja hacia la pierna',
      "Hormigueo o sensación de 'corriente' en la pierna",
      'Entumecimiento en pierna o pie',
      'Debilidad en la pierna afectada',
      'Dolor que empeora al sentarse o al toser',
      'Dificultad para mover el pie o los dedos',
    ],
    treatmentsTitle: 'Opciones de tratamiento',
    treatments: [
      'Evaluación clínica y resonancia magnética',
      'Tratamiento farmacológico para control del dolor',
      'Fisioterapia especializada',
      'Infiltraciones epidurales guiadas',
      'Bloqueos selectivos de raíces nerviosas',
      'Cirugía descompresiva si es necesaria',
    ],
    warningText:
      "Si presentas debilidad progresiva, 'pie caído' o pérdida de control de esfínteres, busca atención médica urgente.",
    faqs: [
      {
        question: '¿Qué es la ciática?',
        answer:
          'Dolor por irritación o compresión del nervio ciático. Suele irradiarse desde la espalda baja hacia la pierna.',
      },
      {
        question: '¿Qué causa la ciática?',
        answer:
          'Hernia de disco, estenosis de canal lumbar, espondilolistesis, síndrome piriforme u otras causas de compresión nerviosa.',
      },
      {
        question: '¿Se cura sola?',
        answer:
          'Muchos casos mejoran con manejo conservador, pero si persiste o hay debilidad, se recomienda evaluación especializada.',
      },
      {
        question: '¿Cuándo se necesita cirugía?',
        answer:
          'Cuando hay dolor incapacitante que no responde, déficit neurológico progresivo o síndrome de cauda equina.',
      },
    ],
    cardTitle: 'Ciática',
    cardDescription: 'Diagnóstico y manejo del dolor del nervio ciático con opciones conservadoras y quirúrgicas.',
    cardIcon: 'brain',
  },

  {
    slug: 'columna-cervical',
    seoTitle: 'Cirugía de Columna Cervical | Dr. Julián Carrillo - Dolor de Cuello y Hernias Cervicales',
    seoDescription:
      'Especialista en tratamiento de columna cervical, hernias cervicales y dolor de cuello. Cirugía mínimamente invasiva en Ciudad Juárez.',
    breadcrumb: 'Columna Cervical',
    title: 'Tratamiento de Columna Cervical',
    subtitle: 'Atención especializada para problemas de cuello y columna cervical',
    description:
      'Los problemas de columna cervical pueden causar dolor de cuello, dolor de brazos, debilidad y afectar tu calidad de vida. Ofrezco evaluación completa y tratamiento especializado.',
    symptomsTitle: 'Síntomas comunes',
    symptoms: [
      'Dolor persistente en cuello',
      'Dolor que se irradia hacia hombros y brazos',
      'Hormigueo o entumecimiento en manos',
      'Debilidad en brazos o manos',
      'Rigidez cervical',
      'Dolores de cabeza que inician en el cuello',
      'Mareos o vértigo',
    ],
    treatmentsTitle: 'Opciones de tratamiento',
    treatments: [
      'Evaluación clínica y resonancia/tomografía',
      'Tratamiento médico conservador',
      'Infiltraciones cervicales',
      'Discectomía cervical anterior',
      'Fusión cervical (ACDF)',
      'Cirugía mínimamente invasiva',
      'Artroplastia cervical (disco artificial)',
    ],
    warningText:
      'Si experimentas debilidad súbita, torpeza severa en manos o dificultad para caminar, busca atención médica urgente.',
    faqs: [
      {
        question: '¿Qué problemas afectan la columna cervical?',
        answer:
          'Hernias discales, estenosis, mielopatía, traumatismos y desgaste degenerativo (cervicoartrosis).',
      },
      {
        question: '¿Qué es la mielopatía cervical?',
        answer:
          'Compresión de la médula espinal en el cuello. Puede causar torpeza en manos, pérdida de equilibrio y dificultad para caminar. Requiere evaluación urgente.',
      },
      {
        question: '¿Cómo se diagnostica?',
        answer:
          'Evaluación clínica + exploración neurológica + estudios de imagen (RM/TC). A veces electromiografía.',
      },
      {
        question: '¿Qué tratamientos existen?',
        answer:
          'Desde tratamiento conservador hasta cirugía descompresiva o fusión según severidad.',
      },
    ],
    cardTitle: 'Columna Cervical',
    cardDescription: 'Tratamiento de condiciones cervicales, dolor de cuello y compresión de raíces nerviosas.',
    cardIcon: 'activity',
  },

  {
    slug: 'columna-lumbar',
    seoTitle: 'Cirugía de Columna Lumbar | Dr. Julián Carrillo - Dolor de Espalda Baja',
    seoDescription:
      'Especialista en tratamiento de columna lumbar, estenosis de canal y dolor de espalda baja. Cirugía especializada en Ciudad Juárez.',
    breadcrumb: 'Columna Lumbar',
    title: 'Tratamiento de Columna Lumbar',
    subtitle: 'Soluciones para dolor de espalda baja y condiciones lumbares',
    description:
      'El dolor lumbar crónico puede limitar tus actividades y afectar tu calidad de vida. Ofrezco evaluación integral y tratamiento especializado para condiciones lumbares.',
    symptomsTitle: 'Síntomas comunes',
    symptoms: [
      'Dolor constante o intermitente en espalda baja',
      'Dolor que empeora al estar de pie o caminar',
      'Rigidez lumbar matutina',
      'Dolor que se irradia hacia las piernas',
      'Limitación para caminar distancias largas',
      'Debilidad en piernas',
    ],
    treatmentsTitle: 'Opciones de tratamiento',
    treatments: [
      'Evaluación completa con resonancia magnética',
      'Manejo conservador inicial',
      'Infiltraciones epidurales',
      'Descompresión lumbar',
      'Laminectomía',
      'Fusión vertebral cuando es necesaria',
      'Técnicas mínimamente invasivas',
    ],
    warningText:
      'Si presentas pérdida de control de esfínteres, anestesia en silla de montar o debilidad bilateral, busca urgencias inmediata.',
    faqs: [
      {
        question: '¿Qué es la estenosis de canal lumbar?',
        answer:
          'Estrechamiento del canal espinal lumbar que puede comprimir nervios, causando dolor, entumecimiento y debilidad en piernas.',
      },
      {
        question: '¿Qué es la espondilolistesis?',
        answer:
          'Desplazamiento de una vértebra sobre otra. Puede causar dolor lumbar y ciática; en algunos casos requiere estabilización.',
      },
      {
        question: '¿Cuándo se necesita fusión vertebral?',
        answer:
          'Cuando hay inestabilidad, espondilolistesis significativa o cuando la descompresión sola no es suficiente.',
      },
      {
        question: '¿Qué es cirugía mínimamente invasiva?',
        answer:
          'Técnicas con incisiones pequeñas: menor trauma, menor dolor postoperatorio y recuperación más rápida.',
      },
    ],
    cardTitle: 'Columna Lumbar',
    cardDescription: 'Manejo de dolor lumbar, estenosis de canal y espondilolistesis.',
    cardIcon: 'brain',
  },

  // ✅ Segunda opinión YA NO ES PÁGINA SEPARADA: es otro slug
  {
    slug: 'segunda-opinion',
    seoTitle: 'Segunda Opinión en Neurocirugía | Dr. Julián Carrillo',
    seoDescription:
      'Obtén una segunda opinión profesional antes de una cirugía neurológica. Revisión de estudios y plan de tratamiento alternativo.',
    breadcrumb: 'Segunda Opinión',
    title: 'Segunda Opinión Neuroquirúrgica',
    subtitle: 'Evaluación independiente y profesional para decidir con claridad',
    description:
      'Recibe una evaluación independiente y profesional de tu caso antes de tomar decisiones importantes sobre tu salud neurológica.',
    symptomsTitle: '¿Cuándo buscar una segunda opinión?',
    symptoms: [
      'Te han recomendado cirugía y quieres confirmar si es necesaria',
      'Tienes dudas sobre el diagnóstico recibido',
      'Quieres conocer otras opciones de tratamiento',
      'El tratamiento actual no ha dado resultados',
      'Antes de procedimientos quirúrgicos complejos',
      'Para confirmar la urgencia de una intervención',
    ],
    treatmentsTitle: 'Qué incluye la consulta',
    treatments: [
      'Revisión completa de resonancias, tomografías y reportes médicos',
      'Evaluación clínica y neurológica detallada',
      'Opinión profesional independiente basada en evidencia',
      'Explicación clara de opciones (conservador vs quirúrgico)',
      'Plan de acción recomendado y siguientes pasos',
    ],
    warningText:
      'Si presentas pérdida súbita de fuerza, entumecimiento severo o pérdida de control de esfínteres, acude a urgencias de inmediato.',
    faqs: [
      {
        question: '¿Por qué es importante una segunda opinión?',
        answer:
          'Te da perspectiva adicional sobre diagnóstico y opciones, especialmente antes de procedimientos quirúrgicos o si tienes dudas del plan propuesto.',
      },
      {
        question: '¿Qué necesito traer?',
        answer:
          'Estudios de imagen (RM/TC), reportes médicos, lista de síntomas, medicamentos actuales y reportes de consultas previas.',
      },
      {
        question: '¿Significa que el primer diagnóstico estaba mal?',
        answer:
          'No necesariamente. Dos especialistas pueden tener enfoques distintos. Lo clave es que tú decidas con información completa.',
      },
      {
        question: '¿Cuánto dura la consulta?',
        answer:
          'Usualmente 45–60 minutos para revisar tu caso a fondo y responder preguntas.',
      },
    ],
    cardTitle: 'Segunda Opinión',
    cardDescription: 'Revisión profesional de diagnósticos y planes de tratamiento propuestos.',
    cardIcon: 'activity',
  },
];

export const SERVICIOS_BY_SLUG: Record<string, ServiceLandingData> = Object.fromEntries(
  SERVICIOS.map(s => [s.slug, s]),
) as Record<string, ServiceLandingData>;
