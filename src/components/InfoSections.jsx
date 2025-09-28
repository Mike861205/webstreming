import React from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Tv, 
  Laptop, 
  Tablet, 
  Download, 
  Shield, 
  Clock, 
  Users,
  Check,
  Star
} from 'lucide-react';

const features = [
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Ve en cualquier dispositivo",
    description: "Transmite en tu teléfono, tablet, laptop y TV sin límites adicionales."
  },
  {
    icon: <Download className="w-8 h-8" />,
    title: "Descarga para ver offline",
    description: "Descarga tus títulos favoritos y míralos sin conexión cuando quieras."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Seguro para niños",
    description: "Crea perfiles para niños con contenido especialmente seleccionado."
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Disponible 24/7",
    description: "Tu entretenimiento favorito disponible en cualquier momento del día."
  }
];

const devices = [
  { icon: <Tv className="w-12 h-12" />, name: "Smart TV" },
  { icon: <Laptop className="w-12 h-12" />, name: "Laptop" },
  { icon: <Tablet className="w-12 h-12" />, name: "Tablet" },
  { icon: <Smartphone className="w-12 h-12" />, name: "Móvil" }
];

const plans = [
  {
    name: "Básico",
    price: "$8.99",
    features: [
      "Acceso ilimitado al catálogo",
      "Ver en 1 dispositivo a la vez",
      "Resolución HD",
      "Descarga en 1 dispositivo"
    ],
    popular: false
  },
  {
    name: "Estándar",
    price: "$13.99",
    features: [
      "Acceso ilimitado al catálogo",
      "Ver en 2 dispositivos a la vez",
      "Resolución Full HD",
      "Descarga en 2 dispositivos",
      "Contenido sin anuncios"
    ],
    popular: true
  },
  {
    name: "Premium",
    price: "$17.99",
    features: [
      "Acceso ilimitado al catálogo",
      "Ver en 4 dispositivos a la vez",
      "Resolución 4K + HDR",
      "Descarga en 4 dispositivos",
      "Audio espacial",
      "Acceso anticipado a contenido exclusivo"
    ],
    popular: false
  }
];

export default function InfoSections() {
  return (
    <div className="space-y-32">
      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Por qué elegir <span className="gradient-text">StreamFlix</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Disfruta de la mejor experiencia de streaming con características diseñadas para ti
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="text-center group"
              >
                <div className="text-netflix-red mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Devices Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-netflix-dark via-netflix-black to-netflix-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ve donde quieras, cuando quieras
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Accede a tu contenido favorito desde cualquier dispositivo
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {devices.map((device, index) => (
              <motion.div
                key={device.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="text-center glass rounded-xl p-8 group cursor-pointer"
              >
                <div className="text-netflix-red mb-4 flex justify-center group-hover:text-white transition-colors duration-300">
                  {device.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {device.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Elige tu plan perfecto
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sin compromisos. Cancela cuando quieras.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-netflix-red/20 to-transparent border-2 border-netflix-red'
                    : 'glass'
                } group cursor-pointer`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-netflix-red text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Más Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold gradient-text">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 ml-2">/mes</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-netflix-red mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-netflix-red hover:bg-red-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  Comenzar Plan {plan.name}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-netflix-red/10 via-transparent to-netflix-red/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Únete a millones de usuarios que ya disfrutan del mejor entretenimiento
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-netflix-red hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Prueba Gratis por 30 Días
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg backdrop-blur-md border border-white/20 transition-all duration-300"
              >
                Ver Planes
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}