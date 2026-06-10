/**
 * ============================================================
 * PANTALLA: LOGIN (Selección de Turno y Trabajador)
 * ============================================================
 *
 * Esta es la pantalla principal del módulo de login.
 *
 * RESPONSABILIDADES:
 * 1. Mostrar opciones de turnos (Mañana, Tarde, Noche)
 * 2. Permitir seleccionar un turno
 * 3. Mostrar lista de trabajadores disponibles
 * 4. Permitir seleccionar un trabajador
 * 5. Botón "Comenzar turno" para confirmar
 *
 * FLUJO:
 * 1. Al montar: useWorkers obtiene la lista de trabajadores
 * 2. Usuario selecciona un turno (shift state)
 * 3. Usuario selecciona un trabajador (selectedWorker state)
 * 4. Usuario presiona botón - (por ahora solo console.log, después irá a home)
 *
 * ============================================================
 */

import { StyleSheet, View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { format, addDays } from 'date-fns';


// Importar componentes compartidos
import Button from '../../../shared/components/Button';
import Card from '../../../shared/components/Card';
import Title from '../../../shared/components/Title';
import CustomText from '../../../shared/components/Text';
import Avatar from '../../../shared/components/Avatar';
import Images from '../../../shared/components/Images';


// Importar hook personalizado
import { useWorkers } from '../hooks/useWorkers';

/**
 * TURNOS DISPONIBLES
 *
 * Array que define los 3 turnos disponibles.
 * Estructura:
 * - id: identificador único
 * - label: texto visible (Mañana, Tarde, Noche)
 * - timeRange: horario visible
 * - backgroundColor: color del fondo cuando se selecciona
 */
const SHIFTS = [
    {
        id: 'morning',
        label: 'Mañana',
        icon: require('../../../assets/morning.png'),
        timeRange: '6:00 AM - 2:00 PM',
        backgroundColor: '#FFD700',
    },
    {
        id: 'afternoon',
        label: 'Tarde',
        icon: require('../../../assets/afternoon.png'),
        timeRange: '2:00 PM - 10:00 PM',
        backgroundColor: '#FF8C00',
    },
    {
        id: 'night',
        label: 'Noche',
        icon: require('../../../assets/night.png'),
        timeRange: '10:00 PM - 6:00 AM',
        backgroundColor: '#9B7DD9',
    },
];

const today = new Date();

const rawDate = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
}).format(today);

const formattedDate = rawDate.replace(/(^\w|\s\w)/g, (match) => {
    return match.trim() === 'd' ? match : match.toUpperCase();
});


/**
 * COMPONENTE PRINCIPAL
 *
 * LoginScreen - Pantalla de login con selección de turno y trabajador
 */
