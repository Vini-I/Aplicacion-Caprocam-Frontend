export class mantCrecmientoDTO {
  constructor({
    finca,
    estanque,
    pesoActual,
    colaborador,
    fechaRegistro,
    muestreos,
  }) {
    this.finca = finca;
    this.estanque = estanque;
    this.colaborador = colaborador ?? null;
    this.fechaRegistro = fechaRegistro;
    this.pesoActual = pesoActual;
    this.muestreos = Array.isArray(muestreos) ? muestreos : [];
  }
}