import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Swing from 'react-swing';
import styled from 'styled-components';
import ls from 'local-storage';
import ProductCard from '../ProductCard';
import { Direction } from 'swing';
import fire from '../../data/fire';
import shuffle from '../../utils/shuffle';
import thumbsDown from './thumbs-down.svg';
import thumbsUp from './thumbs-up.svg';

const ProductsWrapper = styled.div`
  position: relative;
  margin: auto;
  width: 100%;
  max-width: 600px;
  height: calc(100% - 80px);
  max-height: 1000px;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: -80px;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  justify-content: space-around;
`;

const Button = styled.div`
  height: 65px;
  width: 65px;
  box-shadow: 0 2px 3px rgba(0,0,0,.3);
  border-radius: 100%;
  background: white;
  > img {
    width: 25px;
    height: 25px;
    margin: 20px;
  }
`;

const ThankYou = styled.div`
  position: absolute;
  top: -20px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  text-align: center;
  opacity: 0;
  transition: all .3s ease-in-out;
  z-index: -1;
  &.active {
    top: 0;
    opacity: 1;
    z-index: 1;
  }
  * {
    width: 100%;
  }
`

const DislikeButton = Button.extend`
  fill: red;
`;

const LikeButton = Button.extend`
  fill: green;
`;

class Products extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      stack: null,
      cards: [],
      showThankYou: false
    };

    this.removeCard = this.removeCard.bind(this);
    this.handleThrowoutRight = this.handleThrowoutRight.bind(this);
    this.handleThrowoutLeft = this.handleThrowoutLeft.bind(this);
    this.handleDragMove = this.handleDragMove.bind(this);
    this.handleThrow = this.handleThrow.bind(this);
  }

  removeCard(e, index, id) {
    // remove from localstate

    // firebase vote
    this.setState(state => {
      if (index !== 0) {
        state.cards.splice(index, 1);
        state.cards[index - 1].active = true;
        return { cards: state.cards }
      }
      return { cards: [], showThankYou: true }
    })

    // save id to local storage (if possible)
    let hh_voted = ls.get('hh_voted');
    hh_voted.push(id);
    
    ls.set('hh_voted', hh_voted);
  }

  handleThrowoutRight(e, id) {
    // firebase like
    const ref = fire.database().ref('cards/' + id + '/votes/up');
    ref.once('value').then(function(snapshot) {
      const votes = snapshot.val();
      ref.set(votes + 1);
    });
  }

  handleThrowoutLeft(e, id) {
    // firebase dislike
    const ref = fire.database().ref('cards/' + id + '/votes/down');
    ref.once('value').then(function(snapshot) {
      const votes = snapshot.val();
      ref.set(votes + 1);
    });
  }

  componentDidMount() {
    // set localstorage
    const local = ls.get('hh_voted');
    if (!local) {
      ls.set('hh_voted', new Array)
    }

    // set local data
    const localData = [];

    // retrieve cards from firebase
    const ref = fire.database().ref('cards');
    ref.once('value').then(function(snapshot) {
      // push cards to localData
      const hh_local_string = local ? local.join(',') : '';
      let cards = snapshot.val();

      const fireArray = Object.keys(cards).map((key, index) => {
        return Object.assign({id: key}, cards[key]);
      });

      shuffle(fireArray).map((card, index) => {
        if (fireArray.length === (index + 1)) {
          card.active = true;
        } else {
          card.active = false;
        }
        // if (hh_local_string.indexOf(card.id) === -1) {
        localData.push(card);
        // }
      });

      this.setState({
        cards: localData,
        showThankYou: !localData.length
      });
    }.bind(this));
  }

  handleDragMove(e) {
    if (e.offset < -25) {
      this.setState({
        showNope: true,
        showYep: false
      });
    } else if (e.offset > 25) {
      this.setState({
        showNope: false,
        showYep: true
      });
    }
  }

  handleDragEnd(e) {
    this.setState({
      showYep: false,
      showNope: false
    });
  }

  handleThrow(e, direction) {
    // get swing card ref
    const target = this.refs.stack.refs[`card${this.state.cards.length}`];
    const el = ReactDOM.findDOMNode(target);

    // stack.getCard
    const card = this.state.stack.getCard(el);

    if (direction === 'left') {
      this.handleThrowoutLeft(e, target.props.id);
    } else {
      this.handleThrowoutRight(e, target.props.id);
    }
    card.throwOut(0, 100, Swing.DIRECTION[direction.toUpperCase()]);
  }
  render() {
    return (
      <ProductsWrapper>
        <ThankYou className={this.state.showThankYou ? 'active' : ''}>
          <h1>Thank you for voting</h1>
        </ThankYou>
        <Swing
          className="stack"
          tagName="div"
          setStack={(stack) => this.setState({ stack })}
          config={{
            allowedDirections: [Direction.LEFT, Direction.RIGHT],
            throwOutConfidence: function (offset, element) {
              return Math.min(Math.abs(offset) / (375 / 2), 1); // Fix dropout distance by dividing by 2
            },
          }}
          ref="stack"
        >
          {this.state.cards.map((card, index) => (
            <ProductCard
              ref={'card' + (index + 1)}
              key={card.title}
              throwoutleft={(e) => this.handleThrowoutLeft(e, card.id)}
              throwoutright={(e) => this.handleThrowoutRight(e, card.id)}
              throwoutend={(e) => this.removeCard(e, index, card.id)}
              dragmove={(e) => this.handleDragMove(e)}
              dragend={(e) => this.handleDragEnd(e)}
              isNope={this.state.showNope}
              isYep={this.state.showYep}
              {...card}
            />
          ))}
        </Swing>
        {!this.state.showThankYou && (
          <ButtonWrapper>
            <DislikeButton onClick={(e) => this.handleThrow(e, 'left')}>
              <img src={thumbsDown} alt=""/>
            </DislikeButton>
            <LikeButton onClick={(e) => this.handleThrow(e, 'right')}>
              <img src={thumbsUp} alt=""/>
            </LikeButton>
          </ButtonWrapper>
        )}
      </ProductsWrapper>
    );
  }
}

Products.propTypes = {
  data: PropTypes.object
};

export default Products;