export default function LoginScreen() {
    // ============ ESTADO ============

    // Obtener trabajadores usando el hook (con loading/error)
    const { workers, loading, error } = useWorkers();

    // Turno seleccionado (null = ninguno seleccionado)
    const [selectedShift, setSelectedShift] = useState(null);

    // Trabajador seleccionado (null = ninguno)
    const [selectedWorker, setSelectedWorker] = useState(null);

    // ============ FUNCIONES ============

    /**
     * handleStartShift()
     *
     * Se ejecuta cuando el usuario presiona "Comenzar turno"
     *
     * AHORA: Solo hace console.log (para debug)
     * FUTURO: Navegar a home, guardar sesión, etc.
     */
    const handleStartShift = () => {
        console.log('Iniciando turno:', {
            shift: selectedShift,
            worker: selectedWorker,
        });
        // TODO: Navegar a home cuando se implemente navegación
    };

    /**
     * handleSelectShift(shiftId)
     *
     * Manejar cuando el usuario selecciona un turno
     *
     * @param {string} shiftId - El ID del turno seleccionado
     */
    const handleSelectShift = (shiftId) => {
        setSelectedShift(shiftId);
    };

    /**
     * handleSelectWorker(workerId)
     *
     * Manejar cuando el usuario selecciona un trabajador
     *
     * @param {string} workerId - El ID del trabajador
     */
    const handleSelectWorker = (workerId) => {
        setSelectedWorker(workerId);
    };

    // ============ RENDER ============

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* HEADER CON NOMBRE DE EMPRESA Y FECHA */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    {/* Logo/Icono aquí (por ahora solo un placeholder) */}
                    <Card backgroundColor = '#0079CB'>
                        <Images Icon = {require('../../../assets/shrimp-solid.png')} style={{ width: 50, height: 50 }}  />
                    </Card>

                    <Title level={1} color="#FFFFFF" align="center">
                        Caprocam
                    </Title>
                    <CustomText
                        tamano="sm"
                        color="#FFFFFF"
                        alineacion="center"
                        estilo={styles.date}
                    >
                        {formattedDate}
                    </CustomText>
                </View>
            </View>

            {/* SECCION: SELECCIÓN DE TURNO */}
            <View style={styles.section}>
                <CustomText
                    tamano="lg"
                    color="#333333"
                    alineacion="center"
                    estilo={{ fontWeight: 'bold', marginBottom: 5 }}
                >
                    Selecciona tu turno
                </CustomText>
                <CustomText
                    tamano="sm"
                    color="#0084D1"
                    alineacion="center"
                    estilo={{ marginBottom: 15 }}
                >
                    ¿En qué horario vas a trabajar?
                </CustomText>

                {/* TURNOS - Mostrar los 3 botones */}
                <View style={styles.shiftsContainer}>
                    {SHIFTS.map((shift) => (
                        <ShiftButton
                            key={shift.id}
                            shift={shift}
                            isSelected={selectedShift === shift.id}
                            onPress={() => handleSelectShift(shift.id)}
                        />
                        
                    ))}
                </View>
            </View>

            {/* SECCION: SELECCIÓN DE TRABAJADOR */}
            <View style={styles.section}>
                <CustomText
                    tamano="lg"
                    color="#333333"
                    alineacion="center"
                    estilo={{ fontWeight: 'bold', marginBottom: 5 }}
                >
                    ¿Quién está trabajando?
                </CustomText>
                <CustomText
                    tamano="sm"
                    color="#0084D1"
                    alineacion="center"
                    estilo={{ marginBottom: 15 }}
                >
                    Toca tu nombre para comenzar
                </CustomText>

                {/* MOSTRAR ESTADO DE CARGA O ERROR */}
                {loading && (
                    <CustomText
                        tamano="md"
                        color="#666666"
                        alineacion="center"
                        estilo={{ marginVertical: 20 }}
                    >
                        Cargando trabajadores...
                    </CustomText>
                )}

                {error && (
                    <CustomText
                        tamano="md"
                        color="#DC3545"
                        alineacion="center"
                        estilo={{ marginVertical: 20 }}
                    >
                        Error: {error}
                    </CustomText>
                )}

                {/* LISTA DE TRABAJADORES */}
                {!loading && !error && (
                    <View>
                        {workers.map((worker) => (
                            <WorkerCard
                                key={worker.id}
                                worker={worker}
                                isSelected={selectedWorker === worker.id}
                                onPress={() => handleSelectWorker(worker.id)}
                            />
                        ))}
                    </View>
                )}
            </View>

            {/* BOTON: COMENZAR TURNO */}
            <View style={styles.buttonContainer}>
                <View style={styles.startButtonWrapper}>
                    <Button
                        title="Comenzar turno →"
                        onPress={handleStartShift}
                        type={!selectedShift || !selectedWorker ? 'secondary' : 'primary'}
                    />
                </View>
            </View>

            <View style={styles.headerContent}>
                <CustomText
                    tamano="sm"
                    color="#666666"
                    alineacion="center"
                >
                    {!selectedShift && !selectedWorker
                        ? "Selecciona un turno y tu nombre"
                        : !selectedShift
                            ? "Selecciona un turno"
                            : !selectedWorker
                                ? "Selecciona tu nombre"
                                : ""}
                </CustomText>
            </View>
        </ScrollView>
    );


}

