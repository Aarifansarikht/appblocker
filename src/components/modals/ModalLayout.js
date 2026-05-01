import { Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Overlay from './Overlay'

const ModalLayout = ({ children, visible, onClose, layout , sideGap=20}) => {
    const justifyContent = layout === 'bottom-sheet' ? 'flex-end' : 'center'    
    return (
        <Modal visible={visible} transparent animationType='slide' >
            <View style={styles.container}>
                <Overlay onPress={onClose && onClose} />
                <View pointerEvents='box-none' style={{
                    flex: 1,
                    justifyContent,
                    alignItems: 'center',
                    padding: sideGap
                }}>
                    {children}
                </View>
            </View>
        </Modal>
    )
}

export default ModalLayout

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})