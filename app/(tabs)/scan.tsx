import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import axios from 'axios';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { AddBookNavigationProp } from '@/components/types/types';

export default function ScanScreen() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState<boolean>(false);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const navigation = useNavigation<AddBookNavigationProp>();
    const axiosConfig = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const addCopy = async (isbn: string) => {
        try {
            const response = await axios.post("http://192.168.1.203:3030/api/addCopy?isbn=" + isbn, axiosConfig);
            if(response.data == "Added copy"){
                Alert.alert("Copy", "Added copy to Library");
            }
        }catch(error) {
            console.error(error);
        }
    }

    const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
        if (scanned) return;
        setScanned(true);
        setScannedData(data);

        try {
            const response = await axios.post('http://192.168.1.203:3030/api/addBook?isbn=' + data, axiosConfig);
            console.log('API response:', response.data);
            if (response.data == "This book already exists"){
                Alert.alert(`Book Exists`, "This book already exists in your library. Add anyway?",
                    [
                        {
                            text: "No"
                        },
                        {
                            text: "Yes",
                            onPress: () => addCopy(data)
                        }
                    ]
                )
            }
            else if(response.data == "There was a problem adding the book"){
                Alert.alert("Error", "There was a problem adding the book. Try manually?",
                    [
                        {
                            text: "No"
                        },
                        {
                            text: "Yes",
                            onPress: () => navigation.navigate("AddBook")
                        }
                    ]
                )
            }
        } catch (error) {
            alert(`${data}`)
            console.error('API error:', error);
        }
    };
    const isFocused = useIsFocused();
    if (!permission) {
        return <View />; 
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function resetScanner() {
        setScanned(false);
        setScannedData(null);
    }

    console.log("Scanner is focused? " + isFocused)

    return (
        <View style={styles.container}>
            <View style={styles.floatingBox}>
                <Text style={styles.boxText}>Scan a Barcode</Text>
            </View>
            <CameraView
                style={styles.camera}
                facing={facing}
                barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
                onBarcodeScanned={handleBarCodeScanned}
            >
                <View style={styles.overlay}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                </View>
            </CameraView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={resetScanner} disabled={!scanned}>
                    <AntDesign name="reload1" size={24} color="white" />
                </TouchableOpacity>
                {scanned ? <Text style={styles.text}>Reset Scanner</Text> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    plus: {
        alignItems: "flex-end",
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 50, 
        height: 50, 
        borderRadius: 25,
    },
    overlay: {
        top: 325,
        left: 40,
        width: '80%', 
        height: '20%', 
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 30, // Position at the bottom of the screen
        left: 0,    // Align to the left edge
        right: 0,   // Align to the right edge
        justifyContent: 'center',
        alignItems: 'center', // Center both the button and the text horizontally
        flexDirection: 'column', // Stack the button and text vertically
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        width: 50, 
        height: 50, 
        borderRadius: 25,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10, // Add space between button and text
    },
    corner: {
        position: 'absolute',
        width: 40, 
        height: 40, 
        borderColor: 'white'
    },
    topLeft: {
        top: 0,
        left: 0,
        borderLeftWidth: 5,
        borderTopWidth: 5,
    },
    topRight: {
        top: 0,
        right: 0,
        borderRightWidth: 5,
        borderTopWidth: 5
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderLeftWidth: 5,
        borderBottomWidth: 5,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderRightWidth: 5,
        borderBottomWidth: 5,
    },
    floatingBox: {
        position: 'absolute',
        top: 30, // Adjust distance from the top as needed
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Choose your preferred color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        shadowColor: '#000', // Optional shadow for depth
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8, // For Android shadow
        zIndex: 10, // Ensures it stays on top
    },
    boxText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
