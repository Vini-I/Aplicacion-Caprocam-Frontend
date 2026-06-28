import RegistroScreen from '../../../../modules/registro/screens/RegistroScreen';
import {useRouter} from 'expo-router';

export default function RegistrosIndex() {
  const router = useRouter();

  const irAFisicoQuimica =  () => { router.push('/(drawer)/(tabs)/registros/FisicoQuimica'); };
  const irAAlimentacion =  () => { router.push('/(drawer)/(tabs)/registros/Alimentacion'); };
  const irAMortalidad =  () => { router.push('/(drawer)/(tabs)/registros/Mortalidad'); };
  const irACrecimiento = () => { router.push('/(drawer)/(tabs)/registros/Crecimiento'); };
  return <RegistroScreen 
    onFisicoQuimica={irAFisicoQuimica}
    onAlimentacion={irAAlimentacion}
    onMortalidad={irAMortalidad}
    onCrecimiento={irACrecimiento}
  />;
  
}
