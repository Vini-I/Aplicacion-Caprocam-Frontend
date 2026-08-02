export class fincaDTO {

    constructor({
        
        codigoCBO,
        nombreFinca,
        provincia,
        canton,
        distrito,
        otrasSenas,
        propietarioResponsable,
        telefono,
        areaTotal,
        espejosAgua,

    }) {

        this.codigoCBO = codigoCBO;

        this.nombreFinca = nombreFinca;

        this.provincia = provincia;

        this.canton = canton;

        this.distrito = distrito;

        this.otrasSenas = otrasSenas;

        this.propietarioResponsable = propietarioResponsable;
        
        this.telefono = telefono;

        this.areaTotal = areaTotal;

        this.espejosAgua = espejosAgua;

    }
}