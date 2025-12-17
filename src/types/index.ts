export interface Viaje {
  id: string;
  destino: string;
  fechaHora: string;
  costoBase: number;  
  asientosDisponibles: number;
  createdAt: string;   
}

export interface Pasaje {
  id: string;
  viajeId: string;
  usuarioCompradorId: string;
  nombrePasajero: string;
  costo: number;
  qrData: string;
  createdAt: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: number;
  createdAt: string;
}