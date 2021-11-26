import './App.css';
import React from 'react';
import QRCode from "react-qr-code";

const URL = 'https://api.opensea.io/api/v1/assets?owner=0x8af8957e94e4bda9bbf1a9beb2bd28de1c90a950&order_direction=desc&offset=0&limit=50';
const INTERVAL = 5000;

class App extends React.Component {

    state = {
        nftCollection: [],
        activePhoto: {},
        permalink: ''
    }

    timer = ms => new Promise(res => setTimeout(res, ms));

    async cycleAssets() {
      let length = this.state.nftCollection.assets.length;
      let index = 0
      while(true) {
        this.updateActivePhoto(index);
        index += 1;
        await this.timer(INTERVAL);
        if (index == length) {
          index = 0;
        }
      }
    }

    updateActivePhoto(i) {
      this.setState({activePhoto: this.state.nftCollection.assets[i]});
    }

    async componentDidMount() {
      this.getNftCollection()
      .then(() => this.cycleAssets());
    }

    async getNftCollection() {
      const options = {method: 'GET'};                    
      const nftCollection = 
      await fetch(URL, options)
          .then(response => response.json())
          .then(response => {
            this.setState({ nftCollection: response });
            this.setState({activePhoto: response.assets[0]});
            this.setState({permalink: this.state.activePhoto.permalink})
          })
          .catch(err => console.error(err)); 
    }

  
    render() {
      return (
        <div className="App" >
        {
          this.state.activePhoto ? (
            <div class="nft-container"> 
              <img className='nft-image' src={this.state.activePhoto.image_original_url}/>
              <div className='qr-code'> 
                <QRCode value={String(this.state.activePhoto.permalink)}/>
              </div>
            </div>
          )
          :
          (
            <div>
              <p> image not found </p>
            </div>
          )
          
        }
        </div>
      );
    }
}

export default App;
