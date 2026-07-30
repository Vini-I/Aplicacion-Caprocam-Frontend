export class estanqueDTO {

    constructor({

        idFinca,
        codigo, 
        tipoEstanque,
        estado, 
        largo, 
        ancho, 
        profundidad, 
        fuenteAgua, 
        especie, 
        fechaSiembra, 
        fechaInicioEngorde, 
        fechaMantenimiento, 
        densidadSiembra, 
        precria, 
        metodoAlimentacion, 
        proveedorAlimento, 
        numeroAireadores, 
        tieneAlimentadorAutomatico

    }) {

        this.idFinca = idFinca;
        this.codigo = codigo;
        this.tipoEstanque = tipoEstanque;
        this.estado = estado;
        this.largo = largo;
        this.ancho = ancho;
        this.profundidad = profundidad;
        this.fuenteAgua = fuenteAgua;
        this.especie = especie;
        this.fechaSiembra = fechaSiembra;
        this.fechaInicioEngorde = fechaInicioEngorde;
        this.fechaMantenimiento = fechaMantenimiento;
        this.densidadSiembra = densidadSiembra;
        this.precria = precria;
        this.metodoAlimentacion = metodoAlimentacion;
        this.proveedorAlimento = proveedorAlimento;
        this.numeroAireadores = numeroAireadores;
        this.tieneAlimentadorAutomatico = tieneAlimentadorAutomatico;

    }

}