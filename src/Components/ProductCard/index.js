import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { truncateTitle, truncateDescription } from '../../utils/truncate';

const Card = styled.div`
  /* border: 1px solid #ccc; */
  box-shadow: ${(props) => props.isExpanded || !props.active ? 'none' : '0 3px 20px rgba(0,0,0,.2)'};
  position: absolute;
  top: ${(props) => props.isExpanded ? 0 : '3%'};
  right: ${(props) => props.isExpanded ? 0 : '5%'};
  bottom: ${(props) => props.isExpanded ? 0 : '3%'};
  left: ${(props) => props.isExpanded ? 0 : '5%'};
  border-radius: ${(props) => props.isExpanded ? 0 : '5px'};
  background: #fff;
  opacity: ${(props) => props.opacity};
  z-index: 10;
  overflow: hidden;
  transition: box-shadow .3s ease-in-out;
`;

const CardDetails = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: auto;
  padding: 10px;
  background: -moz-linear-gradient(top, rgba(125,185,232,0) 0%, rgba(0,0,0,0.6) 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, rgba(125,185,232,0) 0%,rgba(0,0,0,0.6) 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, rgba(125,185,232,0) 0%,rgba(0,0,0,0.6) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  overflow: hidden;
  transition: all .2s ease-in-out;
  h1, p {
    color: white;
  }
  h1 {
    margin-top: 80px;
    font-size: 24px;
    font-weight: 500;
  }
  &.expanded {
    background: white;
    overflow: scroll;
    height: 50%;
    h1, p {
      color: black;
    }
    h1 {
      margin-top: 20px;
    }
  }
  @media screen and (max-width: 400px) {
    h1 {
      font-size: 20px;
    }
    p {
      font-size: 14px;
    }
  }
`;

const Yep = styled.div`
  position: absolute;
  font-size: 30px;
  color: green;
  padding: 10px;
  border: 3px solid green;
  top: 30px;
  left: 30px;
  line-height: 0.6em;
  transform: rotate(-10deg);
  border-radius: 10px;
  font-weight: 700;
  opacity: ${(props) => props.show ? 1 : 0};
  transition: all .2s ease-in-out;
  z-index: 11;
`;

const Nope = styled.div`
  position: absolute;
  font-size: 30px;
  color: red;
  padding: 10px;
  border: 3px solid red;
  top: 30px;
  right: 30px;
  line-height: 0.6em;
  transform: rotate(10deg);
  border-radius: 10px;
  font-weight: 700;
  opacity: ${(props) => props.show ? 1 : 0};
  transition: all .2s ease-in-out;
  z-index: 11;
`;

const CardImage = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url(${(props) => props.fullImage});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
`;

const CloseExpand = styled.div`
  position: absolute;
  z-index: 11;
  top: 10px;
  right: 10px;
  color: black;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
`;

class ProductCard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.expandCard = this.expandCard.bind(this);

    this.state = {
      expanded: false
    }
  }

  expandCard() {
    if (!this.state.expanded) {
      this.setState({
        expanded: true
      });
    }
  }

  closeExpand() {
    this.setState({
      expanded: false
    });
  }
  // basic styling of cards
  // build 3 items in firebase
  // import data to this component
  render() {
    const { title, imageUrl, description, linkUrl, linkText, active, isNope, isYep } = this.props;
    const desc = !this.state.expanded ? truncateDescription(description) : description;
    return (
      <Card onClick={(e) => this.expandCard(e)} isExpanded={this.state.expanded} active={active}>
        {this.state.expanded && <CloseExpand onClick={(e) => this.closeExpand()}>Close</CloseExpand>}
        {active && <Yep show={isYep}>Yep</Yep>}
        {active && <Nope show={isNope}>Nope</Nope>}
        <CardImage fullImage={imageUrl} />
        <CardDetails className={this.state.expanded ? 'expanded' : ''}>
          <h1>{!this.state.expanded ? truncateTitle(title) : title}</h1>
          <ReactMarkdown source={desc} />
          {(this.state.expanded && linkUrl && linkText) && <a href={linkUrl}>{linkText}</a>}
        </CardDetails>
      </Card>
    );
  }
}

ProductCard.defaultProps = {
  title: '',
  description: '',
  imageUrl: ''
}

ProductCard.propTypes = {
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  description: PropTypes.string
};

export default ProductCard;
