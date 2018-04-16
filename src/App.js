import React, { Component } from 'react';
import FileUploader from 'react-firebase-file-uploader';
import { Switch, Route } from 'react-router-dom';
import Products from './Components/Products';
import Admin from './Components/Admin';
import './App.css';
import fire from './data/fire';

class App extends Component {
  constructor() {
    super();

    this.state = {
      cards: {}
    }
  }

  componentDidMount() {
    const ref = fire.database().ref('cards');
    ref.once('value').then(function(snapshot) {
      // push cards to localData
      this.setState({
        cards: snapshot.val()
      });
    }.bind(this));
  };
 
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Products} />
          <Route path="/hh-admin-123" render={(props) => {
            return <Admin {...props} fireData={this.state.cards} />
          }} />
        </Switch>
      </div>
    );
  }
}

export default App;
