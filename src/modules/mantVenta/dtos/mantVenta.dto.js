export class MantVentaDTO {

    constructor({
    
        finca,
        estanque,
        colaborador = null,
        comprador,
        pesoPromedio,
        tamanoPromedio = null,
        cantVendida,
        precioKilo,
        fecha
    
    }) {
        this.finca = finca;
        this.estanque = estanque;
        this.colaborador = null;
        this.comprador = comprador;

        this.pesoPromedio = pesoPromedio;
        this.tamanoPromedio = null

        this.cantVendida = cantVendida;
        this.precioKilo = precioKilo;

        this.total = Number(cantVendida) * Number(precioKilo);

        this.fecha = fecha;
    }

}