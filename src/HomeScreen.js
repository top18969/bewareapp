import React from 'react';
import {
  View,
  Text,
  Picker,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';
import { Block, Button, TextView } from './components';
import { Colors } from './color';
const W = Dimensions.get('window').width;
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: 300,
  },
  doctor: {
    position: 'absolute',
    top: 100,
    left: 60,

    // width: 50,
    // height: 80,
  },
  wrapperimage: {
    position: 'absolute',
    bottom: 0,

    alignSelf: 'center',
    width: W,
    height: 300,
  },
  bg: {
    position: 'absolute',
    width: 1000,
    height: 1000,
    top: -(930 - W / 2),
    alignSelf: 'center',
    // top: 500 - W / 2,
    // left: 500 - W / 2,
    borderRadius: 1000,
    overflow: 'hidden',
  },
  containerHeader: {
    position: 'relative',
  },
  map: {
    borderRadius: 8,
    marginTop: 15,
    padding: 15,
  },

});


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.watchID = 0;
    this.state = {
      location: {},
      errorMessage: 'asdasdasd',
      remanin:'',
      latitude:0,
      longitude:0,
      start: false,
      activeSwitch: 1,
      btnBTS: {
        width:"50%",
        borderRadius:40, 
        height:'40',
        color:'#fff',
        fontcolor: '#000'
      },
      btnMRT: {
        width:"50%",
        borderRadius:0, 
        height:'40',
        color:'#000',
        fontcolor: '#fff'
      },
    }
    this.onGet = this.onGet.bind(this)
    this.pressToCal = this.pressToCal.bind(this)
    this.btsPress = this.btsPress.bind(this)
    this.mrtPress = this.mrtPress.bind(this)
    this.distanceInKmBetweenEarthCoordinates = this.distanceInKmBetweenEarthCoordinates.bind(this)
    this.createTwoButtonAlert = this.createTwoButtonAlert.bind(this);
    this.degreesToRadians = this.degreesToRadians.bind(this)

    this.watchID = navigator.geolocation.watchPosition(
      position => {
        const { routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude
        };

        this.setState({
          latitude,
          longitude,
        })
        if(this.state.start == true){
          this.onGet();
        }
      },
      error => console.log(error),
     { enableHighAccuracy: true}
    )
   
  }
  

  componentDidMount() {
    this._getLocation();
  }

  _getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status != 'granted') {
      console.log('PERMISSION NOT GRANTED')

      this.setState({
        errorMessage: 'PERMISSION NOT GRANTED'
      })
    }

    // const location = await Location.getCurrentPositionAsync();

    // this.setState({
    //   location
    // })
   
  }

  componentWillUnmount(){
    navigator.geolocation.clearWatch(this.watchID);
  }

  pressToCal(){
    // this.watchID = navigator.geolocation.watchPosition(
    //   position => {
    //     const { routeCoordinates, distanceTravelled } = this.state;
    //     const { latitude, longitude } = position.coords;

    //     const newCoordinate = {
    //       latitude,
    //       longitude
    //     };

    //     this.setState({
    //       latitude,
    //       longitude,
    //     })

    //     this.onGet();
    //   },
    //   error => console.log(error),
    //  { enableHighAccuracy: true}
    // )
    this.setState({
      start: !this.state.start
    })

    
    console.log(this.state.start);
  }
  btsPress() {
    this.setState({
      btnBTS: {
        width:"50%",
        borderRadius:40, 
        height:'40',
        color:'#fff',
        fontcolor: '#000'
      },
      btnMRT: {
        width:"50%",
        borderRadius:0, 
        height:'40',
        color:'#000',
        fontcolor: '#fff'
      },
    })
  }

  mrtPress() {
    this.setState({
      btnBTS: {
        width:"50%",
        borderRadius:0, 
        height:'40',
        color:'#000',
        fontcolor: '#fff'
      },
      btnMRT: {
        width:"50%",
        borderRadius:40, 
        height:'40',
        color:'#fff',
        fontcolor: '#000'
      },
    })
  }

  onGet = () => {
    const la2 = 13.584410;
    const lo2 = 100.608034;
    // console.log("lalong" , this.state.location.coords.latitude)
    // console.log("lalong2" , this.state.location.coords.longitude)

    const data = this.distanceInKmBetweenEarthCoordinates(this.state.latitude,this.state.longitude,la2,lo2)
    console.log("get", data);
    // const remanin = data;
    // const errorMessage = 'asdasdasdasdas';
    this.setState({
      remanin: data
    })
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  createTwoButtonAlert = () =>
    Alert.alert(
      this.state.start == true ? "Stop!" : "Start..",
      this.state.start == true ? "application will be stop !" :"application will be running...",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.pressToCal() }
      ],
      { cancelable: false }
    );
    

  
  distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;
  
    var dLat = this.degreesToRadians(lat2-lat1);
    var dLon = this.degreesToRadians(lon2-lon1);
  
    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return earthRadiusKm * c;
  }

  

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#3e3e3e' }}>
        <Block height={100} middle centered color="#ffc107">
        <TextView h6 color="#fff" middle centered>LOGO HERE</TextView>
        </Block>
        <Block height="auto" color="#000" direction="row">
          <Button width="50%" borderRadius={this.state.btnBTS.borderRadius} centered middle height={40} color={this.state.btnBTS.color} onPress={this.btsPress} disabled={this.state.start}>
            <TextView h6 color={this.state.btnBTS.fontcolor}>BTS</TextView>
          </Button>
          <Button width="50%" borderRadius={this.state.btnMRT.borderRadius} centered middle height={40} color={this.state.btnMRT.color} onPress={this.mrtPress} disabled={this.state.start}>
            <TextView h6 color={this.state.btnMRT.fontcolor}>MRT</TextView>
          </Button>
        </Block>
        <Block height={70}>

        </Block>
        <Block block middle color="#3e3e3e">
          <Block>
            <Button
              color="#fff"
              borderWidth={4}
              borderColor="#000"
              margin={20}
              borderRadius={30} disabled={this.state.start}>
              <Block direction="row" centered height="auto" width="auto" paddingHorizontal={20} middle>
                <Feather name="map-pin" size={16} color={Colors.blue1} />
                <Block direction="row" centered height="auto" width="auto" padding={10} middle>
                  <TextView h6>123123</TextView>
                </Block>
                <Feather name="chevron-down" size={16} color={Colors.blue1} />
              </Block>
            </Button>
          </Block>
        </Block>
        <Block height={200} middle color="#3e3e3e">
          <Block>
            <Button
              color="#ffc107"
              borderWidth={4}
              borderColor="#000"
              margin={20}
              borderRadius={90}
              width={170}
              height={170} onPress={this.createTwoButtonAlert}>
              <Block direction="row" centered height={162} paddingHorizontal={20} middle>
                <Block paddingHorizontal={this.state.start == true ? 0 : 10}></Block>
                <FontAwesome name={this.state.start == true ? "stop" : "play"} size={this.state.start == true ? 80 : 100} color="#000" />
              </Block>
            </Button>
          </Block>
        </Block>
        <Block height={200} middle color="#3e3e3e">
          <Block block margin={20}>
            <TextView h6 center color="#fff">Distance Remaining</TextView>
            <TextView h3 center color="#fff">123</TextView>
            <TextView h6 center color="#fff">Kilometer</TextView>
            {/* <TextView h6 center color="#fff">{JSON.stringify(this.state.location.coords)}</TextView> */}
            <TextView h6 center color="#fff">{this.state.remanin}</TextView>
          </Block>
        </Block>
      </ScrollView>
    );
  }
}