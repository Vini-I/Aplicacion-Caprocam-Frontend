import CardCrecimiento from "./CardCrecimiento.jsx";

export default function DetalleRegistroRenderer({
  tipoRegistro,
  registros,
}) {

  switch(tipoRegistro) {

    case "crecimiento":
      return (
        <CardCrecimiento
          data={registros}
        />
      );


    default:
      return null;
  }

}