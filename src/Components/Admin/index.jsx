import React, { Component } from 'react';
import FileUploader from 'react-firebase-file-uploader';
import styled from 'styled-components';
import fire from '../../data/fire';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  > div {
    flex: 1;
    margin: 0 0 10px;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
    > img {
      height: 100px;
    }
  }
`;

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      linkText: '',
      linkUrl: '',
      image: '',
      isUploading: false,
      items: [],
      cards: [],
      imageUrl: ''
    };
  }
 
  handleInputChange = (event) => this.setState({[event.target.name]: event.target.value});
  handleUploadStart = () => this.setState({isUploading: true, progress: 0});
  handleProgress = (progress) => this.setState({progress});
  handleUploadError = (error) => {
    this.setState({isUploading: false});
    console.error(error);
  }
  handleUploadSuccess = (filename) => {
    this.setState({image: filename, progress: 100, isUploading: false});
    fire.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({imageUrl: url}));
  }
  removeCard = (id) => {
    console.log(id);
    const ref = fire.database().ref('cards/' + id);
    ref.remove()
      .then(function() {
        console.log('removed');
      })
      .catch(function(error) {
        console.log('unable to remove');
      });
  }
  uploadToFirebase = (card) => {
    fire.database().ref('cards').push({
      title: this.state.title,
      description: this.state.description,
      linkText: this.state.linkText,
      linkUrl: this.state.linkUrl,
      imageUrl: this.state.imageUrl,
      votes: {
        up: 0,
        down: 0
      }
    }, function(error) {
      if (error) {
        console.log('there was an error');
      } else {
        this.setState({
          title: '',
          description: '',
          linkText: '',
          linkUrl: '',
          image: '',
          isUploading: false,
          items: [],
          imageUrl: ''
        })
      }
    }.bind(this));
  }

  renderDataRows(cards) {
    if (cards) {
      return Object.keys(cards).map((key) => {
        const card = cards[key];
        return (
          <Row key={key}>
            <div>
              <img src={card.imageUrl} alt=""/>
            </div>
            <div>{card.title}</div>
            <div>{card.linkUrl}</div>
            <div>{card.linkText}</div>
            <div>{card.votes.up}</div>
            <div>{card.votes.down}</div>
            <div>
              <button onClick={() => this.removeCard(key)}>
                Are you sure?
              </button>
            </div>
          </Row>
        );
      });
    }
  }

  render() {
    console.log(this.props.fireData);
    return (
      <div className="App">
        <div style={{height: '100%', overflow: 'scroll'}}>
          <h1>Admin</h1>
          <h2>NOTE: Refresh to update</h2>
          <h3>Stats</h3>
          <div>
            <Row>
              <div><strong>Image</strong></div>
              <div><strong>Title</strong></div>
              <div><strong>LinkURL</strong></div>
              <div><strong>Link Text</strong></div>
              <div><strong>Upvotes</strong></div>
              <div><strong>Downvotes</strong></div>
              <div><strong>Remove</strong></div>
            </Row>
            {this.renderDataRows(this.props.fireData)}
          </div>
          <h3>Upload new card</h3>
          <p>Upload image first. {this.state.isUploading ? 'Uploading...' : ''}</p>
          <FileUploader
            accept="image/*"
            name="image"
            randomizeFilename
            storageRef={fire.storage().ref('images')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
          />
          {this.state.imageUrl && (
            <div>
              <input type="text" placeholder="Title" name="title" onChange={this.handleInputChange} />
              <textarea cols="100" rows="30" placeholder="Description" name="description" onChange={this.handleInputChange} />
              <input type="text" placeholder="Link Text" name="linkText" onChange={this.handleInputChange} />
              <input type="text" placeholder="Link URL" name="linkUrl" onChange={this.handleInputChange} />
              <p>Title: {this.state.title}</p>
              <p>Description: {this.state.description}</p>
              <p>Link text: {this.state.linkText}</p>
              <p>Link url: {this.state.linkUrl}</p>
              <p>Image url: {this.state.imageUrl}</p>
              { (this.state.title
                && this.state.description
                && this.state.imageUrl
                ) &&
                (<button onClick={this.uploadToFirebase}>Upload</button>)}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Admin;
