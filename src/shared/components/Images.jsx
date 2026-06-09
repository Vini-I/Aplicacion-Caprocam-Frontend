import { Image } from "react-native";

export default function Images({ 
  Icon, 
  Width = 50, 
  Height = 50,
  borderRadius = 0,
  borderWidth = 0,
  borderColor = '#000',
  marginTop= 0,
  left= 0,
 }) {
  return (
    <Image
      source={Icon}
      style={{
        width: Width,
        height: Height,
        borderRadius,
        borderWidth,
        borderColor,
        marginTop,
        left,
      }}
    />
  );
}
