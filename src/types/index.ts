export interface Viaje {
  id: string;
  destino: string;
  fechaHora: string;
  costoBase: number;  
  capacidadMax: number;
  asientosDisponibles: number; 
  createdAt: string;
}

export interface CreateViajeDto {
    destino: string;
    fechaHora: string;
    costoBase: number;
    capacidadMax: number;
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
  rol: string;
  createdAt: string;
}