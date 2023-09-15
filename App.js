import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, StatusBar, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';

const App = () => {
  // Encapsuled web (URL)
  const urlWeb = 'https://bulssola.vercel.app/';

  // State variables
  const [refreshing, setRefreshing] = useState(false);
  const [webViewVisible, setWebViewVisible] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const webviewRef = useRef(null);

  // Function to handle refreshing the WebView
  const onRefresh = () => {
    setRefreshing(true);
    webviewRef.current.reload();
  };

  // Function to handle the end of WebView loading
  const onLoadEnd = () => {
    setRefreshing(false);
  };

  // Function to handle WebView errors
  const onError = () => {
    setRefreshing(false);
    // Add error handling logic here, for example, showing an error message to the user.
    setModalVisible(true); // Show the modal when there is no internet connection
  };

  // Effect to check internet connection and display the modal accordingly
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setModalVisible(true);
      } else {
        setModalVisible(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Colors for the RefreshControl loader
  const refreshControlColors = ['#ff0000', '#00ff00', '#0000ff'];

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={refreshControlColors} // Customize loader colors
            progressViewOffset={StatusBar.currentHeight + 10} // Adjust the starting position of the refresh gesture
          />
        }>
        {webViewVisible ? (
          <WebView
            ref={webviewRef}
            source={{ uri: urlWeb }}
            style={styles.webview}
            startInLoadingState={false} // Prevent the default loading indicator from being shown
            onLoadEnd={onLoadEnd}
            onError={onError}
          />
        ) : null}
      </ScrollView>
      <Modal isVisible={isModalVisible} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={1} backdropColor="black" coverScreen={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>No internet connection</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollView: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: StatusBar.currentHeight, // Add top margin equal to the height of the status bar
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
});

export default App;
