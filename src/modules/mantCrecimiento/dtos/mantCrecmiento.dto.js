export class mantCrecmientoDTO {

    constructor({
        finca,
        estanque, 
        pesoActual,
        colaborador,
        fechaRegistro,
    }) {
        this.finca = finca;
        this.estanque = estanque; 
        this.colaborador = colaborador ?? null;
        this.fechaRegistro = fechaRegistro; //Debe venir quemada tambien. 
        this.pesoActual= pesoActual; 
    } 
}