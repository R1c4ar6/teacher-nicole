import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_pricing: 'Pricing',
    nav_about: 'About',
    nav_contact: 'Contact',
    nav_signIn: 'Sign In',
    nav_bookLesson: 'Book a Lesson',
    nav_dashboard: 'Dashboard',
    nav_admin: 'Admin Panel',
    nav_signOut: 'Sign Out',

    // Home Page
    hero_title: 'Learn English with a teacher who ',
    hero_title_accent: 'actually cares',
    hero_subtitle: 'Personalized online tutoring for students of all levels. Build confidence, improve your grades, or master business communication.',
    hero_bookTrial: 'Book a Free Trial',
    hero_viewPricing: 'View Pricing',
    accepting_students: 'Now accepting new students',

    stats_years: 'Years Experience',
    stats_students: 'Happy Students',
    stats_hours: 'Hours Taught',
    stats_rating: 'Average Rating',

    features_title: 'Why students love learning with Nicole',
    features_subtitle: 'A learning experience designed around you, your goals, and your pace.',
    features_personalized: 'Personalized Learning',
    features_personalized_desc: 'Every lesson is tailored to your unique needs, interests, and pace.',
    features_conversations: 'Real Conversations',
    features_conversations_desc: 'Practice speaking with real dialogues and natural conversation flows.',
    features_flexible: 'Flexible Scheduling',
    features_flexible_desc: 'Book lessons that fit your schedule. Reschedule anytime with 24h notice.',

    about_certified: 'Certified & Experienced',
    about_title: "Hi, I'm Nicole!",
    about_desc1: "With over 8 years of experience teaching English to students worldwide, I've helped hundreds of learners achieve their goals—whether it's improving school grades, acing exams, or communicating confidently at work.",
    about_desc2: "My teaching philosophy is simple: every student learns differently. That's why I tailor each lesson to your unique needs, interests, and pace. Learning should be enjoyable, not stressful.",
    about_qualifications: 'Qualifications',
    about_qualifications_array: [
      "TESOL (Teaching English to Speakers of Other Languages)",
      "Bachelor's in English Literature",
      "8+ years online teaching experience",
      "Specialized in Conversational & Business English",
    ],

    testimonials_title: 'What students say',
    testimonials_subtitle: 'Join hundreds of satisfied students on their learning journey',
    testimonials_viewAll: 'View all testimonials',

    cta_title: 'Ready to start your English journey?',
    cta_subtitle: "Book your first lesson today and discover how enjoyable learning English can be. No commitment required!",
    cta_button: 'Book Your Free Trial',

    contact_title: 'Have questions?',
    contact_subtitle: 'Feel free to reach out. I typically respond within 24 hours.',
    contact_whatsapp: 'Chat on WhatsApp',
    contact_email: 'Send an Email',

    // Pricing Page
    pricing_title: 'Simple, transparent pricing',
    pricing_subtitle: 'Choose the package that fits your learning goals. All packages include personalized attention and flexible scheduling.',
    pricing_mostPopular: 'Most Popular',
    pricing_getStarted: 'Get Started',
    pricing_custom: 'Need a custom package? ',
    pricing_contact: 'Contact me',
    pricing_currency: 'EUR',

    // Packages
    package_trial_name: 'Trial Lesson',
    package_trial_desc: 'Perfect for getting started',
    package_trial_price: '10',
    package_trial_duration: '45',
    package_trial_features: [
      '45-minute session',
      'Level assessment',
      'Personalized learning plan',
      'No commitment required',
    ],
    package_weekly_name: 'Weekly Sessions',
    package_weekly_desc: 'Consistent progress every week',
    package_weekly_price: '20',
    package_weekly_duration: '60',
    package_weekly_features: [
      '4 sessions per month',
      '60-minute lessons',
      'Homework & feedback',
      'Progress tracking',
      'Email support',
    ],
    package_intensive_name: 'Intensive Package',
    package_intensive_desc: 'Maximum growth in shortest time',
    package_intensive_price: '30',
    package_intensive_duration: '60',
    package_intensive_features: [
      '8 sessions per month',
      'Priority scheduling',
      'Custom study materials',
      'WhatsApp support',
      'Monthly progress report',
    ],

    // FAQ
    faq_title: 'Frequently Asked Questions',
    faq_subtitle: "Can't find the answer you're looking for? ",
    faq_contact: 'Contact me',
    faq_still: 'Still have questions?',

    faq_payment_q: 'What payment methods do you accept?',
    faq_payment_a: 'I accept PayPal and bank transfers. For bank transfers, please contact me to receive my banking details. Payment must be completed before the lesson.',

    faq_reschedule_q: 'Can I reschedule a lesson?',
    faq_reschedule_a: "Yes! Lessons can be rescheduled with at least 24 hours notice. Just send me a message and we'll find a time that works for both of us.",

    faq_cancel_q: 'What if I need to cancel?',
    faq_cancel_a: "Cancellations made at least 48 hours before the lesson will receive a full refund. Cancellations within 48 hours may be subject to a cancellation fee.",

    faq_online_q: 'How do online lessons work?',
    faq_online_a: "Lessons are conducted via Google Meet. You'll receive a link before each session. All you need is a computer/tablet with a stable internet connection and a microphone.",

    faq_switch_q: 'Can I switch between packages?',
    faq_switch_a: "Absolutely! You can upgrade, downgrade, or pause your package at any time. Just let me know before your next billing cycle.",

    // Footer
    footer_tagline: 'Making English learning accessible, enjoyable, and effective for students of all ages and levels.',
    footer_quickLinks: 'Quick Links',
    footer_contact: 'Contact',
    footer_email: 'hello@teachernicole.com',
    footer_phone: '+34 614 23 21 70',
    footer_location: 'Online Classes Worldwide',
    footer_copyright: 'All rights reserved.',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',

    // Auth Pages
    login_title: 'Welcome back',
    login_subtitle: 'Sign in to continue your learning journey',
    login_continueGoogle: 'Continue with Google',
    login_or: 'or',
    login_remember: 'Remember me',
    login_forgot: 'Forgot password?',
    login_signIn: 'Sign In',
    login_noAccount: "Don't have an account? ",
    login_signup: 'Sign up for free',

    register_title: 'Create your account',
    register_subtitle: 'Start your English learning journey today',
    register_signupGoogle: 'Sign up with Google',
    register_fullName: 'Full Name',
    register_email: 'Email',
    register_password: 'Password',
    register_passwordHint: 'Must be at least 8 characters',
    register_create: 'Create Account',
    register_haveAccount: 'Already have an account? ',
    register_signin: 'Sign in',

    // Dashboard
    dashboard_welcome: 'Welcome back, ',
    dashboard_subtitle: 'Manage your lessons and track your progress',
    dashboard_bookNew: 'Book New Lesson',
    dashboard_upcoming: 'Upcoming Lessons',
    dashboard_noUpcoming: 'No upcoming lessons',
    dashboard_noUpcomingDesc: 'Book your next lesson to continue learning!',
    dashboard_bookLesson: 'Book a Lesson',
    dashboard_past: 'Past Lessons',
    dashboard_noPast: 'No past lessons yet',
    dashboard_bookAgain: 'Book Again',
    dashboard_total: 'Total Lessons',
    dashboard_completed: 'Completed',
    dashboard_join: 'Join',
    dashboard_reschedule: 'Reschedule',
    dashboard_cancel: 'Cancel',

    // Booking
    booking_title: 'Book a Lesson',
    booking_step1: 'Select your preferred package',
    booking_step2: 'Choose an available time slot',
    booking_step3: 'Confirm your booking',
    booking_selectDate: 'Select a date to see available times',
    booking_continue: 'Continue',
    booking_back: 'Back',
    booking_package: 'Package',
    booking_dateTime: 'Date & Time',
    booking_yourSelection: 'Your Selection',
    booking_summary: 'Booking Summary',
    booking_duration: 'Duration',
    booking_date: 'Date',
    booking_time: 'Time',
    booking_total: 'Total',
    booking_confirm: 'Confirm Your Booking',
    booking_payment: 'Select payment method:',
    booking_paypal: 'PayPal',
    booking_bank: 'Bank Transfer',
    booking_manual: 'Manual',
    booking_confirmPay: 'Confirm & Pay',
    booking_error_alert: 'Failed to create booking, possible double booking',

    // Status
    status_pending: 'Pending',
    status_confirmed: 'Confirmed',
    status_completed: 'Completed',
    status_cancelled: 'Cancelled',
    payment_pending: 'Payment Pending',
  },
  es: {
    // Navigation
    nav_home: 'Inicio',
    nav_pricing: 'Precios',
    nav_about: 'Sobre Mí',
    nav_contact: 'Contacto',
    nav_signIn: 'Iniciar Sesión',
    nav_bookLesson: 'Reservar Clase',
    nav_dashboard: 'Panel',
    nav_admin: 'Admin',
    nav_signOut: 'Cerrar Sesión',

    // Home Page
    hero_title: 'Aprende inglés con una maestra que ',
    hero_title_accent: 'realmente se preocupa',
    hero_subtitle: 'Tutoría en línea personalizada para estudiantes de todos los niveles. Construye confianza, mejora tus calificaciones o domina la comunicación empresarial.',
    hero_bookTrial: 'Reserva una Clase de Prueba',
    hero_viewPricing: 'Ver Precios',
    accepting_students: 'Aceptando nuevos estudiantes',

    stats_years: 'Años de Experiencia',
    stats_students: 'Estudiantes Felices',
    stats_hours: 'Horas Enseñadas',
    stats_rating: 'Calificación Promedio',

    features_title: 'Por qué los estudiantes aman aprender con Nicole',
    features_subtitle: 'Una experiencia de aprendizaje diseñada alrededor de ti, tus metas y tu ritmo.',
    features_personalized: 'Aprendizaje Personalizado',
    features_personalized_desc: 'Cada lección se adapta a tus necesidades únicas, intereses y ritmo.',
    features_conversations: 'Conversaciones Reales',
    features_conversations_desc: 'Practica hablar con diálogos reales y flujos de conversación naturales.',
    features_flexible: 'Horarios Flexibles',
    features_flexible_desc: 'Reserva lecciones que se ajusten a tu horario. Reprograme cuando quieras con 24h de anticipación.',

    about_certified: 'Certificada & Experimentada',
    about_title: '¡Hola, soy Nicole!',
    about_desc1: 'Con más de 8 años de experiencia enseñando inglés a estudiantes de todo el mundo, he ayudado a cientos de aprendices a alcanzar sus metas—ya sea mejorar calificaciones escolares, aprobar exámenes o comunicarse con confianza en el trabajo.',
    about_desc2: 'Mi filosofía de enseñanza es simple: cada estudiante aprende de manera diferente. Por eso adapto cada lección a tus necesidades únicas, intereses y ritmo. Aprender debe ser divertido, no estresante.',
    about_qualifications: 'Cualificaciones',
    about_qualifications_array: [
      "TESOL (Enseñanza de inglés a hablantes de otros idiomas)",
      "Licenciatura en Literatura Inglesa",
      "Más de 8 años de experiencia docente en línea",
      "Especializado en inglés conversacional y de negocios",
    ],

    testimonials_title: 'Lo que dicen los estudiantes',
    testimonials_subtitle: 'Únete a cientos de estudiantes satisfechos en su camino de aprendizaje',
    testimonials_viewAll: 'Ver todos los testimonios',

    cta_title: '¿Listo para comenzar tu viaje del inglés?',
    cta_subtitle: 'Reserva tu primera lección hoy y descubre lo divertido que puede ser aprender inglés. ¡Sin compromiso!',
    cta_button: 'Reserva Tu Clase de Prueba',

    contact_title: '¿Tienes preguntas?',
    contact_subtitle: 'No dudes en contactarme. Generalmente respondo en 24 horas.',
    contact_whatsapp: 'Chatear por WhatsApp',
    contact_email: 'Enviar un Email',

    // Pricing Page
    pricing_title: 'Precios simples y transparentes',
    pricing_subtitle: 'Elige el paquete que se ajuste a tus metas de aprendizaje. Todos los paquetes incluyen atención personalizada y horarios flexibles.',
    pricing_mostPopular: 'Más Popular',
    pricing_getStarted: 'Comenzar',
    pricing_custom: '¿Necesitas un paquete personalizado? ',
    pricing_contact: 'Contáctame',
    pricing_currency: 'EUR',

    // Packages
    package_trial_name: 'Clase de Prueba',
    package_trial_desc: 'Perfecto para comenzar',
    package_trial_price: '10',
    package_trial_duration: '45',
    package_trial_features: [
      'Sesión de 45 minutos',
      'Evaluación de nivel',
      'Plan de aprendizaje personalizado',
      'Sin compromiso necesario',
    ],
    package_weekly_name: 'Sesiones Semanales',
    package_weekly_desc: 'Progreso constante cada semana',
    package_weekly_price: '20',
    package_weekly_duration: '60',
    package_weekly_features: [
      '4 sesiones al mes',
      'Sesiones de 60 minutos',
      'Trabajos a domicilio y retroalimentación',
      'Registro de progreso',
      'Soporte por correo electrónico',
    ],
    package_intensive_name: 'Paquete Intensivo',
    package_intensive_desc: 'Máximo crecimiento en el menor tiempo',
    package_intensive_price: '30',
    package_intensive_duration: '60',
    package_intensive_features: [
      '8 sesiones al mes',
      'Programación prioritaria',
      'Materiales de estudio personalizados',
      'Soporte en WhatsApp',
      'Informe de progreso mensual',
    ],

    // FAQ
    faq_title: 'Preguntas Frecuentes',
    faq_subtitle: '¿No encuentras la respuesta que buscas? ',
    faq_contact: 'Contáctame',
    faq_still: '¿Aún tienes preguntas?',

    faq_payment_q: '¿Qué métodos de pago aceptas?',
    faq_payment_a: 'Acepto PayPal y transferencias bancarias. Para transferencias bancarias, por favor contáctame para recibir mis datos bancarios. El pago debe completarse antes de la lección.',

    faq_reschedule_q: '¿Puedo reprogramar una lección?',
    faq_reschedule_a: '¡Sí! Las lecciones se pueden reprogramar con al menos 24 horas de anticipación. Solo envíame un mensaje y encontraremos un horario que funcione para ambos.',

    faq_cancel_q: '¿Y si necesito cancelar?',
    faq_cancel_a: 'Las cancelaciones realizadas al menos 48 horas antes de la lección recibirán un reembolso completo. Las cancelaciones dentro de las 48 horas pueden estar sujetas a una tarifa de cancelación.',

    faq_online_q: '¿Cómo funcionan las lecciones en línea?',
    faq_online_a: 'Las lecciones se realizan a través de Google Meet. Recibirás un enlace antes de cada sesión. Todo lo que necesitas es una computadora/tableta con conexión a internet estable y un micrófono.',

    faq_switch_q: '¿Puedo cambiar entre paquetes?',
    faq_switch_a: '¡Por supuesto! Puedes mejorar, reducir o pausar tu paquete en cualquier momento. Solo avísame antes de tu próximo ciclo de facturación.',

    // Footer
    footer_tagline: 'Haciendo el aprendizaje del inglés accesible, agradable y efectivo para estudiantes de todas las edades y niveles.',
    footer_quickLinks: 'Enlaces Rápidos',
    footer_contact: 'Contacto',
    footer_email: 'hello@teachernicole.com',
    footer_phone: '+34 614 23 21 70',
    footer_location: 'Clases en Línea en Todo el Mundo',
    footer_copyright: 'Todos los derechos reservados.',
    footer_privacy: 'Política de Privacidad',
    footer_terms: 'Términos de Servicio',

    // Auth Pages
    login_title: 'Bienvenido de nuevo',
    login_subtitle: 'Inicia sesión para continuar tu viaje de aprendizaje',
    login_continueGoogle: 'Continuar con Google',
    login_or: 'o',
    login_remember: 'Recordarme',
    login_forgot: '¿Olvidaste tu contraseña?',
    login_signIn: 'Iniciar Sesión',
    login_noAccount: '¿No tienes una cuenta? ',
    login_signup: 'Regístrate gratis',

    register_title: 'Crea tu cuenta',
    register_subtitle: 'Comienza tu viaje de aprendizaje del inglés hoy',
    register_signupGoogle: 'Regístrate con Google',
    register_fullName: 'Nombre Completo',
    register_email: 'Correo Electrónico',
    register_password: 'Contraseña',
    register_passwordHint: 'Debe tener al menos 8 caracteres',
    register_create: 'Crear Cuenta',
    register_haveAccount: '¿Ya tienes una cuenta? ',
    register_signin: 'Inicia sesión',

    // Dashboard
    dashboard_welcome: 'Bienvenido de nuevo, ',
    dashboard_subtitle: 'Administra tus lecciones y sigue tu progreso',
    dashboard_bookNew: 'Reservar Nueva Clase',
    dashboard_upcoming: 'Próximas Lecciones',
    dashboard_noUpcoming: 'Sin lecciones próximas',
    dashboard_noUpcomingDesc: '¡Reserva tu siguiente lección para continuar aprendiendo!',
    dashboard_bookLesson: 'Reservar una Clase',
    dashboard_past: 'Lecciones Pasadas',
    dashboard_noPast: 'Aún no hay lecciones pasadas',
    dashboard_bookAgain: 'Reservar de Nuevo',
    dashboard_total: 'Total de Lecciones',
    dashboard_completed: 'Completadas',
    dashboard_join: 'Unirse',
    dashboard_reschedule: 'Reprogramar',
    dashboard_cancel: 'Cancelar',

    // Booking
    booking_title: 'Reservar una Clase',
    booking_step1: 'Selecciona tu paquete preferido',
    booking_step2: 'Elige un horario disponible',
    booking_step3: 'Confirma tu reserva',
    booking_selectDate: 'Selecciona una fecha para ver horarios disponibles',
    booking_continue: 'Continuar',
    booking_back: 'Volver',
    booking_package: 'Paquete',
    booking_dateTime: 'Fecha y Hora',
    booking_yourSelection: 'Tu Selección',
    booking_summary: 'Resumen de Reserva',
    booking_duration: 'Duración',
    booking_date: 'Fecha',
    booking_time: 'Hora',
    booking_total: 'Total',
    booking_confirm: 'Confirma Tu Reserva',
    booking_payment: 'Selecciona método de pago:',
    booking_paypal: 'PayPal',
    booking_bank: 'Transferencia Bancaria',
    booking_manual: 'Manual',
    booking_confirmPay: 'Confirmar y Pagar',
    booking_error_alert: 'Fallo en creación de reserva, fechas duplicadas',

    // Status
    status_pending: 'Pendiente',
    status_confirmed: 'Confirmado',
    status_completed: 'Completado',
    status_cancelled: 'Cancelado',
    payment_pending: 'Pago Pendiente',
  }
};

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
