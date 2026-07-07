import { Dimensions, ScrollView, View } from "react-native";

import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import DateInput from "../../../shared/components/DateInput.jsx";
import Input from "../../../shared/components/Input.jsx";
import Select from "../../../shared/components/Select.jsx";
import Text from "../../../shared/components/Text.jsx";
import Title from "../../../shared/components/Title.jsx";

import { COLORS } from "../../../theme/colors.js";
import { TYPOGRAPHY } from "../../../theme/typography.js";

import { useRegistrarEquipo } from "../hooks/useRegistrarEquipo.js";
import { styles } from "../styles/RegistrarEquipoStyles.js";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700;

export default function RegistrarEquipoScreen() {
	// La pantalla queda agrupada en un solo card para mantener el formulario compacto.
	const {
		formulario,
		errores,
		guardando,
		tiposEquipo,
		estadosEquipo,
		actualizarCampo,
		guardarEquipo,
	} = useRegistrarEquipo();

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={[
				styles.content,
				{ paddingHorizontal: isLargeScreen ? 40 : 16 },
			]}
			keyboardShouldPersistTaps="handled"
		>
			<View style={styles.contentWrapper}>
				<Card style={styles.card}>

					<View style={styles.sectionSpacer} />


					<View style={styles.row}>
						<View style={styles.column}>
							<Input
								label="Identificador"
								value={formulario.codigoInterno}
								onChangeText={(valor) => actualizarCampo("codigoInterno", valor)}
								placeholder="Ej: EQ-001"
								style={errores.codigoInterno ? styles.invalidField : undefined}
								labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
							/>
						</View>

						<View style={styles.column}>
							<Input
								label="Descripción"
								value={formulario.descripcion}
								onChangeText={(valor) => actualizarCampo("descripcion", valor)}
								placeholder="Ej: Aireador principal del estanque 3"
								style={errores.descripcion ? styles.invalidField : undefined}
								labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
							/>
						</View>
					</View>

					<View style={styles.sectionSpacer} />


					<View style={styles.row}>
						<View style={styles.column}>
							<DateInput
								label="Fecha de instalación"
								value={formulario.fechaInstalacion}
								onChangeText={(valor) =>
									actualizarCampo("fechaInstalacion", valor)
								}
								placeholder="Seleccione la fecha de instalación"
								inputStyle={errores.fechaInstalacion ? styles.invalidField : undefined}
								labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
							/>
						</View>

						<View style={styles.column}>
							<Select
								label="Tipo"
								value={formulario.tipo}
								onChange={(valor) => actualizarCampo("tipo", valor)}
								options={tiposEquipo}
								placeholder="Seleccione el tipo de equipo"
								selectStyle={errores.tipo ? styles.invalidField : undefined}
								labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
							/>
						</View>
					</View>

					<View style={styles.sectionSpacer} />

					<View style={styles.fullWidth}>
						<Select
							label="Estado"
							value={formulario.estado}
							onChange={(valor) => actualizarCampo("estado", valor)}
							options={estadosEquipo}
							placeholder="Seleccione el estado actual"
							selectStyle={errores.estado ? styles.invalidField : undefined}
							labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
						/>
					</View>

					<View style={styles.sectionSpacer} />

					{/* TODO backend: este bloque ya normaliza el payload para conectarlo
					   con el POST real cuando el endpoint exista. */}

					<Input
						label="Función del equipo"
						value={formulario.funcionEquipo}
						onChangeText={(valor) => actualizarCampo("funcionEquipo", valor)}
						placeholder="Ej: Mantener la oxigenación constante en el estanque"
						multiline
						containerStyle={styles.fullWidth}
						style={[
							styles.textArea,
							errores.funcionEquipo ? styles.invalidField : undefined,
						]}
						labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
					/>
				</Card>

				{Object.keys(errores).length > 0 && (
					<View style={styles.errorBox}>
						<Text size={14} color={COLORS.error} style={styles.errorText}>
							Revisa los campos obligatorios marcados con * antes de guardar.
						</Text>
					</View>
				)}

				<Button
					onPress={guardarEquipo}
					disabled={guardando}
					style={styles.saveButton}
				>
					<View style={styles.buttonContent}>
						<Text size={16} color={COLORS.white} style={styles.buttonText}>
							{guardando ? "Guardando..." : "Registrar Equipo"}
						</Text>
					</View>
				</Button>
			</View>
		</ScrollView>
	);
}