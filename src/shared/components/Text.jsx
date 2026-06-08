import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({
    children,
    tamano = 'md',
    color = '#000000',
    fuente,
    alineacion = 'left',
    estilo,
    ...props
}) => {

    const fontSizes = {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24
    };

    return (
        <Text
            style={[
                styles.base,
                {
                    fontSize: fontSizes[tamano] || fontSizes.md,
                    color,
                    fontFamily: fuente,
                    textAlign: alineacion,
                },
                estilo,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
});

export default CustomText;