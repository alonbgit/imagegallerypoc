import React, { Component } from 'react';
import './App.scss';
import ImageGallery from './components/image-gallery/image-gallery.component';

class App extends Component {

  state = {
    cells: [],
  }

  componentDidMount () {
    const cells = this.generateCells();
    this.setState({
      cells,
    });
  }

  generateRandomInt () {
    const int = Math.floor(Math.random() * 4); 
    const values = [50, 100, 150, 200];
    return values[int];
  }

  generateCells () {
    const values = [];
    for(let i = this.state.cells.length; i < this.state.cells.length + 20; i++) {
      values.push(<div style={{ width: this.generateRandomInt(), height: this.generateRandomInt() }} key={i}>{i}</div>);
    }
    return values;
  }

  addMore = () => {
    const morCells = this.generateCells();
    let cells = [...this.state.cells];
    cells = cells.concat(morCells);
    this.setState({
      cells,
    });
  }

  loadLess = () => {
    const values = [];
    for(let i = 0; i < 6; i++) {
      values.push(<div style={{ width: this.generateRandomInt(), height: this.generateRandomInt() }} key={i}>{i}</div>);
    }
    this.setState({
      cells: values,
    });
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.addMore}>add more</button>
        <button onClick={this.loadLess}>add less</button>
        <div className='image-gallery-container'>
          <ImageGallery>
            {this.state.cells}
          </ImageGallery>
        </div>
      </div>
    );
  }
}

export default App;
