export class mantCrecmientoDTO {

    constructor({
        finca,
        estanque, 
        pesoActual,
        colaborador,
        fechaRegistro,
    }) {
        this.grupoDatos = 1; // Temporal hasta implementar Grupo de Datos
        
        this.finca = finca;
        this.estanque = estanque; 
        this.colaborador = 1; // Temporal hasta implementar Colaborador quemado.
        this.fechaRegistro = fechaRegistro; //Debe venir quemada tambien. 
        this.pesoActual= pesoActual; 
    } 
}