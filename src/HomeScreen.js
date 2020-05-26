import React from 'react';
import {
  View,
  Text,
  Picker,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Block, Button, TextView } from './components';
import { Colors } from './color';
const W = Dimensions.get('window').width;
import Feather from 'react-native-vector-icons/Feather';
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
  

  componentDidMount() {
    this._getLocation();

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
      },
      error => console.log(error),
     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )

    // navigator.geolocation.getCurrentPosition(position => {
    //     this.setState({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //       errorMessage: ''
    //     })
    // }, error => this.setState({
    //   errorMessage: error.message
    // }), {enableHighAccuracy: true,timeout:20000,maximumAge:2000});
  }

  _getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status != 'granted') {
      console.log('PERMISSION NOT GRANTED')

      this.setState({
        errorMessage: 'PERMISSION NOT GRANTED'
      })
    }

    const location = await Location.getCurrentPositionAsync();

    this.setState({
      location
    })
   
  }

  onGet = () => {
    const la2 = 13.584410;
    const lo2 = 100.608034;
    console.log("lalong" , this.state.location.coords.latitude)
    console.log("lalong2" , this.state.location.coords.longitude)

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

  constructor(props) {
    super(props)
    this.state = {
      location: {},
      errorMessage: 'asdasdasd',
      remanin:'',
      latitude:0,
      longitude:0
    }
    this.onGet = this.onGet.bind(this)
    this.distanceInKmBetweenEarthCoordinates = this.distanceInKmBetweenEarthCoordinates.bind(this)
    this.degreesToRadians = this.degreesToRadians.bind(this)
   
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#3e3e3e' }}>
        <Block height={100} middle color="#ffc107">

        </Block>
        <Block height={50} color="#000" direction="row">
          <Button width="50%" borderRadius={40} centered middle height={40} color="#fff">
            <TextView h6 >BTS</TextView>
          </Button>
          <Button width="50%" centered middle height={40} color="#000">
            <TextView h6 color="#fff">MRT</TextView>
          </Button>

        </Block>
        <Block height={100}>

        </Block>
        <Block block middle color="#3e3e3e">
          <Block>
            <Button
              color="#fff"
              borderWidth={4}
              borderColor="#000"
              margin={20}
              borderRadius={30}>
              <Block direction="row" paddingHorizontal={15} middle>
                <Feather name="map-pin" size={16} color={Colors.blue1} />
                <Block block padding={10}>
                  <TextView h6>Indonesia</TextView>
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
              height={170} onPress={this.onGet}>
              <Block direction="row" centered height={162} paddingHorizontal={20} middle>
                <Block paddingHorizontal={10}></Block>
                <Feather name="play" size={100} color="#000" />
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