import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    authenticationPopupContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: "flex-start",
        alignItems: 'center',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20
    },
    loginContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 2,
        borderColor: "#000000",
        marginBottom: 10,
    },
    mapView: {
        flex: 1,
    },
    topBar: {
        flex: 1,
        position: "absolute",
        top: 10,
        flexDirection: "row",
        width: Dimensions.get("window").width,
        height: 50,
        justifyContent: "center"
    },
    bottomBar: {
        flex: 1,
        position: "absolute",
        bottom: 50,
        flexDirection: "row",
        width: Dimensions.get("window").width,
        justifyContent: "center",
        alignItems: "center",
        height: 100,
        width: 100,
        backgroundColor: "black",
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        borderRadius: 100,
    }
});

export default styles