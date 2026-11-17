// Correos que ven el Panel Admin.
// IMPORTANTE: si cambias esta lista, cambia también la de firestore.rules y storage.rules.
export const ADMIN_EMAILS = ['22221014@unamad.edu.pe'];

export const NOMBRE_TIENDA = 'Manos Creativas';

// Responsable de los datos personales (aparece en la Política de privacidad).
// ⚠️ Completa estos datos antes de publicar la tienda.
export const RESPONSABLE = {
  nombre: '[Tu nombre completo o razón social]',
  documento: '[DNI o RUC]',
  direccion: 'Puerto Maldonado, Madre de Dios, Perú',
  correo: '[tu-correo@ejemplo.com]',
};

// Cambia esta fecha cada vez que modifiques la Política de privacidad.
// Se guarda en cada pedido como constancia de qué versión aceptó el cliente.
export const VERSION_PRIVACIDAD = '2026-11-17';

export const WHATSAPP = '51900000000'; // Cambia por tu número (con 51 delante)

// Categorías de manualidades: id, nombre visible, icono (emoji) y color de fondo
export const CATEGORIAS = [
  { id: 'tejidos', nombre: 'Tejidos', icono: '🧶', color: 'bg-rose-100' },
  { id: 'bisuteria', nombre: 'Bisutería', icono: '📿', color: 'bg-violet-100' },
  { id: 'ceramica', nombre: 'Cerámica', icono: '🏺', color: 'bg-orange-100' },
  { id: 'velas', nombre: 'Velas y aromas', icono: '🕯️', color: 'bg-amber-100' },
  { id: 'madera', nombre: 'Madera', icono: '🪵', color: 'bg-yellow-100' },
  { id: 'decoracion', nombre: 'Decoración', icono: '🌿', color: 'bg-emerald-100' },
];

export const METODOS_PAGO = ['Yape', 'Plin', 'Transferencia', 'Efectivo contra entrega'];

// Ubicación por defecto del mapa: Puerto Maldonado
export const UBICACION_DEFECTO = { lat: -12.5933, lng: -69.1891 };
