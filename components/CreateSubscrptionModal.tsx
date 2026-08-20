import clsx from "clsx";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

interface CreateSubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (subscription: Subscrption) => void;
}

type Frequency = 'Monthly' | 'Yearly';

const CreateSubscriptionModal = ({ visible, onClose, onSubmit }: CreateSubscriptionModalProps) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [frequency, setFrequency] = useState<Frequency>('Monthly');

    const isVaildPrice = () => {
        const trimmedPrice = price.trim();
        if (!trimmedPrice) return false;
        if (!/^\s*[+-]?(\d+(\.\d+)?|\.\d+)\s*$/.test(trimmedPrice)) return false;
        const numValue = Number(trimmedPrice);
        return Number.isFinite(numValue) && numValue > 0;
    }

    const isValidForm = name.trim() !== '' && isVaildPrice();

    const handleSubmit = () => {
        if (!isValidForm) return;
        const priceValue = Number(price.trim());

        resetForm();
        onClose();
    }

    const resetForm = () => {
        setName('');
        setPrice("");
    }

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={0}
            >
                <Pressable className="modal-overlay" onPress={handleClose}>
                    <Pressable className="modal-container" onPress={(e) => e.stopPropagation()}>
                        <View className="modal-header">
                            <Text className="modal-title">New Subscription</Text>
                            <Pressable className="modal-close" onPress={handleClose}>
                                <Text className="modal-close-text">X</Text>
                            </Pressable>
                        </View>

                        <ScrollView
                            className="p-5"
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
                        >
                            <View className="auth-field">
                                <Text className="auth-label">Name</Text>
                                <TextInput
                                    className="auth-input"
                                    placeholder="Subscription name"
                                    placeholderTextColor="rgba(0,0,0,0.4)"
                                    value={name}
                                    onChangeText={setName}
                                ></TextInput>
                            </View>
                            <View className="auth-field">
                                <Text className="auth-label">Price</Text>
                                <TextInput
                                    className="auth-input"
                                    placeholder="0.00"
                                    placeholderTextColor="rgba(0,0,0,0.4)"
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="decimal-pad"
                                ></TextInput>
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Frequency</Text>
                                <View className="picker-row">
                                    <Pressable
                                        className={clsx('picker-option', frequency === 'Monthly' && 'picker-option-active')}
                                        onPress={() => setFrequency('Monthly')}
                                    >
                                        <Text className={clsx('picker-option-text', frequency === 'Monthly' && 'picker-option-text-active')}>
                                            Monthly
                                        </Text>
                                    </Pressable>
                                    <Pressable className={clsx('picker-option', frequency === 'Yearly' && 'picker-option-active')}
                                        onPress={() => setFrequency('Yearly')}
                                    >
                                        <Text className={clsx('picker-option-text', frequency === 'Yearly' && 'picker-option-text-active')}></Text>
                                    </Pressable>
                                </View>
                            </View>
                            
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    )
}