/**
 * COMPONENTE: ShiftButton
 *
 * Botón individual para un turno
 *
 * Props:
 * - shift: objeto del turno
 * - isSelected: boolean - ¿está seleccionado?
 * - onPress: función a ejecutar
 *
 * NOTA: Usado wrappedButton porque Button component no puede ser customizado
 * entonces usamos TouchableOpacity para aplicar estilos personalizados
 */
function ShiftButton({ shift, isSelected, onPress }) {
    return (
        <TouchableOpacity
            style={[
                styles.shiftButton,
                isSelected && {
                    backgroundColor: shift.backgroundColor,
                    borderWidth: 2,
                    borderColor: '#333333',
                }
            ]}
            onPress={onPress}
        >
            <Avatar source = {shift.icon} />
            
            <Text style={styles.shiftButtonText}>
                {shift.label}
            </Text>
            <Text style={styles.shiftButtonTime}>
                {shift.timeRange}
            </Text>
        </TouchableOpacity>
    );
}

/**
 * COMPONENTE: WorkerCard
 *
 * Tarjeta individual para un trabajador usando el Card compartido
 *
 * Props:
 * - worker: objeto del trabajador
 * - isSelected: boolean - ¿está seleccionado?
 * - onPress: función a ejecutar
 */
function WorkerCard({ worker, isSelected, onPress }) {
    return (
        <TouchableOpacity
            style={[
                styles.workerCardWrapper,
                isSelected && styles.workerCardWrapperSelected,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.workerCardContent}>
                {/* AVATAR CON INICIALES */}
                <View>
                     <Avatar name={worker.initials} size={48} bgColor="#E6F2FF" fgColor="#0066CC"/>
                </View>

                {/* NOMBRE Y ROL */}
                <View style={styles.workerInfo}>
                    <Text style={styles.workerName}>
                        {worker.name}
                    </Text>
                    <Text style={styles.workerRole}>
                        {worker.role}
                    </Text>
                </View>

                {/* INDICADOR DE SELECCIÓN */}
                {isSelected && (
                    <View style={styles.checkIcon}>
                        <Text style={styles.checkIconText}>✓</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

/**
 * ESTILOS
 *
 * Todos los estilos de la pantalla.
 * Colores y tamaños definidos localmente en este módulo.
 */
const styles = StyleSheet.create({
    // CONTENEDOR PRINCIPAL
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    // HEADER (Empresa + Fecha)
    header: {
        backgroundColor: '#0066CC',
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerContent: {
        alignItems: 'center',
    },

    logoPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0052A3',
        marginBottom: 15,
    },

    date: {
        marginTop: 8,
    },

    // SECCIONES
    section: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 5,
    },

    sectionSubtitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 15,
    },

    // TURNOS
    shiftsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
        gap: 8,
    },

    shiftButton: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        borderWidth: 2,
        borderColor: '#CCCCCC',
        alignItems: 'center',
        justifyContent: 'center',
    },

    shiftButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },

    shiftButtonTime: {
        fontSize: 10,
        color: '#666666',
    },

    spacer: {
        height: 10,
    },

    // TRABAJADORES
    workerCardWrapper: {
        marginBottom: 12,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#F5F5F5',
    },

    workerCardWrapperSelected: {
        borderWidth: 2,
        borderColor: '#0066CC',
        backgroundColor: '#FFFFFF',
    },

    workerCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E6F2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },

    avatarSelected: {
        backgroundColor: '#0066CC',
    },

    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    workerInfo: {
        flex: 1,
    },

    workerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
        paddingLeft: 10, 
    },

    workerRole: {
        fontSize: 13,
        color: '#666666',
        paddingLeft: 10,
    },

    checkIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#0066CC',
        justifyContent: 'center',
        alignItems: 'center',
    },

    checkIconText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    // LOADING / ERROR
    loadingText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginVertical: 20,
    },

    errorText: {
        fontSize: 16,
        color: '#DC3545',
        textAlign: 'center',
        marginVertical: 20,
    },

    // BOTON PRINCIPAL
    buttonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },

    startButtonWrapper: {
        opacity: 1,
    },
});
