import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

export default function App() {
  const [routerIP, setRouterIP] = useState('192.168.100.254');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [newWifiName, setNewWifiName] = useState('');
  const [newWifiPassword, setNewWifiPassword] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState({});
  const [currentTab, setCurrentTab] = useState('router');

  const setLoadingState = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  const connectToRouter = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    setLoadingState('connect', true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (username === 'admin' && password.length >= 4) {
        setIsConnected(true);
        Alert.alert('Éxito', 'Conectado al router exitosamente');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al router');
    } finally {
      setLoadingState('connect', false);
    }
  };

  const changeWifiSettings = async () => {
    if (!newWifiName || !newWifiPassword) {
      Alert.alert('Error', 'Por favor completa nombre y contraseña WiFi');
      return;
    }

    if (newWifiPassword.length < 10) {
      Alert.alert('Error', 'La contraseña debe tener al menos 10 caracteres');
      return;
    }

    const hasUpper = /[A-Z]/.test(newWifiPassword);
    const hasLower = /[a-z]/.test(newWifiPassword);
    const hasNumber = /[0-9]/.test(newWifiPassword);

    if (!hasUpper || !hasLower || !hasNumber) {
      Alert.alert('Error', 'La contraseña debe contener mayúsculas, minúsculas y números');
      return;
    }

    setLoadingState('changeWifi', true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      Alert.alert(
        '¡WiFi Actualizado!',
        `Nombre: ${newWifiName}\nContraseña: ${newWifiPassword}\n\n¡IMPORTANTE! Guarda esta información en un lugar seguro.`
      );
      
      setNewWifiName('');
      setNewWifiPassword('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar la configuración WiFi');
    } finally {
      setLoadingState('changeWifi', false);
    }
  };

  const renderTabButton = (tabName, title) => (
    <TouchableOpacity
      style={[styles.tabButton, currentTab === tabName && styles.activeTab]}
      onPress={() => setCurrentTab(tabName)}
    >
      <Text style={[styles.tabText, currentTab === tabName && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestor de Router</Text>
        <Text style={styles.headerSubtitle}>Control completo de tu red</Text>
      </View>

      <View style={styles.tabBar}>
        {renderTabButton('router', 'Router')}
        {renderTabButton('devices', 'Dispositivos')}
        {renderTabButton('schedules', 'Horarios')}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conexión al Router</Text>
          <TextInput
            style={styles.input}
            placeholder="IP del Router"
            value={routerIP}
            onChangeText={setRouterIP}
          />
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.button, isConnected && styles.buttonSuccess]}
            onPress={connectToRouter}
            disabled={loading.connect}
          >
            {loading.connect ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {isConnected ? 'Conectado ✓' : 'Conectar al Router'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {isConnected && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configuración WiFi</Text>
            <TextInput
              style={styles.input}
              placeholder="Nuevo nombre WiFi"
              value={newWifiName}
              onChangeText={setNewWifiName}
            />
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña WiFi (min 10 caracteres)"
              value={newWifiPassword}
              onChangeText={setNewWifiPassword}
              secureTextEntry
            />
            <Text style={styles.helpText}>
              Debe contener mayúsculas, minúsculas y números
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={changeWifiSettings}
              disabled={loading.changeWifi}
            >
              {loading.changeWifi ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Cambiar Configuración WiFi</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSuccess: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    marginTop: -10,
  },
});
