export class MantVentaDTO {

    constructor({
    
        finca,
        estanque,
        colaborador,
        comprador,
        pesoPromedio,
        tamanoPromedio,
        cantVendida,
        precioKilo,
        fecha
    
    }) {

        this.grupoDatos = 1; // Temporal hasta implementar Grupo de Datos

        this.finca = finca;
        this.estanque = estanque;
        this.colaborador = colaborador;
        this.comprador = comprador;

        this.pesoPromedio = pesoPromedio;
        this.tamanoPromedio = tamanoPromedio;

        this.cantVendida = cantVendida;
        this.precioKilo = precioKilo;

        this.total = Number(cantVendida) * Number(precioKilo);

        this.fecha = fecha;
    }

}