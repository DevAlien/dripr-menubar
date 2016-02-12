/* @flow */
import React from 'react-native-desktop';
import uploadImage from './uploading'

const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} = React;


const DropArea = React.createClass({
  getInitialState() {
    return { highlight: false }
  },
  async onDrop(files) {
    this.setState({highlight: false, link: false, uploading: true})
    const result = await uploadImage(files[0], progress => this.setState({progress}))
    this.setState({link: result.url, uploading: false});
  },
  render() {
    return (
      <View draggedTypes={['NSFilenamesPboardType']} style={[styles.innerContainer, this.state.highlight ? {backgroundColor: '#bbb'} : {}]}
        onDragEnter={() => this.setState({highlight: true})}
        onDragLeave={() => this.setState({highlight: false})}
        onDrop={(e) => this.onDrop(e.nativeEvent.files)}>
        {this.state.link &&
          <TouchableOpacity>
            <Text style={styles.link}>{this.state.link}</Text>
          </TouchableOpacity>
        }
        <Text style={styles.containerText}>
          {this.state.uploading ?
              'Uploading... ' + Math.round(this.state.progress * 100) + '%' :
              'Drop file here to generate link'
          }
        </Text>
      </View>
    )
  }
})

const driprApp = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBar}><Text style={styles.title}>Dripr.io</Text></View>
        <DropArea />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  //  backgroundColor: '#1B232E',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  title: {
    textAlign: 'center',
    fontSize: 12,
    color: '#777',
    fontWeight: 'bold'
  },
  titleBar: {
    padding: 5,
    backgroundColor: 'transparent'
  },
  link: {
    color: 'blue',
    marginBottom: 10,
    fontSize: 10
  },
  containerText: {
    fontSize: 16,
    textAlign: 'center',
    //fontFamily: 'Roboto',
    fontWeight: '300'
  },
});

AppRegistry.registerComponent('dripr', () => driprApp);
